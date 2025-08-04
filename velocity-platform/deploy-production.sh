#!/bin/bash

# =============================================================================
# Velocity AI Platform - Production Deployment Script
# =============================================================================

echo "🚀 Starting Velocity AI Platform production deployment..."

# Check if production environment file exists
if [ ! -f ".env.production.real" ]; then
    echo "❌ Error: .env.production.real file not found!"
    echo "📋 Please create the production environment file first."
    exit 1
fi

# Copy production environment
echo "📁 Setting up production environment..."
cp .env.production.real .env.local

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build for production
echo "🔧 Building for production..."
VITE_APP_ENV=production NODE_ENV=production npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📂 Build files are in the 'dist' directory"
    echo ""
    echo "🌐 Next steps:"
    echo "   1. Upload 'dist' folder to your hosting provider"
    echo "   2. Point velocity.eripapp.com to the hosting provider"
    echo "   3. Ensure HTTPS is enabled"
    echo "   4. Test the deployment"
    echo ""
    echo "🔗 Your app will be available at: https://velocity.eripapp.com"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Clean up
rm .env.local

echo "🎉 Production deployment preparation complete!"