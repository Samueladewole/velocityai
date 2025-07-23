# ERIP API Integration Tests
# Test suite for all API endpoints and authentication

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
import json
from datetime import datetime

from main import app
from shared.auth import create_access_token, UserRole

class TestAuthentication:
    """Test authentication and authorization"""
    
    @pytest.fixture
    def client(self):
        """Create test client"""
        return TestClient(app)
    
    @pytest.fixture
    def admin_token(self):
        """Create admin access token for testing"""
        return create_access_token(
            user_id="test_admin",
            email="admin@erip.com",
            role=UserRole.SUPER_ADMIN,
            organization_id="test_org"
        )
    
    @pytest.fixture
    def risk_manager_token(self):
        """Create risk manager access token for testing"""
        return create_access_token(
            user_id="test_risk_manager",
            email="risk@erip.com", 
            role=UserRole.RISK_MANAGER,
            organization_id="test_org"
        )
    
    def test_health_endpoint(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "services" in data
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns service info"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "ERIP Python Backend"
        assert "components" in data
        assert len(data["components"]) > 0
    
    def test_login_valid_credentials(self, client):
        """Test login with valid credentials"""
        login_data = {
            "email": "admin@erip.com",
            "password": "erip-admin-2024"
        }
        
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials"""
        login_data = {
            "email": "admin@erip.com",
            "password": "wrong-password"
        }
        
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    
    def test_protected_endpoint_without_token(self, client):
        """Test accessing protected endpoint without token"""
        response = client.get("/auth/me")
        assert response.status_code == 403
    
    def test_protected_endpoint_with_valid_token(self, client, admin_token):
        """Test accessing protected endpoint with valid token"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.get("/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "email" in data
        assert "role" in data

class TestCOMPASSAPI:
    """Test COMPASS regulatory intelligence endpoints"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    @pytest.fixture
    def admin_headers(self, admin_token):
        return {"Authorization": f"Bearer {admin_token}"}
    
    def test_get_frameworks(self, client, admin_headers):
        """Test getting supported compliance frameworks"""
        response = client.get("/compass/frameworks", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "frameworks" in data
        assert data["ai_powered"] is True
        assert len(data["frameworks"]) > 0
    
    def test_analyze_regulation(self, client, admin_headers):
        """Test regulation analysis endpoint"""
        analysis_data = {
            "regulation_text": "Organizations must implement multi-factor authentication for all privileged accounts.",
            "framework": "ISO 27001",
            "organization_context": {
                "industry": "Technology",
                "employee_count": 500,
                "regions": ["US", "EU"]
            }
        }
        
        with patch("compass.regulatory_engine.RegulatoryIntelligenceEngine.analyze_regulation") as mock_analyze:
            mock_analyze.return_value = Mock(
                regulation_id="reg_001",
                title="Test Regulation",
                framework="ISO 27001",
                ai_confidence=0.92
            )
            
            response = client.post("/compass/analyze-regulation", json=analysis_data, headers=admin_headers)
            assert response.status_code == 200
            mock_analyze.assert_called_once()
    
    def test_compliance_dashboard(self, client, admin_headers):
        """Test compliance dashboard endpoint"""
        response = client.get("/compass/compliance-dashboard", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "overall_compliance" in data
        assert "frameworks" in data
        assert "recent_activities" in data

class TestATLASAPI:
    """Test ATLAS security assessment endpoints"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_get_frameworks(self, client, admin_headers):
        """Test getting supported security frameworks"""
        response = client.get("/atlas/frameworks", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "frameworks" in data
        assert len(data["frameworks"]) > 0
    
    def test_get_asset_types(self, client, admin_headers):
        """Test getting supported asset types"""
        response = client.get("/atlas/asset-types", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "asset_types" in data
        assert "scanning_capabilities" in data
    
    def test_security_assessment(self, client, admin_headers):
        """Test running security assessment"""
        assessment_data = {
            "name": "Test Security Assessment",
            "scope": ["cloud_infrastructure", "applications"],
            "frameworks": ["NIST Cybersecurity Framework"],
            "cloud_configs": {
                "aws": {"region": "us-east-1"},
                "azure": {"subscription_id": "test-sub"}
            }
        }
        
        with patch("atlas.security_engine.SecurityIntelligenceEngine.run_comprehensive_assessment") as mock_assess:
            mock_assess.return_value = Mock(
                assessment_id="assess_001",
                findings=[],
                overall_score=7.5,
                risk_level="medium"
            )
            
            response = client.post("/atlas/assess", json=assessment_data, headers=admin_headers)
            assert response.status_code == 200
            mock_assess.assert_called_once()
    
    def test_security_dashboard(self, client, admin_headers):
        """Test security dashboard endpoint"""
        response = client.get("/atlas/dashboard", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "security_score" in data
        assert "risk_distribution" in data
        assert "asset_coverage" in data

class TestNEXUSAPI:
    """Test NEXUS intelligence platform endpoints"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_threat_intelligence(self, client, admin_headers):
        """Test threat intelligence endpoint"""
        params = {
            "categories": ["malware", "ransomware"],
            "industries": ["Technology"],
            "days": 7
        }
        
        response = client.get("/nexus/threat-intelligence", params=params, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "threat_intelligence" in data
        assert "total_count" in data
    
    def test_expert_search(self, client, admin_headers):
        """Test expert network search"""
        search_data = {
            "expertise_areas": ["Cloud Security", "Zero Trust"],
            "min_experience": 10
        }
        
        response = client.post("/nexus/experts/search", json=search_data, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_research_search(self, client, admin_headers):
        """Test academic research search"""
        search_data = {
            "keywords": ["AI security", "machine learning"],
            "topic_area": "cybersecurity",
            "limit": 5
        }
        
        response = client.post("/nexus/research/search", json=search_data, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

class TestBEACONAPI:
    """Test BEACON value demonstration endpoints"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_roi_calculation(self, client, admin_headers):
        """Test ROI calculation endpoint"""
        roi_data = {
            "baseline_data": {
                "security_score": 6.0,
                "incident_costs": 100000,
                "compliance_costs": 200000
            },
            "current_data": {
                "security_score": 7.5,
                "incident_costs": 50000,
                "compliance_costs": 120000
            },
            "investment_data": {
                "platform_cost": 96000,
                "implementation_cost": 50000
            },
            "timeframe": "annually"
        }
        
        response = client.post("/beacon/roi/calculate", json=roi_data, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_generate_report(self, client, admin_headers):
        """Test business impact report generation"""
        report_data = {
            "reporting_period": "Q4 2024",
            "include_projections": True
        }
        
        response = client.post("/beacon/reports/generate", json=report_data, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_roi" in data
        assert "cost_savings" in data
        assert "metrics" in data
    
    def test_value_dashboard(self, client, admin_headers):
        """Test value demonstration dashboard"""
        response = client.get("/beacon/dashboard", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "roi_summary" in data
        assert "key_metrics" in data
        assert "success_highlights" in data

class TestIntegrationAPI:
    """Test cross-component integration endpoints"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_integration_status(self, client, admin_headers):
        """Test integration status endpoint"""
        response = client.get("/integration/status", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "active_flows" in data
        assert "integration_health" in data
    
    def test_available_workflows(self, client, admin_headers):
        """Test available workflows endpoint"""
        response = client.get("/integration/workflows", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "workflows" in data
        assert "automation_capabilities" in data
    
    def test_integration_dashboard(self, client, admin_headers):
        """Test integration dashboard"""
        response = client.get("/integration/dashboard", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "integration_health" in data
        assert "component_connectivity" in data
        assert "recent_integrations" in data

class TestRoleBasedAccess:
    """Test role-based access control"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_risk_manager_access_to_beacon(self, client, risk_manager_token):
        """Test risk manager can access BEACON endpoints"""
        headers = {"Authorization": f"Bearer {risk_manager_token}"}
        response = client.get("/beacon/dashboard", headers=headers)
        assert response.status_code == 200
    
    def test_risk_manager_access_to_compass(self, client, risk_manager_token):
        """Test risk manager can access COMPASS endpoints"""
        headers = {"Authorization": f"Bearer {risk_manager_token}"}
        response = client.get("/compass/frameworks", headers=headers)
        assert response.status_code == 200
    
    def test_unauthorized_component_access(self, client):
        """Test that invalid tokens are rejected"""
        headers = {"Authorization": "Bearer invalid-token"}
        response = client.get("/compass/frameworks", headers=headers)
        assert response.status_code == 401

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=.", "--cov-report=html"])