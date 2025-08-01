#!/bin/bash

echo "🚀 Starting ERIP AI Agents & Velocity Tier Demo"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "velocity-platform/package.json" ]; then
    echo "❌ Please run this script from the Velocity-app root directory"
    exit 1
fi

# Navigate to platform directory
cd velocity-platform

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🌟 ERIP AI Agents & Velocity Tier Demo"
echo "======================================"
echo ""
echo "📍 Main Routes to Explore:"
echo "  • Landing Page:       http://localhost:5173/"
echo "  • Velocity Pricing:   http://localhost:5173/velocity/pricing"
echo "  • Agent Dashboard:    http://localhost:5173/velocity/dashboard"
echo "  • 30-Min Onboarding:  http://localhost:5173/velocity/onboarding"
echo "  • Integration Hub:    http://localhost:5173/velocity/integration"
echo ""
echo "✨ Key Features:"
echo "  • 95% evidence automation with AI agents"
echo "  • 30-minute onboarding to Trust Score"
echo "  • 3x Trust Points for AI-collected evidence"
echo "  • Real-time integration with Trust Equity, Compass, Atlas"
echo "  • Velocity tier pricing: €999-€4,999/month"
echo ""
echo "🎯 Getting Started:"
echo "  1. Visit the landing page and click 'AI Agents & Velocity Tier' tab"
echo "  2. Click 'Start 30-Min Onboarding' in the purple banner"
echo "  3. Explore the pricing at /velocity/pricing"
echo "  4. Check out the agent dashboard and integration status"
echo ""
echo "🔄 Starting development server..."
echo ""

# Start the development server
npm run dev