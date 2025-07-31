#!/usr/bin/env python3
"""
Test script for Cloud Integration Manager
Demonstrates comprehensive cloud platform integration capabilities
"""

import asyncio
import json
import os
from datetime import datetime, timezone
from typing import Dict, Any

from cloud_integration_manager import (
    CloudIntegrationManager, 
    EvidenceCollectionType,
    Platform,
    AWSCredentials,
    GCPCredentials,
    AzureCredentials,
    GitHubCredentials
)

# Test configuration
TEST_CONFIG = {
    "aws": {
        "access_key_id": os.getenv("AWS_ACCESS_KEY_ID", "test-access-key"),
        "secret_access_key": os.getenv("AWS_SECRET_ACCESS_KEY", "test-secret-key"),
        "region": "us-east-1"
    },
    "gcp": {
        "service_account_key": {
            "type": "service_account",
            "project_id": "test-project",
            "private_key_id": "test-key-id",
            "private_key": "-----BEGIN PRIVATE KEY-----\nTEST KEY\n-----END PRIVATE KEY-----\n",
            "client_email": "test@test-project.iam.gserviceaccount.com",
            "client_id": "123456789",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token"
        },
        "project_id": "test-project"
    },
    "azure": {
        "tenant_id": os.getenv("AZURE_TENANT_ID", "test-tenant-id"),
        "client_id": os.getenv("AZURE_CLIENT_ID", "test-client-id"),
        "client_secret": os.getenv("AZURE_CLIENT_SECRET", "test-client-secret"),
        "subscription_id": os.getenv("AZURE_SUBSCRIPTION_ID", "test-subscription-id")
    },
    "github": {
        "token": os.getenv("GITHUB_TOKEN", "test-github-token"),
        "username": os.getenv("GITHUB_USERNAME", "test-user"),
        "organization": "test-org"
    }
}

