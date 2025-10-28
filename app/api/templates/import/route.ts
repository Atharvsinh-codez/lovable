import { NextRequest, NextResponse } from 'next/server';
import { importTemplate } from '@/lib/templates/template-storage';
import { ExportedTemplate } from '@/lib/templates/template-storage';
import { PathValidationError } from '@/lib/templates/path-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      workspaceId = 'default',
      exportedTemplate,
      overrideId
    } = body;
    
    if (!exportedTemplate) {
      return NextResponse.json(
        { error: 'exportedTemplate is required' },
        { status: 400 }
      );
    }
    
    const exported: ExportedTemplate = exportedTemplate;
    
    if (!exported.definition || !exported.definition.metadata) {
      return NextResponse.json(
        { error: 'Invalid template export format' },
        { status: 400 }
      );
    }
    
    console.log('[import-template] Importing template:', exported.definition.metadata.name);
    
    const templateId = await importTemplate(workspaceId, exported, overrideId);
    
    return NextResponse.json({
      success: true,
      templateId,
      workspaceId,
      artifactType: exported.definition.metadata.artifactType,
      message: `Template "${exported.definition.metadata.name}" imported successfully`
    });
    
  } catch (error) {
    console.error('[import-template] Error:', error);
    
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
        error: error instanceof Error ? error.message : 'Failed to import template',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
