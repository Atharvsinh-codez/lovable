import { Sandbox } from '@e2b/code-interpreter';
import { SandboxProvider, SandboxInfo, CommandResult } from '../types';
import { appConfig } from '@/config/app.config';

const WORKDIR = appConfig.e2b.workingDirectory || '/home/user/app';
const VITE_PORT = appConfig.e2b.vitePort || 5173;

export class E2BProvider extends SandboxProvider {
  private existingFiles: Set<string> = new Set();

  async reconnect(_sandboxId: string): Promise<boolean> {
    return false; // Not supported yet
  }

  private async ensureWorkingDir(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');
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
        timeoutMs: this.config.e2b?.timeoutMs || appConfig.e2b.timeoutMs
      });

      await this.ensureWorkingDir();

      const sandboxId = (this.sandbox as any).sandboxId || Date.now().toString();
      const host = (this.sandbox as any).getHost?.(VITE_PORT);

      this.sandboxInfo = {
        sandboxId,
        url: host ? `https://${host}` : '',
        provider: 'e2b',
        createdAt: new Date()
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

    // NOTE: This is for short-lived commands. Long-running (dev server) uses Popen elsewhere.
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
      success: !result.error
    };
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');

    const fullPath = path.startsWith('/') ? path : `${WORKDIR}/${path}`;
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
      const entries = await this.sandbox.files.list(dir);
      const flatten = (items: any[]): string[] =>
        items.flatMap((it: any) =>
          it.type === 'file'
            ? [it.path.replace(`${WORKDIR}/`, '')]
            : flatten(it.children || [])
        );
      return flatten(entries);
    }

    const result = await this.sandbox.runCode(`
import os, json
base = ${JSON.stringify(dir)}
out = []
for root, dirs, files in os.walk(base):
    dirs[:] = [d for d in dirs if d not in ['node_modules','.git','.next','dist','build','__pycache__']]
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, ${JSON.stringify(WORKDIR)})
        out.append(rel)
print(json.dumps(out))
`);
    const out = result.logs.stdout.join('\n').trim();
    try {
      return JSON.parse(out);
    } catch {
      return [];
    }
  }

  async installPackages(packages: string[]): Promise<CommandResult> {
    if (!this.sandbox) throw new Error('No active sandbox');
    if (!packages || packages.length === 0) {
      return { stdout: 'No packages requested', stderr: '', exitCode: 0, success: true };
    }
    const flag = appConfig.packages?.useLegacyPeerDeps ? ' --legacy-peer-deps' : '';
    return await this.runCommand(`npm install ${packages.join(' ')}${flag}`);
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

  // --- Vite / Dev server helpers ------------------------------------------------

  private async startDevServer(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');

    // Use Python subprocess.Popen so it stays running after this call returns.
    await this.sandbox.runCode(`
import subprocess, os, sys, time

os.chdir(${JSON.stringify(WORKDIR)})

# Avoid duplicate processes
def already_running():
    try:
        import psutil
        for p in psutil.process_iter(['cmdline']):
            cmd = p.info.get('cmdline') or []
            if any('vite' in part for part in cmd):
                return True
    except Exception:
        pass
    return False

if already_running():
    print("Vite already running")
else:
    print("Starting Vite dev server on port ${VITE_PORT}...")
    # Start detached
    p = subprocess.Popen(['npm','run','dev'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"Spawned PID: {p.pid}")
`);

    // (Optional) small delay could be introduced here if you want to probe readiness.
  }

  async setupViteApp(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');

    // Determine if we already have a Vite setup
    const check = await this.runCommand('bash -lc "test -f package.json && echo yes || echo no"');
    const hasPkg = check.stdout.includes('yes');

    if (!hasPkg) {
      // Create minimal Vite + React project
      await this.runCommand('npm init -y');

      // Overwrite package.json with needed scripts and deps
      const pkg = {
        name: 'sandbox-app',
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: `vite --host --port ${VITE_PORT}`,
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          vite: '^5.0.0',
          '@vitejs/plugin-react': '^4.0.0'
        }
      };
      await this.writeFile('package.json', JSON.stringify(pkg, null, 2));

      // Basic vite.config.ts
      const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: ${VITE_PORT},
    strictPort: true
  }
});
`;
      await this.writeFile('vite.config.ts', viteConfig.trim() + '\n');

      // index.html
      const indexHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>E2B Sandbox App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
      await this.writeFile('index.html', indexHtml.trim() + '\n');

      // src/main.tsx & src/App.tsx
      const appTsx = `
import React from 'react';

export function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>E2B Vite React Sandbox</h1>
      <p>Edit files and apply code to see live updates.</p>
    </div>
  );
}
`;
      await this.writeFile('src/App.tsx', appTsx.trim() + '\n');

      const mainTsx = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
`;
      await this.writeFile('src/main.tsx', mainTsx.trim() + '\n');

      // Install dependencies
      await this.installPackages([
        'react',
        'react-dom',
        'vite',
        '@vitejs/plugin-react'
      ]);
    }

    // Always (re)start the dev server to ensure port is open
    await this.restartViteServer();
  }

  async restartViteServer(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');

    // Kill any existing vite
    await this.sandbox.runCode(`
import subprocess, os, signal

def kill_vite():
    try:
        import psutil
        for p in psutil.process_iter(['pid','cmdline']):
            cmd = p.info.get('cmdline') or []
            if any('vite' in part for part in cmd):
                try:
                    p.kill()
                    print(f"Killed Vite PID {p.pid}")
                except Exception as e:
                    print(f"Failed to kill Vite PID {p.pid}: {e}")
    except Exception as e:
        print("psutil not available or error:", e)

kill_vite()
`);
    await this.startDevServer();
  }
}
