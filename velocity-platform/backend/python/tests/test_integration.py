# ERIP Integration Tests
# Comprehensive test suite for cross-component integration

import pytest
import asyncio
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime
import json

from shared.integration import ERIPIntegrationEngine, IntegrationEvent
from shared.auth import TokenData, UserRole
from compass.regulatory_engine import ComplianceFramework, ComplianceGap
from atlas.security_engine import SecurityFramework, AssetType, SeverityLevel
from nexus.intelligence_engine import ThreatCategory
from beacon.value_engine import ROITimeframe, MetricCategory

class TestERIPIntegrationEngine:
    """Test suite for the ERIP Integration Engine"""
    
    @pytest.fixture
    def integration_engine(self):
        """Create integration engine instance for testing"""
        return ERIPIntegrationEngine()
    
    @pytest.fixture
    def mock_user(self):
        """Create mock user for testing"""
        return TokenData(
            user_id="test_user_001",
            email="test@erip.com",
            role=UserRole.ADMIN,
            permissions=["compass", "atlas", "nexus", "beacon"],
            organization_id="test_org_001",
            session_id="test_session"
        )
    
    @pytest.fixture
    def sample_compliance_data(self):
        """Sample compliance data for testing"""
        return {
            "compliance_gaps": [
                {
                    "gap_id": "gap_001",
                    "description": "Multi-factor authentication not implemented",
                    "framework": ComplianceFramework.ISO27001,
                    "priority": "high"
                },
                {
                    "gap_id": "gap_002", 
                    "description": "Network segmentation requires improvement",
                    "framework": ComplianceFramework.ISO27001,
                    "priority": "medium"
                }
            ],
            "framework": ComplianceFramework.ISO27001,
            "compliance_score": 75,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    @pytest.fixture
    def sample_security_data(self):
        """Sample security data for testing"""
        return {
            "findings": [
                {
                    "finding_id": "finding_001",
                    "title": "S3 Bucket Public Access",
                    "severity": SeverityLevel.HIGH,
                    "framework_controls": ["ISO 27001 A.9.1.2", "SOC 2 CC6.1"]
                },
                {
                    "finding_id": "finding_002",
                    "title": "Outdated Security Groups",
                    "severity": SeverityLevel.MEDIUM,
                    "framework_controls": ["NIST CSF PR.AC-3"]
                }
            ],
            "overall_score": 7.2,
            "findings_count": 2,
            "critical_findings": 0,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    @pytest.fixture
    def sample_threat_data(self):
        """Sample threat intelligence data for testing"""
        return {
            "threat_intelligence": [
                {
                    "intel_id": "threat_001",
                    "category": ThreatCategory.RANSOMWARE,
                    "severity": "critical",
                    "indicators": ["malware.exe", "evil-domain.com"]
                },
                {
                    "intel_id": "threat_002",
                    "category": ThreatCategory.CLOUD_THREATS,
                    "severity": "high",
                    "indicators": ["*.s3.amazonaws.com"]
                }
            ],
            "categories": [ThreatCategory.RANSOMWARE, ThreatCategory.CLOUD_THREATS],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def test_integration_engine_initialization(self, integration_engine):
        """Test integration engine initializes correctly"""
        assert integration_engine is not None
        assert hasattr(integration_engine, 'compass_engine')
        assert hasattr(integration_engine, 'atlas_engine')
        assert hasattr(integration_engine, 'nexus_engine')
        assert hasattr(integration_engine, 'beacon_engine')
        assert len(integration_engine.data_flows) > 0
    
    def test_default_integration_flows_setup(self, integration_engine):
        """Test that default integration flows are properly configured"""
        expected_flows = [
            "compass_to_atlas",
            "atlas_to_compass", 
            "nexus_to_atlas",
            "atlas_to_beacon",
            "compass_to_beacon"
        ]
        
        for flow_id in expected_flows:
            assert flow_id in integration_engine.data_flows
            flow = integration_engine.data_flows[flow_id]
            assert flow.source_component is not None
            assert flow.target_component is not None
            assert flow.trigger_event is not None
    
    @pytest.mark.asyncio
    async def test_compass_to_atlas_integration(self, integration_engine, sample_compliance_data, mock_user):
        """Test COMPASS to ATLAS integration flow"""
        with patch.object(integration_engine.atlas_engine, 'run_comprehensive_assessment') as mock_assessment:
            # Mock the security assessment response
            mock_assessment.return_value = Mock(
                assessment_id="assessment_001",
                findings=[],
                overall_score=7.5
            )
            
            result = await integration_engine.execute_integration_flow(
                flow_id="compass_to_atlas",
                source_data=sample_compliance_data,
                organization_id=mock_user.organization_id
            )
            
            assert result.success is True
            assert "assessment_id" in result.enriched_data
            assert "compliance_aligned" in result.enriched_data
            assert result.enriched_data["compliance_aligned"] is True
            mock_assessment.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_atlas_to_compass_integration(self, integration_engine, sample_security_data, mock_user):
        """Test ATLAS to COMPASS integration flow"""
        with patch.object(integration_engine.compass_engine, 'generate_compliance_evidence') as mock_evidence:
            # Mock the evidence generation response
            mock_evidence.return_value = {
                "control_id": "SECURITY_ASSESSMENT",
                "evidence_package": "Security assessment evidence",
                "generated_at": datetime.utcnow().isoformat()
            }
            
            result = await integration_engine.execute_integration_flow(
                flow_id="atlas_to_compass",
                source_data=sample_security_data,
                organization_id=mock_user.organization_id
            )
            
            assert result.success is True
            assert "compliance_impact" in result.enriched_data
            assert "affected_frameworks" in result.enriched_data
            assert len(result.enriched_data["compliance_impact"]) > 0
    
    @pytest.mark.asyncio
    async def test_nexus_to_atlas_integration(self, integration_engine, sample_threat_data, mock_user):
        """Test NEXUS to ATLAS integration flow"""
        result = await integration_engine.execute_integration_flow(
            flow_id="nexus_to_atlas",
            source_data=sample_threat_data,
            organization_id=mock_user.organization_id
        )
        
        assert result.success is True
        assert "threat_informed" in result.enriched_data
        assert result.enriched_data["threat_informed"] is True
        assert "assessment_priorities" in result.enriched_data
        assert len(result.enriched_data["assessment_priorities"]) > 0
    
    @pytest.mark.asyncio
    async def test_atlas_to_beacon_integration(self, integration_engine, sample_security_data, mock_user):
        """Test ATLAS to BEACON integration flow"""
        with patch.object(integration_engine.beacon_engine, 'calculate_roi_metrics') as mock_roi:
            # Mock ROI calculation response
            mock_roi.return_value = [
                Mock(financial_impact=50000, category=MetricCategory.SECURITY),
                Mock(financial_impact=25000, category=MetricCategory.OPERATIONAL)
            ]
            
            result = await integration_engine.execute_integration_flow(
                flow_id="atlas_to_beacon",
                source_data=sample_security_data,
                organization_id=mock_user.organization_id
            )
            
            assert result.success is True
            assert "roi_calculated" in result.enriched_data
            assert result.enriched_data["roi_calculated"] is True
            assert "total_security_value" in result.enriched_data
            mock_roi.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_compass_to_beacon_integration(self, integration_engine, sample_compliance_data, mock_user):
        """Test COMPASS to BEACON integration flow"""
        with patch.object(integration_engine.beacon_engine, 'calculate_roi_metrics') as mock_roi:
            # Mock ROI calculation response
            mock_roi.return_value = [
                Mock(financial_impact=80000, category=MetricCategory.COMPLIANCE),
                Mock(financial_impact=30000, category=MetricCategory.OPERATIONAL)
            ]
            
            result = await integration_engine.execute_integration_flow(
                flow_id="compass_to_beacon",
                source_data=sample_compliance_data,
                organization_id=mock_user.organization_id
            )
            
            assert result.success is True
            assert "compliance_value_calculated" in result.enriched_data
            assert result.enriched_data["compliance_value_calculated"] is True
            assert "total_compliance_value" in result.enriched_data
            mock_roi.assert_called_once()
    
    @pytest.mark.asyncio 
    async def test_integration_flow_error_handling(self, integration_engine, mock_user):
        """Test integration flow error handling"""
        # Test with invalid flow ID
        result = await integration_engine.execute_integration_flow(
            flow_id="invalid_flow",
            source_data={},
            organization_id=mock_user.organization_id
        )
        
        assert result.success is False
        assert result.error_message is not None
        assert "not found" in result.error_message
    
    @pytest.mark.asyncio
    async def test_integration_status_tracking(self, integration_engine, mock_user):
        """Test integration status and metrics tracking"""
        status = await integration_engine.get_integration_status(mock_user.organization_id)
        
        assert "organization_id" in status
        assert "active_flows" in status
        assert "total_executions" in status
        assert "integration_health" in status
        assert "flows" in status
        assert status["organization_id"] == mock_user.organization_id
    
    @pytest.mark.asyncio
    async def test_flow_execution_metrics(self, integration_engine, sample_compliance_data, mock_user):
        """Test that flow execution updates metrics correctly"""
        flow_id = "compass_to_atlas"
        initial_count = integration_engine.data_flows[flow_id].execution_count
        
        with patch.object(integration_engine.atlas_engine, 'run_comprehensive_assessment') as mock_assessment:
            mock_assessment.return_value = Mock(
                assessment_id="test_assessment",
                findings=[],
                overall_score=8.0
            )
            
            result = await integration_engine.execute_integration_flow(
                flow_id=flow_id,
                source_data=sample_compliance_data,
                organization_id=mock_user.organization_id
            )
            
            assert result.success is True
            assert integration_engine.data_flows[flow_id].execution_count == initial_count + 1
            assert integration_engine.data_flows[flow_id].last_execution is not None
    
    def test_integration_result_caching(self, integration_engine):
        """Test that integration results are properly cached"""
        initial_cache_size = len(integration_engine.integration_history)
        
        # Add a mock result to cache
        mock_result = {
            "integration_id": "test_integration_001",
            "success": True,
            "execution_time": 1.5
        }
        
        integration_engine.integration_history["test_integration_001"] = mock_result
        
        assert len(integration_engine.integration_history) == initial_cache_size + 1
        assert "test_integration_001" in integration_engine.integration_history

class TestIntegrationPerformance:
    """Performance tests for integration engine"""
    
    @pytest.fixture
    def integration_engine(self):
        return ERIPIntegrationEngine()
    
    @pytest.mark.asyncio
    async def test_concurrent_integrations(self, integration_engine):
        """Test that multiple integrations can run concurrently"""
        mock_user = TokenData(
            user_id="perf_test_user",
            email="perf@erip.com",
            role=UserRole.ADMIN,
            permissions=["compass", "atlas"],
            organization_id="perf_test_org",
            session_id="perf_session"
        )
        
        # Create multiple integration tasks
        tasks = []
        for i in range(3):
            task = integration_engine.execute_integration_flow(
                flow_id="nexus_to_atlas",
                source_data={
                    "threat_intelligence": [],
                    "categories": [],
                    "timestamp": datetime.utcnow().isoformat()
                },
                organization_id=mock_user.organization_id
            )
            tasks.append(task)
        
        # Execute concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Verify all completed successfully
        for result in results:
            assert not isinstance(result, Exception)
            assert result.success is True
    
    @pytest.mark.asyncio
    async def test_integration_execution_time(self, integration_engine):
        """Test that integrations complete within acceptable time limits"""
        mock_user = TokenData(
            user_id="time_test_user",
            email="time@erip.com", 
            role=UserRole.ADMIN,
            permissions=["nexus", "atlas"],
            organization_id="time_test_org",
            session_id="time_session"
        )
        
        start_time = datetime.utcnow()
        
        result = await integration_engine.execute_integration_flow(
            flow_id="nexus_to_atlas",
            source_data={
                "threat_intelligence": [{"intel_id": "test", "category": "malware"}],
                "categories": ["malware"],
                "timestamp": datetime.utcnow().isoformat()
            },
            organization_id=mock_user.organization_id
        )
        
        execution_time = result.execution_time
        
        # Assert execution completes within 5 seconds
        assert execution_time < 5.0
        assert result.success is True

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=shared.integration", "--cov-report=html"])