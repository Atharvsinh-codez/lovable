import { NextRequest, NextResponse } from 'next/server';
import { listTemplates } from '@/lib/templates/template-storage';
import { PathValidationError } from '@/lib/templates/path-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'default';
    const artifactType = searchParams.get('artifactType') || undefined;
    
    console.log('[list-templates] Listing templates for workspace:', workspaceId, 'type:', artifactType || 'all');
    
    const templates = await listTemplates(workspaceId, artifactType);
    
    return NextResponse.json({
      success: true,
      workspaceId,
      artifactType: artifactType || null,
      count: templates.length,
      templates
    });
    
  } catch (error) {
    console.error('[list-templates] Error:', error);
    
    if (error instanceof PathValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          parameter: error.paramName,
          attemptedValue: error.attemptedValue
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to list templates',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
