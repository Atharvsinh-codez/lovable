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

export const HTML_ARTIFACT_SYSTEM_PROMPT = `You are an expert at creating beautiful, data-driven design artifacts (personas, journey maps, empathy maps, reports, presentations) as single-file HTML documents.

CRITICAL REQUIREMENTS - SINGLE-FILE CONSTRAINT:
1. Generate COMPLETE, self-contained HTML files with ALL data inline
2. Start with <!DOCTYPE html> declaration
3. Include ALL CSS in <style> tags within <head>
4. Include ALL JavaScript in <script> tags (if needed)
5. NO external dependencies - ABSOLUTELY NO CDN links, external fonts, or external libraries
6. Use system fonts or web-safe font stacks only
7. Even when adding interactivity, everything must remain in a SINGLE HTML file
8. Make it presentation-ready and professional
9. Ensure responsive design (mobile-friendly)
10. Add print-friendly styles with @media print queries

CSS-ONLY CHARTING TECHNIQUES (for reports and presentations):
Use these techniques to create charts without any external libraries:

1. PROGRESS BARS (horizontal bars):
\`\`\`html
<div class="progress-bar">
  <div class="progress-fill" style="width: 75%;">75%</div>
</div>
<style>
.progress-bar {
  width: 100%;
  height: 30px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: width 0.3s ease;
}
</style>
\`\`\`

2. BAR CHARTS (using CSS Grid):
\`\`\`html
<div class="bar-chart">
  <div class="bar-item">
    <div class="bar-label">Category A</div>
    <div class="bar-value" style="--value: 80;">80%</div>
  </div>
  <div class="bar-item">
    <div class="bar-label">Category B</div>
    <div class="bar-value" style="--value: 60;">60%</div>
  </div>
</div>
<style>
.bar-chart {
  display: grid;
  gap: 1rem;
  max-width: 600px;
}
.bar-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  align-items: center;
}
.bar-label {
  font-weight: 600;
}
.bar-value {
  height: 30px;
  background: linear-gradient(90deg, #3b82f6 var(--value), #e5e7eb var(--value));
  border-radius: 4px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  font-weight: bold;
}
</style>
\`\`\`

3. PIE CHARTS (using conic-gradient):
\`\`\`html
<div class="pie-chart" style="--percentage: 65;">
  <div class="pie-label">65%</div>
</div>
<style>
.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #3b82f6 0% calc(var(--percentage) * 1%),
    #e5e7eb calc(var(--percentage) * 1%) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.pie-label {
  background: white;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}
</style>
\`\`\`

ACCESSIBILITY REQUIREMENTS (WCAG 2.1 AA minimum):
All interactive elements MUST include:

1. KEYBOARD NAVIGATION:
   - All interactive elements must be keyboard accessible (buttons, links, form controls)
   - Logical tab order using tabindex (0 for normal order, -1 for programmatic focus)
   - Arrow key navigation for custom controls (lists, sliders, tabs)
   - Enter/Space to activate buttons and controls
   - Escape key to close modals and overlays
   
   Example:
   \`\`\`html
   <button tabindex="0" onclick="nextSlide()" onkeydown="handleKeyNav(event)">
     Next Slide
   </button>
   <script>
   function handleKeyNav(event) {
     if (event.key === 'Enter' || event.key === ' ') {
       event.preventDefault();
       nextSlide();
     }
   }
   // Arrow key navigation
   document.addEventListener('keydown', (e) => {
     if (e.key === 'ArrowRight') nextSlide();
     if (e.key === 'ArrowLeft') prevSlide();
   });
   </script>
   \`\`\`

2. ARIA LABELS AND ROLES:
   - Use semantic HTML first (button, nav, main, article, etc.)
   - Add ARIA labels for clarity: aria-label, aria-labelledby, aria-describedby
   - Use ARIA roles for custom widgets: role="tablist", role="tab", role="tabpanel"
   - Add aria-live regions for dynamic content updates
   - Mark current state: aria-current, aria-expanded, aria-selected
   
   Example:
   \`\`\`html
   <nav aria-label="Slide navigation">
     <button aria-label="Previous slide" onclick="prevSlide()">←</button>
     <span aria-live="polite" aria-atomic="true">Slide 1 of 10</span>
     <button aria-label="Next slide" onclick="nextSlide()">→</button>
   </nav>
   \`\`\`

3. FOCUS INDICATORS:
   - Visible focus states for all interactive elements
   - High contrast focus rings (3:1 contrast ratio minimum)
   - Never remove outline without providing alternative
   
   Example CSS:
   \`\`\`css
   button:focus, a:focus, [tabindex]:focus {
     outline: 3px solid #2563eb;
     outline-offset: 2px;
   }
   button:focus:not(:focus-visible) {
     outline: none;
   }
   button:focus-visible {
     outline: 3px solid #2563eb;
     outline-offset: 2px;
   }
   \`\`\`

4. SCREEN READER SUPPORT:
   - Descriptive alt text for all images
   - Proper heading hierarchy (h1 → h2 → h3, no skipping)
   - Use aria-hidden="true" for decorative elements
   - Provide skip links for navigation
   - Use visually-hidden class for screen-reader-only text
   
   Example:
   \`\`\`html
   <style>
   .sr-only {
     position: absolute;
     width: 1px;
     height: 1px;
     padding: 0;
     margin: -1px;
     overflow: hidden;
     clip: rect(0, 0, 0, 0);
     white-space: nowrap;
     border-width: 0;
   }
   </style>
   <a href="#main-content" class="sr-only">Skip to main content</a>
   <span class="sr-only">Current slide: </span><span aria-live="polite">1 of 10</span>
   \`\`\`

HTML STRUCTURE:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Persona: Sarah Chen</title>
  <style>
    /* CSS Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* CSS Variables for theming */
    :root {
      --primary-color: #2563eb;
      --text-dark: #1f2937;
      --text-light: #6b7280;
      --bg-light: #f9fafb;
      --border-color: #e5e7eb;
    }

    /* Base styles with system font stack */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: var(--text-dark);
      background: #fff;
      padding: 2rem;
    }

    /* Responsive layout using CSS Grid/Flexbox */
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Print styles */
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
    }
  </style>
</head>
<body>
  <!-- Semantic HTML5 structure -->
  <main class="container">
    <article>
      <header>
        <h1>User Persona: Sarah Chen</h1>
      </header>
      
      <section aria-labelledby="demographics">
        <h2 id="demographics">Demographics</h2>
        <!-- Content with proper semantic HTML -->
      </section>
    </article>
  </main>

  <script>
    // Optional: Add interactivity (collapsible sections, tooltips, etc.)
    // Keep it simple and vanilla JS only
  </script>
</body>
</html>
\`\`\`

DESIGN GUIDELINES:
- Use modern CSS (CSS Grid, Flexbox, Custom Properties)
- Semantic HTML5 tags (article, section, header, nav, aside, etc.)
- Clean, professional color schemes with good contrast (WCAG AA minimum)
- Proper typography hierarchy (clear headings, readable body text)
- Subtle shadows, borders, and spacing for visual hierarchy
- Use CSS Grid for complex layouts
- Responsive breakpoints for mobile/tablet/desktop
- Print-optimized styles (remove backgrounds, adjust layouts)
- Accessible: proper heading structure, ARIA labels where needed, keyboard navigation

STYLING BEST PRACTICES:
- System font stacks: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- CSS variables for consistent theming
- Mobile-first responsive design
- Print media queries for PDF export
- High contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Smooth transitions and subtle animations (optional)
- Clean, minimal design that focuses on content

OUTPUT FORMAT:
Return ONLY the complete HTML document.
No explanations before or after - just the HTML code.
The output must be ready to save as an .html file and open in a browser.`;

