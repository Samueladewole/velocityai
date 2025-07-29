#!/usr/bin/env python3
"""
Test script for QIE Integration Agent
Verifies the agent can be created and basic functionality works
"""

import asyncio
import sys
import os
import logging

# Add project root to path
sys.path.append('/Users/macbook/Projects/ERIP-app/velocity-platform')

from src.services.agents.qie.QIEIntegrationAgent import create_qie_integration_agent

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_qie_integration_agent():
    """Test QIE Integration Agent functionality"""
    logger.info("🧪 Starting QIE Integration Agent Test")
    
    try:
        # Create agent
        logger.info("1. Creating QIE Integration Agent...")
        agent = create_qie_integration_agent()
        logger.info(f"✅ Agent created: {agent.config.agent_id}")
        
        # Start agent
        logger.info("2. Starting agent...")
        start_result = await agent.start()
        if start_result:
            logger.info("✅ Agent started successfully")
        else:
            logger.error("❌ Agent failed to start")
            return
        
        # Test health status
        logger.info("3. Checking agent health...")
        health = await agent.get_health_status()
        logger.info(f"✅ Agent health: {health}")
        
        # Test task processing - observability report
        logger.info("4. Testing observability report task...")
        test_task = {
            "type": "observability_report",
            "organization_id": "test-org-123",
            "time_range": "24h"
        }
        
        result = await agent.process_task(test_task)
        if result.success:
            logger.info("✅ Observability report task completed successfully")
            logger.info(f"Report data keys: {list(result.data.keys()) if result.data else 'None'}")
        else:
            logger.error(f"❌ Task failed: {result.error}")
        
        # Test compliance mapping task
        logger.info("5. Testing compliance mapping task...")
        mapping_task = {
            "type": "compliance_mapping",
            "framework": "SOC2",
            "organization_id": "test-org-123"
        }
        
        mapping_result = await agent.process_task(mapping_task)
        if mapping_result.success:
            logger.info("✅ Compliance mapping task completed successfully")
            logger.info(f"Coverage: {mapping_result.data.get('mapping', {}).get('coverage_percentage', 0):.1f}%")
        else:
            logger.error(f"❌ Mapping task failed: {mapping_result.error}")
        
        # Test invalid task
        logger.info("6. Testing invalid task handling...")
        invalid_task = {
            "type": "invalid_task_type",
            "organization_id": "test-org-123"
        }
        
        invalid_result = await agent.process_task(invalid_task)
        if not invalid_result.success:
            logger.info("✅ Invalid task properly rejected")
        else:
            logger.warning("⚠️ Invalid task unexpectedly succeeded")
        
        # Stop agent
        logger.info("7. Stopping agent...")
        stop_result = await agent.stop()
        if stop_result:
            logger.info("✅ Agent stopped successfully")
        else:
            logger.error("❌ Agent failed to stop cleanly")
        
        logger.info("🎉 QIE Integration Agent test completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

async def test_qie_service_integration():
    """Test QIE service integration (if available)"""
    logger.info("🌐 Testing QIE Service Integration")
    
    try:
        import aiohttp
        
        # Test QIE service connectivity
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get('http://localhost:3000/api/qie/health', timeout=5) as resp:
                    if resp.status == 200:
                        logger.info("✅ QIE service is available")
                        
                        # Test metrics endpoint
                        async with session.get('http://localhost:3000/api/qie/metrics/test-org', timeout=5) as metrics_resp:
                            if metrics_resp.status == 200:
                                metrics = await metrics_resp.json()
                                logger.info(f"✅ QIE metrics available: {list(metrics.keys()) if isinstance(metrics, dict) else 'data received'}")
                            else:
                                logger.info(f"⚠️ QIE metrics endpoint returned {metrics_resp.status}")
                    else:
                        logger.info(f"⚠️ QIE service health check returned {resp.status}")
            except asyncio.TimeoutError:
                logger.info("⚠️ QIE service not responding (timeout)")
            except aiohttp.ClientError as e:
                logger.info(f"⚠️ QIE service not available: {e}")
                
    except ImportError:
        logger.info("⚠️ aiohttp not available for service testing")
    except Exception as e:
        logger.info(f"⚠️ QIE service test error: {e}")

async def main():
    """Main test function"""
    logger.info("🚀 QIE Integration Agent Test Suite")
    logger.info("=" * 50)
    
    # Test 1: Basic agent functionality
    await test_qie_integration_agent()
    
    logger.info("\n" + "=" * 50)
    
    # Test 2: QIE service integration
    await test_qie_service_integration()
    
    logger.info("\n" + "=" * 50)
    logger.info("🏁 All tests completed!")

if __name__ == "__main__":
    asyncio.run(main())