# Quick Start: Build Persona Creator in 30 Minutes

## Goal
Create a working persona generator that uses your existing Open Lovable infrastructure.

---

## Step 1: Create the Artifact Creation Endpoint (5 min)

Copy and adapt your existing code generation endpoint:

```bash
# Copy the existing endpoint
cp app/api/generate-ai-code-stream/route.ts app/api/create-persona-stream/route.ts
```

Now modify `app/api/create-persona-stream/route.ts`:

```typescript
// Keep all imports and AI provider setup (lines 1-45) - UNCHANGED

// CHANGE: Update the system prompt (around line 700)
const systemPrompt = `You are an expert UX researcher who synthesizes interview data into user personas.

When given interview transcripts, you:
1. Identify common patterns and user segments
2. Extract demographic information
3. Identify goals, pain points, and behaviors
4. Provide evidence citations for every insight

Output format:
<persona id="unique-id" name="Persona Name">
  <section name="Demographics">
    <insight confidence="0.85">Age range: 28-35</insight>
    <citation source="interview-03" line="42">
      "I'm 31 and just started using design tools professionally"
    </citation>
  </section>
  
  <section name="Goals">
    <insight confidence="0.92">Create professional designs quickly</insight>
    <citation source="interview-01" line="15">
      "I need to ship designs fast without compromising quality"
    </citation>
    <citation source="interview-07" line="89">
      "Speed is everything in my workflow"
    </citation>
  </section>
  
  <section name="Pain Points">
    <insight confidence="0.78">Struggles with complex tool features</insight>
    <citation source="interview-02" line="34">
      "The advanced features are overwhelming"
    </citation>
  </section>
</persona>

IMPORTANT:
- Every insight MUST have at least 2 citations
- Include confidence scores (0.0-1.0) based on evidence strength
- Use exact quotes from interviews
- Reference source and line numbers`;

// Keep the rest of the file - streaming logic works as-is!
```

---

## Step 2: Create Persona Parser (5 min)

Create `lib/parsers/persona-parser.ts`:

```typescript
interface PersonaInsight {
  text: string;
  confidence: number;
  citations: Citation[];
}

interface Citation {
  source: string;
  line?: string;
  quote: string;
}

interface ParsedPersona {
  id: string;
  name: string;
  sections: {
    [sectionName: string]: PersonaInsight[];
  };
}

export function parsePersonaResponse(response: string): ParsedPersona[] {
  const personas: ParsedPersona[] = [];
  
  // Extract persona blocks
  const personaRegex = /<persona id="([^"]+)" name="([^"]+)">([\s\S]*?)<\/persona>/g;
  let personaMatch;
  
  while ((personaMatch = personaRegex.exec(response)) !== null) {
    const id = personaMatch[1];
    const name = personaMatch[2];
    const content = personaMatch[3];
    
    // Extract sections
    const sections: { [key: string]: PersonaInsight[] } = {};
    const sectionRegex = /<section name="([^"]+)">([\s\S]*?)<\/section>/g;
    let sectionMatch;
    
    while ((sectionMatch = sectionRegex.exec(content)) !== null) {
      const sectionName = sectionMatch[1];
      const sectionContent = sectionMatch[2];
      
      // Extract insights
      const insights = extractInsights(sectionContent);
      sections[sectionName] = insights;
    }
    
    personas.push({ id, name, sections });
  }
  
  return personas;
}

function extractInsights(content: string): PersonaInsight[] {
  const insights: PersonaInsight[] = [];
  
  // Match insight + citations pattern
  const insightRegex = /<insight confidence="([^"]+)">([^<]+)<\/insight>([\s\S]*?)(?=<insight|<\/section>|$)/g;
  let match;
  
  while ((match = insightRegex.exec(content)) !== null) {
    const confidence = parseFloat(match[1]);
    const text = match[2].trim();
    const citationBlock = match[3];
    
    // Extract citations
    const citations = extractCitations(citationBlock);
    
    insights.push({
      text,
      confidence,
      citations
    });
  }
  
  return insights;
}

function extractCitations(content: string): Citation[] {
  const citations: Citation[] = [];
  const citationRegex = /<citation source="([^"]+)"(?:\s+line="([^"]+)")?>([^<]+)<\/citation>/g;
  let match;
  
  while ((match = citationRegex.exec(content)) !== null) {
    citations.push({
      source: match[1],
      line: match[2],
      quote: match[3].trim()
    });
  }
  
  return citations;
}
```

---

## Step 3: Create Persona Renderer (10 min)

Create `components/PersonaCard.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import { User, Target, AlertCircle, TrendingUp } from 'lucide-react';

interface PersonaCardProps {
  persona: {
    id: string;
    name: string;
    sections: {
      [key: string]: Array<{
        text: string;
        confidence: number;
        citations: Array<{
          source: string;
          line?: string;
          quote: string;
        }>;
      }>;
    };
  };
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return '🟢 High';
    if (confidence >= 0.6) return '🟡 Medium';
    return '🟠 Low';
  };

  const getSectionIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'demographics': return <User className="w-5 h-5" />;
      case 'goals': return <Target className="w-5 h-5" />;
      case 'pain points': return <AlertCircle className="w-5 h-5" />;
      case 'behaviors': return <TrendingUp className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{persona.name}</h2>
        <p className="text-sm text-gray-500">ID: {persona.id}</p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {Object.entries(persona.sections).map(([sectionName, insights]) => (
          <div key={sectionName} className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              {getSectionIcon(sectionName)}
              <h3 className="text-lg font-semibold text-gray-800">
                {sectionName}
              </h3>
            </div>

            {/* Insights */}
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div key={idx} className="pl-4">
                  {/* Insight */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {getConfidenceLabel(insight.confidence)}
                    </span>
                    <p className="flex-1 text-gray-700">{insight.text}</p>
                  </div>

                  {/* Citations */}
                  {insight.citations.length > 0 && (
                    <details className="ml-8 mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                        View {insight.citations.length} source{insight.citations.length > 1 ? 's' : ''}
                      </summary>
                      <div className="mt-2 space-y-2">
                        {insight.citations.map((citation, citIdx) => (
                          <div
                            key={citIdx}
                            className="bg-gray-50 rounded p-3 border-l-4 border-blue-400"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-gray-600">
                                {citation.source}
                                {citation.line && `:${citation.line}`}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 italic">
                              "{citation.quote}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Export Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Export to Figma
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Export to PDF
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Share Link
        </button>
      </div>
    </motion.div>
  );
}
```

