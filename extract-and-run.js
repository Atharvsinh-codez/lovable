#!/usr/bin/env node

/**
 * Extract generated code from Open Lovable and run it locally
 * Bypasses their broken preview system
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createLocalProject(prompt) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const projectName = `project-${timestamp}`;
  const projectPath = path.join(__dirname, 'extracted-projects', projectName);

  // Create project directory
  fs.mkdirSync(projectPath, { recursive: true });

  console.log(`🚀 Creating project: ${projectName}`);
  console.log(`📁 Location: ${projectPath}`);

  // Create basic React app structure
  const packageJson = {
    "name": projectName,
    "version": "1.0.0",
    "private": true,
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-scripts": "5.0.1"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    "browserslist": {
      "production": [">0.2%", "not dead", "not op_mini all"],
      "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
    }
  };

  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create public/index.html
  const publicDir = path.join(projectPath, 'public');
  fs.mkdirSync(publicDir);

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Generated App</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

  fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);

  // Create src directory
  const srcDir = path.join(projectPath, 'src');
  fs.mkdirSync(srcDir);

  // Create basic App.js
  const appJs = `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Generated React App
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            Ready for your generated components!
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Prompt: "${prompt}"
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;`;

  fs.writeFileSync(path.join(srcDir, 'App.js'), appJs);

  // Create index.js
  const indexJs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

  fs.writeFileSync(path.join(srcDir, 'index.js'), indexJs);

  console.log(`✅ Project structure created`);
  console.log(`📦 Installing dependencies...`);

  // Install dependencies
  try {
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    console.log(`✅ Dependencies installed`);
  } catch (error) {
    console.error(`❌ Failed to install dependencies:`, error.message);
    return null;
  }

  return projectPath;
}

async function callOpenLovableAPI(prompt) {
  console.log(`🤖 Generating code with Open Lovable...`);
  console.log(`💭 Prompt: "${prompt}"`);
  
  // Make API call to Open Lovable
  const response = await fetch('http://localhost:3001/api/generate-ai-code-stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      model: 'anthropic/claude-sonnet-4-20250514',
      isEdit: false,
      context: {
        sandboxId: 'local-extraction',
        currentFiles: []
      }
    })
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  // Read streaming response
  const reader = response.body.getReader();
  let fullResponse = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = new TextDecoder().decode(value);
    fullResponse += chunk;
  }

  console.log(`✅ Code generated (${fullResponse.length} characters)`);
  return fullResponse;
}

function extractCodeFromResponse(response) {
  console.log(`🔍 Extracting code from response...`);
  
  const files = [];
  const fileRegex = /<file path="([^"]+)">([\s\S]*?)<\/file>/g;
  let match;

  while ((match = fileRegex.exec(response)) !== null) {
    const filePath = match[1];
    const content = match[2].trim();
    files.push({ path: filePath, content });
  }

  console.log(`✅ Extracted ${files.length} files`);
  return files;
}

function saveFilesToProject(projectPath, files) {
  console.log(`💾 Saving files to project...`);
  
  files.forEach(file => {
    const fullPath = path.join(projectPath, file.path);
    const dir = path.dirname(fullPath);
    
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, file.content);
    console.log(`   ✅ ${file.path}`);
  });
}

async function main() {
  const prompt = process.argv[2];
  
  if (!prompt) {
    console.log(`
🚀 Open Lovable Code Extractor

Usage: node extract-and-run.js "your prompt here"

Example: node extract-and-run.js "create a todo app with dark mode"
    `);
    return;
  }

  try {
    // Step 1: Create local React project
    const projectPath = await createLocalProject(prompt);
    if (!projectPath) return;

    // Step 2: Call Open Lovable API
    const response = await callOpenLovableAPI(prompt);

    // Step 3: Extract code files
    const files = extractCodeFromResponse(response);
    
    if (files.length === 0) {
      console.log(`⚠️  No code files found in response. Raw response:`);
      console.log(response);
      return;
    }

    // Step 4: Save files to project
    saveFilesToProject(projectPath, files);

    // Step 5: Start dev server
    console.log(`\n🎉 Project ready!`);
    console.log(`📁 Location: ${projectPath}`);
    console.log(`🚀 Starting development server...`);
    
    execSync('npm start', { cwd: projectPath, stdio: 'inherit' });

  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { createLocalProject, callOpenLovableAPI, extractCodeFromResponse, saveFilesToProject };