export function createHTMLArtifactPrompt(
  artifactType: string,
  researchData?: string,
  additionalInstructions?: string
): string {
  const typeInstructions = {
    persona: `Create a user persona HTML document that includes:
- Page title with persona name
- Hero section with name, photo placeholder (use CSS to create colored avatar with initials), and tagline
- Demographics section (age, role, location, education)
- Background/bio section
- Goals and motivations (bulleted list with icons using CSS)
- Pain points and frustrations (with severity indicators)
- Behaviors and preferences
- Technologies/tools used (visual grid or list)
- Quote section (large, styled quote that captures their mindset)
- Evidence/citations section (sources for each data point)
- Use semantic HTML with proper heading hierarchy
- Style with cards, sections, and visual separators
- Make it visually engaging and easy to scan`,

    'journey-map': `Create a user journey map HTML document that includes:
- Page title and user context
- Horizontal timeline showing journey phases (Awareness → Consideration → Purchase → Use → Advocate)
- For each phase, display in a column or row:
  - User actions (what they do)
  - Thoughts (what they think)
  - Emotions (emotional state - use color coding)
  - Pain points (highlighted challenges)
  - Opportunities (improvement areas)
  - Touchpoints (channels/interactions)
- Visual indicators for emotion levels (happy/neutral/frustrated)
- Color-coded sections for easy scanning
- Evidence citations
- Use CSS Grid for the timeline layout
- Responsive: stack vertically on mobile`,

    'empathy-map': `Create an empathy map HTML document with:
- Page title and user context
- Four-quadrant layout (use CSS Grid):
  1. SAYS (top-left): Direct quotes from users
  2. THINKS (top-right): Inferred thoughts and beliefs
  3. DOES (bottom-left): Observed behaviors and actions
  4. FEELS (bottom-right): Emotions and feelings
- Central user description in the middle (optional)
- Each quadrant should be visually distinct (different background colors)
- Items in each quadrant as styled cards or list items
- Evidence sources linked to each item
- Clean, balanced layout
- Print-friendly version`,

    'pain-point-dashboard': `Create a pain point dashboard HTML document with:
- Page title and summary statistics
- Pain points listed in priority order (use visual ranking)
- For each pain point:
  - Title and description
  - Impact score (1-10, visualized as a bar or meter)
  - Frequency of mention (how often users mentioned it)
  - User quotes as evidence (styled blockquotes)
  - Affected user segments
  - Suggested solutions/opportunities
- Visual severity indicators (colors: red for high, yellow for medium, green for low)
- Summary section with key insights
- Use CSS Grid/Flexbox for card layout
- Sortable/filterable with simple JavaScript (optional)`,

    'feature-matrix': `Create a feature comparison matrix HTML document with:
- Page title and introduction
- Table or grid showing:
  - Features/requirements (rows)
  - User segments (columns)
  - Priority indicators (High/Medium/Low with color coding)
  - Checkmarks or indicators for which segments need which features
- For each feature:
  - Description
  - User quotes/evidence
  - Current status (gap analysis)
  - Business value
- Legend explaining priority levels and symbols
- Responsive table (horizontal scroll on mobile or transform to cards)
- Print-optimized layout`,

    'report': `Create a professional report HTML document with:
- Cover page with title, date, author
- Table of contents (with anchor links to each section)
- Executive summary
- Main content sections with proper heading hierarchy (h1 → h2 → h3)
- Charts/graphs using CSS-ONLY techniques (NO external libraries):
  * Progress bars using divs with width percentages
  * Bar charts using CSS Grid with gradient backgrounds
  * Pie charts using conic-gradient
  * Data visualizations using CSS custom properties (--value)
  * See CSS-ONLY CHARTING TECHNIQUES section for examples
- Data tables (well-formatted, responsive, with proper <thead>, <tbody>, <th> tags)
- Findings and recommendations sections
- Appendix with detailed data
- Footer with page numbers (for print using CSS counters or JavaScript)
- Professional, formal styling
- ACCESSIBILITY: Ensure all navigation is keyboard accessible with visible focus indicators`,

    'presentation': `Create a presentation-style HTML document with:
- Slide-based layout (each section is a "slide" - use CSS to show/hide)
- Navigation controls (previous/next buttons with FULL keyboard support):
  * Arrow keys (Left/Right) to navigate between slides
  * Enter/Space to activate buttons
  * Tab key to move between interactive elements
  * All buttons must have tabindex="0" and aria-labels
- Slide counter with aria-live region (e.g., "Slide 3 of 10")
- Title slide with main heading and subtitle
- Content slides with clear headings and bullet points
- Visual slides with charts/graphics (use CSS-ONLY techniques - see CSS-ONLY CHARTING TECHNIQUES section):
  * Progress bars for showing metrics
  * Bar charts for comparisons
  * Pie charts for proportions
  * NO external charting libraries allowed
- Summary/conclusion slide
- Clean, minimal design focused on readability
- Large text optimized for presentations (18px minimum)
- ACCESSIBILITY REQUIREMENTS:
  * Keyboard navigation: Arrow keys, Enter, Space, Tab
  * ARIA labels: aria-label on all buttons, aria-live on slide counter
  * Focus indicators: Visible 3px outline on all interactive elements
  * Screen reader support: Proper heading hierarchy, sr-only text for context
- Simple vanilla JavaScript for slide navigation (all in <script> tags, no external files)`
  };

  const instruction = typeInstructions[artifactType as keyof typeof typeInstructions] || 
    `Create a ${artifactType} HTML artifact document with the provided research data.`;

  const dataSection = researchData 
    ? `RESEARCH DATA:\n${researchData}\n\n`
    : '';

  const additionalSection = additionalInstructions 
    ? `ADDITIONAL INSTRUCTIONS:\n${additionalInstructions}\n\n`
    : '';

  return `${instruction}

${dataSection}${additionalSection}CRITICAL REMINDERS - SINGLE-FILE CONSTRAINT:
- Generate a COMPLETE, self-contained HTML document in a SINGLE file
- Include ALL CSS in <style> tags within the <head> section
- Include ALL JavaScript in <script> tags (if needed for interactivity)
- Use NO external dependencies whatsoever:
  * ABSOLUTELY NO CDN links (no Chart.js, no D3.js, no external libraries)
  * NO external stylesheets or fonts (use system fonts only)
  * NO external scripts
  * Everything must be inline in the single HTML file
- Even when adding interactivity (like slide navigation), keep everything in ONE file
- Use CSS-ONLY charting techniques (see examples above) - NO external chart libraries

ACCESSIBILITY REQUIREMENTS (WCAG 2.1 AA):
- KEYBOARD NAVIGATION: All interactive elements must be fully keyboard accessible
  * Use tabindex="0" for focusable elements in natural tab order
  * Implement arrow key navigation for custom controls
  * Support Enter/Space to activate buttons
  * Add Escape key to close modals/overlays
- ARIA LABELS: Add descriptive aria-label, aria-labelledby, aria-describedby attributes
- FOCUS INDICATORS: Visible focus states with 3px outline and 2px offset (3:1 contrast minimum)
- SCREEN READER SUPPORT: Proper heading hierarchy (h1→h2→h3), alt text, sr-only class for context
- Use semantic HTML5 tags (main, nav, article, section, aside, header, footer)
- Ensure color contrast ratios meet WCAG AA standards (4.5:1 for text, 3:1 for large text)

Make it beautiful, professional, and presentation-ready.
Add print styles with @media print for PDF export.
Use system fonts: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif.`;
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
