import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json().catch(() => ({} as any));
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 25_000);

  try {
    const r = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36"
      }
    });

    clearTimeout(t);

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return NextResponse.json(
        { error: `Fetch ${r.status}: ${text.slice(0,300)}` },
        { status: r.status }
      );
    }

    const html = await r.text();
    return NextResponse.json({ html });
  } catch (e: any) {
    clearTimeout(t);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
