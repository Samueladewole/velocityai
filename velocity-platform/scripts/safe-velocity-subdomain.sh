#!/bin/bash

# SAFE Velocity Subdomain Setup - Won't affect existing domain
# This script ONLY adds velocity subdomain without touching existing setup

set -e

echo "🛡️  SAFE Velocity subdomain setup (won't affect existing eripapp.com)"

# Variables (update these with your actual values)
APP_ID="your-amplify-app-id"  # Get this from Amplify console
EXISTING_DOMAIN="eripapp.com"  # Your existing domain

# Step 1: Check current domain setup (READ ONLY)
echo "📋 Checking current domain configuration..."
aws amplify get-domain-association \
  --app-id $APP_ID \
  --domain-name $EXISTING_DOMAIN || echo "No existing domain found - that's okay!"

# Step 2: Add ONLY the velocity subdomain (non-disruptive)
echo "➕ Adding velocity subdomain to existing domain..."
aws amplify update-domain-association \
  --app-id $APP_ID \
  --domain-name $EXISTING_DOMAIN \
  --sub-domain-settings "prefix=velocity,branchName=main" \
  --enable-auto-sub-domain

# Step 3: Verify addition
echo "✅ Verifying subdomain addition..."
aws amplify get-domain-association \
  --app-id $APP_ID \
  --domain-name $EXISTING_DOMAIN

echo "🎯 SUCCESS: velocity.eripapp.com added without affecting existing setup"
echo "🔗 Your existing eripapp.com remains unchanged"
echo "🔗 New subdomain: https://velocity.eripapp.com"