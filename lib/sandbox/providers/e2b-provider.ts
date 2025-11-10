import { Sandbox } from '@e2b/code-interpreter';
import { SandboxProvider, SandboxInfo, CommandResult } from '../types';
import { appConfig } from '@/config/app.config';

const WORKDIR = appConfig.e2b.workingDirectory || '/home/user/app';
const VITE_PORT = appConfig.e2b.vitePort || 5173;

export class E2BProvider extends SandboxProvider {
  private existingFiles: Set<string> = new Set();
  private viteProcess: any = null;

  async reconnect(sandboxId: string): Promise<boolean> {
    try {
      // E2B SDK doesn't support direct reconnection yet
      return false;
    } catch (error) {
      console.error(`[E2BProvider] Failed to reconnect to sandbox ${sandboxId}:`, error);
      return false;
    }
  }

  private async ensureWorkingDir(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');
    await this.sandbox.runCode(`
import os
os.makedirs(${JSON.stringify(WORKDIR)}, exist_ok=True)
os.chdir(${JSON.stringify(WORKDIR)})
print(f"✓ Working directory: {os.getcwd()}")
`);
  }

  async createSandbox(): Promise<SandboxInfo> {
    try {
      console.log('[E2BProvider] Creating new sandbox...');
      
      // Kill existing sandbox if any
      if (this.sandbox) {
        try {
          await this.sandbox.kill();
        } catch (e) {
          console.error('Failed to close existing sandbox:', e);
        }
        this.sandbox = null;
      }
      
      // Clear existing files tracking
      this.existingFiles.clear();
      this.viteProcess = null;

      // Create base sandbox
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

      // Set extended timeout on the sandbox instance if method available
      if (typeof this.sandbox.setTimeout === 'function') {
        this.sandbox.setTimeout(appConfig.e2b.timeoutMs);
      }

      console.log(`[E2BProvider] Sandbox created: ${sandboxId}`);
      console.log(`[E2BProvider] URL: ${this.sandboxInfo.url}`);

      return this.sandboxInfo;

    } catch (error) {
      console.error('[E2BProvider] Error creating sandbox:', error);
      throw error;
    }
  }

  async runCommand(command: string): Promise<CommandResult> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    console.log(`[E2BProvider] Running command: ${command}`);
    