def print_section(title: str):
    """Print a formatted section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_result(test_name: str, success: bool, details: Dict[str, Any] = None):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"     Details: {json.dumps(details, indent=2, default=str)}")

async def test_cloud_integration_manager():
    """Comprehensive test of CloudIntegrationManager"""
    
    print_section("Cloud Integration Manager Test Suite")
    print(f"Test started at: {datetime.now(timezone.utc).isoformat()}")
    
    # Initialize the manager
    manager = CloudIntegrationManager()
    print("✅ CloudIntegrationManager initialized successfully")
    
    # Test 1: Connection Tests
    print_section("1. Connection Tests")
    
    connection_results = {}
    
    # Test AWS Connection (will fail with test credentials, but tests the flow)
    try:
        aws_success, aws_error = await manager.connect_platform(
            Platform.AWS,
            TEST_CONFIG["aws"],
            "test-aws-integration",
            test_connection=True
        )
        connection_results["aws"] = {"success": aws_success, "error": aws_error}
        print_result("AWS Connection", aws_success, {"error": aws_error})
    except Exception as e:
        connection_results["aws"] = {"success": False, "error": str(e)}
        print_result("AWS Connection", False, {"error": str(e)})
    
    # Test GCP Connection
    try:
        gcp_success, gcp_error = await manager.connect_platform(
            Platform.GCP,
            TEST_CONFIG["gcp"],
            "test-gcp-integration",
            test_connection=True
        )
        connection_results["gcp"] = {"success": gcp_success, "error": gcp_error}
        print_result("GCP Connection", gcp_success, {"error": gcp_error})
    except Exception as e:
        connection_results["gcp"] = {"success": False, "error": str(e)}
        print_result("GCP Connection", False, {"error": str(e)})
    
    # Test Azure Connection
    try:
        azure_success, azure_error = await manager.connect_platform(
            Platform.AZURE,
            TEST_CONFIG["azure"],
            "test-azure-integration",
            test_connection=True
        )
        connection_results["azure"] = {"success": azure_success, "error": azure_error}
        print_result("Azure Connection", azure_success, {"error": azure_error})
    except Exception as e:
        connection_results["azure"] = {"success": False, "error": str(e)}
        print_result("Azure Connection", False, {"error": str(e)})
    
    # Test GitHub Connection
    try:
        github_success, github_error = await manager.connect_platform(
            Platform.GITHUB,
            TEST_CONFIG["github"],
            "test-github-integration",
            test_connection=True
        )
        connection_results["github"] = {"success": github_success, "error": github_error}
        print_result("GitHub Connection", github_success, {"error": github_error})
    except Exception as e:
        connection_results["github"] = {"success": False, "error": str(e)}
        print_result("GitHub Connection", False, {"error": str(e)})
    
    # Test 2: Health Checks
    print_section("2. Health Check Tests")
    
    # Perform health checks on all connected integrations
    health_results = await manager.perform_health_checks()
    
    for integration_id, health_check in health_results.items():
        print_result(
            f"Health Check - {integration_id}",
            health_check.status.value == "healthy",
            {
                "status": health_check.status.value,
                "response_time_ms": health_check.response_time_ms,
                "error": health_check.error_message
            }
        )
    
    # Test 3: Evidence Collection
    print_section("3. Evidence Collection Tests")
    
    # Test evidence collection for each platform
    for integration_id in manager.clients.keys():
        try:
            client = manager.clients[integration_id]
            platform = client.platform
            
            # Get supported evidence types for this platform
            supported_types = manager.get_supported_evidence_types(platform)
            
            if supported_types:
                # Test collecting first evidence type
                evidence_results = await manager.collect_evidence(
                    integration_id,
                    [supported_types[0]]
                )
                
                for result in evidence_results:
                    print_result(
                        f"Evidence Collection - {platform.value} - {result.collection_type.value}",
                        result.success,
                        {
                            "evidence_count": result.evidence_count,
                            "error": result.error_message
                        }
                    )
            else:
                print_result(f"Evidence Collection - {platform.value}", False, {"error": "No supported evidence types"})
                
        except Exception as e:
            print_result(f"Evidence Collection - {integration_id}", False, {"error": str(e)})
    
    # Test 4: Data Synchronization
    print_section("4. Data Synchronization Tests")
    
    # Test data sync for each connected integration
    for integration_id in manager.clients.keys():
        try:
            sync_result = await manager.sync_platform_data(integration_id)
            
            success = sync_result.get('successful_collections', 0) > 0
            print_result(
                f"Data Sync - {integration_id}",
                success,
                {
                    "total_evidence": sync_result.get('total_evidence_collected', 0),
                    "successful_collections": sync_result.get('successful_collections', 0),
                    "sync_time": sync_result.get('sync_time')
                }
            )
            
        except Exception as e:
            print_result(f"Data Sync - {integration_id}", False, {"error": str(e)})
    
    # Test 5: Connection Status
    print_section("5. Connection Status Tests")
    
    # Get all connection statuses
    all_statuses = await manager.get_all_connection_statuses()
    
    for status in all_statuses:
        print_result(
            f"Connection Status - {status['platform']}",
            status['status'] != 'not_found',
            status
        )
    
    # Test 6: Statistics
    print_section("6. Statistics Tests")
    
    stats = manager.get_statistics()
    print_result(
        "Manager Statistics",
        stats['total_integrations'] > 0,
        stats
    )
    
    # Test 7: Supported Evidence Types
    print_section("7. Supported Evidence Types Tests")
    
    for platform in [Platform.AWS, Platform.GCP, Platform.AZURE, Platform.GITHUB]:
        evidence_types = manager.get_supported_evidence_types(platform)
        print_result(
            f"Evidence Types - {platform.value}",
            len(evidence_types) > 0,
            {"types": [et.value for et in evidence_types]}
        )
    
    # Test 8: Cleanup
    print_section("8. Cleanup Tests")
    
    # Disconnect all integrations
    disconnect_results = []
    for integration_id in list(manager.clients.keys()):
        success = manager.disconnect_platform(integration_id)
        disconnect_results.append(success)
        print_result(f"Disconnect - {integration_id}", success)
    
    # Final Summary
    print_section("Test Summary")
    
    total_tests = 0
    passed_tests = 0
    
    # Count results
    for result in connection_results.values():
        total_tests += 1
        if result["success"]:
            passed_tests += 1
    
    total_tests += len(health_results)
    passed_tests += len([h for h in health_results.values() if h.status.value == "healthy"])
    
    total_tests += len(disconnect_results)
    passed_tests += sum(disconnect_results)
    
    success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {success_rate:.1f}%")
    
    print(f"\nTest completed at: {datetime.now(timezone.utc).isoformat()}")
    
    return success_rate > 70  # Consider test suite successful if >70% pass

async def test_individual_clients():
    """Test individual cloud clients"""
    
    print_section("Individual Cloud Client Tests")
    
    from cloud_integration_manager import AWSClient, GCPClient, AzureClient, GitHubClient
    from security import EncryptionService
    
    encryption_service = EncryptionService()
    
    # Test AWS Client
    print("\n--- AWS Client Test ---")
    try:
        aws_creds = AWSCredentials(
            platform=Platform.AWS,
            access_key_id=TEST_CONFIG["aws"]["access_key_id"],
            secret_access_key=TEST_CONFIG["aws"]["secret_access_key"],
            region=TEST_CONFIG["aws"]["region"],
            created_at=datetime.now(timezone.utc)
        )
        
        aws_client = AWSClient(aws_creds, encryption_service)
        health_check = await aws_client.test_connection()
        
        print_result("AWS Client Test", health_check.status.value != "unhealthy", {
            "status": health_check.status.value,
            "error": health_check.error_message
        })
        
    except Exception as e:
        print_result("AWS Client Test", False, {"error": str(e)})
    
    # Test GCP Client
    print("\n--- GCP Client Test ---")
    try:
        gcp_creds = GCPCredentials(
            platform=Platform.GCP,
            service_account_key=TEST_CONFIG["gcp"]["service_account_key"],
            project_id=TEST_CONFIG["gcp"]["project_id"],
            created_at=datetime.now(timezone.utc)
        )
        
        gcp_client = GCPClient(gcp_creds, encryption_service)
        health_check = await gcp_client.test_connection()
        
        print_result("GCP Client Test", health_check.status.value != "unhealthy", {
            "status": health_check.status.value,
            "error": health_check.error_message
        })
        
    except Exception as e:
        print_result("GCP Client Test", False, {"error": str(e)})
    
    # Test Azure Client  
    print("\n--- Azure Client Test ---")
    try:
        azure_creds = AzureCredentials(
            platform=Platform.AZURE,
            tenant_id=TEST_CONFIG["azure"]["tenant_id"],
            client_id=TEST_CONFIG["azure"]["client_id"],
            client_secret=TEST_CONFIG["azure"]["client_secret"],
            subscription_id=TEST_CONFIG["azure"]["subscription_id"],
            created_at=datetime.now(timezone.utc)
        )
        
        azure_client = AzureClient(azure_creds, encryption_service)
        health_check = await azure_client.test_connection()
        
        print_result("Azure Client Test", health_check.status.value != "unhealthy", {
            "status": health_check.status.value,
            "error": health_check.error_message
        })
        
    except Exception as e:
        print_result("Azure Client Test", False, {"error": str(e)})
    
    # Test GitHub Client
    print("\n--- GitHub Client Test ---")
    try:
        github_creds = GitHubCredentials(
            platform=Platform.GITHUB,
            token=TEST_CONFIG["github"]["token"],
            username=TEST_CONFIG["github"]["username"],
            organization=TEST_CONFIG["github"]["organization"],
            created_at=datetime.now(timezone.utc)
        )
        
        github_client = GitHubClient(github_creds, encryption_service)
        health_check = await github_client.test_connection()
        
        print_result("GitHub Client Test", health_check.status.value != "unhealthy", {
            "status": health_check.status.value,
            "error": health_check.error_message
        })
        
    except Exception as e:
        print_result("GitHub Client Test", False, {"error": str(e)})

def test_data_models():
    """Test data models and enums"""
    
    print_section("Data Models and Enums Tests")
    
    # Test Platform enum
    platforms = [Platform.AWS, Platform.GCP, Platform.AZURE, Platform.GITHUB]
    print_result("Platform Enum", len(platforms) == 4, {"platforms": [p.value for p in platforms]})
    
    # Test EvidenceCollectionType enum
    evidence_types = list(EvidenceCollectionType)
    print_result("EvidenceCollectionType Enum", len(evidence_types) > 0, {
        "types": [et.value for et in evidence_types]
    })
    
    # Test credentials classes
    try:
        aws_creds = AWSCredentials(
            platform=Platform.AWS,
            access_key_id="test",
            secret_access_key="test",
            created_at=datetime.now(timezone.utc)
        )
        print_result("AWSCredentials Creation", True, {"platform": aws_creds.platform.value})
    except Exception as e:
        print_result("AWSCredentials Creation", False, {"error": str(e)})

async def main():
    """Main test function"""
    
    print("🚀 Starting Cloud Integration Manager Test Suite")
    print(f"Python Environment: {os.getenv('VIRTUAL_ENV', 'System Python')}")
    
    # Set test mode environment variables
    os.environ["ENVIRONMENT"] = "test"
    
    try:
        # Run data model tests (synchronous)
        test_data_models()
        
        # Run individual client tests
        await test_individual_clients()
        
        # Run comprehensive integration tests
        success = await test_cloud_integration_manager()
        
        if success:
            print("\n🎉 Test suite completed successfully!")
        else:
            print("\n⚠️  Test suite completed with some failures.")
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Test suite interrupted by user")
    except Exception as e:
        print(f"\n💥 Test suite failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Run the test suite
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nTest suite interrupted.")
    except Exception as e:
        print(f"Failed to run test suite: {e}")