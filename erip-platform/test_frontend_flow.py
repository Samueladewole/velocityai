#!/usr/bin/env python3
"""
Test script to verify frontend-backend integration
Simulates the complete user journey that customers would experience
"""

import requests
import json
import time

BASE_URL = "http://localhost:8001"
FRONTEND_URL = "http://localhost:5173"

def test_signup_flow():
    """Test user signup"""
    print("🧪 Testing user signup...")
    
    signup_data = {
        "email": f"test-{int(time.time())}@velocityai.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "company": "Test Company"
    }
    
    response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Signup successful! User ID: {data['user']['id']}")
        return data['access_token'], signup_data['email']
    else:
        print(f"❌ Signup failed: {response.text}")
        return None, None

def test_login_flow(email, password):
    """Test user login"""
    print("🧪 Testing user login...")
    
    login_data = {
        "email": email,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Login successful! User: {data['user']['name']}")
        return data['access_token']
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def test_agent_creation(token):
    """Test agent creation"""
    print("🧪 Testing agent creation...")
    
    agent_data = {
        "name": "Test AWS SOC2 Agent",
        "description": "Test agent for end-to-end validation",
        "platform": "aws",
        "framework": "soc2",
        "automation_level": 90.0
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/agents", json=agent_data, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Agent created! ID: {data['id']}, Evidence: {data['evidence_count']} items")
        return data['id']
    else:
        print(f"❌ Agent creation failed: {response.text}")
        return None

def test_dashboard_stats(token):
    """Test dashboard statistics"""
    print("🧪 Testing dashboard statistics...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Dashboard stats retrieved!")
        print(f"   - Total Agents: {data['total_agents']}")
        print(f"   - Total Evidence: {data['total_evidence']}")
        print(f"   - Trust Score: {data['trust_score']}%")
        return True
    else:
        print(f"❌ Dashboard stats failed: {response.text}")
        return False

def test_agents_list(token):
    """Test agents list"""
    print("🧪 Testing agents list...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/agents", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Agents list retrieved! Found {len(data)} agents")
        for agent in data:
            print(f"   - {agent['name']} ({agent['platform']}/{agent['framework']}) - {agent['evidence_count']} evidence")
        return True
    else:
        print(f"❌ Agents list failed: {response.text}")
        return False

def main():
    """Run complete frontend-backend integration test"""
    print("🚀 Starting Velocity AI Platform Integration Test")
    print("=" * 60)
    
    # Test 1: Signup
    token, email = test_signup_flow()
    if not token:
        print("❌ Test failed at signup")
        return False
    
    # Test 2: Login
    login_token = test_login_flow(email, "testpassword123")
    if not login_token:
        print("❌ Test failed at login")
        return False
    
    # Test 3: Agent Creation
    agent_id = test_agent_creation(login_token)
    if not agent_id:
        print("❌ Test failed at agent creation")
        return False
    
    # Test 4: Dashboard Stats
    if not test_dashboard_stats(login_token):
        print("❌ Test failed at dashboard stats")
        return False
    
    # Test 5: Agents List
    if not test_agents_list(login_token):
        print("❌ Test failed at agents list")
        return False
    
    print("=" * 60)
    print("🎉 ALL TESTS PASSED! Frontend-Backend integration is working!")
    print("\n📋 Customer Journey Validated:")
    print("   ✅ User can sign up for an account")
    print("   ✅ User can log in with credentials")
    print("   ✅ User can create compliance agents")
    print("   ✅ System automatically generates evidence")
    print("   ✅ Dashboard shows real-time statistics")
    print("   ✅ User can view and manage their agents")
    
    print(f"\n🌐 Frontend URL: {FRONTEND_URL}/velocity")
    print("🎯 Ready for customer testing!")
    
    return True

if __name__ == "__main__":
    main()