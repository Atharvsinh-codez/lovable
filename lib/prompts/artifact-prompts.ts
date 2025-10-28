/**
 * Simplified artifact generation prompts
 * Artifacts are generated as self-contained React components with inline data
 */

export const ARTIFACT_SYSTEM_PROMPT = `You are an expert at creating beautiful, data-driven design artifacts (personas, journey maps, empathy maps, etc.) as React components.

IMPORTANT RULES:
1. Generate COMPLETE, self-contained React components with ALL data inline
2. Use Tailwind CSS for styling (available by default)
3. Include the research data directly in the component (no external props)
4. Make components visually beautiful with good typography and spacing
5. Add evidence citations where data came from
6. Use TypeScript for type safety

COMPONENT STRUCTURE:
\`\`\`tsx
export default function PersonaCard() {
  // All data defined inline here
  const persona = {
    name: "Sarah Chen",
    age: 32,
    role: "UX Designer",
    goals: ["..."],
    painPoints: ["..."],
    // Include evidence citations
    evidence: {
      goals: ["Quote from interview 1", "Quote from survey 2"],
      painPoints: ["Quote from observation 3"]
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Beautiful, well-designed component */}
    </div>
  );
}
\`\`\`

STYLING GUIDELINES:
- Use modern, clean designs
- Good contrast and readability
- Professional color schemes
- Proper spacing and hierarchy
- Add subtle shadows and borders
- Use icons where appropriate (lucide-react is available)

OUTPUT FORMAT:
Return ONLY the React component code in a TypeScript code block.
No explanations before or after - just the code.`;

export function createArtifactPrompt(
  artifactType: string,
  researchData: string,
  additionalInstructions?: string
): string {
  const typeInstructions = {
    persona: `Create a user persona card component that includes:
- Name, photo/avatar, demographics (age, role, location)
- Background/bio
- Goals and motivations
- Pain points and frustrations
- Behaviors and preferences
- Technologies used
- Quote that captures their mindset
- Evidence citations for each section`,

    'journey-map': `Create a user journey map component that includes:
- Journey phases (e.g., Awareness, Consideration, Purchase, Use, Advocate)
- User actions in each phase
- Thoughts and feelings
- Pain points and opportunities
- Touchpoints
- Evidence citations`,

    'empathy-map': `Create an empathy map component with four quadrants:
- Says (direct quotes from research)
- Thinks (inferred thoughts)
- Does (observed behaviors)
- Feels (emotions and feelings)
- Include evidence citations for each`,

    'pain-point-dashboard': `Create a pain point dashboard showing:
- List of pain points prioritized by severity
- Impact score (1-10)
- Frequency of mention
- User quotes as evidence
- Suggested solutions or opportunities`,

    'feature-matrix': `Create a feature comparison matrix showing:
- List of desired features
- User segments who want them
- Priority level
- Evidence from research
- Current gaps`
  };

  const instruction = typeInstructions[artifactType as keyof typeof typeInstructions] || 
    `Create a ${artifactType} artifact component with the provided research data.`;

  return `${instruction}

RESEARCH DATA:
${researchData}

${additionalInstructions ? `ADDITIONAL INSTRUCTIONS:\n${additionalInstructions}\n` : ''}

Generate a complete, self-contained React component with Tailwind CSS styling.
Include ALL data inline in the component - no external data sources.
Make it visually beautiful and professional.`;
}

export function detectArtifactIntent(message: string): {
  isArtifact: boolean;
  type?: string;
  extractedData?: string;
} {
  const lowerMessage = message.toLowerCase();
  
  // Check for artifact keywords
  const artifactKeywords = {
    persona: ['persona', 'user profile', 'user card', 'user persona'],
    'journey-map': ['journey map', 'user journey', 'customer journey'],
    'empathy-map': ['empathy map', 'empathy mapping'],
    'pain-point-dashboard': ['pain point', 'pain points', 'frustration', 'problems'],
    'feature-matrix': ['feature matrix', 'feature comparison', 'feature list']
  };

  for (const [type, keywords] of Object.entries(artifactKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        isArtifact: true,
        type,
        extractedData: message
      };
    }
  }

  // Check for "create X from Y" pattern
  const createPattern = /create (?:a |an )?(.*?)(?:from|using|with) (.*)/i;
  const match = message.match(createPattern);
  if (match) {
    return {
      isArtifact: true,
      type: 'persona', // Default to persona
      extractedData: message
    };
  }

  return { isArtifact: false };
}
