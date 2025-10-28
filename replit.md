# Open Lovable - Replit Project

## Project Overview

**Current State:** AI-powered chat interface for building React applications (Open Lovable v2)

**Strategic Pivot:** Evolving into an agentic chat-based design research artifact creation platform

### Vision
Transform design research workflows through conversational AI that turns messy research data into trusted artifacts (personas, journey maps, problem statements) in half the time.

---

## Recent Changes

### October 28, 2025
- ✅ Migrated from Vercel to Replit
- ✅ Configured Next.js to bind to 0.0.0.0:5000 for Replit environment
- ✅ Installed all dependencies (628 packages)
- ✅ Set up workflow for Next.js development server
- ✅ Application running successfully on port 5000
- ✅ Created comprehensive product strategy for agentic chat-based artifact creation

### Product Strategy Updated
- Focus: Agentic chat interface for design research artifact creation
- Core workflow: Conversational AI guides users through creating personas, journey maps, and other research artifacts
- Key differentiators: Multi-agent system, automatic citations, provenance tracking, real-time collaboration
- See `docs/PRODUCT_STRATEGY.md` for full strategy

---

## Project Architecture

### Tech Stack
- **Framework:** Next.js 15.4.3 (with Turbopack)
- **Runtime:** Node.js 20.19.3
- **Package Manager:** npm (package-lock.json present)
- **UI:** React 19.1.0, Tailwind CSS, Radix UI components
- **AI Providers:** OpenAI, Anthropic, Groq, Google Gemini
- **Sandbox:** Vercel Sandbox + E2B (configurable)
- **Web Scraping:** Firecrawl
- **State:** Jotai

### Key Directories
- `/app` - Next.js app router pages and API routes
- `/components` - React components
- `/lib` - Core utilities, sandbox providers, AI integrations
- `/hooks` - React hooks
- `/atoms` - Jotai state atoms
- `/types` - TypeScript type definitions
- `/docs` - Documentation and strategy documents
- `/public` - Static assets

---

## User Preferences

### Development Approach
- **Chat-first:** All features should be accessible through conversational interface
- **Agent-based:** Use multi-agent architecture (orchestrator, ingestion, analysis, citation, quality agents)
- **Evidence-first:** Every insight must link to source evidence with citations
- **Human-in-the-loop:** AI proposes, humans approve (no autonomous decisions)
- **Progressive disclosure:** Simple by default, powerful when needed

### Code Style
- TypeScript for type safety
- Modular architecture (separate agents, clean interfaces)
- Real-time streaming for progressive results
- Comprehensive error handling with user-friendly messages
- Security-first (encryption, access controls, audit logging)

### Quality Standards
- All AI outputs must include citations and confidence scores
- Provenance tracking for every artifact
- Version control with diff views
- Collaborative review workflows
- Metrics-driven development (track time savings, quality, adoption)

---

## API Keys Required

### AI Providers (at least one required)
- `OPENAI_API_KEY` - For OpenAI models (GPT-4, etc.)
- `ANTHROPIC_API_KEY` - For Claude models
- `GROQ_API_KEY` - For fast Groq inference
- `GEMINI_API_KEY` - For Google Gemini models

### Optional Services
- `E2B_API_KEY` - For E2B sandbox environments
- `FIRECRAWL_API_KEY` - For web scraping capabilities
- `MORPH_API_KEY` - For fast apply features

### Configuration
- `SANDBOX_PROVIDER` - Choose 'e2b' or 'vercel'
- `NEXT_PUBLIC_APP_URL` - Application URL for API calls

---

## Development Workflow

### Running Locally
```bash
npm install
npm run dev
```
- Development server runs on http://0.0.0.0:5000
- Hot reload enabled with Turbopack

### Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## Strategic Priorities

### Immediate Focus (MVP - Next 3 Months)
1. Build chat orchestrator agent
2. Implement persona creation workflow
3. Add automatic citation system
4. Create evidence search and clustering
5. Implement confidence scoring
6. Set up real-time collaboration

### Near-term (Months 4-6)
1. Journey map creation
2. Problem statement generation  
3. Template marketplace
4. Diff view for artifact updates
5. Additional integrations (Notion, Google Drive, Slack)

### Long-term (Months 7-12)
1. Enterprise features (SSO, audit logs)
2. Custom agent training
3. Advanced analytics dashboard
4. API/SDK for extensibility
5. On-premise deployment option

---

## Success Metrics

### North Star
- **Time to artifact:** <2 hours from data upload to approved artifact (vs. 3-5 days manual)

### Key Metrics
- **Citation coverage:** >95% of insights cited with ≥2 sources
- **Agent acceptance:** >75% of AI suggestions accepted
- **Weekly active users:** >60% of team
- **Time savings:** 50%+ reduction vs. manual process
- **Rework rate:** <5% of artifacts need major edits post-approval

---

## Notes

### Replit-Specific Configuration
- Next.js must bind to `0.0.0.0:5000` (configured in package.json)
- Cross-origin requests handled by Replit proxy
- Workflows auto-restart on package changes

### Known Warnings
- Cross-origin request warning (will be resolved in future Next.js version)
- Firecrawl requires Node.js ≥22 (currently on 20.19.3, non-blocking)

### Security Considerations
- All API keys managed through Replit Secrets
- Environment variables encrypted at rest
- No sensitive data in code/logs
- CORS configured for Replit proxy