---

## Step 4: Create the Page (10 min)

Create `app/persona-creator/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import PersonaCard from '@/components/PersonaCard';
import { parsePersonaResponse } from '@/lib/parsers/persona-parser';

export default function PersonaCreatorPage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [personas, setPersonas] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<string>('');

  async function handleCreatePersona() {
    setLoading(true);
    setProgress('Analyzing interviews...');
    
    try {
      const response = await fetch('/api/create-persona-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create user personas from these interview transcripts:\n\n${interviews}`,
          model: 'anthropic/claude-sonnet-4',
          context: {
            type: 'research',
            evidenceCount: interviews.split('Interview').length - 1
          }
        })
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('0:')) {
            // AI text chunk
            const text = line.slice(2).trim().replace(/^"|"$/g, '');
            fullResponse += text;
            setProgress('Generating persona...');
          }
        }
      }

      // Parse the response
      const parsedPersonas = parsePersonaResponse(fullResponse);
      setPersonas(parsedPersonas);
      setProgress('');
      
    } catch (error) {
      console.error('Error:', error);
      setProgress('Error creating persona');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Persona Creator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Interview Transcripts</h2>
              <textarea
                className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
                placeholder="Paste your interview transcripts here...

Example format:
Interview 01:
Interviewer: Tell me about your design workflow.
User: I usually start with sketches, then move to Figma...

Interview 02:
..."
                value={interviews}
                onChange={(e) => setInterviews(e.target.value)}
              />

              <button
                onClick={handleCreatePersona}
                disabled={loading || !interviews}
                className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {progress}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Create Personas
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="space-y-4">
            {personas.length === 0 ? (
              <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">
                  Your personas will appear here after generation
                </p>
              </div>
            ) : (
              personas.map((persona) => (
                <PersonaCard key={persona.id} persona={persona} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Step 5: Test It! (5 min)

1. **Add sample interview data:**

```
Interview 01:
Interviewer: Tell me about your background.
User: I'm 31, a product designer at a startup. Been using design tools for about 3 years.

Interviewer: What's your biggest challenge?
User: Honestly, the learning curve for advanced features is steep. I just want to create good designs quickly without spending hours on tutorials.

Interview 02:
Interviewer: How do you approach new projects?
User: I'm 28, freelance designer. Speed is everything for me. I need to ship designs fast.

Interviewer: What frustrates you most?
User: Too many features I don't understand. The tools are overwhelming.
```

2. **Run the app:**

```bash
npm run dev
```

3. **Visit:** `http://localhost:5000/persona-creator`

4. **Paste interviews → Click "Create Personas"**

---

## What You Just Built

✅ **AI-powered persona generation** (using your existing AI infrastructure)
✅ **Citation tracking** (every insight links to source quotes)
✅ **Confidence scoring** (AI rates its own certainty)
✅ **Real-time streaming** (progressive results as AI thinks)
✅ **Beautiful UI** (using your existing design system)

---

## Next: Add Multi-Agent Support

Now that you have basic persona creation, add the Analysis Agent:

```typescript
// lib/agents/analysis-agent.ts

export class AnalysisAgent {
  async clusterInsights(transcripts: string[]): Promise<Cluster[]> {
    // Pre-process interviews before sending to main AI
    const themes = await this.extractThemes(transcripts);
    const patterns = await this.findPatterns(transcripts);
    
    return {
      themes,
      patterns,
      suggestedPersonaCount: Math.ceil(themes.length / 3)
    };
  }

  async extractThemes(transcripts: string[]): Promise<Theme[]> {
    // Use embeddings for semantic clustering
    const embeddings = await this.generateEmbeddings(transcripts);
    const clusters = this.kMeansClustering(embeddings, 5);
    
    return clusters.map(c => ({
      name: c.centerText,
      mentions: c.items.length,
      confidence: c.coherence
    }));
  }
}
```

Then modify your persona endpoint to use it:

```typescript
// In app/api/create-persona-stream/route.ts

import { AnalysisAgent } from '@/lib/agents/analysis-agent';

// Before calling AI:
const analysisAgent = new AnalysisAgent();
const clusters = await analysisAgent.clusterInsights(interviews);

await sendProgress({ 
  type: 'status', 
  message: `Found ${clusters.themes.length} themes across interviews` 
});

// Include in prompt:
const enhancedPrompt = `
${prompt}

Pre-Analysis Results:
Themes identified: ${clusters.themes.map(t => t.name).join(', ')}
Suggested personas: ${clusters.suggestedPersonaCount}

Create personas based on these themes.
`;
```

---

## Total Time: ~30 Minutes

You now have a working persona creator that:
- Reuses 80% of your existing code
- Has proper citations and confidence
- Looks professional
- Streams results in real-time

**Next steps:**
1. Add file upload for transcripts
2. Add journey map generation
3. Add evidence panel for exploring sources
4. Add export to Figma/PDF

All using the same reuse patterns! 🚀
