/**
 * Template Definition Module (TDM) Types
 * 
 * Templates are user-created coded artifacts that define:
 * 1. What data structure the AI should generate (schema)
 * 2. How to render that data (React component)
 * 3. Metadata about the template
 */

import { z } from 'zod';

// ============================================================================
// Template Metadata
// ============================================================================

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  artifactType: string; // e.g., "persona", "journey-map", "empathy-map"
  version: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// ============================================================================
// Schema Definition (tells AI what data structure to generate)
// ============================================================================

export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required?: boolean;
  items?: SchemaField; // For arrays
  properties?: SchemaField[]; // For objects
  examples?: any[];
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

export interface TemplateSchema {
  version: string; // Schema version for migrations
  fields: SchemaField[];
  
  // Instructions for AI on how to generate this data
  aiGuidance?: {
    systemPrompt?: string; // Additional instructions
    exampleOutput?: any; // Example of valid output
    evidenceRequirements?: {
      minCitationsPerInsight?: number;
      confidenceScoring?: boolean;
    };
  };
}

// ============================================================================
// Evidence & Citation Support
// ============================================================================

export interface EvidenceReference {
  insightPath: string; // JSON path to the insight (e.g., "goals[0]")
  citations: Citation[];
  confidence?: number; // 0.0-1.0
}

export interface Citation {
  sourceId: string; // e.g., "interview-01"
  sourceName: string; // e.g., "Interview with Sarah"
  location?: string; // Line number, timestamp, page, etc.
  quote: string; // Exact quote from source
  context?: string; // Surrounding context if needed
}

// ============================================================================
// Artifact Instance (AI-generated data)
// ============================================================================

export interface ArtifactInstance {
  id: string;
  templateId: string;
  templateVersion: string;
  createdAt: string;
  status: 'draft' | 'approved' | 'rejected';
  
  // The actual data conforming to template schema
  data: Record<string, any>;
  
  // Evidence backing the data
  evidence: EvidenceReference[];
  
  // Metadata about generation
  metadata?: {
    model?: string;
    generationTime?: number;
    inputSummary?: string;
  };
}

// ============================================================================
// Template Definition Module (complete template package)
// ============================================================================

export interface TemplateDefinition {
  metadata: TemplateMetadata;
  schema: TemplateSchema;
  
  // Path to renderer component (React component that renders the data)
  // e.g., "./PersonaRenderer.tsx"
  rendererPath: string;
  
  // Optional: Custom validation beyond schema
  validatorPath?: string;
  
  // Optional: Helper utilities for this template
  utilsPath?: string;
}

// ============================================================================
// Template Registry Entry
// ============================================================================

export interface TemplateRegistryEntry {
  definition: TemplateDefinition;
  
  // Workspace this template belongs to
  workspaceId: string;
  
  // File system paths
  paths: {
    definition: string; // Path to template.json
    renderer: string; // Path to renderer component
    validator?: string;
    utils?: string;
  };
  
  // Runtime state
  isValid: boolean;
  validationErrors?: string[];
  lastLoaded: string;
}

// ============================================================================
// Template Storage Structure
// ============================================================================

/**
 * Template directory structure:
 * 
 * workspace/
 *   <workspace-id>/
 *     templates/
 *       persona/
 *         default-persona/
 *           template.json          <- TemplateDefinition
 *           PersonaRenderer.tsx    <- React component
 *           validator.ts           <- Optional custom validator
 *           utils.ts               <- Optional helpers
 *       journey-map/
 *         customer-journey/
 *           template.json
 *           JourneyRenderer.tsx
 *     data/
 *       artifacts/
 *         <artifact-id>.json      <- ArtifactInstance
 *       sources/
 *         <source-id>.txt         <- Interview transcripts, etc.
 */

// ============================================================================
// Helper Functions for Schema Generation
// ============================================================================

/**
 * Converts a template schema to a Zod schema for runtime validation
 */
export function templateSchemaToZod(schema: TemplateSchema): z.ZodType {
  const zodFields: Record<string, z.ZodType> = {};
  
  for (const field of schema.fields) {
    zodFields[field.name] = fieldToZod(field);
  }
  
  return z.object(zodFields);
}

function fieldToZod(field: SchemaField): z.ZodType {
  let zodType: z.ZodType;
  
  switch (field.type) {
    case 'string':
      zodType = z.string();
      if (field.validationRules?.pattern) {
        zodType = (zodType as z.ZodString).regex(new RegExp(field.validationRules.pattern));
      }
      if (field.validationRules?.enum) {
        zodType = z.enum(field.validationRules.enum as [string, ...string[]]);
      }
      break;
      
    case 'number':
      zodType = z.number();
      if (field.validationRules?.min !== undefined) {
        zodType = (zodType as z.ZodNumber).min(field.validationRules.min);
      }
      if (field.validationRules?.max !== undefined) {
        zodType = (zodType as z.ZodNumber).max(field.validationRules.max);
      }
      break;
      
    case 'boolean':
      zodType = z.boolean();
      break;
      
    case 'array':
      const itemSchema = field.items ? fieldToZod(field.items) : z.any();
      zodType = z.array(itemSchema);
      break;
      
    case 'object':
      if (field.properties) {
        const objFields: Record<string, z.ZodType> = {};
        for (const prop of field.properties) {
          objFields[prop.name] = fieldToZod(prop);
        }
        zodType = z.object(objFields);
      } else {
        zodType = z.record(z.any());
      }
      break;
      
    default:
      zodType = z.any();
  }
  
  // Handle optional fields
  if (!field.required) {
    zodType = zodType.optional();
  }
  
  return zodType;
}

/**
 * Generates a JSON Schema from template schema (for AI consumption)
 */
export function templateSchemaToJSON(schema: TemplateSchema) {
  return {
    type: 'object',
    properties: schema.fields.reduce((acc, field) => {
      acc[field.name] = fieldToJSONSchema(field);
      return acc;
    }, {} as Record<string, any>),
    required: schema.fields.filter(f => f.required).map(f => f.name)
  };
}

function fieldToJSONSchema(field: SchemaField): any {
  const jsonSchema: any = {
    type: field.type,
    description: field.description
  };
  
  if (field.examples) {
    jsonSchema.examples = field.examples;
  }
  
  if (field.type === 'array' && field.items) {
    jsonSchema.items = fieldToJSONSchema(field.items);
  }
  
  if (field.type === 'object' && field.properties) {
    jsonSchema.properties = field.properties.reduce((acc, prop) => {
      acc[prop.name] = fieldToJSONSchema(prop);
      return acc;
    }, {} as Record<string, any>);
  }
  
  if (field.validationRules) {
    Object.assign(jsonSchema, field.validationRules);
  }
  
  return jsonSchema;
}
