#!/usr/bin/env python3
"""
Quick backend test to identify issues
"""
import sys
import os

# Add backend directory to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend', 'velocity')
sys.path.insert(0, backend_path)
os.chdir(backend_path)
os.environ['DATABASE_URL'] = 'sqlite:///velocity.db'

try:
    # Test imports
    print("Testing imports...")
    import main
    from fastapi.testclient import TestClient
    print("✅ Imports successful")
    
    # Test app creation
    print("Testing app creation...")
    client = TestClient(main.app)
    print("✅ App creation successful")
    
    # Test root endpoint
    print("Testing root endpoint...")
    response = client.get("/")
    print(f"✅ Root endpoint: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test docs endpoint
    print("Testing docs endpoint...")
    response = client.get("/docs")
    print(f"✅ Docs endpoint: {response.status_code}")
    
    # Test frameworks endpoint
    print("Testing frameworks...")
    response = client.get("/api/v1/frameworks")
    print(f"✅ Frameworks: {response.status_code}")
    if response.status_code == 200:
        frameworks = response.json()
        print(f"Supported frameworks: {[f['code'] for f in frameworks.get('frameworks', [])]}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()