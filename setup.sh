#!/bin/bash

# OME Video Chat - Codespaces Setup Script

echo "🚀 Setting up OME Video Chat Application..."
echo ""

# Check if running in Codespaces
if [ ! -z "$CODESPACES" ]; then
    echo "✓ Running in GitHub Codespaces"
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
echo "✓ Server dependencies installed"

# Check if .env exists, create if not
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Created server/.env from template"
fi

cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
echo "✓ Client dependencies installed"

# Check if .env exists, create if not
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Created client/.env from template"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 To start the application, run:"
echo "   npm run dev"
echo ""
echo "📍 The application will be available at:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "💡 In Codespaces, port forwarding will be handled automatically."
echo ""
