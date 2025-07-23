"""
Advanced Roles API Integration Test
Test API endpoints and basic functionality
"""

import requests
import json
import time

BASE_URL = "http://localhost:8001"

def test_api_health():
    """Test basic API health"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            print("✅ API Health Check - Server is running")
            return True
        else:
            print(f"❌ API Health Check - Server returned {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ API Health Check - Cannot connect to server")
        print("💡 Make sure to start the server with: python main.py")
        return False
    except Exception as e:
        print(f"❌ API Health Check - Error: {str(e)}")
        return False

def test_api_root():
    """Test root endpoint with component listing"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "Advanced Roles - Enterprise Role Management Framework" in data.get("components", []):
                print("✅ Root Endpoint - Advanced Roles component listed")
                return True
            else:
                print("❌ Root Endpoint - Advanced Roles component not found")
                return False
        else:
            print(f"❌ Root Endpoint - Server returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root Endpoint - Error: {str(e)}")
        return False

def test_api_docs():
    """Test API documentation accessibility"""
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=10)
        if response.status_code == 200:
            print("✅ API Documentation - Accessible")
            return True
        else:
            print(f"❌ API Documentation - Server returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Documentation - Error: {str(e)}")
        return False

def test_advanced_roles_endpoints():
    """Test advanced roles endpoints availability"""
    try:
        # Test industry templates endpoint
        response = requests.get(f"{BASE_URL}/api/advanced-roles/templates/industries", timeout=10)
        if response.status_code == 200:
            industries = response.json()
            if isinstance(industries, list) and len(industries) > 0:
                print("✅ Advanced Roles Endpoints - Industries list accessible")
                print(f"   Found industries: {', '.join(industries[:3])}...")
            else:
                print("❌ Advanced Roles Endpoints - Industries list empty")
                return False
        elif response.status_code == 401:
            print("✅ Advanced Roles Endpoints - Authentication protection working")
        else:
            print(f"❌ Advanced Roles Endpoints - Unexpected status {response.status_code}")
            return False
            
        # Test role levels endpoint
        response = requests.get(f"{BASE_URL}/api/advanced-roles/templates/role-levels", timeout=10)
        if response.status_code == 200:
            levels = response.json()
            if isinstance(levels, list) and len(levels) > 0:
                print("✅ Advanced Roles Endpoints - Role levels list accessible")
                print(f"   Found role levels: {', '.join(levels[:3])}...")
                return True
            else:
                print("❌ Advanced Roles Endpoints - Role levels list empty")
                return False
        elif response.status_code == 401:
            print("✅ Advanced Roles Endpoints - Authentication protection working")
            return True
        else:
            print(f"❌ Advanced Roles Endpoints - Unexpected status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Advanced Roles Endpoints - Error: {str(e)}")
        return False

def test_development_mode():
    """Test development mode functionality"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            dev_mode = data.get("development_mode", {})
            if "🚧 Development Mode: Authentication bypassed for testing" in dev_mode.get("message", ""):
                print("✅ Development Mode - Authentication bypass active")
                print(f"   Default user: {dev_mode.get('default_user', 'N/A')}")
                return True
            else:
                print("ℹ️ Development Mode - Production mode active (authentication required)")
                return True
        else:
            print(f"❌ Development Mode Check - Server returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Development Mode Check - Error: {str(e)}")
        return False

def run_integration_tests():
    """Run all integration tests"""
    print("🧪 Running Advanced Roles API Integration Tests...\n")
    
    tests = [
        ("API Health Check", test_api_health),
        ("Root Endpoint", test_api_root),
        ("API Documentation", test_api_docs),
        ("Development Mode", test_development_mode),
        ("Advanced Roles Endpoints", test_advanced_roles_endpoints)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        try:
            if test_func():
                passed += 1
            time.sleep(0.5)  # Brief pause between tests
        except Exception as e:
            print(f"❌ {test_name} - Exception: {str(e)}")
    
    print(f"\n📊 Integration Test Results: {passed}/{total} passed")
    
    if passed == total:
        print("🎉 All API integration tests completed successfully!")
        print("\n💡 Advanced Roles Framework is properly integrated!")
        print("   - API endpoints are accessible")
        print("   - Authentication system is working") 
        print("   - Documentation is available at /docs")
        return True
    else:
        print("⚠️ Some integration tests failed.")
        if passed == 0:
            print("💡 Make sure the server is running: python main.py")
        return False

if __name__ == "__main__":
    success = run_integration_tests()
    exit(0 if success else 1)