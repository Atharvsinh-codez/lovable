import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { sanitizePathSegment, buildSafePath, PathValidationError } from '@/lib/templates/path-utils';

export const dynamic = 'force-dynamic';

const isUsingAIGateway = !!process.env.AI_GATEWAY_API_KEY;
const aiGatewayBaseURL = 'https://ai-gateway.vercel.sh/v1';

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY,
  baseURL: isUsingAIGateway ? aiGatewayBaseURL : (process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1'),
});

interface AnalysisResult {
  dataType: 'interviews' | 'surveys' | 'observations' | 'mixed' | 'unknown';
  itemCount: number;
  themes: string[];
  suggestedArtifacts: Array<{
    type: string;
    name: string;
    description: string;
    confidence: number;
    reasoning: string;
  }>;
  dataSegments?: Array<{
    name: string;
    description: string;
    itemCount: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const rawWorkspaceId = (formData.get('workspaceId') as string) || 'default';
    
    console.log('[upload-research-data] Received', files.length, 'file(s)');
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }
    
    const workspaceId = sanitizePathSegment(rawWorkspaceId, 'workspaceId');
    
    const workspacePath = buildSafePath(process.cwd(), 'workspace', workspaceId);
    const sourcesPath = buildSafePath(workspacePath, 'data', 'sources');
    await fs.mkdir(sourcesPath, { recursive: true });
    
    // Process and save files
    const savedFiles: Array<{ id: string; filename: string; path: string; size: number }> = [];
    const fileContents: Array<{ filename: string; content: string }> = [];
    
    for (const file of files) {
      if (!(file instanceof File)) continue;
      
      const fileId = nanoid();
      const ext = path.extname(file.name);
      const filename = `${fileId}${ext}`;
      const filePath = path.join(sourcesPath, filename);
      
      // Read file content
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save file
      await fs.writeFile(filePath, buffer);
      
      // Extract text content for analysis
      const content = buffer.toString('utf-8');
      fileContents.push({ filename: file.name, content });
      
      savedFiles.push({
        id: fileId,
        filename: file.name,
        path: filePath,
        size: file.size
      });
      
      console.log('[upload-research-data] Saved:', file.name, '→', filename);
    }
    
    // Analyze data and suggest artifacts
    console.log('[upload-research-data] Analyzing data...');
    const analysis = await analyzeResearchData(fileContents);
    
    const analysisPath = buildSafePath(workspacePath, 'data', 'analysis.json');
    await fs.writeFile(analysisPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      files: savedFiles,
      analysis
    }, null, 2));
    
    return NextResponse.json({
      success: true,
      workspaceId,
      files: savedFiles,
      analysis
    });
    
  } catch (error) {
    if (error instanceof PathValidationError) {
      console.warn('[upload-research-data] Path validation error:', error.message);
      return NextResponse.json(
        { 
          error: error.message,
          paramName: error.paramName
        },
        { status: 400 }
      );
    }
    
    console.error('[upload-research-data] Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to upload research data',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

async function analyzeResearchData(
  files: Array<{ filename: string; content: string }>
): Promise<AnalysisResult> {
  
  // Combine all content for analysis (truncate if too long)
  const combinedContent = files
    .map(f => `=== ${f.filename} ===\n${f.content}`)
    .join('\n\n')
    .substring(0, 20000); // Limit to ~20k chars for analysis
  
  const systemPrompt = `You are an expert UX researcher analyzing uploaded research data.

Your task:
1. Identify the type of research data (interviews, surveys, observations, etc.)
2. Count distinct items (e.g., number of interviews)
3. Extract key themes and patterns
4. Suggest appropriate design artifacts to create
5. Identify potential user segments

Output your analysis as JSON matching this structure:
{
  "dataType": "interviews" | "surveys" | "observations" | "mixed" | "unknown",
  "itemCount": number,
  "themes": ["theme1", "theme2", ...],
  "suggestedArtifacts": [
    {
      "type": "persona" | "journey-map" | "empathy-map" | "pain-point-dashboard" | "feature-matrix",
      "name": "User Personas",
      "description": "Create 3 distinct user personas based on segments found",
      "confidence": 0.92,
      "reasoning": "Clear segments identified with distinct goals and behaviors"
    }
  ],
  "dataSegments": [
    {
      "name": "Busy Professionals",
      "description": "Time-constrained users seeking efficiency",
      "itemCount": 4
    }
  ]
}

Be specific and evidence-based. Only suggest artifacts that are well-supported by the data.`;

  const userPrompt = `Analyze this research data and suggest appropriate design artifacts:

${combinedContent}

Provide your analysis as JSON.`;

  try {
    const result = await generateText({
      model: openai('openai/gpt-4o-mini'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.3,
    });
    
    // Parse JSON from response
    const text = result.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      console.log('[upload-research-data] Analysis complete:', analysis.suggestedArtifacts.length, 'artifacts suggested');
      return analysis;
    }
    
    throw new Error('Failed to parse AI analysis response');
    
  } catch (error) {
    console.error('[upload-research-data] Analysis error:', error);
    
    // Fallback: basic analysis
    return {
      dataType: 'unknown',
      itemCount: files.length,
      themes: ['User needs', 'Pain points', 'Behaviors'],
      suggestedArtifacts: [
        {
          type: 'persona',
          name: 'User Personas',
          description: 'Create user personas from your research data',
          confidence: 0.7,
          reasoning: 'Default suggestion for uploaded research data'
        }
      ]
    };
  }
}
