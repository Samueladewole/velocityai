#!/usr/bin/env python3
"""
Test script for AWS Evidence Collector
Tests connection without real credentials
"""
import asyncio
import json
from aws_evidence_collector import AWSEvidenceCollector

async def test_aws_collector():
    """Test AWS Evidence Collector functionality"""
    print("Testing AWS Evidence Collector...")
    
    # Test with mock credentials (will fail connection but test code structure)
    test_credentials = {
        "access_key_id": "test-access-key-id",
        "secret_access_key": "test-secret-access-key", 
        "region": "us-east-1"
    }
    
    try:
        # Initialize collector
        collector = AWSEvidenceCollector(test_credentials)
        print("✓ AWS Evidence Collector initialized successfully")
        
        # Test connection (expected to fail with mock credentials)
        connection_result = await collector.test_connection()
        print(f"Connection test result: {json.dumps(connection_result, indent=2)}")
        
        if connection_result["success"]:
            print("✓ AWS connection successful")
            
            # Test evidence collection
            try:
                results = await collector.collect_all_evidence()
                print(f"✓ Evidence collection completed: {results['total_evidence_collected']} items")
                print(f"  - Successful collections: {results['successful_collections']}/{results['total_collections']}")
                print(f"  - Automation rate: {results['automation_rate']}%")
                print(f"  - Confidence score: {results['confidence_score']}")
                
                # Print collection results summary
                for task_name, result in results['collection_results'].items():
                    status = "✓" if result['success'] else "✗"
                    print(f"  {status} {task_name}: {result['count']} items")
                    if not result['success']:
                        print(f"    Error: {result['error']}")
                        
            except Exception as e:
                print(f"✗ Evidence collection failed: {e}")
        else:
            print(f"✗ AWS connection failed: {connection_result['error']}")
            print("This is expected with mock credentials")
            
    except Exception as e:
        print(f"✗ Failed to initialize AWS Evidence Collector: {e}")
        import traceback
        traceback.print_exc()

async def test_real_aws_connection():
    """Test with environment variables if available"""
    import os
    
    access_key = os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY') 
    region = os.getenv('AWS_DEFAULT_REGION', 'us-east-1')
    
    if access_key and secret_key:
        print("\n" + "="*50)
        print("Testing with real AWS credentials from environment...")
        
        real_credentials = {
            "access_key_id": access_key,
            "secret_access_key": secret_key,
            "region": region
        }
        
        try:
            collector = AWSEvidenceCollector(real_credentials)
            connection_result = await collector.test_connection()
            
            if connection_result["success"]:
                print("✓ Real AWS connection successful!")
                print(f"  Account ID: {connection_result.get('account_id')}")
                print(f"  User ARN: {connection_result.get('arn')}")
                
                # Test a single evidence collection
                print("\nTesting IAM policies collection...")
                try:
                    policies = await collector.collect_iam_policies()
                    print(f"✓ Collected {len(policies)} IAM policies")
                    
                    if policies:
                        sample_policy = policies[0]
                        print(f"  Sample policy: {sample_policy['resource_name']}")
                        print(f"  Confidence score: {sample_policy['confidence_score']}")
                        
                except Exception as e:
                    print(f"✗ Failed to collect IAM policies: {e}")
                    
            else:
                print(f"✗ Real AWS connection failed: {connection_result['error']}")
                
        except Exception as e:
            print(f"✗ Error with real credentials: {e}")
    else:
        print("\nNo real AWS credentials found in environment variables")
        print("Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to test real connection")

async def main():
    """Main test function"""
    print("AWS Evidence Collector Test Suite")
    print("=" * 50)
    
    # Test 1: Mock credentials
    await test_aws_collector()
    
    # Test 2: Real credentials if available
    await test_real_aws_connection()
    
    print("\n" + "="*50)
    print("Test suite completed")

if __name__ == "__main__":
    asyncio.run(main())