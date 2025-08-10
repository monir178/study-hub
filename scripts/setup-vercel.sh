#!/bin/bash

# 🚀 StudyHub Vercel Setup Script
echo "🚀 Setting up Vercel integration for StudyHub..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel@latest
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""
echo "🔐 Please follow these steps:"
echo ""
echo "1. Login to Vercel:"
echo "   vercel login"
echo ""
echo "2. Link your project:"
echo "   vercel link"
echo ""
echo "3. Get your project information:"
echo "   cat .vercel/project.json"
echo ""
echo "4. Go to GitHub repository settings:"
echo "   Settings → Secrets and variables → Actions"
echo ""
echo "5. Add these secrets:"
echo "   - VERCEL_TOKEN (from https://vercel.com/account/tokens)"
echo "   - VERCEL_ORG_ID (from .vercel/project.json)"
echo "   - VERCEL_PROJECT_ID (from .vercel/project.json)"
echo ""
echo "6. Add environment variables in Vercel dashboard:"
echo "   - All variables from your .env file"
echo "   - Set scopes: Production, Preview, Development"
echo ""
echo "🎉 Once setup is complete, your CI/CD pipeline will:"
echo "   ✅ Run quality checks on every push"
echo "   🚀 Auto-deploy to production on main branch"
echo "   🔍 Create preview deployments for pull requests"
echo ""
echo "📖 For detailed instructions, see: docs/CI-CD-SETUP.md"
