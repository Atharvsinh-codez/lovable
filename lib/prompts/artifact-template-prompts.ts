/**
 * Prompts for AI to generate artifact templates (personas, journey maps, etc.)
 * Adapted from the website generation prompts to create design artifacts instead
 */

export interface TemplateGenerationContext {
  artifactType: string;
  artifactName: string;
  dataPreview: string; // Sample of the user's research data
  userRequirements?: string; // User's description of what they want
  existingTemplate?: string; // If editing an existing template
}

/**
 * System prompt for artifact template generation
 */
export function getArtifactTemplateSystemPrompt(artifactType: string): string {
  return `You are an expert React developer and UX researcher who creates beautiful, functional artifact templates for design research.

CONTEXT:
You are building a template component for a "${artifactType}" artifact. This template will be used to display research insights (like user personas, journey maps, etc.) with evidence citations and confidence scores.

YOUR TASK:
Generate a complete, production-ready React component that:
1. Accepts data as props matching a clear interface
2. Displays the artifact beautifully and clearly
3. Shows evidence citations (quotes, sources)
4. Displays confidence scores visually
5. Is responsive and accessible
6. Uses Tailwind CSS for styling
7. Follows modern React best practices

CRITICAL RULES:
- Output ONLY the complete TypeScript React component code
- Start with proper TypeScript interface for props
- Use functional components with hooks
- Use Tailwind CSS classes for all styling (NO custom CSS)
- Make it visually appealing and professional
- Include hover states, transitions, and micro-interactions
- Support dark mode using Tailwind's dark: prefix
- Add proper accessibility attributes
- Include JSDoc comments for the main component

COMPONENT STRUCTURE:
\`\`\`tsx
import React from 'react';

// Define the data interface
interface ${capitalize(artifactType)}Data {
  // Define based on artifact type
}

interface ${capitalize(artifactType)}Props {
  data: ${capitalize(artifactType)}Data;
  showCitations?: boolean;
  compact?: boolean;
}

/**
 * ${capitalize(artifactType)} component
 * Displays [description based on artifact type]
 */
export default function ${capitalize(artifactType)}Template({ 
  data, 
  showCitations = true,
  compact = false 
}: ${capitalize(artifactType)}Props) {
  // Component implementation
}
\`\`\`

STYLING GUIDELINES:
- Use modern, clean design
- Proper spacing and visual hierarchy
- Confidence scores: use gradient progress bars or color-coded indicators
- Citations: subtle but accessible (maybe on hover or expandable)
- Use colors from Tailwind's palette (blue, indigo, purple for primary elements)
- Smooth transitions with transition-all duration-200
- Card-based layouts work well for most artifacts

EXAMPLES OF GOOD PATTERNS:
- Progress bars for confidence: <div className="h-2 bg-blue-500 rounded" style={{ width: \`\${confidence * 100}%\` }} />
- Citation badges: <span className="text-xs text-gray-500 hover:text-gray-700 cursor-help">📌</span>
- Tooltips for evidence: Use title attribute or build custom tooltip
- Responsive grids: grid grid-cols-1 md:grid-cols-2 gap-4

Remember: This template will be reused across multiple instances with different data!`;
}

/**
 * User prompt for initial template creation
 */
export function getInitialTemplatePrompt(context: TemplateGenerationContext): string {
  const { artifactType, artifactName, dataPreview, userRequirements } = context;
  
  let prompt = `Create a "${artifactName}" template component for displaying ${artifactType} artifacts.\n\n`;
  
  if (userRequirements) {
    prompt += `USER REQUIREMENTS:\n${userRequirements}\n\n`;
  }
  
  prompt += `SAMPLE DATA STRUCTURE (from user's research):\n${dataPreview}\n\n`;
  
  prompt += `Generate a beautiful React component that can display this type of data. The component should:
- Be visually appealing and professional
- Show all important information clearly
- Include confidence scores if present in data
- Display citations/evidence for insights
- Be reusable for multiple instances of this artifact

Focus on creating something that looks great and is easy to understand at a glance.`;
  
  return prompt;
}

/**
 * User prompt for editing an existing template
 */
