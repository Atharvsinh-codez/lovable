# Artifact Creator - "Lovable for Design Artifacts"

## Overview
This project transforms Open Lovable into an AI-powered design research artifact creation platform. Users interact with AI via chat to generate design artifacts like personas, journey maps, and empathy maps directly from research data. The platform prioritizes a natural conversational workflow over complex wizards, allowing for iterative refinement of artifacts. The vision is to make the creation of design research artifacts seamless, flexible, and accessible, driving market potential by empowering designers and researchers with AI-driven tools.

## User Preferences
- **Communication Style:** I prefer simple, straightforward language.
- **Workflow:** I want an iterative development process.
- **Interaction:** Ask before making major changes.
- **General Working:** I prefer detailed explanations.
- **Change Restrictions:** Do not make changes to folder Z. Do not make changes to file Y.

## System Architecture

### UI/UX Decisions
The primary UI/UX is a conversational chat interface. Artifacts are rendered inline within the chat or in an isolated iframe. There is a mode selector in `/generation` for choosing between HTML-first artifact generation (default for simplicity) and React-based generation (for advanced interactive experiences). The homepage (`app/page.tsx`) has been simplified to promote the Artifacts Creator exclusively, removing previous website cloning UI elements for a focused user experience.

### Technical Implementations
- **Conversational Workflow:** All artifact creation, from data upload and analysis to generation and iteration, occurs within a single chat interface.
- **Data Upload & Analysis:** Users upload research data files (txt, csv, json, md, pdf) directly to the chat. AI automatically analyzes the content, identifies themes, user segments, and suggests appropriate artifacts, displaying results inline.
- **Template System:** A robust template system allows users to define and manage their own artifact templates. Templates are stored on the filesystem within a workspace-scoped directory structure and include metadata, React components (for React mode), and optional validation/utility files. AI can generate and iterate on these templates through chat.
- **Artifact Generation:** The system uses AI to generate artifact data based on uploaded research and selected templates. It supports both HTML-first (single-file HTML with inline CSS/JS, instant rendering in secure iframes, print-friendly) and React-based (multi-file components, full sandbox provisioning) artifact generation, managed by an API branching on the selected mode.
- **Evidence-First Approach:** Generated insights are backed by citations from research data, and confidence scores indicate the strength of evidence.
- **Human-in-the-Loop:** AI proposes artifacts, but human users review, approve, and request changes, allowing for iterative improvement.

### Feature Specifications
- **Data Upload & Analysis:** `/api/upload-research-data` handles file uploads, storage in `workspace/<id>/data/sources/`, and AI analysis.
- **Template Management:** CRUD operations for templates via `/api/templates/save`, `/api/templates/list`, `/api/templates/load/[id]`, `/api/templates/export/[id]`, `/api/templates/import`, `/api/templates/delete/[id]`.
- **Artifact Generation:** `/api/generate-artifact-data` applies templates to research data. `/api/generate-ai-code-stream` handles AI code generation for both HTML and React artifacts.
- **Default Template:** A "Modern Persona Card" template is provided as an example.
- **Sample Data:** `workspace/default/data/sample-interviews.txt` for testing.

### System Design Choices
- **Filesystem First Storage:** Utilizes Node.js `fs/promises` for template and data storage, organized by workspace.
- **No Traditional Database:** Simplifies infrastructure by relying on the filesystem for persistence.
- **Technology Stack:**
    - **Frontend:** Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Shadcn/ui.
    - **Backend:** Next.js API Routes, Node.js filesystem, OpenRouter API, Vercel AI SDK.
    - **Infrastructure:** Workspace-based storage, no database.

## External Dependencies
- **OpenRouter API:** Used for accessing various AI models, authenticated via `OPENAI_API_KEY`.
- **Vercel AI SDK:** For streaming and text generation capabilities.
- **Tailwind CSS:** For styling.
- **Framer Motion:** For animations.
- **Shadcn/ui:** For UI components.