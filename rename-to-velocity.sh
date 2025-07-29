#!/bin/bash

# Script to rename ERIP references to Velocity throughout the project
# This script will rename folders, files, and update references

set -e  # Exit on any error

echo "🚀 Starting ERIP to Velocity transformation..."

# Change to project root
cd "$(dirname "$0")"
PROJECT_ROOT="$(pwd)"

echo "📁 Current directory: $PROJECT_ROOT"

# 1. Rename the main project folder (if needed)
if [[ "$PROJECT_ROOT" == *"Velocity-app" ]]; then
    echo "⚠️  Note: Main project folder still named Velocity-app"
    echo "   You may want to rename this manually to Velocity-app"
fi

# 2. Rename velocity-platform folder to velocity-platform
if [[ -d "velocity-platform" ]]; then
    echo "📁 Renaming velocity-platform → velocity-platform"
    mv velocity-platform velocity-platform
fi

# 3. Rename files with 'erip' in their names
echo "📄 Renaming files with 'erip' in their names..."

# CloudFormation file
if [[ -f "backend/python/deployment/aws/cloudformation/velocity-infrastructure.yaml" ]]; then
    echo "   Renaming velocity-infrastructure.yaml → velocity-infrastructure.yaml"
    mv "backend/python/deployment/aws/cloudformation/velocity-infrastructure.yaml" \
       "backend/python/deployment/aws/cloudformation/velocity-infrastructure.yaml"
fi

# Architecture documentation
if [[ -f "architecture/VELOCITY_ARCHITECTURE.md" ]]; then
    echo "   Renaming VELOCITY_ARCHITECTURE.md → VELOCITY_ARCHITECTURE.md"
    mv "architecture/VELOCITY_ARCHITECTURE.md" "architecture/VELOCITY_ARCHITECTURE.md"
fi

# Rename all velocity_*.md files in docs/
for file in docs/velocity_*.md; do
    if [[ -f "$file" ]]; then
        new_name=$(echo "$file" | sed 's/velocity_/velocity_/')
        echo "   Renaming $(basename "$file") → $(basename "$new_name")"
        mv "$file" "$new_name"
    fi
done

# Rename VELOCITY_EURO_POSITIONING file
if [[ -f "docs/VELOCITY_EURO_POSITIONING_IMPLEMENTATION_ROADMAP.md" ]]; then
    echo "   Renaming VELOCITY_EURO_POSITIONING_IMPLEMENTATION_ROADMAP.md → VELOCITY_EURO_POSITIONING_IMPLEMENTATION_ROADMAP.md"
    mv "docs/VELOCITY_EURO_POSITIONING_IMPLEMENTATION_ROADMAP.md" \
       "docs/VELOCITY_EURO_POSITIONING_IMPLEMENTATION_ROADMAP.md"
fi

# Rename gbm_velocity_implementation.md
if [[ -f "docs/gbm_velocity_implementation.md" ]]; then
    echo "   Renaming gbm_velocity_implementation.md → gbm_velocity_implementation.md"
    mv "docs/gbm_velocity_implementation.md" "docs/gbm_velocity_implementation.md"
fi

# 4. Update file contents - find all files that contain 'erip' or 'ERIP' (case-insensitive)
echo "🔍 Updating file contents..."

# Function to update content in files
update_file_content() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    # Skip binary files, node_modules, .git, and other non-text files
    if file "$file" | grep -q "text\|empty"; then
        # Replace ERIP references
        sed -e 's/Velocity-app/Velocity-app/g' \
            -e 's/velocity-platform/velocity-platform/g' \
            -e 's/velocity-infrastructure/velocity-infrastructure/g' \
            -e 's/VELOCITY_ARCHITECTURE/VELOCITY_ARCHITECTURE/g' \
            -e 's/VELOCITY_EURO_POSITIONING/VELOCITY_EURO_POSITIONING/g' \
            -e 's/velocity_/velocity_/g' \
            -e 's/VELOCITY_/VELOCITY_/g' \
            -e 's/eripapp\.com/velocityai.com/g' \
            -e 's/app\.eripapp\.com/app.velocityai.com/g' \
            -e 's/erip\.eripapp\.com/velocity.velocityai.com/g' \
            -e 's/gbm_velocity/gbm_velocity/g' \
            "$file" > "$temp_file"
        
        # Only replace if content actually changed
        if ! cmp -s "$file" "$temp_file"; then
            mv "$temp_file" "$file"
            echo "   Updated: $file"
        else
            rm "$temp_file"
        fi
    fi
}

# Find and update all text files (excluding certain directories)
echo "   Scanning and updating text files..."
find . -type f \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./*/node_modules/*" \
    -not -path "./*/venv/*" \
    -not -path "./*/backend-venv/*" \
    -not -path "./*/dist/*" \
    -not -path "./*/.next/*" \
    -not -name "*.log" \
    -not -name "*.png" \
    -not -name "*.jpg" \
    -not -name "*.jpeg" \
    -not -name "*.gif" \
    -not -name "*.ico" \
    -not -name "*.woff*" \
    -not -name "*.ttf" \
    -not -name "*.svg" \
    -print0 | while IFS= read -r -d '' file; do
    update_file_content "$file"
done

# 5. Special handling for configuration files that need domain updates
echo "🔧 Updating domain configurations..."

# Update amplify.yml files
for file in amplify.yml velocity-platform/amplify.yml; do
    if [[ -f "$file" ]]; then
        echo "   Updating domains in $file"
        sed -i.bak \
            -e 's/eripapp\.com/velocityai.com/g' \
            -e 's/api\.eripapp\.com/api.velocityai.com/g' \
            -e 's/velocity\.eripapp\.com/velocity.velocityai.com/g' \
            "$file"
        rm -f "${file}.bak"
    fi
done

# Update package.json if it exists in the renamed folder
if [[ -f "velocity-platform/package.json" ]]; then
    echo "   Ensuring velocity-platform/package.json has correct name"
    sed -i.bak 's/"name": "velocity-platform"/"name": "velocity-platform"/g' velocity-platform/package.json
    rm -f velocity-platform/package.json.bak
fi

# 6. Update environment and configuration files
echo "🌍 Updating environment configurations..."

# Look for .env files and update domains
find . -name ".env*" -type f | while read -r env_file; do
    if [[ -f "$env_file" ]]; then
        echo "   Updating domains in $env_file"
        sed -i.bak \
            -e 's/eripapp\.com/velocityai.com/g' \
            -e 's/erip\./velocity./g' \
            "$env_file"
        rm -f "${env_file}.bak"
    fi
done

echo "✅ ERIP to Velocity transformation completed!"
echo ""
echo "📋 Summary of changes:"
echo "   • Renamed velocity-platform/ → velocity-platform/"
echo "   • Renamed velocity-infrastructure.yaml → velocity-infrastructure.yaml"
echo "   • Renamed VELOCITY_ARCHITECTURE.md → VELOCITY_ARCHITECTURE.md"
echo "   • Renamed all velocity_*.md files to velocity_*.md"
echo "   • Updated domain references: velocityai.com → velocityai.com"
echo "   • Updated file contents throughout project"
echo ""
echo "⚠️  Manual steps still needed:"
echo "   1. Consider renaming project folder: Velocity-app → Velocity-app"
echo "   2. Update any hardcoded URLs in databases or external services"
echo "   3. Update DNS and deployment configurations"
echo "   4. Test all functionality after changes"
echo ""
echo "🎉 Velocity transformation ready!"