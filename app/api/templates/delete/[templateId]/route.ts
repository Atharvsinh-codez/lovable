import { NextRequest, NextResponse } from 'next/server';
import { deleteTemplate } from '@/lib/templates/template-storage';
import { PathValidationError } from '@/lib/templates/path-utils';

export const dynamic = 'force-dynamic';

export async function DELETE(
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
    
    console.log('[delete-template] Deleting template:', templateId, 'type:', artifactType);
    
    await deleteTemplate(workspaceId, artifactType, templateId);
    
    return NextResponse.json({
      success: true,
      templateId,
      workspaceId,
      artifactType,
      message: `Template "${templateId}" deleted successfully`
    });
    
  } catch (error) {
    console.error('[delete-template] Error:', error);
    
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
        error: error instanceof Error ? error.message : 'Failed to delete template',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
