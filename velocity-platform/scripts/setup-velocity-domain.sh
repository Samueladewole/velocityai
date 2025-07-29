#!/bin/bash

# AWS Amplify Velocity Subdomain Setup Script
# Make sure AWS CLI is configured with appropriate permissions

set -e

echo "🚀 Setting up Velocity subdomain on AWS Amplify..."

# Variables (update these with your actual values)
APP_ID="your-amplify-app-id"  # Get this from Amplify console
DOMAIN_NAME="eripapp.com"
VELOCITY_SUBDOMAIN="velocity.eripapp.com"

# Step 1: Get current app info
echo "📋 Getting current Amplify app information..."
aws amplify get-app --app-id $APP_ID

# Step 2: Create domain association (if not already exists)
echo "🌐 Creating domain association..."
aws amplify create-domain-association \
  --app-id $APP_ID \
  --domain-name $DOMAIN_NAME \
  --sub-domain-settings "prefix=app,branchName=main" \
  --sub-domain-settings "prefix=velocity,branchName=main" \
  --enable-auto-sub-domain

# Step 3: Get domain status
echo "📊 Checking domain status..."
aws amplify get-domain-association \
  --app-id $APP_ID \
  --domain-name $DOMAIN_NAME

echo "✅ Domain setup initiated. Check AWS Console for DNS records to add to your registrar."
echo "🔗 Your Velocity subdomain will be: https://velocity.eripapp.com"

# Step 4: Update build settings for routing
echo "🔧 Updating build specification for proper routing..."
cat > amplify.yml << EOF
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
      rewrites:
        - source: '/velocity/*'
          target: '/velocity/index.html'
          status: '200'
        - source: '/<*>'
          target: '/index.html'
          status: '404-200'
EOF

echo "📝 Created amplify.yml with proper routing configuration"
echo "🎯 Commit and push the amplify.yml file to trigger a new deployment"
echo ""
echo "Next steps:"
echo "1. Add the DNS records provided by Amplify to your domain registrar"
echo "2. Wait for SSL certificate provisioning (can take up to 24 hours)"
echo "3. Test https://velocity.eripapp.com once DNS propagates"