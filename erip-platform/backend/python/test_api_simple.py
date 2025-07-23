#!/usr/bin/env python3
"""
Simple API Test for ERIP Data Architecture
Tests basic API functionality without full authentication
"""

import asyncio
import sys
import os

# Add the current directory to Python path for imports
sys.path.insert(0, os.path.abspath('.'))

async def test_basic_imports():
    """Test that all modules can be imported"""
    print("Testing basic module imports...")
    
    try:
        from data_architecture import (
            CloudProvider,
            MultiCloudManager,
            StreamingPipeline,
            DataQualityMonitor,
            DataCatalog
        )
        print("✓ Core data architecture imports successful")
        
        # Test basic instantiation
        cloud_manager = MultiCloudManager()
        quality_monitor = DataQualityMonitor()
        data_catalog = DataCatalog()
        
        print("✓ Core components instantiated successfully")
        return True
        
    except ImportError as e:
        print(f"✗ Import failed: {e}")
        return False
    except Exception as e:
        print(f"✗ Instantiation failed: {e}")
        return False

async def test_api_router_import():
    """Test that the API router can be imported"""
    print("Testing API router import...")
    
    try:
        from data_architecture.router import router
        print("✓ Data architecture router imported successfully")
        print(f"✓ Router has {len(router.routes)} endpoints")
        
        # List some key endpoints
        routes = [route.path for route in router.routes if hasattr(route, 'path')]
        key_endpoints = ['/cloud/connect', '/streaming/pipeline', '/quality/assess', '/catalog/assets']
        
        for endpoint in key_endpoints:
            if any(endpoint in route for route in routes):
                print(f"✓ Found key endpoint: {endpoint}")
            else:
                print(f"? Key endpoint not found: {endpoint}")
        
        return True
        
    except ImportError as e:
        print(f"✗ Router import failed: {e}")
        return False
    except Exception as e:
        print(f"✗ Router test failed: {e}")
        return False

async def test_quality_assessment_flow():
    """Test a complete quality assessment flow"""
    print("Testing quality assessment flow...")
    
    try:
        import pandas as pd
        from data_architecture.quality import (
            DataQualityMonitor,
            CompletenessRule,
            UniquenessRule,
            ValidityRule
        )
        
        # Create sample data
        test_data = pd.DataFrame({
            'id': [1, 2, 3, 4, 5],
            'name': ['Alice', 'Bob', None, 'David', 'Eve'],
            'email': ['alice@example.com', 'invalid-email', 'charlie@example.com', 'david@example.com', 'eve@example.com'],
            'age': [25, 30, -5, 35, 28]
        })
        
        # Initialize quality monitor with rules
        monitor = DataQualityMonitor()
        monitor.add_validation_rule(CompletenessRule())
        monitor.add_validation_rule(UniquenessRule())
        monitor.add_validation_rule(ValidityRule(
            column_types={'id': 'int', 'age': 'int', 'email': 'email'},
            patterns={'email': r'^[^@]+@[^@]+\.[^@]+$'}
        ))
        
        # Run quality assessment
        report = await monitor.assess_quality(
            df=test_data,
            dataset_id="test_api_dataset",
            include_anomaly_detection=True
        )
        
        print(f"✓ Quality assessment completed")
        print(f"  - Overall score: {report.overall_score:.3f}")
        print(f"  - Metrics generated: {len(report.metrics)}")
        print(f"  - Issues found: {len(report.issues)}")
        print(f"  - Dataset has {report.statistics['record_count']} records")
        
        return True
        
    except Exception as e:
        print(f"✗ Quality assessment failed: {e}")
        return False

async def test_data_catalog_flow():
    """Test data catalog functionality"""
    print("Testing data catalog flow...")
    
    try:
        from data_architecture.governance import (
            DataCatalog,
            DataAsset,
            DataClassification
        )
        from datetime import datetime
        
        # Create catalog and register assets
        catalog = DataCatalog()
        
        asset = DataAsset(
            asset_id="test_api_asset",
            name="Test API Dataset",
            description="Dataset for API testing",
            asset_type="table",
            classification=DataClassification.INTERNAL,
            owner="api_test",
            steward="api_test",
            location="/test/api/data",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            tags=["test", "api", "validation"]
        )
        
        success = await catalog.register_asset(asset)
        print(f"✓ Asset registration: {'successful' if success else 'failed'}")
        
        # Search for assets
        results = await catalog.search_assets("test")
        print(f"✓ Search found {len(results)} assets")
        
        # Get asset by classification
        internal_assets = await catalog.get_assets_by_classification(DataClassification.INTERNAL)
        print(f"✓ Found {len(internal_assets)} internal assets")
        
        return True
        
    except Exception as e:
        print(f"✗ Data catalog test failed: {e}")
        return False

async def main():
    """Run all API tests"""
    print("=" * 80)
    print("ERIP DATA ARCHITECTURE API TESTS")
    print("=" * 80)
    
    tests = [
        ("Basic Imports", test_basic_imports),
        ("API Router", test_api_router_import),
        ("Quality Assessment", test_quality_assessment_flow),
        ("Data Catalog", test_data_catalog_flow)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        print("-" * 60)
        
        try:
            result = await test_func()
            if result:
                passed += 1
                print(f"✓ {test_name} test passed")
            else:
                print(f"✗ {test_name} test failed")
        except Exception as e:
            print(f"✗ {test_name} test error: {e}")
    
    print("\n" + "=" * 80)
    print(f"API TEST SUMMARY: {passed}/{total} TESTS PASSED")
    if passed == total:
        print("🎉 ALL API TESTS PASSED!")
    else:
        print(f"⚠️  {total - passed} TESTS FAILED")
    print("=" * 80)
    
    return passed == total

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)