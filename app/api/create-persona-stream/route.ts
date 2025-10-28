import { NextRequest } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// Force dynamic route to enable streaming
export const dynamic = 'force-dynamic';

// Check if we're using Vercel AI Gateway
const isUsingAIGateway = !!process.env.AI_GATEWAY_API_KEY;
const aiGatewayBaseURL = 'https://ai-gateway.vercel.sh/v1';

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY,
  baseURL: isUsingAIGateway ? aiGatewayBaseURL : (process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1'),
});

const anthropic = createAnthropic({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.ANTHROPIC_API_KEY,
  baseURL: isUsingAIGateway ? aiGatewayBaseURL : (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1'),
});

export async function POST(request: NextRequest) {
  try {
    const { transcripts, model = 'openai/gpt-4o-mini' } = await request.json();
    
    console.log('[create-persona-stream] Received request');
    console.log('[create-persona-stream] Model:', model);
    console.log('[create-persona-stream] Transcripts length:', transcripts?.length || 0);
    
    if (!transcripts || transcripts.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Transcripts are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // System prompt for persona creation
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
    <citation source="Interview 01" line="5">
      "I'm 31 and just started using design tools professionally"
    </citation>
  </section>
  
  <section name="Goals">
    <insight confidence="0.92">Create professional designs quickly</insight>
    <citation source="Interview 01" line="15">
      "I need to ship designs fast without compromising quality"
    </citation>
    <citation source="Interview 02" line="23">
      "Speed is everything in my workflow"
    </citation>
  </section>
  
  <section name="Pain Points">
    <insight confidence="0.78">Struggles with complex tool features</insight>
    <citation source="Interview 02" line="34">
      "The advanced features are overwhelming"
    </citation>
  </section>
  
  <section name="Behaviors">
    <insight confidence="0.88">Prefers templates and shortcuts</insight>
    <citation source="Interview 01" line="42">
      "I always start with a template to save time"
    </citation>
  </section>
</persona>

CRITICAL RULES:
- Every insight MUST have at least 1 citation with exact quotes
- Include confidence scores (0.0-1.0) based on evidence strength
- Use exact quotes from interviews
- Reference source (Interview number) and approximate line/position
- Create 1-3 distinct personas based on different user segments found
- Use real patterns from the data - never make things up`;

    const userPrompt = `Analyze these interview transcripts and create user personas:

${transcripts}

Generate 1-3 distinct personas based on the user segments you identify. Each persona should have demographics, goals, pain points, and behaviors with citations.`;

    // Select AI provider based on model
    let aiProvider;
    if (model.includes('claude') || model.includes('anthropic')) {
      aiProvider = anthropic(model);
    } else {
      aiProvider = openai(model);
    }

    console.log('[create-persona-stream] Starting AI stream with model:', model);

    // Stream the AI response
    const result = await streamText({
      model: aiProvider,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 4000,
    });

    // Return the stream
    return result.toTextStreamResponse();

  } catch (error) {
    console.error('[create-persona-stream] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to create persona',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
