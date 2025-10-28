import { NextRequest, NextResponse } from 'next/server';
import { saveTemplate } from '@/lib/templates/template-storage';
import { TemplateDefinition } from '@/lib/templates/types';
import { PathValidationError } from '@/lib/templates/path-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      workspaceId = 'default',
      artifactType,
      templateName,
      template,
      renderer,
      validator,
      utils,
      preview
    } = body;
    
    if (!artifactType) {
      return NextResponse.json(
        { error: 'artifactType is required' },
        { status: 400 }
      );
    }
    
    if (!templateName) {
      return NextResponse.json(
        { error: 'templateName is required' },
        { status: 400 }
      );
    }
    
    if (!template) {
      return NextResponse.json(
        { error: 'template definition is required' },
        { status: 400 }
      );
    }
    
    const templateDef: TemplateDefinition = template;
    
    const files: {
      template: TemplateDefinition;
      renderer?: string;
      validator?: string;
      utils?: string;
      preview?: Buffer;
    } = {
      template: templateDef
    };
    
    if (renderer) {
      files.renderer = renderer;
    }
    
    if (validator) {
      files.validator = validator;
    }
    
    if (utils) {
      files.utils = utils;
    }
    
    if (preview) {
      files.preview = Buffer.from(preview, 'base64');
    }
    
    const templateId = await saveTemplate({
      workspaceId,
      artifactType,
      templateName,
      files
    });
    
    console.log('[save-template] Saved template:', templateId);
    
    return NextResponse.json({
      success: true,
      templateId,
      workspaceId,
      artifactType
    });
    
  } catch (error) {
    console.error('[save-template] Error:', error);
    
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
        error: error instanceof Error ? error.message : 'Failed to save template',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
