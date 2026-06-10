#!/bin/bash

# 🎬 OME - Quick Start Guide
# This script will help you get started with the OME video chat application

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           🎥 Welcome to OME - Anonymous Video Chat             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Install from: https://nodejs.org"
    exit 1
fi

echo "✓ Node.js $(node --version) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✓ npm $(npm --version) detected"
echo ""

# Menu
echo "Choose an option:"
echo ""
echo "1. 📦 Install all dependencies"
echo "2. 🚀 Start development (both server & client)"
echo "3. 🔧 Start only backend server"
echo "4. 💻 Start only frontend"
echo "5. 🧹 Clean node_modules and reinstall"
echo "6. 📖 View documentation"
echo "7. ❌ Exit"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo ""
        echo "📦 Installing dependencies..."
        npm run install-all
        echo "✓ Installation complete!"
        ;;
    2)
        echo ""
        echo "🚀 Starting development environment..."
        echo ""
        echo "📍 Frontend: http://localhost:5173"
        echo "📍 Backend:  http://localhost:5000"
        echo ""
        echo "Press Ctrl+C to stop"
        echo ""
        npm run dev
        ;;
    3)
        echo ""
        echo "🔧 Starting backend server..."
        echo "📍 http://localhost:5000"
        echo "Press Ctrl+C to stop"
        echo ""
        npm run start:server
        ;;
    4)
        echo ""
        echo "💻 Starting frontend..."
        echo "📍 http://localhost:5173"
        echo "Press Ctrl+C to stop"
        echo ""
        npm run start:client
        ;;
    5)
        echo ""
        echo "🧹 Cleaning up..."
        rm -rf node_modules server/node_modules client/node_modules
        rm -f package-lock.json server/package-lock.json client/package-lock.json
        echo "📦 Reinstalling..."
        npm run install-all
        echo "✓ Clean install complete!"
        ;;
    6)
        echo ""
        echo "📖 Documentation files:"
        echo ""
        echo "  • README.md           - Main documentation"
        echo "  • DEVELOPMENT.md      - Development guide"
        echo "  • DEPLOYMENT.md       - Deployment strategies"
        echo "  • ARCHITECTURE.md     - Technical architecture"
        echo "  • TESTING.md          - Testing procedures"
        echo "  • TERMS_OF_SERVICE.md - Legal terms"
        echo "  • PRIVACY_POLICY.md   - Privacy information"
        echo ""
        read -p "Which file to open? (e.g., README.md): " docfile
        if [ -f "$docfile" ]; then
            less "$docfile"
        else
            echo "❌ File not found: $docfile"
        fi
        ;;
    7)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please try again."
        ;;
esac

echo ""
echo "✨ Done! Happy coding!"
