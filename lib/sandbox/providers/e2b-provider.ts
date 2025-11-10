import { Sandbox } from '@e2b/code-interpreter';
import { SandboxProvider, SandboxInfo, CommandResult } from '../types';
import { appConfig } from '@/config/app.config';

const WORKDIR = appConfig.e2b.workingDirectory || '/home/user/app';

export class E2BProvider extends SandboxProvider {
  private existingFiles: Set<string> = new Set();

  async reconnect(_sandboxId: string): Promise<boolean> {
    // Not supported by current SDK
    return false;
  }

  private async ensureWorkingDir(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');

    // Create working dir if missing
    await this.sandbox.runCode(`
import os
os.makedirs(${JSON.stringify(WORKDIR)}, exist_ok=True)
    `);
  }

  async createSandbox(): Promise<SandboxInfo> {
    try {
      if (this.sandbox) {
        try { await this.sandbox.kill(); } catch {}
        this.sandbox = null;
      }

      this.existingFiles.clear();

      this.sandbox = await Sandbox.create({
        apiKey: this.config.e2b?.apiKey || process.env.E2B_API_KEY,
        timeoutMs: this.config.e2b?.timeoutMs || appConfig.e2b.timeoutMs,
      });

      await this.ensureWorkingDir();

      const sandboxId = (this.sandbox as any).sandboxId || Date.now().toString();
      const host = (this.sandbox as any).getHost?.(appConfig.e2b.vitePort);

      this.sandboxInfo = {
        sandboxId,
        url: host ? `https://${host}` : '',
        provider: 'e2b',
        createdAt: new Date(),
      };

      if (typeof this.sandbox.setTimeout === 'function') {
        this.sandbox.setTimeout(appConfig.e2b.timeoutMs);
      }

      return this.sandboxInfo!;
    } catch (error) {
      console.error('[E2BProvider] Error creating sandbox:', error);
      throw error;
    }
  }

  async runCommand(command: string): Promise<CommandResult> {
    if (!this.sandbox) throw new Error('No active sandbox');

    const result = await this.sandbox.runCode(`
import subprocess, os, shlex
os.chdir(${JSON.stringify(WORKDIR)})
cmd = ${JSON.stringify(command)}
result = subprocess.run(cmd if isinstance(cmd, list) else shlex.split(cmd),
                        capture_output=True, text=True, shell=False)
print("STDOUT:")
print(result.stdout)
if result.stderr:
    print("\\nSTDERR:")
    print(result.stderr)
print(f"\\nReturn code: {result.returncode}")
    `);

    const stdout = result.logs.stdout.join('\n');
    const stderr = result.logs.stderr.join('\n');

    return {
      stdout,
      stderr,
      exitCode: result.error ? 1 : 0,
      success: !result.error,
    };
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');

    const fullPath = path.startsWith('/') ? path : `${WORKDIR}/${path}`;
    // Prefer SDK filesystem API if available, else fallback to Python write
    if (this.sandbox.files?.write) {
      await this.sandbox.files.write(fullPath, content);
    } else {
      await this.sandbox.runCode(`
from pathlib import Path
p = Path(${JSON.stringify(fullPath)})
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(${JSON.stringify(content)}, encoding="utf-8")
      `);
    }
    this.existingFiles.add(fullPath);
  }

  async readFile(path: string): Promise<string> {
    if (!this.sandbox) throw new Error('No active sandbox');
    const fullPath = path.startsWith('/') ? path : `${WORKDIR}/${path}`;

    if (this.sandbox.files?.read) {
      const data = await this.sandbox.files.read(fullPath);
      // data may be string or Uint8Array depending on SDK version
      return typeof data === 'string' ? data : new TextDecoder().decode(data);
    }

    const result = await this.sandbox.runCode(`
from pathlib import Path
p = Path(${JSON.stringify(fullPath)})
if not p.exists() or not p.is_file():
    print("ERROR:NOT_FOUND")
else:
    print("CONTENT_START")
    print(p.read_text(encoding="utf-8"))
    print("CONTENT_END")
    `);
    const out = result.logs.stdout.join('\n');
    if (out.includes('ERROR:NOT_FOUND')) {
      throw new Error(`File not found: ${fullPath}`);
    }
    const m = out.match(/CONTENT_START\\n([\\s\\S]*?)\\nCONTENT_END/);
    return m ? m[1] : '';
  }

  async listFiles(directory?: string): Promise<string[]> {
    if (!this.sandbox) throw new Error('No active sandbox');
    const dir = directory
      ? (directory.startsWith('/') ? directory : `${WORKDIR}/${directory}`)
      : WORKDIR;

    if (this.sandbox.files?.list) {
      // Flatten nested results into simple relative paths
      const entries = await this.sandbox.files.list(dir);
      const flatten = (base: string, items: any[]): string[] =>
        items.flatMap((it: any) =>
          it.type === 'file'
            ? [it.path.replace(`${WORKDIR}/`, '')]
            : flatten(base, it.children || []));
      return flatten(dir, entries);
    }

    const result = await this.sandbox.runCode(`
import os, json
base = ${JSON.stringify(dir)}
out = []
for root, dirs, files in os.walk(base):
    # skip common heavy dirs
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'build', '__pycache__']]
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, ${JSON.stringify(WORKDIR)})
        out.append(rel)
print(json.dumps(out))
    `);
    const out = result.logs.stdout.join('\n');
    try {
      return JSON.parse(out.trim());
    } catch {
      return [];
    }
  }

  async installPackages(packages: string[]): Promise<CommandResult> {
    if (!this.sandbox) throw new Error('No active sandbox');
    if (!packages || packages.length === 0) {
      return { stdout: 'No packages requested', stderr: '', exitCode: 0, success: true };
    }
    const pkgList = packages.join(' ');
    // --legacy-peer-deps can be toggled via config
    const flag = appConfig.packages?.useLegacyPeerDeps ? ' --legacy-peer-deps' : '';
    return await this.runCommand(`npm install ${pkgList}${flag}`);
  }

  getSandboxUrl(): string | null {
    return this.sandboxInfo?.url || null;
  }

  getSandboxInfo(): SandboxInfo | null {
    return this.sandboxInfo;
  }

  async terminate(): Promise<void> {
    if (this.sandbox) {
      try { await this.sandbox.kill(); } catch (e) { console.warn('Kill sandbox failed:', e); }
      this.sandbox = null;
    }
    this.sandboxInfo = null;
    this.existingFiles.clear();
  }

  isAlive(): boolean {
    return !!this.sandbox;
  }

  // Optional helpers the app may call

  async setupViteApp(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');

    // If package.json doesn’t exist, initialize a project
    const check = await this.runCommand('bash -lc "test -f package.json && echo yes || echo no"');
    const hasPkg = check.stdout.includes('yes');

    if (!hasPkg) {
      await this.runCommand('npm init -y');
      // Don’t force a template here; your app writes files via writeFile()
      // Install vite + react tooling if needed by your flow
      // await this.installPackages(['vite', '@vitejs/plugin-react']);
    }
  }

  async restartViteServer(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');
    // A simple best-effort approach; your UI may manage the dev server itself
    await this.runCommand('bash -lc "pkill -f vite || true"');
    // You can start it detached if your UI expects a server running:
    // await this.runCommand('bash -lc "npm run dev >/tmp/vite.log 2>&1 &"');
  }
}
