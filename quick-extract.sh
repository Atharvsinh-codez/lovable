#!/bin/bash

# Quick launcher for bypassing Open Lovable's broken preview system
# Uses their AI but runs code locally

echo "🚀 Open Lovable Code Extractor"
echo "Bypass their broken preview system and run code locally"
echo ""

if [ -z "$1" ]; then
    echo "Usage: ./quick-extract.sh \"your app idea\""
    echo ""
    echo "Examples:"
    echo "  ./quick-extract.sh \"todo app with dark mode\""
    echo "  ./quick-extract.sh \"weather dashboard with charts\""
    echo "  ./quick-extract.sh \"crypto portfolio tracker\""
    echo ""
    exit 1
fi

echo "💭 Prompt: $1"
echo "🤖 Generating with Open Lovable AI..."
echo ""

# Make sure Open Lovable server is running
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Open Lovable server not running on localhost:3001"
    echo "   Start it with: npm run dev"
    exit 1
fi

# Run the extraction
node extract-and-run.js "$1"