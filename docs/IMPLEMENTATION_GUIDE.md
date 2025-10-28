# Implementation Guide: Leveraging Open Lovable for Artifact Creation

## Overview

Your existing Open Lovable codebase is **90% ready** for the artifact creation pivot! Here's how to adapt what you have.

---

## 🎯 Direct Code Reuse Mapping

### 1. AI Streaming Infrastructure → Multi-Agent Orchestration

**Existing:** `/app/api/generate-ai-code-stream/route.ts`
- ✅ Multi-provider AI support (OpenAI, Anthropic, Groq, Gemini)
- ✅ Real-time streaming with `TransformStream`
- ✅ Conversation state management
- ✅ Context handling

**Adaptation for Artifacts:**

```typescript
// EXISTING (Code Generation):
app/api/generate-ai-code-stream/route.ts
→ Generates React code from prompts

// NEW (Artifact Creation):
app/api/create-artifact-stream/route.ts
→ Generates personas/journey maps from research data

// REUSE EXACTLY:
- AI provider configuration (lines 18-45)
- Streaming setup (TransformStream pattern)
- Conversation context management (lines 103-139)
- Multi-model selection logic

// MODIFY:
- System prompts (change from "React developer" to "Research synthesizer")
- Output format (from <file> tags to <artifact> tags)
- Context (from code files to evidence/research data)
```

**Example Adaptation:**

```typescript
// In app/api/create-artifact-stream/route.ts

// KEEP THIS (unchanged from generate-ai-code-stream):
const anthropic = createAnthropic({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.ANTHROPIC_API_KEY,
  baseURL: isUsingAIGateway ? aiGatewayBaseURL : process.env.ANTHROPIC_BASE_URL,
});

// MODIFY THIS:
const systemPrompt = `You are an expert design research synthesizer.
You analyze interview transcripts, surveys, and user feedback to create:
- User personas with evidence citations
- Customer journey maps
- Problem statements

Output format:
<artifact type="persona" id="unique-id">
  <section name="Demographics">
    <insight confidence="0.85">Age range: 28-35</insight>
    <citation source="interview-03.txt" timestamp="04:32">
      "I'm 31 and just started using design tools professionally"
    </citation>
  </section>
</artifact>`;
```

---

### 2. File Management → Evidence & Artifact Storage

**Existing:** `/lib/sandbox/` (Vercel & E2B providers)
- ✅ Abstract file operations (read/write)
- ✅ File caching system
- ✅ Global file state management

**Adaptation for Artifacts:**

```typescript
// EXISTING:
lib/sandbox/providers/vercel-provider.ts
→ Manages code files in sandbox

// NEW:
lib/evidence/providers/storage-provider.ts
→ Manages research evidence and artifacts

// REUSE:
- Abstract provider pattern (SandboxProvider → EvidenceProvider)
- writeFile() / readFile() methods
- File cache structure (SandboxFileCache → EvidenceCache)
```

**Example Adaptation:**

```typescript
// Create: lib/evidence/types.ts
export interface EvidenceFile {
  id: string;
  type: 'transcript' | 'survey' | 'support-ticket' | 'note';
  content: string;
  metadata: {
    source: string;
    uploadedAt: number;
    processedAt?: number;
  };
}

export interface EvidenceProvider {
  storeEvidence(file: EvidenceFile): Promise<void>;
  retrieveEvidence(id: string): Promise<EvidenceFile>;
  searchEvidence(query: string): Promise<EvidenceFile[]>;
}

// Reuse sandbox file cache pattern:
export interface EvidenceCache {
  evidence: Record<string, EvidenceFile>;
  artifacts: Record<string, Artifact>;
  lastSync: number;
  workspaceId: string;
}
```

---

### 3. AI Response Parsing → Insight & Citation Extraction

**Existing:** `/app/api/apply-ai-code-stream/route.ts`
- ✅ Parses AI output into structured files
- ✅ Extracts packages from imports
- ✅ Handles streaming progress

**Adaptation for Artifacts:**

