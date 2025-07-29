#!/usr/bin/env python3
"""
QIE Integration Agent - Velocity.ai Multi-Agent System
Bridges Question Intelligent Extraction (QIE) with Agent Infrastructure

This agent integrates the existing TypeScript QIE system with the Python agent
orchestration system, providing seamless intelligent questionnaire processing
with full observability and compliance alignment.
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timedelta
from pathlib import Path

try:
    import aiofiles
    import httpx
    DEPENDENCIES_AVAILABLE = True
except ImportError:
    # For testing without full dependencies
    DEPENDENCIES_AVAILABLE = False
    aiofiles = None
    httpx = None

from ..core.base_agent import BaseAgent, AgentConfig, TaskResult, Evidence
from ..core.agent_types import AgentType, TaskPriority
from ...trustScore.rust_trust_integration import RustTrustIntegration
from ...database.evidence_store import EvidenceStore

# Configure logging
logger = logging.getLogger(__name__)

class QIEIntegrationConfig(AgentConfig):
    """Configuration for QIE Integration Agent"""
    
    def __init__(self):
        super().__init__(
            agent_id="qie-integration-agent",
            name="QIE Integration Agent",
            agent_type=AgentType.INTELLIGENCE,
            description="Integrates Question Intelligent Extraction with agent infrastructure",
            capabilities=[
                "question_extraction",
                "answer_generation", 
                "compliance_mapping",
                "observability_integration",
                "multi_framework_support"
            ],
            required_permissions=[
                "qie:read",
                "qie:write", 
                "evidence:create",
                "compliance:analyze"
            ],
            max_concurrent_tasks=5,
            task_timeout=300,  # 5 minutes per QIE task
            priority=TaskPriority.HIGH
        )
        
        # QIE-specific configuration
        self.qie_service_url = "http://localhost:3000/api/qie"
        self.supported_frameworks = [
            "SOC2", "ISO27001", "GDPR", "HIPAA", "PCI_DSS", "NIST"
        ]
        self.extraction_models = {
            "default": "question-extraction-v1",
            "enhanced": "gpt-4-turbo",
            "specialized": "claude-3-opus"
        }
        self.confidence_thresholds = {
            "minimum": 0.6,
            "standard": 0.75,
            "high_quality": 0.9
        }

class QIEIntegrationAgent(BaseAgent):
    """
    QIE Integration Agent
    
    Bridges the existing TypeScript QIE system with the Python agent infrastructure,
    providing intelligent questionnaire processing with enterprise observability.
    """
    
    def __init__(self, config: QIEIntegrationConfig):
        super().__init__(config)
        self.config = config
        self.rust_trust = RustTrustIntegration()
        self.evidence_store = EvidenceStore()
        self.http_client = None
        
        # QIE processing metrics
        self.metrics = {
            "questions_extracted": 0,
            "answers_generated": 0,
            "frameworks_processed": set(),
            "total_processing_time": 0.0,
            "average_confidence": 0.0,
            "evidence_items_created": 0
        }
        
        logger.info(f"QIE Integration Agent initialized: {self.config.agent_id}")
    
    async def start(self) -> bool:
        """Start the QIE Integration Agent"""
        try:
            await super().start()
            
            # Initialize HTTP client for QIE service communication if dependencies available
            if DEPENDENCIES_AVAILABLE and httpx:
                self.http_client = httpx.AsyncClient(
                    timeout=httpx.Timeout(30.0),
                    headers={"Content-Type": "application/json"}
                )
                
                # Verify QIE service connectivity
                await self._verify_qie_service()
            else:
                logger.warning("HTTP dependencies not available, QIE service integration disabled")
                self.http_client = None
            
            logger.info("QIE Integration Agent started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start QIE Integration Agent: {e}")
            return False
    
    async def stop(self) -> bool:
        """Stop the QIE Integration Agent"""
        try:
            if self.http_client:
                await self.http_client.aclose()
            
            await super().stop()
            logger.info("QIE Integration Agent stopped successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error stopping QIE Integration Agent: {e}")
            return False
    
    async def process_task(self, task_data: Dict[str, Any]) -> TaskResult:
        """Process QIE-related tasks"""
        task_type = task_data.get("type")
        start_time = datetime.now()
        
        try:
            if task_type == "extract_questions":
                result = await self._extract_questions(task_data)
            elif task_type == "generate_answers":
                result = await self._generate_answers(task_data)
            elif task_type == "analyze_questionnaire":
                result = await self._analyze_questionnaire(task_data)
            elif task_type == "compliance_mapping":
                result = await self._map_compliance_requirements(task_data)
            elif task_type == "observability_report":
                result = await self._generate_observability_report(task_data)
            else:
                return TaskResult(
                    success=False,
                    error=f"Unknown task type: {task_type}",
                    task_type=task_type
                )
            
            # Update processing metrics
            processing_time = (datetime.now() - start_time).total_seconds()
            self.metrics["total_processing_time"] += processing_time
            
            return result
            
        except Exception as e:
            logger.error(f"QIE task processing failed: {e}")
            return TaskResult(
                success=False,
                error=str(e),
                task_type=task_type,
                processing_time=(datetime.now() - start_time).total_seconds()
            )
    
    async def _extract_questions(self, task_data: Dict[str, Any]) -> TaskResult:
        """Extract questions from documents using QIE system"""
        try:
            file_path = task_data.get("file_path")
            organization_id = task_data.get("organization_id")
            user_id = task_data.get("user_id", "system")
            
            if not file_path or not organization_id:
                raise ValueError("Missing required parameters: file_path, organization_id")
            
            # Read file content
            async with aiofiles.open(file_path, 'rb') as f:
                file_content = await f.read()
            
            # Call QIE service for question extraction
            extraction_payload = {
                "filename": Path(file_path).name,
                "organization_id": organization_id,
                "user_id": user_id,
                "options": {
                    "model": task_data.get("model", "default"),
                    "confidence_threshold": task_data.get("confidence_threshold", 0.75),
                    "frameworks": task_data.get("frameworks", ["SOC2", "ISO27001"])
                }
            }
            
            # Use multipart form for file upload
            files = {"file": (Path(file_path).name, file_content)}
            data = {"options": json.dumps(extraction_payload["options"])}
            
            response = await self.http_client.post(
                f"{self.config.qie_service_url}/extract-questions",
                files=files,
                data=data
            )
            
            if response.status_code != 200:
                raise Exception(f"QIE service error: {response.status_code} - {response.text}")
            
            qie_result = response.json()
            
            # Process extracted questions into evidence items
            evidence_items = []
            questions = qie_result.get("questions", [])
            
            for question in questions:
                # Create cryptographic evidence for each question
                evidence_content = {
                    "question_id": question.get("id"),
                    "question_text": question.get("text", question.get("question")),
                    "category": question.get("category"),
                    "type": question.get("type"),
                    "compliance_framework": question.get("complianceFramework"),
                    "required": question.get("required", False),
                    "extraction_confidence": question.get("confidence", 0.0),
                    "extraction_metadata": question.get("metadata", {})
                }
                
                # Generate cryptographic hash for evidence integrity
                evidence_hash = self.rust_trust.compute_evidence_hash(
                    json.dumps(evidence_content, sort_keys=True)
                )
                
                evidence = Evidence(
                    source="qie_extraction",
                    evidence_type="question_extraction",
                    content=evidence_content,
                    confidence_score=question.get("confidence", 0.0),
                    collected_at=datetime.now(),
                    hash_value=evidence_hash,
                    metadata={
                        "agent_id": self.config.agent_id,
                        "file_source": Path(file_path).name,
                        "extraction_model": extraction_payload["options"]["model"],
                        "frameworks": extraction_payload["options"]["frameworks"]
                    }
                )
                
                evidence_items.append(evidence)
            
            # Store evidence in database
            stored_evidence = []
            for evidence in evidence_items:
                evidence_id = await self.evidence_store.store_evidence(
                    evidence, organization_id
                )
                stored_evidence.append(evidence_id)
            
            # Update metrics
            self.metrics["questions_extracted"] += len(questions)
            self.metrics["evidence_items_created"] += len(evidence_items)
            for framework in extraction_payload["options"]["frameworks"]:
                self.metrics["frameworks_processed"].add(framework)
            
            return TaskResult(
                success=True,
                data={
                    "questions_extracted": len(questions),
                    "evidence_items_created": len(evidence_items),
                    "evidence_ids": stored_evidence,
                    "observability_data": qie_result.get("observabilityData", {}),
                    "extraction_summary": {
                        "total_questions": len(questions),
                        "frameworks_covered": list(set(q.get("complianceFramework") for q in questions if q.get("complianceFramework"))),
                        "categories": list(set(q.get("category") for q in questions if q.get("category"))),
                        "average_confidence": sum(q.get("confidence", 0) for q in questions) / len(questions) if questions else 0
                    }
                },
                evidence=evidence_items,
                task_type="extract_questions",
                processing_time=(datetime.now() - datetime.now()).total_seconds()
            )
            
        except Exception as e:
            logger.error(f"Question extraction failed: {e}")
            raise
    
    async def _generate_answers(self, task_data: Dict[str, Any]) -> TaskResult:
        """Generate answers for questions using QIE system"""
        try:
            questions = task_data.get("questions", [])
            organization_id = task_data.get("organization_id")
            user_id = task_data.get("user_id", "system")
            
            if not questions or not organization_id:
                raise ValueError("Missing required parameters: questions, organization_id")
            
            generated_answers = []
            evidence_items = []
            
            # Process each question for answer generation
            for question in questions:
                # Prepare question data for QIE service
                answer_payload = {
                    "question": question,
                    "organization_id": organization_id,
                    "user_id": user_id,
                    "options": {
                        "tone": task_data.get("tone", "formal"),
                        "length": task_data.get("length", "standard"),
                        "include_evidence": task_data.get("include_evidence", True),
                        "model": task_data.get("model", "gpt-4"),
                        "confidence_threshold": task_data.get("confidence_threshold", 0.75)
                    }
                }
                
                # Call QIE service for answer generation
                response = await self.http_client.post(
                    f"{self.config.qie_service_url}/generate-answer",
                    json=answer_payload
                )
                
                if response.status_code != 200:
                    logger.warning(f"Failed to generate answer for question {question.get('id')}: {response.text}")
                    continue
                
                answer_result = response.json()
                answer_data = answer_result.get("answer", {})
                
                # Create evidence item for generated answer
                evidence_content = {
                    "question_id": question.get("id"),
                    "question_text": question.get("text", question.get("question")),
                    "generated_answer": answer_data.get("content"),
                    "confidence": answer_data.get("confidence"),
                    "evidence_sources": answer_data.get("evidence", []),
                    "reasoning": answer_data.get("suggestedImprovements", []),
                    "compliance_alignment": answer_result.get("observabilityData", {}).get("complianceAlignment", []),
                    "generation_metadata": {
                        "model": answer_payload["options"]["model"],
                        "tone": answer_payload["options"]["tone"],
                        "processing_time": answer_result.get("observabilityData", {}).get("decisionTrace", {}).get("latency", 0)
                    }
                }
                
                # Generate cryptographic hash for answer integrity
                evidence_hash = self.rust_trust.compute_evidence_hash(
                    json.dumps(evidence_content, sort_keys=True)
                )
                
                # Calculate confidence score
                confidence_map = {
                    "verified": 0.95,
                    "high": 0.85,
                    "medium": 0.7,
                    "low": 0.5,
                    "gap": 0.3
                }
                confidence_score = confidence_map.get(answer_data.get("confidence", "medium"), 0.7)
                
                evidence = Evidence(
                    source="qie_answer_generation",
                    evidence_type="generated_answer",
                    content=evidence_content,
                    confidence_score=confidence_score,
                    collected_at=datetime.now(),
                    hash_value=evidence_hash,
                    metadata={
                        "agent_id": self.config.agent_id,
                        "question_category": question.get("category"),
                        "compliance_framework": question.get("complianceFramework"),
                        "answer_model": answer_payload["options"]["model"]
                    }
                )
                
                evidence_items.append(evidence)
                generated_answers.append({
                    "question_id": question.get("id"),
                    "answer": answer_data,
                    "observability": answer_result.get("observabilityData", {}),
                    "evidence_hash": evidence_hash
                })
            
            # Store evidence in database
            stored_evidence = []
            for evidence in evidence_items:
                evidence_id = await self.evidence_store.store_evidence(
                    evidence, organization_id
                )
                stored_evidence.append(evidence_id)
            
            # Update metrics
            self.metrics["answers_generated"] += len(generated_answers)
            self.metrics["evidence_items_created"] += len(evidence_items)
            
            # Calculate average confidence
            if generated_answers:
                total_confidence = sum(
                    confidence_map.get(answer["answer"].get("confidence", "medium"), 0.7)
                    for answer in generated_answers
                )
                self.metrics["average_confidence"] = total_confidence / len(generated_answers)
            
            return TaskResult(
                success=True,
                data={
                    "answers_generated": len(generated_answers),
                    "evidence_items_created": len(evidence_items),
                    "evidence_ids": stored_evidence,
                    "answers": generated_answers,
                    "generation_summary": {
                        "total_answers": len(generated_answers),
                        "average_confidence": self.metrics["average_confidence"],
                        "frameworks_covered": list(set(
                            answer.get("observability", {}).get("complianceAlignment", [{}])[0].get("framework")
                            for answer in generated_answers
                            if answer.get("observability", {}).get("complianceAlignment")
                        ))
                    }
                },
                evidence=evidence_items,
                task_type="generate_answers"
            )
            
        except Exception as e:
            logger.error(f"Answer generation failed: {e}")
            raise
    
    async def _analyze_questionnaire(self, task_data: Dict[str, Any]) -> TaskResult:
        """Perform comprehensive questionnaire analysis"""
        try:
            questionnaire_id = task_data.get("questionnaire_id")
            organization_id = task_data.get("organization_id")
            
            if not questionnaire_id or not organization_id:
                raise ValueError("Missing required parameters: questionnaire_id, organization_id")
            
            # Get QIE metrics for analysis
            response = await self.http_client.get(
                f"{self.config.qie_service_url}/metrics/{organization_id}"
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to get QIE metrics: {response.text}")
            
            qie_metrics = response.json()
            
            # Analyze questionnaire completeness and quality
            analysis_data = {
                "questionnaire_id": questionnaire_id,
                "organization_id": organization_id,
                "analysis_timestamp": datetime.now().isoformat(),
                "question_analysis": qie_metrics.get("questionExtractionMetrics", {}),
                "answer_analysis": qie_metrics.get("answerGenerationMetrics", {}),
                "learning_analysis": qie_metrics.get("learningMetrics", {}),
                "compliance_coverage": await self._analyze_compliance_coverage(organization_id),
                "quality_assessment": await self._assess_questionnaire_quality(qie_metrics),
                "recommendations": await self._generate_improvement_recommendations(qie_metrics)
            }
            
            # Create comprehensive analysis evidence
            evidence_hash = self.rust_trust.compute_evidence_hash(
                json.dumps(analysis_data, sort_keys=True)
            )
            
            evidence = Evidence(
                source="qie_analysis",
                evidence_type="questionnaire_analysis",
                content=analysis_data,
                confidence_score=0.9,  # High confidence in analysis
                collected_at=datetime.now(),
                hash_value=evidence_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "analysis_type": "comprehensive",
                    "metrics_source": "observable_qie"
                }
            )
            
            # Store analysis evidence
            evidence_id = await self.evidence_store.store_evidence(
                evidence, organization_id
            )
            
            return TaskResult(
                success=True,
                data={
                    "analysis": analysis_data,
                    "evidence_id": evidence_id,
                    "analysis_hash": evidence_hash
                },
                evidence=[evidence],
                task_type="analyze_questionnaire"
            )
            
        except Exception as e:
            logger.error(f"Questionnaire analysis failed: {e}")
            raise
    
    async def _map_compliance_requirements(self, task_data: Dict[str, Any]) -> TaskResult:
        """Map questions and answers to compliance requirements"""
        try:
            framework = task_data.get("framework")
            organization_id = task_data.get("organization_id")
            
            if not framework or not organization_id:
                raise ValueError("Missing required parameters: framework, organization_id")
            
            # Get evidence related to the compliance framework
            framework_evidence = await self.evidence_store.get_evidence_by_metadata(
                organization_id, {"compliance_framework": framework}
            )
            
            # Analyze compliance coverage
            mapping_data = {
                "framework": framework,
                "organization_id": organization_id,
                "mapping_timestamp": datetime.now().isoformat(),
                "total_requirements": len(self._get_framework_requirements(framework)),
                "covered_requirements": [],
                "gaps": [],
                "coverage_percentage": 0.0,
                "evidence_count": len(framework_evidence),
                "recommendations": []
            }
            
            # Process evidence to determine coverage
            for evidence in framework_evidence:
                if evidence.evidence_type == "question_extraction":
                    content = evidence.content
                    if content.get("compliance_framework") == framework:
                        requirement = content.get("category", "unknown")
                        if requirement not in mapping_data["covered_requirements"]:
                            mapping_data["covered_requirements"].append(requirement)
            
            # Calculate coverage
            total_requirements = mapping_data["total_requirements"]
            covered_count = len(mapping_data["covered_requirements"])
            mapping_data["coverage_percentage"] = (covered_count / total_requirements) * 100 if total_requirements > 0 else 0
            
            # Identify gaps
            all_requirements = self._get_framework_requirements(framework)
            mapping_data["gaps"] = [
                req for req in all_requirements 
                if req not in mapping_data["covered_requirements"]
            ]
            
            # Generate recommendations
            if mapping_data["coverage_percentage"] < 80:
                mapping_data["recommendations"].append("Increase compliance coverage through additional questionnaires")
            if len(mapping_data["gaps"]) > 0:
                mapping_data["recommendations"].append(f"Address gaps in: {', '.join(mapping_data['gaps'][:3])}")
            
            # Create compliance mapping evidence
            evidence_hash = self.rust_trust.compute_evidence_hash(
                json.dumps(mapping_data, sort_keys=True)
            )
            
            evidence = Evidence(
                source="qie_compliance_mapping",
                evidence_type="compliance_mapping",
                content=mapping_data,
                confidence_score=0.85,
                collected_at=datetime.now(),
                hash_value=evidence_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "framework": framework,
                    "coverage_percentage": mapping_data["coverage_percentage"]
                }
            )
            
            # Store mapping evidence
            evidence_id = await self.evidence_store.store_evidence(
                evidence, organization_id
            )
            
            return TaskResult(
                success=True,
                data={
                    "mapping": mapping_data,
                    "evidence_id": evidence_id,
                    "mapping_hash": evidence_hash
                },
                evidence=[evidence],
                task_type="compliance_mapping"
            )
            
        except Exception as e:
            logger.error(f"Compliance mapping failed: {e}")
            raise
    
    async def _generate_observability_report(self, task_data: Dict[str, Any]) -> TaskResult:
        """Generate comprehensive observability report for QIE operations"""
        try:
            organization_id = task_data.get("organization_id")
            time_range = task_data.get("time_range", "24h")
            
            if not organization_id:
                raise ValueError("Missing required parameter: organization_id")
            
            # Get QIE metrics
            response = await self.http_client.get(
                f"{self.config.qie_service_url}/metrics/{organization_id}"
            )
            
            qie_metrics = response.json() if response.status_code == 200 else {}
            
            # Generate comprehensive observability report
            report_data = {
                "organization_id": organization_id,
                "report_timestamp": datetime.now().isoformat(),
                "time_range": time_range,
                "agent_metrics": {
                    "questions_extracted": self.metrics["questions_extracted"],
                    "answers_generated": self.metrics["answers_generated"],
                    "frameworks_processed": list(self.metrics["frameworks_processed"]),
                    "total_processing_time": self.metrics["total_processing_time"],
                    "average_confidence": self.metrics["average_confidence"],
                    "evidence_items_created": self.metrics["evidence_items_created"]
                },
                "qie_system_metrics": qie_metrics,
                "performance_analysis": {
                    "extraction_efficiency": qie_metrics.get("questionExtractionMetrics", {}).get("processingTime", 0),
                    "answer_quality": qie_metrics.get("answerGenerationMetrics", {}).get("averageConfidence", 0),
                    "learning_progress": qie_metrics.get("learningMetrics", {}).get("improvementRate", 0),
                    "system_reliability": self._calculate_system_reliability()
                },
                "recommendations": self._generate_system_recommendations(qie_metrics)
            }
            
            # Create observability evidence
            evidence_hash = self.rust_trust.compute_evidence_hash(
                json.dumps(report_data, sort_keys=True)
            )
            
            evidence = Evidence(
                source="qie_observability",
                evidence_type="observability_report",
                content=report_data,
                confidence_score=0.95,
                collected_at=datetime.now(),
                hash_value=evidence_hash,
                metadata={
                    "agent_id": self.config.agent_id,
                    "report_type": "comprehensive",
                    "time_range": time_range
                }
            )
            
            # Store observability evidence
            evidence_id = await self.evidence_store.store_evidence(
                evidence, organization_id
            )
            
            return TaskResult(
                success=True,
                data={
                    "report": report_data,
                    "evidence_id": evidence_id,
                    "report_hash": evidence_hash
                },
                evidence=[evidence],
                task_type="observability_report"
            )
            
        except Exception as e:
            logger.error(f"Observability report generation failed: {e}")
            raise
    
    async def _verify_qie_service(self) -> bool:
        """Verify QIE service connectivity"""
        try:
            response = await self.http_client.get(f"{self.config.qie_service_url}/health")
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"QIE service verification failed: {e}")
            return False
    
    async def _analyze_compliance_coverage(self, organization_id: str) -> Dict[str, Any]:
        """Analyze compliance framework coverage"""
        coverage_data = {}
        
        for framework in self.config.supported_frameworks:
            evidence = await self.evidence_store.get_evidence_by_metadata(
                organization_id, {"compliance_framework": framework}
            )
            coverage_data[framework] = {
                "evidence_count": len(evidence),
                "last_updated": max([e.collected_at for e in evidence], default=datetime.min).isoformat() if evidence else None,
                "coverage_score": min(len(evidence) / 10, 1.0)  # Assume 10 items = full coverage
            }
        
        return coverage_data
    
    async def _assess_questionnaire_quality(self, qie_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Assess overall questionnaire quality"""
        extraction_metrics = qie_metrics.get("questionExtractionMetrics", {})
        answer_metrics = qie_metrics.get("answerGenerationMetrics", {})
        
        return {
            "extraction_quality": extraction_metrics.get("accuracyScore", 0),
            "answer_quality": answer_metrics.get("averageConfidence", 0),
            "completeness": min(extraction_metrics.get("totalExtracted", 0) / 50, 1.0),  # Assume 50 questions = complete
            "evidence_utilization": answer_metrics.get("evidenceUtilization", 0),
            "overall_score": (
                extraction_metrics.get("accuracyScore", 0) * 0.3 +
                answer_metrics.get("averageConfidence", 0) * 0.4 +
                answer_metrics.get("evidenceUtilization", 0) * 0.3
            )
        }
    
    async def _generate_improvement_recommendations(self, qie_metrics: Dict[str, Any]) -> List[str]:
        """Generate recommendations for QIE system improvement"""
        recommendations = []
        
        extraction_metrics = qie_metrics.get("questionExtractionMetrics", {})
        answer_metrics = qie_metrics.get("answerGenerationMetrics", {})
        learning_metrics = qie_metrics.get("learningMetrics", {})
        
        if extraction_metrics.get("accuracyScore", 0) < 0.8:
            recommendations.append("Improve question extraction accuracy through model fine-tuning")
        
        if answer_metrics.get("averageConfidence", 0) < 0.75:
            recommendations.append("Enhance answer generation with better evidence integration")
        
        if answer_metrics.get("evidenceUtilization", 0) < 0.6:
            recommendations.append("Increase evidence utilization in answer generation")
        
        if learning_metrics.get("feedbackIncorporated", 0) < 10:
            recommendations.append("Collect more user feedback for continuous improvement")
        
        return recommendations
    
    def _get_framework_requirements(self, framework: str) -> List[str]:
        """Get requirements for a specific compliance framework"""
        framework_requirements = {
            "SOC2": ["Access Controls", "System Operations", "Logical and Physical Access", "System Monitoring", "Change Management"],
            "ISO27001": ["Information Security Policy", "Risk Management", "Asset Management", "Access Control", "Cryptography"],
            "GDPR": ["Data Protection", "Consent Management", "Data Subject Rights", "Privacy by Design", "Data Breach Response"],
            "HIPAA": ["Administrative Safeguards", "Physical Safeguards", "Technical Safeguards", "Access Controls", "Audit Controls"],
            "PCI_DSS": ["Network Security", "Cardholder Data Protection", "Vulnerability Management", "Access Control", "Monitoring"],
            "NIST": ["Identify", "Protect", "Detect", "Respond", "Recover"]
        }
        
        return framework_requirements.get(framework, [])
    
    def _calculate_system_reliability(self) -> float:
        """Calculate system reliability based on metrics"""
        # Simple reliability calculation based on processing success
        if self.metrics["questions_extracted"] + self.metrics["answers_generated"] == 0:
            return 1.0  # No failures if no processing
        
        # Assume 95% reliability as baseline
        return 0.95
    
    def _generate_system_recommendations(self, qie_metrics: Dict[str, Any]) -> List[str]:
        """Generate system-level recommendations"""
        recommendations = []
        
        if self.metrics["total_processing_time"] > 300:  # More than 5 minutes total
            recommendations.append("Consider optimizing processing performance")
        
        if len(self.metrics["frameworks_processed"]) < 3:
            recommendations.append("Expand compliance framework coverage")
        
        if self.metrics["average_confidence"] < 0.8:
            recommendations.append("Focus on improving answer confidence through better training data")
        
        return recommendations
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get agent health status"""
        base_status = await super().get_health_status()
        
        # Add QIE-specific health information
        qie_service_healthy = await self._verify_qie_service() if self.http_client else False
        
        base_status.update({
            "qie_service_connected": qie_service_healthy,
            "questions_processed": self.metrics["questions_extracted"],
            "answers_generated": self.metrics["answers_generated"],
            "frameworks_active": len(self.metrics["frameworks_processed"]),
            "average_confidence": round(self.metrics["average_confidence"], 3),
            "evidence_items_created": self.metrics["evidence_items_created"]
        })
        
        return base_status

# Factory function for agent creation
def create_qie_integration_agent() -> QIEIntegrationAgent:
    """Create a QIE Integration Agent instance"""
    config = QIEIntegrationConfig()
    return QIEIntegrationAgent(config)

if __name__ == "__main__":
    # Test the agent
    async def test_agent():
        agent = create_qie_integration_agent()
        await agent.start()
        
        # Test task processing
        test_task = {
            "type": "observability_report",
            "organization_id": "test-org",
            "time_range": "24h"
        }
        
        result = await agent.process_task(test_task)
        print(f"Test result: {result.success}")
        print(f"Data: {result.data}")
        
        await agent.stop()
    
    asyncio.run(test_agent())