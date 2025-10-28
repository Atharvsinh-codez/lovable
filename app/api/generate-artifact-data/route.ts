import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { promises as fs } from 'fs';
import path from 'path';
import { getArtifactDataGenerationPrompt } from '@/lib/prompts/artifact-template-prompts';
import { sanitizePathSegment, buildSafePath, PathValidationError } from '@/lib/templates/path-utils';

export const dynamic = 'force-dynamic';

const isUsingAIGateway = !!process.env.AI_GATEWAY_API_KEY;
const aiGatewayBaseURL = 'https://ai-gateway.vercel.sh/v1';

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY,
  baseURL: isUsingAIGateway ? aiGatewayBaseURL : (process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1'),
});

export async function POST(request: NextRequest) {
  try {
    const { 
      workspaceId: rawWorkspaceId = 'default',
      templateId: rawTemplateId,
      artifactType: rawArtifactType,
      sourceFiles,
      model = 'openai/gpt-4o-mini'
    } = await request.json();
    
    const workspaceId = sanitizePathSegment(rawWorkspaceId, 'workspaceId');
    const templateId = sanitizePathSegment(rawTemplateId, 'templateId');
    const artifactType = sanitizePathSegment(rawArtifactType, 'artifactType');
    
    console.log('[generate-artifact-data] Generating artifact data');
    console.log('[generate-artifact-data] Template:', templateId);
    console.log('[generate-artifact-data] Artifact type:', artifactType);
    
    const templatePath = buildSafePath(
      process.cwd(),
      'workspace',
      workspaceId,
      'templates',
      artifactType,
      templateId,
      'template.json'
    );
    
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = JSON.parse(templateContent);
    
    let researchData = '';
    if (sourceFiles && sourceFiles.length > 0) {
      for (const fileId of sourceFiles) {
        const sourcePath = buildSafePath(
          process.cwd(),
          'workspace',
          workspaceId,
          'data',
          'sources'
        );
        const files = await fs.readdir(sourcePath);
        const sourceFile = files.find(f => f.startsWith(fileId));
        
        if (sourceFile) {
          const sourceFilePath = buildSafePath(sourcePath, sourceFile);
          const content = await fs.readFile(sourceFilePath, 'utf-8');
          researchData += `\n\n=== ${sourceFile} ===\n${content}`;
        }
      }
    }
    
    if (!researchData) {
      const analysisPath = buildSafePath(
        process.cwd(),
        'workspace',
        workspaceId,
        'data',
        'analysis.json'
      );
      
      try {
        const analysisContent = await fs.readFile(analysisPath, 'utf-8');
        const analysis = JSON.parse(analysisContent);
        
        // Load all source files from analysis
        for (const file of analysis.files || []) {
          const content = await fs.readFile(file.path, 'utf-8');
          researchData += `\n\n=== ${file.filename} ===\n${content}`;
        }
      } catch (e) {
        console.error('[generate-artifact-data] Failed to load from analysis:', e);
      }
    }
    
    if (!researchData) {
      return NextResponse.json(
        { error: 'No research data found' },
        { status: 400 }
      );
    }
    
    // Generate artifact data using AI
    const templateSchema = JSON.stringify(template.schema || template, null, 2);
    const prompt = getArtifactDataGenerationPrompt(templateSchema, researchData.substring(0, 30000));
    
    console.log('[generate-artifact-data] Calling AI to generate artifact data...');
    
    const result = await generateText({
      model: openai(model),
      prompt,
      temperature: 0.7,
    });
    
    // Parse JSON response
    const text = result.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('[generate-artifact-data] Failed to parse AI response:', text.substring(0, 500));
      return NextResponse.json(
        { error: 'Failed to generate valid artifact data' },
        { status: 500 }
      );
    }
    
    const artifactData = JSON.parse(jsonMatch[0]);
    
    console.log('[generate-artifact-data] Successfully generated artifact data');
    
    return NextResponse.json({
      success: true,
      artifactData
    });
    
  } catch (error) {
    if (error instanceof PathValidationError) {
      console.warn('[generate-artifact-data] Path validation error:', error.message);
      return NextResponse.json(
        { 
          error: error.message,
          paramName: error.paramName
        },
        { status: 400 }
      );
    }
    
    console.error('[generate-artifact-data] Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate artifact data',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
