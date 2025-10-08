import { NextResponse } from "next/server";

const ORIGIN = process.env.MIRROR_ORIGIN || "https://www.segurosimediato.com.br";

/** remove attrs que podem bloquear no iframe */
function stripAttrs(html: string) {
  return html
    .replace(/\s+integrity=('|")[^'"]*\1/gi, "")
    .replace(/\s+crossorigin=('|")[^'"]*\1/gi, "");
}

/** normaliza caminho relativo em relação a um diretório base (ex.: "contato" -> "produtos/contato") */
function resolveRelative(baseDir: string, rel: string) {
  const stack = baseDir.split("/").filter(Boolean);
  const parts = rel.split("/");
  for (const p of parts) {
    if (p === "" || p === ".") continue;
    if (p === "..") stack.pop();
    else stack.push(p);
  }
  return "/" + stack.join("/");
}

/** reescreve href/src/action/srcset para apontar a /mirror/... */
function rewriteLinks(html: string, rawPath: string) {
  const baseDir =
    rawPath && rawPath.includes("/") ? "/" + rawPath.replace(/[^/]*$/, "") : "/";

  // 0) Protocol-relative (//cdn...) → manter como absoluto (não reescrever)
  // (nada a fazer aqui, só garantimos que as outras regras não os toquem)

  // 1) Absolutos do mesmo domínio → /mirror/...
  html = html.replace(
    /(href|src|action)=("|\')https?:\/\/(www\.)?segurosimediato\.com\.br(\/[^"']*)\2/gi,
    (_m, attr, q, _sub, path) => `${attr}=${q}/mirror${path}${q}`
  );

  // 2) Root-relativos de UMA barra (ex.: "/contato") → /mirror/...
  // Ignora URLs que começam com "//" (protocol-relative)
  html = html.replace(
    /(href|src|action)=("|\')(\/(?!\/)[^"']*)\2/gi,
    (_m, attr, q, path) => `${attr}=${q}/mirror${path}${q}`
  );

  // 3) Relativos “nus” (não começam com http, //, /, #, mailto, tel, javascript:)
  html = html.replace(
    /(href|src|action)=("|\')([^"'#:][^"']*)\2/gi,
    (_m, attr, q, rel) => {
      if (/^(https?:\/\/|\/\/|\/|#|mailto:|tel:|javascript:|data:|blob:)/i.test(rel)) return _m as string;
      const resolved = resolveRelative(baseDir, rel);
      return `${attr}=${q}/mirror${resolved}${q}`;
    }
  );

  // 4) srcset: várias URLs separadas por vírgula
  html = html.replace(
    /(srcset)=("|\')([^"\']+)\2/gi,
    (_m, attr, q, val) => {
      const rewritten = val
        .split(",")
        .map((s: string) => {
          const [url, size] = s.trim().split(/\s+/, 2);
          if (!url) return s;

          // mesmo domínio → /mirror/...
          if (/^https?:\/\/(www\.)?segurosimediato\.com\.br\//i.test(url)) {
            return `/mirror${url.replace(/^https?:\/\/(www\.)?segurosimediato\.com\.br/i, "")}${size ? " " + size : ""}`;
          }

          // absolutas externas: manter intactas
          if (/^https?:\/\//i.test(url)) {
            return `${url}${size ? " " + size : ""}`;
          }

          // protocol-relative: manter
          if (/^\/\//.test(url)) {
            return `${url}${size ? " " + size : ""}`;
          }

          // root-relativo (uma barra)
          if (/^\/(?!\/)/.test(url)) {
            return `/mirror${url}${size ? " " + size : ""}`;
          }

          // esquemas especiais
          if (/^(#|mailto:|tel:|javascript:|data:|blob:)/i.test(url)) {
            return `${url}${size ? " " + size : ""}`;
          }

          // relativo “nu”
          const resolved = resolveRelative(baseDir, url);
          return `/mirror${resolved}${size ? " " + size : ""}`;
        })
        .join(", ");

      return `${attr}=${q}${rewritten}${q}`;
    }
  );

  return html;
}

/** injeta <base> LOCAL para que links relativos sigam /mirror/<dir>/ */
function injectLocalBase(html: string, rawPath: string) {
  const baseDir =
    rawPath && rawPath.includes("/") ? "/" + rawPath.replace(/[^/]*$/, "") : "/";
  const baseTag = `<base href="/mirror${baseDir}">`;

  if (/<head[^>]*>/i.test(html)) {
    if (!/<base[^>]*>/i.test(html)) {
      return html.replace(/<head[^>]*>/i, (m) => `${m}\n${baseTag}`);
    }
    return html.replace(/<base[^>]*>/i, baseTag);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (m) => `${m}\n<head>${baseTag}</head>`);
  }
  return `<!doctype html><html lang="pt-BR"><head>${baseTag}</head><body>${html}</body></html>`;
}

export async function GET(
  req: Request,
  // ⬇⬇⬇ Next 15: params é assíncrono
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await ctx.params;
  const rawPath = (path ?? []).join("/");
  const target = rawPath ? `${ORIGIN}/${rawPath}` : `${ORIGIN}/`;

  console.log(`[Mirror] Fetching: ${target}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);

  try {
    const r = await fetch(target, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timer);

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error(`[Mirror] HTTP Error ${r.status} on ${target}: ${txt.slice(0, 200)}`);
      return new NextResponse(
        `<!doctype html><h1>Fetch ${r.status}</h1><pre>${txt.slice(0,500)}</pre>`,
        { status: r.status, headers: { "content-type": "text/html; charset=utf-8" } }
      );
    }

    let html = await r.text();

    console.log(`[Mirror] Fetched ${html.length} chars from ${target}`);

    html = stripAttrs(html);
    html = rewriteLinks(html, rawPath);
    html = injectLocalBase(html, rawPath);

    console.log(`[Mirror] Rewrote links for path: ${rawPath}, ready to serve.`);

    return new NextResponse(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (e: any) {
    clearTimeout(timer);
    console.error(`[Mirror] Error on ${target}: ${String(e?.message || e)}`);
    return new NextResponse(
      `<!doctype html><h1>Erro</h1><pre>${String(e?.message || e)}</pre>`,
      { status: 500, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }
}