```typescript
// EXISTING (parse code files):
function parseAIResponse(response: string): ParsedResponse {
  const fileRegex = /<file path="([^"]+)">([\s\S]*?)(?:<\/file>|$)/g;
  // Extract files from AI response
}

// NEW (parse artifacts with citations):
function parseArtifactResponse(response: string): ParsedArtifact {
  const artifactRegex = /<artifact type="([^"]+)" id="([^"]+)">([\s\S]*?)(?:<\/artifact>|$)/g;
  const citationRegex = /<citation source="([^"]+)"[^>]*>([\s\S]*?)<\/citation>/g;
  
  // Extract artifacts and their citations
  const artifacts = [];
  const citations = [];
  
  // Parse structured artifact data
  while ((match = artifactRegex.exec(response)) !== null) {
    const type = match[1]; // 'persona', 'journey', etc.
    const id = match[2];
    const content = match[3];
    
    // Extract citations from content
    const artifactCitations = extractCitations(content);
    
    artifacts.push({
      type,
      id,
      content,
      citations: artifactCitations
    });
  }
  
  return { artifacts, citations };
}

function extractCitations(content: string): Citation[] {
  // Similar to extractPackagesFromCode() but for evidence sources
  const citations: Citation[] = [];
  const citationRegex = /<citation source="([^"]+)"(?:\s+timestamp="([^"]+)")?>([\s\S]*?)<\/citation>/g;
  
  let match;
  while ((match = citationRegex.exec(content)) !== null) {
    citations.push({
      source: match[1],
      timestamp: match[2],
      quote: match[3].trim()
    });
  }
  
  return citations;
}
```

---

### 4. Progress Tracking → Agent Status Display

**Existing:** `components/CodeApplicationProgress.tsx`
- ✅ Shows real-time progress
- ✅ Animated loading states
- ✅ Stage-based updates

**Adaptation for Artifacts:**

```tsx
// EXISTING:
<CodeApplicationProgress 
  state={{ 
    stage: 'installing',
    message: 'Installing packages...' 
  }} 
/>

// NEW:
<ArtifactCreationProgress 
  state={{ 
    agent: 'analysis',
    stage: 'clustering',
    message: 'Analyzing 10 transcripts... found 5 themes',
    progress: 0.6
  }} 
/>

// Component: components/ArtifactCreationProgress.tsx
// Copy from CodeApplicationProgress and modify:

export default function ArtifactCreationProgress({ state }) {
  const getAgentIcon = (agent: string) => {
    switch(agent) {
      case 'ingestion': return '📥';
      case 'analysis': return '🔍';
      case 'citation': return '🔗';
      case 'quality': return '✅';
      default: return '⚙️';
    }
  };

  return (
    <motion.div className="bg-gray-100 rounded-[10px] p-3 mt-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getAgentIcon(state.agent)}</span>
        <div className="flex-1">
          <div className="text-sm font-medium">{state.message}</div>
          {state.progress && (
            <div className="w-full bg-gray-300 rounded-full h-1.5 mt-1">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${state.progress * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
```

---

### 5. Preview System → Artifact Preview

**Existing:** `components/SandboxPreview.tsx`
- ✅ Iframe preview
- ✅ Refresh/reload controls
- ✅ Console toggle

**Adaptation for Artifacts:**

```tsx
// EXISTING:
<SandboxPreview 
  previewUrl={sandboxUrl}
  type="vite"
  onRefresh={() => refreshSandbox()}
/>

// NEW:
<ArtifactPreview 
  artifact={currentArtifact}
  type="persona"
  onExport={() => exportToFigma()}
  onRefine={() => showEvidencePanel()}
/>

// Component structure (adapt from SandboxPreview):
export default function ArtifactPreview({ artifact, type }) {
  return (
    <div className="space-y-4">
      {/* Preview Controls - REUSE */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {type === 'persona' ? '👤 Persona' : '🗺️ Journey Map'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={showEvidence}>📚 Evidence</button>
          <button onClick={exportToFigma}>📤 Export</button>
          <button onClick={handleRefine}>✏️ Refine</button>
        </div>
      </div>

      {/* Main Preview - NEW (not iframe, rendered component) */}
      <div className="bg-white rounded-lg border p-6">
        {type === 'persona' && <PersonaRenderer data={artifact} />}
        {type === 'journey' && <JourneyMapRenderer data={artifact} />}
      </div>
    </div>
  );
}
```

---

### 6. Data Ingestion → Evidence Upload

**Existing:** `/app/api/scrape-url-enhanced/route.ts`
- ✅ Uses Firecrawl for data extraction
- ✅ Sanitizes and formats content
- ✅ Returns structured data

**Adaptation for Artifacts:**

