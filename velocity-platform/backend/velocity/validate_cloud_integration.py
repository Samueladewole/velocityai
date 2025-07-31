#!/usr/bin/env python3
"""
Validation script for Cloud Integration Manager
Checks syntax and basic structure without requiring external dependencies
"""

import ast
import sys
from pathlib import Path

def validate_python_file(file_path: Path) -> tuple[bool, list[str]]:
    """Validate a Python file for syntax errors"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        
        # Parse the AST to check for syntax errors
        ast.parse(source)
        return True, []
    
    except SyntaxError as e:
        return False, [f"Syntax error at line {e.lineno}: {e.msg}"]
    except Exception as e:
        return False, [f"Error reading file: {str(e)}"]

def analyze_cloud_integration_structure():
    """Analyze the structure of the cloud integration files"""
    
    files_to_check = [
        "cloud_integration_manager.py",
        "test_cloud_integration.py",
        "validate_cloud_integration.py"
    ]
    
    results = {}
    
    for filename in files_to_check:
        file_path = Path(filename)
        if file_path.exists():
            is_valid, errors = validate_python_file(file_path)
            results[filename] = {
                "valid": is_valid,
                "errors": errors,
                "size": file_path.stat().st_size
            }
        else:
            results[filename] = {
                "valid": False,
                "errors": [f"File {filename} does not exist"],
                "size": 0
            }
    
    return results

def check_api_endpoints():
    """Check that main.py contains the expected API endpoints"""
    try:
        with open("main.py", 'r', encoding='utf-8') as f:
            content = f.read()
        
        expected_endpoints = [
            ("/api/v1/integrations/cloud/{platform}/connect", "/integrations/cloud/{platform}/connect"),
            ("/api/v1/integrations/cloud/{platform}/test", "/integrations/cloud/{platform}/test"),
            ("/api/v1/integrations/cloud/{platform}/sync", "/integrations/cloud/{platform}/sync"),
            ("/api/v1/integrations/cloud/status", "/integrations/cloud/status"),
            ("/api/v1/integrations/cloud/{platform}/evidence-types", "/integrations/cloud/{platform}/evidence-types")
        ]
        
        found_endpoints = []
        missing_endpoints = []
        
        for endpoint_display, search_pattern in expected_endpoints:
            if search_pattern in content:
                found_endpoints.append(endpoint_display)
            else:
                missing_endpoints.append(endpoint_display)
        
        return {
            "found": found_endpoints,
            "missing": missing_endpoints,
            "total_expected": len(expected_endpoints)
        }
    
    except Exception as e:
        return {"error": str(e)}

def validate_imports_structure():
    """Validate the structure of imports in cloud_integration_manager.py"""
    try:
        with open("cloud_integration_manager.py", 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for key classes and functions
        key_components = [
            "class CloudIntegrationManager",
            "class AWSClient",
            "class GCPClient", 
            "class AzureClient",
            "class GitHubClient",
            "class EvidenceCollectionType",
            "class ConnectionHealthStatus",
            "async def connect_platform",
            "async def test_connection",
            "async def collect_evidence",
            "async def sync_platform_data"
        ]
        
        found_components = []
        missing_components = []
        
        for component in key_components:
            if component in content:
                found_components.append(component)
            else:
                missing_components.append(component)
        
        return {
            "found": found_components,
            "missing": missing_components,
            "total_expected": len(key_components)
        }
    
    except Exception as e:
        return {"error": str(e)}

def main():
    """Main validation function"""
    print("🔍 Validating Cloud Integration Manager Implementation")
    print("=" * 60)
    
    # Check file syntax
    print("\n1. Syntax Validation:")
    results = analyze_cloud_integration_structure()
    
    total_files = len(results)
    valid_files = sum(1 for r in results.values() if r["valid"])
    
    for filename, result in results.items():
        status = "✅ VALID" if result["valid"] else "❌ INVALID"
        size_kb = result["size"] / 1024
        print(f"   {status} {filename} ({size_kb:.1f} KB)")
        
        if result["errors"]:
            for error in result["errors"]:
                print(f"      Error: {error}")
    
    print(f"\n   Summary: {valid_files}/{total_files} files passed syntax validation")
    
    # Check API endpoints
    print("\n2. API Endpoints Validation:")
    endpoint_results = check_api_endpoints()
    
    if "error" in endpoint_results:
        print(f"   ❌ Error checking endpoints: {endpoint_results['error']}")
    else:
        found_count = len(endpoint_results["found"])
        total_count = endpoint_results["total_expected"]
        
        print(f"   Found {found_count}/{total_count} expected endpoints:")
        
        for endpoint in endpoint_results["found"]:
            print(f"      ✅ {endpoint}")
        
        if endpoint_results["missing"]:
            print(f"\n   Missing endpoints:")
            for endpoint in endpoint_results["missing"]:
                print(f"      ❌ {endpoint}")
    
    # Check component structure
    print("\n3. Component Structure Validation:")
    structure_results = validate_imports_structure()
    
    if "error" in structure_results:
        print(f"   ❌ Error checking structure: {structure_results['error']}")
    else:
        found_count = len(structure_results["found"])
        total_count = structure_results["total_expected"]
        
        print(f"   Found {found_count}/{total_count} expected components:")
        
        for component in structure_results["found"]:
            print(f"      ✅ {component}")
        
        if structure_results["missing"]:
            print(f"\n   Missing components:")
            for component in structure_results["missing"]:
                print(f"      ❌ {component}")
    
    # Overall validation summary
    print("\n" + "=" * 60)
    print("📊 Validation Summary:")
    
    syntax_score = (valid_files / total_files) * 100 if total_files > 0 else 0
    
    if "error" not in endpoint_results:
        endpoint_score = (len(endpoint_results["found"]) / endpoint_results["total_expected"]) * 100
    else:
        endpoint_score = 0
    
    if "error" not in structure_results:
        structure_score = (len(structure_results["found"]) / structure_results["total_expected"]) * 100
    else:
        structure_score = 0
    
    overall_score = (syntax_score + endpoint_score + structure_score) / 3
    
    print(f"   Syntax Validation: {syntax_score:.1f}%")
    print(f"   API Endpoints: {endpoint_score:.1f}%")
    print(f"   Component Structure: {structure_score:.1f}%")
    print(f"   Overall Score: {overall_score:.1f}%")
    
    if overall_score >= 90:
        print("\n🎉 Excellent! Implementation looks very solid.")
    elif overall_score >= 75:
        print("\n✅ Good! Implementation is mostly complete.")
    elif overall_score >= 50:
        print("\n⚠️  Fair. Some components may need attention.")
    else:
        print("\n❌ Implementation needs significant work.")
    
    # Additional checks
    print("\n4. Additional File Checks:")
    
    # Check if guide exists
    guide_path = Path("CLOUD_INTEGRATION_GUIDE.md")
    if guide_path.exists():
        guide_size = guide_path.stat().st_size / 1024
        print(f"   ✅ Documentation: CLOUD_INTEGRATION_GUIDE.md ({guide_size:.1f} KB)")
    else:
        print(f"   ❌ Documentation: CLOUD_INTEGRATION_GUIDE.md missing")
    
    # Check if requirements updated
    req_path = Path("requirements.txt")
    if req_path.exists():
        with open(req_path, 'r') as f:
            req_content = f.read()
        
        cloud_deps = ["boto3", "google-cloud", "azure-", "httpx"]
        found_deps = [dep for dep in cloud_deps if dep in req_content]
        
        print(f"   ✅ Dependencies: Found {len(found_deps)}/{len(cloud_deps)} cloud SDK dependencies")
    else:
        print("   ❌ requirements.txt not found")
    
    return overall_score >= 75

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)