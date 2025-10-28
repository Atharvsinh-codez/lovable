interface PersonaInsight {
  text: string;
  confidence: number;
  citations: Citation[];
}

interface Citation {
  source: string;
  line?: string;
  quote: string;
}

export interface ParsedPersona {
  id: string;
  name: string;
  sections: {
    [sectionName: string]: PersonaInsight[];
  };
}

export function parsePersonaResponse(response: string): ParsedPersona[] {
  const personas: ParsedPersona[] = [];
  
  // Extract persona blocks
  const personaRegex = /<persona id="([^"]+)" name="([^"]+)">([\s\S]*?)<\/persona>/g;
  let personaMatch;
  
  while ((personaMatch = personaRegex.exec(response)) !== null) {
    const id = personaMatch[1];
    const name = personaMatch[2];
    const content = personaMatch[3];
    
    // Extract sections
    const sections: { [key: string]: PersonaInsight[] } = {};
    const sectionRegex = /<section name="([^"]+)">([\s\S]*?)<\/section>/g;
    let sectionMatch;
    
    while ((sectionMatch = sectionRegex.exec(content)) !== null) {
      const sectionName = sectionMatch[1];
      const sectionContent = sectionMatch[2];
      
      // Extract insights
      const insights = extractInsights(sectionContent);
      sections[sectionName] = insights;
    }
    
    personas.push({ id, name, sections });
  }
  
  return personas;
}

function extractInsights(content: string): PersonaInsight[] {
  const insights: PersonaInsight[] = [];
  
  // Match insight blocks - handle case where citations come after
  const insightRegex = /<insight confidence="([^"]+)">([^<]+)<\/insight>/g;
  let match;
  
  while ((match = insightRegex.exec(content)) !== null) {
    const confidence = parseFloat(match[1]);
    const text = match[2].trim();
    const insightEndIndex = match.index + match[0].length;
    
    // Look for citations immediately after this insight
    const remainingContent = content.substring(insightEndIndex);
    const nextInsightMatch = remainingContent.match(/<insight/);
    const nextSectionMatch = remainingContent.match(/<\/section>/);
    
    // Get content until next insight or end of section
    let citationSearchEnd = remainingContent.length;
    if (nextInsightMatch && nextInsightMatch.index) {
      citationSearchEnd = Math.min(citationSearchEnd, nextInsightMatch.index);
    }
    if (nextSectionMatch && nextSectionMatch.index) {
      citationSearchEnd = Math.min(citationSearchEnd, nextSectionMatch.index);
    }
    
    const citationBlock = remainingContent.substring(0, citationSearchEnd);
    const citations = extractCitations(citationBlock);
    
    insights.push({
      text,
      confidence,
      citations
    });
  }
  
  return insights;
}

function extractCitations(content: string): Citation[] {
  const citations: Citation[] = [];
  const citationRegex = /<citation source="([^"]+)"(?:\s+line="([^"]+)")?>([^<]+)<\/citation>/g;
  let match;
  
  while ((match = citationRegex.exec(content)) !== null) {
    citations.push({
      source: match[1],
      line: match[2],
      quote: match[3].trim()
    });
  }
  
  return citations;
}
