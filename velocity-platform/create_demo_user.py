#!/usr/bin/env python3
"""
Create a comprehensive demo user account with multiple agents
This demonstrates the full customer experience
"""

import requests
import json
import time

BASE_URL = "http://localhost:8001"

def create_demo_user():
    """Create a demo user account"""
    print("🎭 Creating demo user account...")
    
    user_data = {
        "email": f"demo-{int(time.time())}@velocityai.com",
        "password": "demo123",
        "first_name": "Demo",
        "last_name": "Customer", 
        "company": "Demo Corp"
    }
    
    # Try to create user (might already exist)
    response = requests.post(f"{BASE_URL}/auth/signup", json=user_data)
    
    if response.status_code == 200:
        print("✅ Demo user created successfully!")
        return response.json()['access_token']
    elif response.status_code == 400 and "already registered" in response.text:
        print("📝 Demo user already exists, logging in...")
        # Login instead
        login_response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })
        if login_response.status_code == 200:
            print("✅ Demo user logged in successfully!")
            return login_response.json()['access_token']
    
    print(f"❌ Failed to create/login demo user: {response.text}")
    return None

def create_demo_agents(token):
    """Create multiple demo agents to showcase different platforms and frameworks"""
    print("🤖 Creating demo agents...")
    
    demo_agents = [
        {
            "name": "AWS SOC2 Compliance Agent",
            "description": "Automated SOC2 compliance monitoring for AWS infrastructure including IAM policies, security groups, and access controls",
            "platform": "aws",
            "framework": "soc2",
            "automation_level": 85.0
        },
        {
            "name": "Azure GDPR Privacy Agent", 
            "description": "GDPR data protection monitoring for Azure resources, tracking data processing and privacy controls",
            "platform": "azure",
            "framework": "gdpr",
            "automation_level": 92.0
        },
        {
            "name": "GCP ISO27001 Security Agent",
            "description": "ISO27001 information security management system monitoring for Google Cloud Platform",
            "platform": "gcp", 
            "framework": "iso27001",
            "automation_level": 78.0
        },
        {
            "name": "GitHub NIS2 Cybersecurity Agent",
            "description": "NIS2 cybersecurity monitoring for critical infrastructure code repositories and CI/CD pipelines",
            "platform": "github",
            "framework": "nis2", 
            "automation_level": 88.0
        },
        {
            "name": "Multi-Cloud DORA Agent",
            "description": "Digital Operational Resilience Act compliance monitoring across multiple cloud platforms",
            "platform": "aws",
            "framework": "dora",
            "automation_level": 95.0
        }
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    created_agents = []
    
    for agent_data in demo_agents:
        print(f"  Creating {agent_data['name']}...")
        response = requests.post(f"{BASE_URL}/agents", json=agent_data, headers=headers)
        
        if response.status_code == 200:
            agent = response.json()
            created_agents.append(agent)
            print(f"    ✅ Created with {agent['evidence_count']} evidence items")
        else:
            print(f"    ❌ Failed: {response.text}")
        
        time.sleep(0.5)  # Small delay between requests
    
    return created_agents

def show_demo_dashboard(token):
    """Display the demo dashboard stats"""
    print("📊 Demo Dashboard Overview:")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get dashboard stats
    stats_response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    if stats_response.status_code == 200:
        stats = stats_response.json()
        print(f"  📈 Total Agents: {stats['total_agents']}")
        print(f"  🔍 Evidence Items: {stats['total_evidence']}")
        print(f"  🎯 Trust Score: {stats['trust_score']}%")
        print(f"  ⚡ Automation Level: {stats['avg_automation']}%")
        print(f"  🟢 Active Agents: {stats['active_agents']}")
    
    # Get agents list
    agents_response = requests.get(f"{BASE_URL}/agents", headers=headers)
    if agents_response.status_code == 200:
        agents = agents_response.json()
        print(f"\n🤖 Created Agents ({len(agents)} total):")
        for agent in agents:
            print(f"  • {agent['name']}")
            print(f"    Platform: {agent['platform'].upper()} | Framework: {agent['framework'].upper()}")
            print(f"    Evidence: {agent['evidence_count']} items | Success: {agent['success_rate']}%")
            print()

def main():
    """Create complete demo environment"""
    print("🚀 Setting up Velocity AI Platform Demo Environment")
    print("=" * 60)
    
    # Step 1: Create demo user
    token = create_demo_user()
    if not token:
        print("❌ Failed to create demo user")
        return
    
    # Step 2: Create demo agents
    agents = create_demo_agents(token)
    if not agents:
        print("❌ Failed to create demo agents")
        return
    
    # Step 3: Show dashboard
    show_demo_dashboard(token)
    
    print("=" * 60)
    print("🎉 Demo Environment Ready!")
    print("\n📋 Demo Credentials:")
    print("   Email: demo@velocityai.com")
    print("   Password: demo123")
    print(f"\n🌐 Frontend: http://localhost:5173/velocity")
    print("📱 Try the complete customer journey:")
    print("   1. Visit the signup page and create an account")
    print("   2. Or login with the demo credentials above")
    print("   3. Go to /velocity/creator to create custom agents")
    print("   4. View /velocity/dashboard to see real agents and data")
    print("   5. Check /velocity/evidence to see collected compliance evidence")
    
    return True

if __name__ == "__main__":
    main()