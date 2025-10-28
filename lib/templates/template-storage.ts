import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { TemplateDefinition, TemplateMetadata } from './types';
import { sanitizePathSegment, verifyPathWithinBase, buildSafePath } from './path-utils';

export interface SaveTemplateParams {
  workspaceId: string;
  artifactType: string;
  templateName: string;
  files: {
    template: TemplateDefinition;
    renderer?: string;
    validator?: string;
    utils?: string;
    preview?: Buffer;
  };
}

export interface TemplateListItem {
  id: string;
  name: string;
  description: string;
  artifactType: string;
  version: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  hasPreview: boolean;
}

export interface LoadedTemplate {
  definition: TemplateDefinition;
  files: {
    renderer?: string;
    validator?: string;
    utils?: string;
  };
  hasPreview: boolean;
}

export interface ExportedTemplate {
  definition: TemplateDefinition;
  files: {
    renderer?: { filename: string; content: string };
    validator?: { filename: string; content: string };
    utils?: { filename: string; content: string };
    preview?: { filename: string; base64: string };
  };
  exportedAt: string;
  exportVersion: string;
}

function getTemplatePath(workspaceId: string, artifactType: string, templateId: string): string {
  const sanitizedWorkspaceId = sanitizePathSegment(workspaceId, 'workspaceId');
  const sanitizedArtifactType = sanitizePathSegment(artifactType, 'artifactType');
  const sanitizedTemplateId = sanitizePathSegment(templateId, 'templateId');
  
  const workspaceBasePath = path.join(process.cwd(), 'workspace');
  const templatePath = buildSafePath(
    workspaceBasePath,
    sanitizedWorkspaceId,
    'templates',
    sanitizedArtifactType,
    sanitizedTemplateId
  );
  
  return templatePath;
}

function getTemplatesBasePath(workspaceId: string, artifactType?: string): string {
  const sanitizedWorkspaceId = sanitizePathSegment(workspaceId, 'workspaceId');
  
  const workspaceBasePath = path.join(process.cwd(), 'workspace');
  
  if (artifactType) {
    const sanitizedArtifactType = sanitizePathSegment(artifactType, 'artifactType');
    return buildSafePath(workspaceBasePath, sanitizedWorkspaceId, 'templates', sanitizedArtifactType);
  }
  
  return buildSafePath(workspaceBasePath, sanitizedWorkspaceId, 'templates');
}

export async function saveTemplate(params: SaveTemplateParams): Promise<string> {
  const { workspaceId, artifactType, templateName, files } = params;
  
  const templateId = files.template.metadata.id || `${artifactType}-${nanoid(8)}`;
  const templatePath = getTemplatePath(workspaceId, artifactType, templateId);
  
  const workspaceBasePath = path.join(process.cwd(), 'workspace');
  await verifyPathWithinBase(templatePath, workspaceBasePath);
  
  await fs.mkdir(templatePath, { recursive: true });
  
  const now = new Date().toISOString();
  const templateDef: TemplateDefinition = {
    ...files.template,
    metadata: {
      ...files.template.metadata,
      id: templateId,
      name: templateName,
      artifactType,
      updatedAt: now,
      createdAt: files.template.metadata.createdAt || now,
    }
  };
  
  await fs.writeFile(
    path.join(templatePath, 'template.json'),
    JSON.stringify(templateDef, null, 2),
    'utf-8'
  );
  
  if (files.renderer) {
    const rendererFilename = path.basename(templateDef.rendererPath);
    await fs.writeFile(
      path.join(templatePath, rendererFilename),
      files.renderer,
      'utf-8'
    );
  }
  
  if (files.validator && templateDef.validatorPath) {
    const validatorFilename = path.basename(templateDef.validatorPath);
    await fs.writeFile(
      path.join(templatePath, validatorFilename),
      files.validator,
      'utf-8'
    );
  }
  
  if (files.utils && templateDef.utilsPath) {
    const utilsFilename = path.basename(templateDef.utilsPath);
    await fs.writeFile(
      path.join(templatePath, utilsFilename),
      files.utils,
      'utf-8'
    );
  }
  
  if (files.preview) {
    await fs.writeFile(
      path.join(templatePath, 'preview.png'),
      files.preview
    );
  }
  
  console.log('[template-storage] Saved template:', templateId, 'at', templatePath);
  
  return templateId;
}

