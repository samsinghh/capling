#!/bin/bash

# Simple Capling Setup Script
# Creates a basic .env.local file with instructions

echo "🦕 Capling Setup"
echo "================"
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting without changes."
        exit 0
    fi
fi

# Create .env.local with template
cat > .env.local << 'EOF'
# Capling Environment Configuration
# =================================

# OpenAI API Key (Required for AI analysis)
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (Local Development)
# These values are for local Supabase instance
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Optional: Model Selection (defaults to gpt-3.5-turbo)
# OPENAI_MODEL=gpt-4

# Optional: Feature Flags
# NEXT_PUBLIC_ENABLE_ANALYTICS=true
# NEXT_PUBLIC_DEBUG_MODE=true
# NEXT_PUBLIC_USE_MOCK_DATA=true
EOF

echo "✅ Created .env.local"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Edit .env.local and add your OpenAI API key"
echo "   Get it from: https://platform.openai.com/api-keys"
echo ""
echo "2. Start Supabase:"
echo "   supabase start"
echo ""
echo "3. Reset the database:"
echo "   supabase db reset"
echo ""
echo "4. Start the dev server:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 and create an account!"
echo ""