```typescript
// EXISTING:
app/api/scrape-url-enhanced/route.ts
→ Scrapes website content

// NEW:
app/api/ingest-research/route.ts
→ Ingests research files (transcripts, PDFs, surveys)

// REUSE:
- Firecrawl integration (can parse PDFs, documents)
- Content sanitization (sanitizeQuotes function)
- Structured response format

// Example:
export async function POST(request: NextRequest) {
  const { source, type } = await request.json();
  
  // For URLs (articles, documentation):
  if (type === 'url') {
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: source,
        formats: ['markdown'],
      })
    });
    
    const data = await firecrawlResponse.json();
    
    return NextResponse.json({
      success: true,
      evidence: {
        id: generateId(),
        type: 'article',
        content: data.data.markdown,
        source: source,
        metadata: data.data.metadata
      }
    });
  }
  
  // For file uploads (transcripts, PDFs):
  if (type === 'file') {
    // Use existing file parsing logic
    // Store in evidence cache
  }
}
```

---

### 7. Conversation State → Artifact Context

**Existing:** Global conversation state management
```typescript
global.conversationState: ConversationState
```

**Adaptation:**

```typescript
// EXISTING:
interface ConversationState {
  conversationId: string;
  context: {
    messages: ConversationMessage[];
    edits: ConversationEdit[];
  };
}

// EXTEND (don't replace):
interface ArtifactConversationState extends ConversationState {
  context: {
    messages: ConversationMessage[];
    edits: ConversationEdit[];
    
    // NEW for artifacts:
    evidencePool: EvidenceFile[];
    activeArtifact?: Artifact;
    artifactHistory: ArtifactVersion[];
    insights: Insight[];
    citations: Citation[];
  };
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Minimal Viable Adaptation (Week 1)

**Goal:** Get basic persona creation working with existing code

1. **Copy & Modify Endpoints:**
   ```bash
   # Copy existing endpoints
   cp app/api/generate-ai-code-stream/route.ts app/api/create-artifact-stream/route.ts
   cp app/api/apply-ai-code-stream/route.ts app/api/apply-artifact-stream/route.ts
   
   # Modify prompts and parsing logic
   ```

2. **Reuse Components:**
   ```bash
   # Copy and adapt UI components
   cp components/CodeApplicationProgress.tsx components/ArtifactCreationProgress.tsx
   cp components/SandboxPreview.tsx components/ArtifactPreview.tsx
   ```

3. **Adapt File Storage:**
   ```bash
   # Repurpose sandbox for evidence storage
   # Use existing file cache for evidence
   # No new infrastructure needed!
   ```

### Phase 2: Add Agent Specialization (Week 2)

**Goal:** Split orchestrator into specialized agents

1. **Create Agent Router:**
   ```typescript
   // lib/agents/orchestrator.ts
   export async function orchestrateAgents(userIntent: string, context: Context) {
     // Determine which agents to call
     if (userIntent.includes('analyze')) {
       return analysisAgent.process(context.evidence);
     }
     if (userIntent.includes('cite')) {
       return citationAgent.link(context.insights, context.evidence);
     }
   }
   ```

2. **Reuse Streaming Pattern:**
   - Each agent streams progress like package installation
   - Orchestrator aggregates streams

### Phase 3: Add Evidence Panel (Week 3)

**Goal:** Add power-user evidence exploration

1. **Build on Existing UI:**
   - Use existing sidebar patterns
   - Adapt file tree component for evidence tree
   - Reuse search/filter logic

---

## 📋 Quick Start: Build Your First Agent

### Step 1: Create the Ingestion Agent

```typescript
// lib/agents/ingestion-agent.ts

import type { EvidenceFile } from '@/types/evidence';

export class IngestionAgent {
  async validate(file: any): Promise<{ valid: boolean; error?: string }> {
    // Check file format, size, permissions
    if (!file.content) {
      return { valid: false, error: 'Empty file' };
    }
    
    return { valid: true };
  }

  async normalize(file: any): Promise<EvidenceFile> {
    // Convert to standard format
    return {
      id: generateId(),
      type: detectType(file),
      content: sanitizeContent(file.content),
      metadata: {
        source: file.name,
        uploadedAt: Date.now()
      }
    };
  }

  async deduplicate(files: EvidenceFile[]): Promise<EvidenceFile[]> {
    // Remove duplicates based on content similarity
    // Use existing deduplication logic from package detection
    const unique = new Set<string>();
    return files.filter(f => {
      const hash = hashContent(f.content);
      if (unique.has(hash)) return false;
      unique.add(hash);
      return true;
    });
  }
}

// Reuse from existing code:
function sanitizeContent(content: string): string {
  // Use existing sanitizeQuotes from scrape-url-enhanced
  return content
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}
```

### Step 2: Create API Endpoint

```typescript
// app/api/agents/ingest/route.ts