export async function loadTemplate(
  workspaceId: string,
  artifactType: string,
  templateId: string
): Promise<LoadedTemplate> {
  const templatePath = getTemplatePath(workspaceId, artifactType, templateId);
  
  const workspaceBasePath = path.join(process.cwd(), 'workspace');
  await verifyPathWithinBase(templatePath, workspaceBasePath);
  
  const templateJsonPath = path.join(templatePath, 'template.json');
  const templateJson = await fs.readFile(templateJsonPath, 'utf-8');
  const definition: TemplateDefinition = JSON.parse(templateJson);
  
  const files: LoadedTemplate['files'] = {};
  
  if (definition.rendererPath) {
    const rendererFilename = path.basename(definition.rendererPath);
    try {
      files.renderer = await fs.readFile(
        path.join(templatePath, rendererFilename),
        'utf-8'
      );
    } catch (error) {
      console.warn('[template-storage] Renderer file not found:', rendererFilename);
    }
  }
  
  if (definition.validatorPath) {
    const validatorFilename = path.basename(definition.validatorPath);
    try {
      files.validator = await fs.readFile(
        path.join(templatePath, validatorFilename),
        'utf-8'
      );
    } catch (error) {
      console.warn('[template-storage] Validator file not found:', validatorFilename);
    }
  }
  
  if (definition.utilsPath) {
    const utilsFilename = path.basename(definition.utilsPath);
    try {
      files.utils = await fs.readFile(
        path.join(templatePath, utilsFilename),
        'utf-8'
      );
    } catch (error) {
      console.warn('[template-storage] Utils file not found:', utilsFilename);
    }
  }
  
  let hasPreview = false;
  try {
    await fs.access(path.join(templatePath, 'preview.png'));
    hasPreview = true;
  } catch {
    hasPreview = false;
  }
  
  return { definition, files, hasPreview };
}

export async function listTemplates(
  workspaceId: string,
  artifactType?: string
): Promise<TemplateListItem[]> {
  const templates: TemplateListItem[] = [];
  
  const basePath = getTemplatesBasePath(workspaceId, artifactType);
  
  try {
    await fs.access(basePath);
  } catch {
    return templates;
  }
  
  if (artifactType) {
    const templateDirs = await fs.readdir(basePath);
    
    for (const templateId of templateDirs) {
      const templatePath = path.join(basePath, templateId);
      const stats = await fs.stat(templatePath);
      
      if (!stats.isDirectory()) continue;
      
      try {
        const templateJsonPath = path.join(templatePath, 'template.json');
        const templateJson = await fs.readFile(templateJsonPath, 'utf-8');
        const definition: TemplateDefinition = JSON.parse(templateJson);
        
        let hasPreview = false;
        try {
          await fs.access(path.join(templatePath, 'preview.png'));
          hasPreview = true;
        } catch {
          hasPreview = false;
        }
        
        templates.push({
          ...definition.metadata,
          hasPreview
        });
      } catch (error) {
        console.warn('[template-storage] Failed to load template:', templateId, error);
      }
    }
  } else {
    const artifactTypeDirs = await fs.readdir(basePath);
    
    for (const type of artifactTypeDirs) {
      const typePath = path.join(basePath, type);
      const stats = await fs.stat(typePath);
      
      if (!stats.isDirectory()) continue;
      
      const typeTemplates = await listTemplates(workspaceId, type);
      templates.push(...typeTemplates);
    }
  }
  
  return templates;
}

