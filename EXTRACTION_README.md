# 🚀 Open Lovable Local Extraction

Fuck their broken preview system - use their AI but run code locally!

## The Problem
- Open Lovable's preview system is busted
- E2B sandboxes failing randomly  
- Generated code gets truncated
- iframe preview doesn't load

## The Solution
Bypass their entire preview system and extract generated code directly:

```bash
# Quick start
./quick-extract.sh "todo app with dark mode"

# Or manually
node extract-and-run.js "weather dashboard with charts"
```

## How It Works

1. **Uses their AI** - Calls Open Lovable's generation API directly
2. **Extracts clean code** - Parses response for actual React components  
3. **Creates local project** - Sets up proper React app structure
4. **Runs locally** - Uses create-react-app dev server (reliable!)

## What You Get

- ✅ **Working React app** - No broken previews
- ✅ **Full code access** - Edit, modify, extend as needed
- ✅ **Real dev server** - Hot reload, proper error handling
- ✅ **Tailwind included** - Styling just works
- ✅ **Standard structure** - Normal React project layout

## Generated Projects

All projects saved to `extracted-projects/` with timestamp names:
```
extracted-projects/
├── project-2024-01-15T10-30-45-123Z/
├── project-2024-01-15T11-15-22-456Z/
└── project-2024-01-15T12-45-33-789Z/
```

## Usage Examples

```bash
# Simple apps
./quick-extract.sh "calculator app"
./quick-extract.sh "todo list with categories"

# Complex apps  
./quick-extract.sh "crypto portfolio dashboard with charts"
./quick-extract.sh "weather app with 7-day forecast"
./quick-extract.sh "expense tracker with data visualization"
```

## Requirements

- Open Lovable server running (`npm run dev`)
- Node.js installed
- Your API keys configured in `.env.local`

## No More Bullshit

- ❌ No broken E2B sandboxes
- ❌ No iframe loading failures  
- ❌ No truncated code
- ❌ No preview system headaches

Just AI → Code → Local Dev Server → Profit! 🎉