import { IngestionAgent } from '@/lib/agents/ingestion-agent';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { files } = await request.json();
  
  const agent = new IngestionAgent();
  
  // Create streaming response (REUSE pattern from install-packages)
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  const sendProgress = async (data: any) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\\n\\n`));
  };
  
  (async () => {
    try {
      await sendProgress({ type: 'status', message: 'Validating files...' });
      
      // Validate each file
      for (const file of files) {
        const validation = await agent.validate(file);
        if (!validation.valid) {
          await sendProgress({ 
            type: 'error', 
            message: `File ${file.name}: ${validation.error}` 
          });
          continue;
        }
      }
      
      await sendProgress({ type: 'status', message: 'Normalizing content...' });
      const normalized = await Promise.all(
        files.map(f => agent.normalize(f))
      );
      
      await sendProgress({ type: 'status', message: 'Checking for duplicates...' });
      const unique = await agent.deduplicate(normalized);
      
      await sendProgress({ 
        type: 'complete', 
        message: `Processed ${unique.length} files`,
        data: unique
      });
      
      await writer.close();
    } catch (error) {
      await sendProgress({ type: 'error', message: error.message });
      await writer.close();
    }
  })();
  
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
```

### Step 3: Wire Up the UI

```tsx
// app/artifact-creator/page.tsx

'use client';

import { useState } from 'react';
import { ArtifactCreationProgress } from '@/components/ArtifactCreationProgress';

export default function ArtifactCreatorPage() {
  const [progress, setProgress] = useState<any>(null);

  async function handleUpload(files: File[]) {
    // Call ingestion agent
    const response = await fetch('/api/agents/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files })
    });

    // Stream progress (REUSE pattern from CodeApplicationProgress)
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          setProgress(data);
        }
      }
    }
  }

  return (
    <div className="p-8">
      <h1>Create Artifact</h1>
      
      <input 
        type="file" 
        multiple 
        onChange={(e) => handleUpload(Array.from(e.target.files))}
      />

      {progress && <ArtifactCreationProgress state={progress} />}
    </div>
  );
}
```

---

## 🎨 UI Component Reuse Matrix

| Existing Component | New Component | Modification Level |
|-------------------|---------------|-------------------|
| `HeroInput` | `ArtifactPromptInput` | Low (change placeholder text) |
| `CodeApplicationProgress` | `ArtifactCreationProgress` | Low (change icons/labels) |
| `SandboxPreview` | `ArtifactPreview` | Medium (replace iframe with renderer) |
| `SidebarInput` | `EvidencePanel` | Medium (adapt for evidence tree) |
| File tree (if exists) | Evidence browser | Low (rename, adjust icons) |

---

## 🔄 API Endpoint Reuse Matrix

| Existing Endpoint | New Endpoint | Reuse % |
|-------------------|--------------|---------|
| `/api/generate-ai-code-stream` | `/api/create-artifact-stream` | 80% |
| `/api/apply-ai-code-stream` | `/api/apply-artifact-stream` | 70% |
| `/api/install-packages` | `/api/agents/ingest` | 60% (streaming pattern) |
| `/api/scrape-url-enhanced` | `/api/ingest-research` | 85% |
| `/api/create-ai-sandbox-v2` | `/api/create-workspace` | 90% |

---

## 🧩 Library Reuse

### Already Have (No Changes Needed):
- ✅ AI SDK providers (`@ai-sdk/*`)
- ✅ Streaming utilities
- ✅ UI components (Radix, Tailwind)
- ✅ State management (Jotai)

### Extend (Minor additions):
- 📝 Add citation parsing to AI response parser
- 📝 Add confidence scoring to insights
- 📝 Add evidence clustering algorithms

### New (Build from scratch):
- 🆕 Persona/Journey renderers (pure UI components)
- 🆕 Evidence similarity matching
- 🆕 Inter-rater reliability tracking

---

## 💡 Key Principles

1. **Copy, Don't Rewrite**: Start by copying working code and modifying
2. **Extend Types**: Add new interfaces that extend existing ones
3. **Reuse Patterns**: Streaming, state management, UI components all work as-is
4. **Gradual Migration**: Keep both systems running during transition

---

## Next Steps

1. **Start with Ingestion Agent** (easiest, most reusable)
2. **Adapt one endpoint** (`generate-ai-code-stream` → `create-artifact-stream`)
3. **Test with simple persona creation**
4. **Add more agents incrementally**

The beauty of this approach: **You can ship a working artifact creator in ~1 week** by leveraging what you already have!
