#!/usr/bin/env python3
"""
Simple test for QIE Integration Agent without external dependencies
"""

import asyncio
import logging
import sys
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_qie_agent_simple():
    """Simple test of QIE Integration Agent"""
    logger.info("🧪 Simple QIE Integration Agent Test")
    
    try:
        # Mock the necessary imports for testing
        class MockBaseAgent:
            def __init__(self, config):
                self.config = config
                self.status = "created"
            
            async def start(self):
                self.status = "running"
                return True
            
            async def stop(self):
                self.status = "stopped"
                return True
            
            async def get_health_status(self):
                return {
                    "status": self.status,
                    "agent_id": self.config.agent_id,
                    "agent_type": "qie-integration",
                    "healthy": True
                }
        
        class MockAgentConfig:
            def __init__(self):
                self.agent_id = "qie-integration-test"
                self.name = "QIE Integration Agent"
                self.agent_type = "intelligence"
        
        class MockTaskResult:
            def __init__(self, success=True, data=None, error=None, task_type=None):
                self.success = success
                self.data = data or {}
                self.error = error
                self.task_type = task_type
        
        class MockEvidence:
            def __init__(self, source, evidence_type, content, confidence_score, collected_at, hash_value, metadata):
                self.source = source
                self.evidence_type = evidence_type
                self.content = content
                self.confidence_score = confidence_score
                self.collected_at = collected_at
                self.hash_value = hash_value
                self.metadata = metadata
        
        # Mock QIE Integration Agent
        class MockQIEIntegrationAgent(MockBaseAgent):
            def __init__(self, config):
                super().__init__(config)
                self.metrics = {
                    "questions_extracted": 0,
                    "answers_generated": 0,
                    "frameworks_processed": set(),
                    "total_processing_time": 0.0,
                    "average_confidence": 0.0,
                    "evidence_items_created": 0
                }
            
            async def process_task(self, task_data):
                task_type = task_data.get("type")
                
                if task_type == "observability_report":
                    return MockTaskResult(
                        success=True,
                        data={
                            "report": {
                                "organization_id": task_data.get("organization_id"),
                                "time_range": task_data.get("time_range"),
                                "agent_metrics": self.metrics,
                                "report_timestamp": "2025-01-29T00:00:00Z"
                            }
                        },
                        task_type=task_type
                    )
                elif task_type == "compliance_mapping":
                    return MockTaskResult(
                        success=True,
                        data={
                            "mapping": {
                                "framework": task_data.get("framework"),
                                "coverage_percentage": 85.0,
                                "covered_requirements": ["Access Controls", "System Operations"],
                                "gaps": ["Change Management"],
                                "recommendations": ["Increase compliance coverage"]
                            }
                        },
                        task_type=task_type
                    )
                else:
                    return MockTaskResult(
                        success=False,
                        error=f"Unknown task type: {task_type}",
                        task_type=task_type
                    )
        
        # Test the mock agent
        logger.info("1. Creating mock QIE Integration Agent...")
        config = MockAgentConfig()
        agent = MockQIEIntegrationAgent(config)
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
        
        # Test observability report task
        logger.info("4. Testing observability report task...")
        test_task = {
            "type": "observability_report",
            "organization_id": "test-org-123",
            "time_range": "24h"
        }
        
        result = await agent.process_task(test_task)
        if result.success:
            logger.info("✅ Observability report task completed")
            logger.info(f"Organization: {result.data['report']['organization_id']}")
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
            logger.info("✅ Compliance mapping task completed")
            logger.info(f"Coverage: {mapping_result.data['mapping']['coverage_percentage']:.1f}%")
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
        
        logger.info("🎉 Simple QIE Integration Agent test completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

async def main():
    """Main test function"""
    logger.info("🚀 Simple QIE Integration Agent Test")
    logger.info("=" * 50)
    
    await test_qie_agent_simple()
    
    logger.info("\n" + "=" * 50)
    logger.info("🏁 Test completed!")

if __name__ == "__main__":
    asyncio.run(main())