    const result = await this.sandbox.runCode(`
import subprocess
import os
import shlex

os.chdir(${JSON.stringify(WORKDIR)})

# Parse command properly
cmd = ${JSON.stringify(command)}
cmd_parts = cmd if isinstance(cmd, list) else shlex.split(cmd)

result = subprocess.run(
    cmd_parts, 
    capture_output=True, 
    text=True, 
    shell=False
)

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
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const fullPath = path.startsWith('/') ? path : `${WORKDIR}/${path}`;
    
    console.log(`[E2BProvider] Writing file: ${fullPath}`);

    // Use the E2B filesystem API to write the file
    if ((this.sandbox as any).files?.write) {
      try {
        await (this.sandbox as any).files.write(fullPath, content);
        console.log(`[E2BProvider] ✓ File written via files.write API: ${path}`);
      } catch (error) {
        console.error(`[E2BProvider] Error writing via files.write:`, error);
        throw error;
      }
    } else {
      // Fallback to Python code execution with proper escaping
      await this.sandbox.runCode(`
import os
import json

# Ensure directory exists
dir_path = os.path.dirname(${JSON.stringify(fullPath)})
if dir_path:
    os.makedirs(dir_path, exist_ok=True)

# Write file with proper content handling
content = ${JSON.stringify(content)}
with open(${JSON.stringify(fullPath)}, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✓ Written: {${JSON.stringify(fullPath)}}")
print(f"  Size: {len(content)} bytes")
      `);
      console.log(`[E2BProvider] ✓ File written via Python: ${path}`);
    }
    
    this.existingFiles.add(path);
  }

  async readFile(path: string): Promise<string> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const fullPath = path.startsWith('/') ? path : `${WORKDIR}/${path}`;
    
    console.log(`[E2BProvider] Reading file: ${fullPath}`);
    
    const result = await this.sandbox.runCode(`
try:
    with open(${JSON.stringify(fullPath)}, 'r', encoding='utf-8') as f:
        content = f.read()
    print(content)
except FileNotFoundError:
    print("ERROR: File not found")
except Exception as e:
    print(f"ERROR: {str(e)}")
    `);
    
    const output = result.logs.stdout.join('\n');
    if (output.startsWith('ERROR:')) {
      throw new Error(output);
    }
    
    return output;
  }

  async listFiles(directory: string = WORKDIR): Promise<string[]> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const result = await this.sandbox.runCode(`
import os
import json

def list_files(path):
    files = []
    try:
        for root, dirs, filenames in os.walk(path):
            # Skip node_modules and other build directories
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'build', '.vite']]
            for filename in filenames:
                rel_path = os.path.relpath(os.path.join(root, filename), path)
                files.append(rel_path)
    except Exception as e:
        print(f"Error listing files: {e}", file=sys.stderr)
    return files

files = list_files(${JSON.stringify(directory)})
print(json.dumps(files))
    `);
    
    try {
      const output = result.logs.stdout.join('');
      return JSON.parse(output);
    } catch {
      return [];
    }
  }

  async installPackages(packages: string[]): Promise<CommandResult> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const packageList = packages.join(' ');
    const flags = appConfig.packages?.useLegacyPeerDeps ? '--legacy-peer-deps' : '';
    
    console.log(`[E2BProvider] Installing packages: ${packageList}`);
    
    const result = await this.sandbox.runCode(`
import subprocess
import os

os.chdir(${JSON.stringify(WORKDIR)})

# Install packages
cmd = ['npm', 'install']
${flags ? `cmd.append('${flags}')` : ''}
cmd.extend([${packages.map(p => `'${p}'`).join(', ')}])

print(f"Running: {' '.join(cmd)}")

result = subprocess.run(
    cmd,
    capture_output=True,
    text=True,
    cwd=${JSON.stringify(WORKDIR)}
)

print("STDOUT:")
print(result.stdout)
if result.stderr:
    print("\\nSTDERR:")
    print(result.stderr)
print(f"\\nReturn code: {result.returncode}")
    `);
    
    const stdout = result.logs.stdout.join('\n');
    const stderr = result.logs.stderr.join('\n');
    const success = !result.error;
    
    // Restart Vite if configured and installation succeeded
    if (appConfig.packages?.autoRestartVite && success) {
      console.log('[E2BProvider] Auto-restarting Vite server...');
      await this.restartViteServer();
    }
    
    return {
      stdout,
      stderr,
      exitCode: result.error ? 1 : 0,
      success
    };
  }

  async setupViteApp(): Promise<void> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    console.log('[E2BProvider] Setting up Vite React app...');
    
    // Write all files in a single Python script for better reliability
    const setupScript = `
import os
import json

print('Setting up React app with Vite and Tailwind...')

# Ensure we're in the right directory
os.chdir(${JSON.stringify(WORKDIR)})

# Create directory structure
os.makedirs('src', exist_ok=True)

# Package.json
package_json = {
    "name": "sandbox-app",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite --host 0.0.0.0 --port ${VITE_PORT}",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.3.1",
        "vite": "^5.0.0",
        "tailwindcss": "^3.4.0",
        "postcss": "^8.4.32",
        "autoprefixer": "^10.4.16"
    }
}

with open('package.json', 'w') as f:
    json.dump(package_json, f, indent=2)
print('✓ package.json')

# Vite config - CRITICAL: Allow all E2B hosts
vite_config = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: ${VITE_PORT},
    strictPort: true,
    allowedHosts: [
      '.e2b.dev',
      '.e2b.app', 
      '.vercel.app',
      '.vercel.run',
      'localhost',
      '127.0.0.1'
    ],
    hmr: {
      protocol: 'wss',
      clientPort: ${VITE_PORT},
      host: undefined
    },
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: ${VITE_PORT},
    strictPort: true
  }
})"""

with open('vite.config.js', 'w') as f:
    f.write(vite_config)
print('✓ vite.config.js')

# Tailwind config
tailwind_config = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}"""

with open('tailwind.config.js', 'w') as f:
    f.write(tailwind_config)
print('✓ tailwind.config.js')

# PostCSS config
postcss_config = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}"""

with open('postcss.config.js', 'w') as f:
    f.write(postcss_config)
print('✓ postcss.config.js')

# Index.html
index_html = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Sandbox App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>"""

with open('index.html', 'w') as f:
    f.write(index_html)
print('✓ index.html')

# Main.jsx
main_jsx = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)"""

with open('src/main.jsx', 'w') as f:
    f.write(main_jsx)
print('✓ src/main.jsx')

# App.jsx
app_jsx = """function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl space-y-6">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          🚀 Sandbox Ready
        </h1>
        <p className="text-xl text-gray-300">
          Your AI-powered development environment is ready!
        </p>
        <p className="text-lg text-gray-400">
          Start building with React, Vite, and Tailwind CSS
        </p>
      </div>
    </div>
  )
}

