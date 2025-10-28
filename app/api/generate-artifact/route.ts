import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { ARTIFACT_SYSTEM_PROMPT, createArtifactPrompt } from '@/lib/prompts/artifact-prompts';

export const runtime = 'edge';
export const maxDuration = 60;

/**
 * Simple artifact generation - no sandbox required!
 * Just stream back a React component with inline data
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      artifactType, 
      researchData, 
      additionalInstructions,
      model = 'anthropic/claude-3.5-sonnet'
    } = await request.json();

    if (!artifactType || !researchData) {
      return NextResponse.json(
        { error: 'Missing required fields: artifactType and researchData' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    console.log(`[generate-artifact] Generating ${artifactType} artifact`);

    // OpenRouter compatibility - use OpenAI SDK with OpenRouter base URL
    const openrouter = createOpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });

    const userPrompt = createArtifactPrompt(artifactType, researchData, additionalInstructions);

    const result = await streamText({
      model: openrouter(model),
      system: ARTIFACT_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
    });

    // Return the stream
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('[generate-artifact] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate artifact' },
      { status: 500 }
    );
  }
}
