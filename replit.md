# Artifact Creator - "Lovable for Design Artifacts"

## Project Overview
This project transforms Open Lovable (a website cloning tool) into an AI-powered design research artifact creation platform. Users chat with AI to create artifacts (personas, journey maps, empathy maps) directly from research data - no complex workflows, just natural conversation.

**Current Status:** HTML-first artifact generation with mode selector (Occam's razor approach)  
**Last Updated:** October 28, 2025 (HTML mode for simple artifacts, React mode for advanced web apps)

---

## What We Built Tonight

### Core Workflow (Simplified!)
1. **Go to `/generation`** → Open the existing chat UI
2. **Paste research data** → Copy/paste interviews, surveys, notes into chat
3. **Ask for artifact** → "Create a persona from this data"
4. **AI generates component** → Streams back a beautiful React component with inline data
5. **Iterate** → "Make it more colorful", "Add pain points section"
6. **Done!** → No sandbox needed, artifacts render inline in chat

**Occam's Razor:** Why have a complex multi-step wizard when you can just chat?

### Key Features Implemented

#### 1. Data Upload & Analysis ✅
- **API:** `/api/upload-research-data` - Upload files, store in workspace, AI analyzes content
- **UI:** `DataUploadZone.tsx` - Drag-and-drop interface for .txt, .csv, .json, .md files
- **Analysis:** AI identifies data type, themes, user segments, suggests appropriate artifacts
- **Storage:** `workspace/<id>/data/sources/` for research files

#### 2. Template System ✅
- **Storage API:** Complete CRUD for templates
  - `/api/templates/save` - Save new templates
  - `/api/templates/list` - Browse templates by workspace/type
  - `/api/templates/load/[id]` - Load template files
  - `/api/templates/export/[id]` - Export as portable JSON
  - `/api/templates/import` - Import from JSON
  - `/api/templates/delete/[id]` - Remove templates
  
- **Template Structure:**
  ```
  workspace/<id>/templates/<artifactType>/<templateId>/
    template.json          <- Metadata & schema
    PersonaRenderer.tsx    <- React component
    validator.ts           <- Optional validation
    utils.ts              <- Optional helpers
  ```

- **Core Library:** `lib/templates/`
  - `types.ts` - TypeScript interfaces for entire template system
  - `template-storage.ts` - Filesystem operations for templates
  - `persona-parser.ts` - Parse persona responses (kept for reference)

#### 3. UI Components ✅
All in `components/artifact/`:
- **DataUploadZone.tsx** - File upload with progress, validation, error handling
- **AnalysisResults.tsx** - Display analysis with confidence scores, clickable suggestions
- **TemplateLibrary.tsx** - Browse/search templates, grid/list view, filters
- **ArtifactPreview.tsx** - Preview artifacts with citations, approve/reject, export options
- **index.ts** - Clean exports

#### 4. Artifact Generation ✅
- **API:** `/api/generate-artifact-data` - Apply template to research data
- **Prompts:** `lib/prompts/artifact-template-prompts.ts`
  - System prompts for template creation
  - Data generation prompts with evidence requirements
  - Edit prompts for template iteration

#### 5. Main Application Page ✅
- **Route:** `/artifacts` - Complete multi-step wizard
- **Steps:** Upload → Analysis → Template Selection → Generation
- **Navigation:** Added to homepage header with Sparkles icon

#### 6. Default Template ✅
- **Location:** `workspace/default/templates/persona/modern-persona-card/`
- **Example:** Complete persona template with React component
- **Shows:** How users can create their own templates

### Sample Data for Testing ✅
- `workspace/default/data/sample-interviews.txt` - 3 interview transcripts
- Includes diverse user segments (freelancer, PM, student)
- Different goals, pain points, behaviors to test analysis

#### 7. Clean Homepage ✅
- **File:** `app/page.tsx` - Simplified landing page
- **Features:** Promotes Artifacts Creator only (removed website cloning UI)
- **Result:** No more sandbox/Firecrawl errors in console
- **Benefits:** Clean server logs, faster load times, focused user experience

#### 8. HTML-First Artifact System ✅ (LATEST!)
- **Mode Selector:** Choose between HTML (default) and React modes in `/generation`
- **HTML Mode:** Single-file artifacts with inline CSS/JS - perfect for personas, journey maps, reports
  - No sandbox creation (instant rendering!)
  - Generates complete HTML documents
  - Secure iframe rendering (sandbox="allow-scripts" only)
  - Print-friendly and exportable
- **React Mode:** Multi-file React/TypeScript apps for advanced interactive experiences
  - Full sandbox provisioning
  - Multi-component architecture
  - Existing workflow preserved
- **API:** `/api/generate-ai-code-stream` - Branches on mode parameter
- **Prompts:** `lib/prompts/artifact-prompts.ts` - Both HTML and React artifact prompts
  - `HTML_ARTIFACT_SYSTEM_PROMPT` - Single-file HTML generation
  - `createHTMLArtifactPrompt()` - Artifact-specific HTML prompts
  - CSS-only charting techniques (no external libraries)
  - WCAG 2.1 AA accessibility compliance
- **Benefits:** Occam's razor in action - simple by default, complex when needed

---

## Architecture Decisions

### Why Template-Based (Not Hardcoded UI)
- **User Control:** Users define their own artifact templates
- **Flexibility:** Any artifact type (persona, journey map, empathy map, etc.)
- **Reusability:** Create once, use across projects
- **AI-Powered:** AI codes templates through chat (like Lovable codes websites)

### Storage Strategy
- **Filesystem First:** Using Node.js fs/promises for simplicity
- **Workspace Scoped:** Each workspace has its own templates and data
- **Future:** Can swap to database without changing APIs

### Evidence-First Approach
- Every insight backed by citations from research data
- Confidence scoring (0.0-1.0) based on evidence strength
- AI cannot make up data - must cite sources

### Human-in-the-Loop
- AI proposes artifacts
- Humans review, approve, or request changes
- Templates can be iteratively improved via chat

---

## Technology Stack

### Frontend
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Shadcn/ui components

### Backend
- Next.js API Routes
- Node.js filesystem (fs/promises)
- OpenRouter API (100+ AI models via OPENAI_API_KEY)
- Vercel AI SDK (streaming, text generation)

### Infrastructure
- Workspace-based storage
- No database (filesystem only)
- No sandbox needed for artifact creation (generates JSON/text, not code)

---

## API Endpoints

### Data Management
- `POST /api/upload-research-data` - Upload and analyze research files
- `POST /api/generate-artifact-data` - Generate artifact data from template + research

### Template Management
- `POST /api/templates/save` - Save template
- `GET /api/templates/list` - List templates
- `GET /api/templates/load/[id]` - Load template
- `GET /api/templates/export/[id]` - Export template
- `POST /api/templates/import` - Import template
- `DELETE /api/templates/delete/[id]` - Delete template

### Legacy (From Open Lovable)
- `/api/generate-ai-code-stream` - Code generation (reusable for template coding)
- `/api/create-ai-sandbox-v2` - Sandbox creation (not needed but kept)
- `/api/scrape-screenshot` - Website scraping (requires FIRECRAWL_API_KEY)

---

## Environment Variables

### Required
- `OPENAI_API_KEY` - OpenRouter API key (provides access to 100+ models) ✅ SET

### Optional
- `FIRECRAWL_API_KEY` - For website scraping (not needed for artifacts)
- `ANTHROPIC_API_KEY` - Direct Claude access (not needed, use OpenRouter)
- `GROQ_API_KEY` - Direct Groq access (not needed, use OpenRouter)
- `E2B_API_KEY` - E2B sandbox (not needed, using Vercel sandbox)

---

## File Structure

```
/app
  /api
    /upload-research-data       <- Data upload & analysis
    /generate-artifact-data     <- Artifact generation
    /templates                  <- Template CRUD APIs
  /artifacts                    <- Main artifacts page
  
/components
  /artifact                     <- All artifact UI components
  
/lib
  /templates                    <- Template system core
  /prompts                      <- AI prompt templates
  /parsers                      <- Response parsers
  
/workspace
  /<workspace-id>
    /data
      /sources                  <- Research data files
      analysis.json             <- Analysis results
    /templates
      /<artifact-type>
        /<template-id>          <- Template files
    /artifacts                  <- Generated artifacts
    
/docs                          <- Documentation
```

---

## Next Steps (Future Enhancements)

### Phase 2 Features
1. **Integrate with existing code generation** - Use chat UI for template creation
2. **Export system** - PDF/PNG export for artifacts
3. **Multi-artifact generation** - Create 5 personas from 1 template
4. **Template marketplace** - Share templates across users
5. **Real-time collaboration** - Multiple users editing templates
6. **Version control** - Template versioning and history

### UX Improvements
- Template preview thumbnails
- Better citation visualization
- Batch artifact generation
- Template forking/cloning
- Template search and discovery

### Technical Debt
- Add comprehensive error handling
- Add loading states throughout
- Add E2E tests
- Add LSP/type checking in CI
- Database migration option

---

## Testing

### Manual Test Flow
1. Visit `/artifacts`
2. Upload `workspace/default/data/sample-interviews.txt`
3. View analysis results (should suggest personas)
4. Click on "User Personas" suggestion
5. See template library with default "Modern Persona Card"
6. Click "Use Template" or "Create New Template"
7. Generate artifacts from research data

### Expected Results
- 3 distinct personas identified (Sarah, Tom, Maya)
- Different user segments (freelancer, PM, student)
- Goals, pain points, behaviors extracted
- Citations from interview transcripts
- Confidence scores based on evidence

---

## Known Issues

### Minor
- Template creation flow redirects to `/generation` page (needs integration)
- Export functionality not yet implemented (PDF, PNG, HTML)
- No template previews in library (shows placeholder)
- Citation hover states need polish

### Fixed Issues
- ✅ Homepage sandbox/Firecrawl errors - Removed website cloning UI (October 28, 2025)
- ✅ Security vulnerabilities - All paths sanitized against directory traversal
- ✅ LSP errors - All TypeScript errors resolved

---

## Documentation Files

- `docs/LOVABLE_FOR_ARTIFACTS.md` - Complete vision and workflow
- `docs/PRODUCT_STRATEGY.md` - Product strategy (from earlier)
- `docs/IMPLEMENTATION_GUIDE.md` - Implementation guide (from earlier)
- `docs/SETUP_STATUS.md` - Environment setup status
- `replit.md` - This file (project memory)

---

## Credits

**Built by:** Replit Agent  
**Based on:** Open Lovable by Mendable AI  
**Date:** October 28, 2025  
**Time to Build:** ~3 hours (while user sleeps 😴)

---

## User Preferences

*(None documented yet - add as you discover them)*

---

## Recent Changes

### October 28, 2025 - HTML-First Artifact System Complete ✨
- **Mode Selector UI** - Added HTML vs React toggle in `/generation` (HTML default)
- **HTML Artifact Prompts** - Complete prompt system for single-file HTML generation
  - CSS-only charting techniques (progress bars, bar charts, pie charts)
  - WCAG 2.1 AA accessibility compliance
  - Comprehensive keyboard navigation support
- **API Branching** - `/api/generate-ai-code-stream` now supports both modes
  - HTML mode: Single file, no sandbox, instant rendering
  - React mode: Multi-file, sandbox, existing workflow preserved
- **Secure Rendering** - HTML artifacts render in isolated iframe (sandbox="allow-scripts")
- **Bug Fixes** - Fixed React mode sandbox creation and HTML wrapper stripping
- **All LSP errors resolved** - Clean TypeScript compilation
- **OpenRouter Integration** - All models now use OpenRouter (works with OPENAI_API_KEY)
- **Default Model** - Changed to Anthropic Claude 3.5 Sonnet via OpenRouter

**Status:** Ready for artifact generation! Type "Doordash persona" in HTML mode to test 🎨

### October 28, 2025 - MVP Complete & Cleaned
- Created complete template system from scratch
- Built data upload and analysis
- Created all UI components
- Added navigation to homepage
- Created sample data for testing
- Fixed all security vulnerabilities (directory traversal)
- Fixed all LSP errors
- **Cleaned homepage** - Removed website cloning features to eliminate console errors
- Server running without errors
