#!/bin/bash

echo "🔍 Verifying Velocity AI Deployment..."
echo ""

# Check if the site is loading
echo "1. Checking site availability..."
curl -s -o /dev/null -w "%{http_code}" https://velocity.eripapp.com/
echo ""

# Check for JavaScript errors
echo "2. Checking for main JavaScript file..."
curl -s https://velocity.eripapp.com/ | grep -o "src=\"[^\"]*\.js\"" | head -5
echo ""

# Check if environment variables are being used
echo "3. Checking build output..."
if [ -d "dist" ]; then
    echo "✅ Build directory exists"
    echo "Files in dist:"
    ls -la dist/ | head -10
else
    echo "❌ No dist directory found"
fi
echo ""

echo "4. Required environment variables for AWS Amplify:"
echo "   VITE_SUPABASE_URL"
echo "   VITE_SUPABASE_ANON_KEY"
echo "   VITE_APP_ENV"
echo "   VITE_APP_DOMAIN"
echo "   VITE_ENABLE_DEMO_MODE"
echo ""

echo "📋 Action Required:"
echo "1. Go to AWS Amplify Console"
echo "2. Navigate to your app settings"
echo "3. Click on 'Environment variables'"
echo "4. Add the following variables:"
echo ""
echo "VITE_SUPABASE_URL=https://acefedmwnsgarsjvjyao.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZWZlZG13bnNnYXJzanZqeWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODExODYsImV4cCI6MjA2OTY1NzE4Nn0.u7mj5kMAWIkCQEVP8QRaLWxk1-bE9wCMCHYRepn7tGg"
echo "VITE_APP_ENV=production"
echo "VITE_APP_DOMAIN=velocity.eripapp.com"
echo "VITE_ENABLE_DEMO_MODE=false"
echo ""
echo "5. Trigger a new build in Amplify"