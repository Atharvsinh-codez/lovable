# Lovable for Design Artifacts

## Vision
Transform Open Lovable's code generation workflow into an artifact creation platform where AI codes customizable templates for research artifacts.

## Workflow Comparison

### Current Lovable (Website Builder)
```
1. User uploads screenshot/URL
2. AI analyzes → generates code for website
3. Sandbox renders live preview
4. User iterates in chat → AI edits code
5. Export/deploy final website
```

### New Vision (Artifact Creator)
```
1. User uploads research data (transcripts, surveys, etc.)
2. AI analyzes data → suggests artifact types (personas, journey maps, etc.)
3. AI codes template with real data
4. Sandbox renders live preview of artifact
5. User iterates in chat → AI edits template
6. Save template for reuse
7. Generate final artifacts using template + data
8. Export artifacts (PDF, PNG, interactive HTML)
```

## What We Reuse (80% of codebase)

### ✅ Already Working
- **Chat UI** → Keep as-is for template iteration
- **AI Code Generation** → Adapt prompts for artifact templates instead of websites
- **Sandbox System** → Preview artifact templates with real data
- **Real-time Streaming** → Live updates as AI codes templates
- **File Management** → Store templates instead of website files
- **Edit/Iterate Flow** → Works for template refinement

### 🔧 Need to Build
1. **Data Upload System** → Accept research data (transcripts, CSVs, etc.)
2. **Data Analyzer** → Suggest appropriate artifact types
3. **Template-Aware Prompts** → Guide AI to code artifact templates
4. **Template Storage** → Save/load/export templates
5. **Artifact Generator** → Apply templates to data
6. **Export System** → PDF, PNG, HTML, JSON export

## Implementation Strategy

### Phase 1: Data Upload & Analysis (15 min)
- API endpoint: `/api/upload-research-data`
- Store in `workspace/<id>/data/sources/`
- Analyze content and suggest artifacts
- Return suggestions to chat

### Phase 2: Template Generation in Chat (20 min)
- Adapt existing code generation prompts
- Instead of: "Build a landing page"
- Use: "Create a persona card component using this data structure"
- Sandbox previews template with real data

### Phase 3: Template Save/Reuse (15 min)
- Save templates to `workspace/<id>/templates/`
- Template library UI
- Import/export templates as .zip

### Phase 4: Artifact Generation (20 min)
- Apply saved template to datasets
- Generate multiple artifacts (e.g., 5 personas from 1 template)
- Export options (PDF, PNG, HTML, JSON)

## Example User Flow

### Step 1: Upload Data
```
User: "I have 10 user interviews about our design tool"
[Uploads interview-transcripts.zip]

System: "Analyzing your data... I found:
- 10 interview transcripts
- 3 distinct user segments
- Recurring themes: speed, complexity, templates

Suggested artifacts:
✅ User Personas (3 segments identified)
✅ Pain Points Dashboard
✅ Feature Priority Matrix

Which would you like to create?"
```

### Step 2: Generate Template
```
User: "Let's create user personas"

AI: "I'll create a persona template for you. What style do you prefer?
- Card-based (like trading cards)
- Dashboard style (metrics + insights)
- Story format (narrative-driven)
- Or describe your own..."

User: "Card-based with quotes and confidence scores"

AI: [Generates React component]
```
*Sandbox shows live preview with real data*

### Step 3: Iterate
```
User: "Make the confidence scores more prominent and add a photo placeholder"

AI: [Updates template code]
```
*Sandbox updates in real-time*

### Step 4: Save & Generate
```
User: "Perfect! Save this template as 'User Persona Cards v1'"

System: "Template saved! Generating 3 personas from your data..."
[Shows 3 persona cards: Sarah the Busy Designer, Tom the Tech Lead, etc.]

User: "Export all as PDF"
System: "✅ personas-export.pdf ready for download"
```

## Technical Architecture

### Data Storage
```
workspace/
  <workspace-id>/
    data/
      sources/
        interviews-2025-10-28.json
        survey-results.csv
    templates/
      persona-card-v1/
        template.tsx          ← React component
        schema.json          ← Data structure
        preview.png          ← Thumbnail
    artifacts/
      persona-sarah.json     ← Generated artifact instance
      persona-tom.json
```

### Key Differences from Website Builder

| Aspect | Website Builder | Artifact Creator |
|--------|----------------|------------------|
| **Input** | Screenshot/URL | Research data |
| **AI Output** | Full website code | Template component |
| **Sandbox Use** | Preview website | Preview template with data |
| **Iteration** | Edit website | Edit template design |
| **Final Output** | Deployed site | Multiple artifacts from template |
| **Reusability** | One-off project | Templates reused across projects |

### AI Prompt Strategy

**Old Prompt:**
```
"Create a landing page based on this screenshot. Include header, hero, features..."
```

**New Prompt:**
```
"Create a persona card component that displays:
- Name and tagline
- Demographics (age, occupation, tech level)
- Goals (array with confidence scores)
- Pain points (array with evidence citations)
- Quote

Use this data structure: [schema]
Data: [actual user data from transcripts]

Style: Modern card design, highlight confidence scores, show citations on hover"
```

## Success Metrics

### MVP Success (Week 1)
- ✅ Upload research data
- ✅ AI suggests artifact types
- ✅ AI codes template in chat
- ✅ Live preview in sandbox
- ✅ Save template
- ✅ Generate artifacts
- ✅ Export as PDF/PNG

### Future Enhancements
- Template marketplace (share templates)
- Multi-template projects
- Real-time collaboration
- AI-powered insights from data
- Automated citation linking
- Template versioning
- Batch artifact generation

## Why This Works

1. **Leverage existing infrastructure** - 80% code reuse
2. **Familiar workflow** - Same chat + sandbox UX users know
3. **Actual value** - Solves real UX research pain point
4. **Differentiated** - No "Lovable for artifacts" exists yet
5. **Extensible** - Works for any artifact type (personas, journeys, flows, etc.)

## Next Steps

1. Build data upload system
2. Adapt AI prompts for template generation
3. Test with real interview data
4. Add template save/export
5. Ship MVP! 🚀