export default App"""

with open('src/App.jsx', 'w') as f:
    f.write(app_jsx)
print('✓ src/App.jsx')

# Index.css
index_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}"""

with open('src/index.css', 'w') as f:
    f.write(index_css)
print('✓ src/index.css')

print('\\n✅ All files created successfully!')
`;

    await this.sandbox.runCode(setupScript);
    
    // Install dependencies
    console.log('[E2BProvider] Installing npm packages...');
    await this.sandbox.runCode(`
import subprocess
import os

os.chdir(${JSON.stringify(WORKDIR)})

print('📦 Installing dependencies...')
result = subprocess.run(
    ['npm', 'install'],
    capture_output=True,
    text=True
)

if result.returncode == 0:
    print('✅ Dependencies installed successfully')
else:
    print(f'⚠️ npm install had issues:')
    print(result.stderr)
    `);
    
    // Start Vite dev server
    console.log('[E2BProvider] Starting Vite dev server...');
    await this.startViteServer();
    
    // Track initial files
    this.existingFiles.add('src/App.jsx');
    this.existingFiles.add('src/main.jsx');
    this.existingFiles.add('src/index.css');
    this.existingFiles.add('index.html');
    this.existingFiles.add('package.json');
    this.existingFiles.add('vite.config.js');
    this.existingFiles.add('tailwind.config.js');
    this.existingFiles.add('postcss.config.js');

    console.log('[E2BProvider] ✅ Vite app setup complete!');
  }

  private async startViteServer(): Promise<void> {
    if (!this.sandbox) throw new Error('No active sandbox');

    await this.sandbox.runCode(`
import subprocess
import os
import time

os.chdir(${JSON.stringify(WORKDIR)})

# Kill any existing Vite processes
subprocess.run(['pkill', '-9', '-f', 'vite'], capture_output=True)
time.sleep(1)

# Start Vite dev server in background
env = os.environ.copy()
env['FORCE_COLOR'] = '0'
env['HOST'] = '0.0.0.0'
env['PORT'] = '${VITE_PORT}'

process = subprocess.Popen(
    ['npm', 'run', 'dev'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    env=env,
    cwd=${JSON.stringify(WORKDIR)}
)

print(f'✅ Vite dev server started (PID: {process.pid})')
print(f'🌐 Server should be available on port ${VITE_PORT}')
    `);
    
    // Wait for Vite to be ready
    const startupDelay = appConfig.e2b?.viteStartupDelay || 5000;
    await new Promise(resolve => setTimeout(resolve, startupDelay));
    
    console.log('[E2BProvider] Vite server should be ready');
  }

  async restartViteServer(): Promise<void> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    console.log('[E2BProvider] Restarting Vite server...');
    
    await this.sandbox.runCode(`
import subprocess
import time
import os

os.chdir(${JSON.stringify(WORKDIR)})

# Kill existing Vite process
print('🛑 Stopping Vite...')
subprocess.run(['pkill', '-9', '-f', 'vite'], capture_output=True)
time.sleep(2)

# Start Vite dev server
print('🚀 Starting Vite...')
env = os.environ.copy()
env['FORCE_COLOR'] = '0'
env['HOST'] = '0.0.0.0'
env['PORT'] = '${VITE_PORT}'

process = subprocess.Popen(
    ['npm', 'run', 'dev'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    env=env,
    cwd=${JSON.stringify(WORKDIR)}
)

print(f'✅ Vite restarted (PID: {process.pid})')
    `);
    
    // Wait for Vite to be ready
    const startupDelay = appConfig.e2b?.viteStartupDelay || 5000;
    await new Promise(resolve => setTimeout(resolve, startupDelay));
    
    console.log('[E2BProvider] ✅ Vite server restarted');
  }

  getSandboxUrl(): string | null {
    return this.sandboxInfo?.url || null;
  }

  getSandboxInfo(): SandboxInfo | null {
    return this.sandboxInfo;
  }

  async terminate(): Promise<void> {
    if (this.sandbox) {
      console.log('[E2BProvider] Terminating sandbox...');
      try {
        await this.sandbox.kill();
      } catch (e) {
        console.error('Failed to terminate sandbox:', e);
      }
      this.sandbox = null;
      this.sandboxInfo = null;
      this.existingFiles.clear();
      this.viteProcess = null;
    }
  }

  isAlive(): boolean {
    return !!this.sandbox;
  }
}