export async function deleteTemplate(
  workspaceId: string,
  artifactType: string,
  templateId: string
): Promise<void> {
  const templatePath = getTemplatePath(workspaceId, artifactType, templateId);
  
  const workspaceBasePath = path.join(process.cwd(), 'workspace');
  await verifyPathWithinBase(templatePath, workspaceBasePath);
  
  try {
    await fs.rm(templatePath, { recursive: true, force: true });
    console.log('[template-storage] Deleted template:', templateId);
  } catch (error) {
    console.error('[template-storage] Failed to delete template:', templateId, error);
    throw new Error(`Failed to delete template: ${templateId}`);
  }
}

export async function exportTemplate(
  workspaceId: string,
  artifactType: string,
  templateId: string
): Promise<ExportedTemplate> {
  const templatePath = getTemplatePath(workspaceId, artifactType, templateId);
  
  const workspaceBasePath = path.join(process.cwd(), 'workspace');
  await verifyPathWithinBase(templatePath, workspaceBasePath);
  
  const templateJsonPath = path.join(templatePath, 'template.json');
  const templateJson = await fs.readFile(templateJsonPath, 'utf-8');
  const definition: TemplateDefinition = JSON.parse(templateJson);
  
  const exportedFiles: ExportedTemplate['files'] = {};
  
  if (definition.rendererPath) {
    const rendererFilename = path.basename(definition.rendererPath);
    try {
      const content = await fs.readFile(
        path.join(templatePath, rendererFilename),
        'utf-8'
      );
      exportedFiles.renderer = { filename: rendererFilename, content };
    } catch (error) {
      console.warn('[template-storage] Renderer file not found for export:', rendererFilename);
    }
  }
  
  if (definition.validatorPath) {
    const validatorFilename = path.basename(definition.validatorPath);
    try {
      const content = await fs.readFile(
        path.join(templatePath, validatorFilename),
        'utf-8'
      );
      exportedFiles.validator = { filename: validatorFilename, content };
    } catch (error) {
      console.warn('[template-storage] Validator file not found for export:', validatorFilename);
    }
  }
  
  if (definition.utilsPath) {
    const utilsFilename = path.basename(definition.utilsPath);
    try {
      const content = await fs.readFile(
        path.join(templatePath, utilsFilename),
        'utf-8'
      );
      exportedFiles.utils = { filename: utilsFilename, content };
    } catch (error) {
      console.warn('[template-storage] Utils file not found for export:', utilsFilename);
    }
  }
  
  try {
    const previewBuffer = await fs.readFile(path.join(templatePath, 'preview.png'));
    exportedFiles.preview = {
      filename: 'preview.png',
      base64: previewBuffer.toString('base64')
    };
  } catch {
    console.log('[template-storage] No preview image for export');
  }
  
  return {
    definition,
    files: exportedFiles,
    exportedAt: new Date().toISOString(),
    exportVersion: '1.0.0'
  };
}

export async function importTemplate(
  workspaceId: string,
  exported: ExportedTemplate,
  overrideId?: string
): Promise<string> {
  const templateId = overrideId || exported.definition.metadata.id;
  const artifactType = exported.definition.metadata.artifactType;
  
  const files: SaveTemplateParams['files'] = {
    template: {
      ...exported.definition,
      metadata: {
        ...exported.definition.metadata,
        id: templateId
      }
    }
  };
  
  if (exported.files.renderer) {
    files.renderer = exported.files.renderer.content;
  }
  
  if (exported.files.validator) {
    files.validator = exported.files.validator.content;
  }
  
  if (exported.files.utils) {
    files.utils = exported.files.utils.content;
  }
  
  if (exported.files.preview) {
    files.preview = Buffer.from(exported.files.preview.base64, 'base64');
  }
  
  return saveTemplate({
    workspaceId,
    artifactType,
    templateName: exported.definition.metadata.name,
    files
  });
}

export async function findTemplateByName(
  workspaceId: string,
  artifactType: string,
  templateName: string
): Promise<string | null> {
  const templates = await listTemplates(workspaceId, artifactType);
  const found = templates.find(t => t.name === templateName);
  return found ? found.id : null;
}