export function getTemplateEditPrompt(
  userRequest: string,
  currentTemplate: string,
  dataPreview?: string
): string {
  let prompt = `CURRENT TEMPLATE CODE:\n\`\`\`tsx\n${currentTemplate}\n\`\`\`\n\n`;
  
  if (dataPreview) {
    prompt += `SAMPLE DATA:\n${dataPreview}\n\n`;
  }
  
  prompt += `USER REQUEST:\n${userRequest}\n\n`;
  prompt += `Update the template component to incorporate the user's request. Return the complete modified component code.`;
  
  return prompt;
}

/**
 * Prompt for generating artifact data from research using a template schema
 */
export function getArtifactDataGenerationPrompt(
  templateSchema: string,
  researchData: string
): string {
  return `You are an expert UX researcher analyzing user research data.

TASK: Generate artifact data that matches the following schema from the provided research data.

TEMPLATE SCHEMA:
${templateSchema}

RESEARCH DATA:
${researchData}

CRITICAL RULES:
1. Output ONLY valid JSON matching the schema
2. Every insight MUST be supported by evidence from the research data
3. Include exact quotes as citations
4. Add confidence scores (0.0-1.0) based on strength of evidence
5. Do NOT make up data - only extract what's actually in the research
6. If you can't find enough evidence for something, omit it or lower confidence

OUTPUT FORMAT:
{
  "data": { /* artifact data matching schema */ },
  "evidence": [
    {
      "insightPath": "goals[0]",
      "citations": [
        {
          "sourceId": "interview-01",
          "sourceName": "Interview with User",
          "quote": "exact quote from research",
          "location": "line 42"
        }
      ],
      "confidence": 0.85
    }
  ]
}`;
}

/**
 * Helper to capitalize first letter
 */
function capitalize(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Get artifact type description for prompts
 */
export function getArtifactTypeDescription(artifactType: string): string {
  const descriptions: Record<string, string> = {
    'persona': 'A user persona represents a fictional character that embodies the characteristics, goals, and behaviors of a key user segment. It typically includes demographics, goals, pain points, behaviors, and a quote.',
    'journey-map': 'A user journey map visualizes the steps a user takes to accomplish a goal, showing their actions, thoughts, emotions, and pain points at each stage.',
    'empathy-map': 'An empathy map captures what users say, think, do, and feel about a particular experience or problem.',
    'pain-point-dashboard': 'A pain point dashboard summarizes the key frustrations and obstacles users face, often with frequency and impact scores.',
    'feature-matrix': 'A feature priority matrix shows which features are most important to users, often plotted by importance vs. satisfaction or effort vs. impact.',
  };
  
  return descriptions[artifactType] || `A ${artifactType} artifact for UX research insights.`;
}

/**
 * Generate example data structure for a given artifact type
 */
export function getExampleDataStructure(artifactType: string): string {
  const examples: Record<string, string> = {
    'persona': `{
  name: "Sarah the Busy Designer",
  tagline: "Speed over complexity",
  demographics: {
    ageRange: "28-35",
    occupation: "Freelance Designer",
    techSavviness: "Intermediate"
  },
  goals: [
    "Ship designs quickly without compromising quality",
    "Learn new tools fast"
  ],
  painPoints: [
    "Complex features slow down workflow",
    "Too many options feel overwhelming"
  ],
  behaviors: [
    "Prefers starting with templates",
    "Uses keyboard shortcuts extensively"
  ],
  quote: "I don't have time to learn every feature—I just need to get things done"
}`,
    'journey-map': `{
  journeyName: "First-time User Onboarding",
  stages: [
    {
      stage: "Awareness",
      actions: ["Searches for design tool", "Reads reviews"],
      thoughts: ["Will this be easy to use?"],
      emotions: ["curious", "hopeful"],
      painPoints: ["Too many options to choose from"]
    }
  ]
}`,
    'empathy-map': `{
  context: "Using the design tool for the first time",
  says: ["This looks complicated", "Where do I start?"],
  thinks: ["Hope I can figure this out", "Worried about wasting time"],
  does: ["Clicks around randomly", "Searches for tutorials"],
  feels: ["overwhelmed", "uncertain", "hopeful"]
}`
  };
  
  return examples[artifactType] || `{ /* Data structure for ${artifactType} */ }`;
}
