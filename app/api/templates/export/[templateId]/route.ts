import { NextRequest, NextResponse } from 'next/server';
import { exportTemplate } from '@/lib/templates/template-storage';
import { PathValidationError } from '@/lib/templates/path-utils';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'default';
    const artifactType = searchParams.get('artifactType');
    
    if (!artifactType) {
      return NextResponse.json(
        { error: 'artifactType query parameter is required' },
        { status: 400 }
      );
    }
    
    const templateId = params.templateId;
    
    console.log('[export-template] Exporting template:', templateId, 'type:', artifactType);
    
    const exported = await exportTemplate(workspaceId, artifactType, templateId);
    
    const filename = `${templateId}-template-export.json`;
    
    return new NextResponse(JSON.stringify(exported, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
    
  } catch (error) {
    console.error('[export-template] Error:', error);
    
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
    
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to export template',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
