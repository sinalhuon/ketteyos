#!/bin/bash

echo "🚀 Kettekyuos - Vercel Deployment Helper"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if remote exists
if ! git remote | grep -q origin; then
    echo ""
    echo "⚠️  No GitHub remote found!"
    echo "Please create a repository on GitHub and run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/kettekyuos-app.git"
    echo ""
    read -p "Press Enter after adding remote, or Ctrl+C to exit..."
fi

# Add all files
echo ""
echo "📝 Adding files to git..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Ready for Vercel deployment" || echo "No changes to commit"

# Push
echo ""
echo "⬆️  Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'Add New Project'"
echo "4. Import your repository"
echo "5. Click 'Deploy'"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
