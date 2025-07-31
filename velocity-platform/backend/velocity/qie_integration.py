"""
QIE (Questionnaire Intelligence Engine) Integration for Velocity AI Platform
Handles questionnaire upload, processing, and results management
"""

import os
import json
import uuid
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timezone, timedelta
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
import logging
import tempfile
import shutil

from models import (
    Framework, Organization, User, Agent, EvidenceItem,
    AgentStatus, EvidenceStatus, EvidenceType, Base
)
from database import SessionLocal
from validation import VelocityException
from compliance_questionnaire import ComplianceQuestionnaire

logger = logging.getLogger(__name__)

# QIE Configuration
QIE_CONFIG = {
    "supported_formats": ["pdf", "docx", "xlsx", "csv", "json"],
    "max_file_size": 50 * 1024 * 1024,  # 50MB
    "processing_timeout": 300,  # 5 minutes
    "auto_save_interval": 30,  # seconds
    "frameworks": {
        Framework.SOC2: {
            "question_patterns": [
                r"access\s+control",
                r"data\s+encryption",
                r"backup\s+procedures",
                r"incident\s+response",
                r"vulnerability\s+management"
            ],
            "control_mapping": {
                "access_control": ["CC6.1", "CC6.2", "CC6.3"],
                "encryption": ["CC6.7", "CC6.8"],
                "backup": ["A1.2", "A1.3"],
                "incident_response": ["CC7.1", "CC7.2"],
                "vulnerability": ["CC7.3", "CC7.4"]
            }
        },
        Framework.ISO27001: {
            "question_patterns": [
                r"information\s+security\s+policy",
                r"risk\s+assessment",
                r"asset\s+management",
                r"physical\s+security",
                r"business\s+continuity"
            ],
            "control_mapping": {
                "security_policy": ["A.5.1.1", "A.5.1.2"],
                "risk_assessment": ["A.6.1.1", "A.6.1.2"],
                "asset_management": ["A.8.1.1", "A.8.1.2"],
                "physical_security": ["A.11.1.1", "A.11.1.2"],
                "business_continuity": ["A.17.1.1", "A.17.1.2"]
            }
        },
        Framework.GDPR: {
            "question_patterns": [
                r"data\s+protection",
                r"consent\s+management",
                r"data\s+subject\s+rights",
                r"privacy\s+notice",
                r"data\s+breach"
            ],
            "control_mapping": {
                "data_protection": ["Art.5", "Art.6"],
                "consent": ["Art.7", "Art.8"],
                "subject_rights": ["Art.12", "Art.13", "Art.14"],
                "privacy_notice": ["Art.13", "Art.14"],
                "breach": ["Art.33", "Art.34"]
            }
        },
        Framework.HIPAA: {
            "question_patterns": [
                r"administrative\s+safeguards",
                r"physical\s+safeguards",
                r"technical\s+safeguards",
                r"breach\s+notification",
                r"business\s+associate"
            ],
            "control_mapping": {
                "administrative": ["164.308(a)(1)", "164.308(a)(2)"],
                "physical": ["164.310(a)(1)", "164.310(a)(2)"],
                "technical": ["164.312(a)(1)", "164.312(a)(2)"],
                "breach": ["164.400", "164.404"],
                "business_associate": ["164.502(e)", "164.504(e)"]
            }
        },
        Framework.CIS_CONTROLS: {
            "question_patterns": [
                r"inventory\s+management",
                r"software\s+management",
                r"configuration\s+management",
                r"vulnerability\s+management",
                r"access\s+control"
            ],
            "control_mapping": {
                "inventory": ["CIS-1.1", "CIS-1.2"],
                "software": ["CIS-2.1", "CIS-2.2"],
                "configuration": ["CIS-4.1", "CIS-4.2"],
                "vulnerability": ["CIS-7.1", "CIS-7.2"],
                "access": ["CIS-5.1", "CIS-5.2"]
            }
        }
    }
}

class QuestionnaireProcessor:
    """Handles questionnaire processing and analysis"""
    
    def __init__(self):
        self.compliance_qie = ComplianceQuestionnaire()
        self.upload_dir = Path("uploads/questionnaires")
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        
    async def upload_questionnaire(
        self,
        file_content: bytes,
        filename: str,
        user_id: str,
        organization_id: str,
        file_format: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Upload and validate a questionnaire file"""
        try:
            # Validate file format
            if file_format.lower() not in QIE_CONFIG["supported_formats"]:
                raise VelocityException(f"Unsupported file format: {file_format}")
            
            # Validate file size
            if len(file_content) > QIE_CONFIG["max_file_size"]:
                raise VelocityException("File size exceeds maximum limit (50MB)")
            
            # Generate unique filename
            questionnaire_id = str(uuid.uuid4())
            file_extension = filename.split('.')[-1] if '.' in filename else file_format
            stored_filename = f"{questionnaire_id}.{file_extension}"
            file_path = self.upload_dir / stored_filename
            
            # Save file
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            # Extract basic information
            question_count = await self._extract_question_count(file_path, file_format)
            detected_frameworks = await self._detect_frameworks(file_path, file_format)
            
            # Create questionnaire record
            questionnaire_data = {
                "id": questionnaire_id,
                "original_filename": filename,
                "stored_filename": stored_filename,
                "file_path": str(file_path),
                "file_format": file_format,
                "file_size": len(file_content),
                "user_id": user_id,
                "organization_id": organization_id,
                "status": "uploaded",
                "question_count": question_count,
                "detected_frameworks": detected_frameworks,
                "metadata": metadata or {},
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
                "processing_status": "pending"
            }
            
            # Store in database or cache (implement based on your storage strategy)
            await self._store_questionnaire_metadata(questionnaire_data)
            
            logger.info(f"Questionnaire uploaded successfully: {questionnaire_id}")
            
            return {
                "questionnaire_id": questionnaire_id,
                "status": "uploaded",
                "filename": filename,
                "file_size": len(file_content),
                "question_count": question_count,
                "detected_frameworks": detected_frameworks,
                "message": "Questionnaire uploaded successfully"
            }
            
        except Exception as e:
            logger.error(f"Error uploading questionnaire: {e}")
            raise VelocityException(f"Failed to upload questionnaire: {str(e)}")
    
    async def process_questionnaire(
        self,
        questionnaire_id: str,
        frameworks: Optional[List[Framework]] = None,
        auto_fill: bool = True,
        confidence_threshold: float = 0.8
    ) -> Dict[str, Any]:
        """Process questionnaire with AI assistance"""
        try:
            # Get questionnaire metadata
            questionnaire_data = await self._get_questionnaire_metadata(questionnaire_id)
            if not questionnaire_data:
                raise VelocityException(f"Questionnaire not found: {questionnaire_id}")
            
            # Update processing status
            await self._update_processing_status(questionnaire_id, "processing")
            
            file_path = Path(questionnaire_data["file_path"])
            if not file_path.exists():
                raise VelocityException(f"Questionnaire file not found: {file_path}")
            
            # Use detected frameworks if none specified
            if not frameworks:
                frameworks = [Framework(fw) for fw in questionnaire_data.get("detected_frameworks", [])]
            
            if not frameworks:
                frameworks = [Framework.SOC2]  # Default to SOC2
            
            # Process with QIE
            processing_results = []
            
            for framework in frameworks:
                logger.info(f"Processing questionnaire for {framework.value}")
                
                try:
                    # Load questionnaire content
                    questionnaire_content = await self._load_questionnaire_content(
                        file_path, 
                        questionnaire_data["file_format"]
                    )
                    
                    # Process with compliance QIE
                    result = await self.compliance_qie.process_comprehensive_questionnaire(
                        questionnaire_content,
                        framework,
                        auto_fill=auto_fill
                    )
                    
                    # Enhance with framework-specific analysis
                    enhanced_result = await self._enhance_with_framework_analysis(
                        result,
                        framework,
                        questionnaire_content,
                        confidence_threshold
                    )
                    
                    processing_results.append({
                        "framework": framework.value,
                        "status": "completed",
                        "result": enhanced_result
                    })
                    
                except Exception as framework_error:
                    logger.error(f"Error processing {framework.value}: {framework_error}")
                    processing_results.append({
                        "framework": framework.value,
                        "status": "failed",
                        "error": str(framework_error)
                    })
            
            # Calculate overall results
            successful_results = [r for r in processing_results if r["status"] == "completed"]
            overall_compliance_score = 0
            
            if successful_results:
                scores = [r["result"].get("compliance_score", 0) for r in successful_results]
                overall_compliance_score = sum(scores) / len(scores)
            
            # Update questionnaire status
            final_result = {
                "questionnaire_id": questionnaire_id,
                "status": "completed" if successful_results else "failed",
                "processing_duration": "estimated_duration_here",  # Implement timing
                "overall_compliance_score": round(overall_compliance_score, 2),
                "frameworks_processed": len(successful_results),
                "total_frameworks": len(frameworks),
                "results": processing_results,
                "processed_at": datetime.now(timezone.utc).isoformat()
            }
            
            await self._store_processing_results(questionnaire_id, final_result)
            await self._update_processing_status(questionnaire_id, "completed")
            
            logger.info(f"Questionnaire processing completed: {questionnaire_id}")
            
            return final_result
            
        except Exception as e:
            logger.error(f"Error processing questionnaire: {e}")
            await self._update_processing_status(questionnaire_id, "failed", str(e))
            raise VelocityException(f"Failed to process questionnaire: {str(e)}")
    
    async def get_questionnaire_results(
        self,
        questionnaire_id: str,
        framework: Optional[Framework] = None
    ) -> Dict[str, Any]:
        """Get processing results for a questionnaire"""
        try:
            # Get questionnaire metadata
            questionnaire_data = await self._get_questionnaire_metadata(questionnaire_id)
            if not questionnaire_data:
                raise VelocityException(f"Questionnaire not found: {questionnaire_id}")
            
            # Get processing results
            results = await self._get_processing_results(questionnaire_id)
            if not results:
                return {
                    "questionnaire_id": questionnaire_id,
                    "status": questionnaire_data.get("processing_status", "pending"),
                    "message": "Processing results not available yet"
                }
            
            # Filter by framework if specified
            if framework:
                framework_results = [
                    r for r in results.get("results", []) 
                    if r.get("framework") == framework.value
                ]
                if framework_results:
                    return {
                        "questionnaire_id": questionnaire_id,
                        "framework": framework.value,
                        "result": framework_results[0]["result"]
                    }
                else:
                    raise VelocityException(f"No results found for framework: {framework.value}")
            
            return results
            
        except Exception as e:
            logger.error(f"Error getting questionnaire results: {e}")
            raise VelocityException(f"Failed to get questionnaire results: {str(e)}")
    
    async def list_questionnaires(
        self,
        organization_id: str,
        status: Optional[str] = None,
        framework: Optional[Framework] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        """List questionnaires for an organization"""
        try:
            # Get questionnaires from storage
            questionnaires = await self._list_questionnaires_from_storage(
                organization_id, status, framework, limit, offset
            )
            
            return {
                "questionnaires": questionnaires,
                "total": len(questionnaires),
                "limit": limit,
                "offset": offset
            }
            
        except Exception as e:
            logger.error(f"Error listing questionnaires: {e}")
            raise VelocityException(f"Failed to list questionnaires: {str(e)}")
    
    async def delete_questionnaire(
        self,
        questionnaire_id: str,
        user_id: str
    ) -> Dict[str, Any]:
        """Delete a questionnaire and its results"""
        try:
            # Get questionnaire metadata
            questionnaire_data = await self._get_questionnaire_metadata(questionnaire_id)
            if not questionnaire_data:
                raise VelocityException(f"Questionnaire not found: {questionnaire_id}")
            
            # Check permissions (implement based on your auth system)
            if questionnaire_data.get("user_id") != user_id:
                # Check if user has admin permissions
                pass  # Implement permission check
            
            # Delete file
            file_path = Path(questionnaire_data["file_path"])
            if file_path.exists():
                file_path.unlink()
            
            # Delete metadata and results
            await self._delete_questionnaire_data(questionnaire_id)
            
            logger.info(f"Questionnaire deleted: {questionnaire_id}")
            
            return {
                "questionnaire_id": questionnaire_id,
                "status": "deleted",
                "message": "Questionnaire deleted successfully"
            }
            
        except Exception as e:
            logger.error(f"Error deleting questionnaire: {e}")
            raise VelocityException(f"Failed to delete questionnaire: {str(e)}")
    
    # Helper methods
    async def _extract_question_count(self, file_path: Path, file_format: str) -> int:
        """Extract question count from questionnaire file"""
        try:
            if file_format.lower() == 'pdf':
                # Implement PDF parsing
                return 50  # Placeholder
            elif file_format.lower() in ['xlsx', 'csv']:
                # Implement Excel/CSV parsing
                return 30  # Placeholder
            elif file_format.lower() == 'docx':
                # Implement Word document parsing
                return 40  # Placeholder
            else:
                return 0
        except Exception as e:
            logger.warning(f"Could not extract question count: {e}")
            return 0
    
    async def _detect_frameworks(self, file_path: Path, file_format: str) -> List[str]:
        """Detect compliance frameworks from questionnaire content"""
        try:
            content = await self._load_questionnaire_content(file_path, file_format)
            detected = []
            
            # Simple pattern matching for framework detection
            content_lower = content.lower()
            
            if any(pattern in content_lower for pattern in ['soc 2', 'soc2', 'service organization control']):
                detected.append(Framework.SOC2.value)
            
            if any(pattern in content_lower for pattern in ['iso 27001', 'iso27001', 'information security management']):
                detected.append(Framework.ISO27001.value)
            
            if any(pattern in content_lower for pattern in ['gdpr', 'general data protection', 'data protection regulation']):
                detected.append(Framework.GDPR.value)
            
            if any(pattern in content_lower for pattern in ['hipaa', 'health insurance portability']):
                detected.append(Framework.HIPAA.value)
            
            if any(pattern in content_lower for pattern in ['cis controls', 'center for internet security']):
                detected.append(Framework.CIS_CONTROLS.value)
            
            return detected if detected else [Framework.SOC2.value]  # Default to SOC2
            
        except Exception as e:
            logger.warning(f"Could not detect frameworks: {e}")
            return [Framework.SOC2.value]
    
    async def _load_questionnaire_content(self, file_path: Path, file_format: str) -> str:
        """Load questionnaire content from file"""
        try:
            if file_format.lower() == 'txt':
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            elif file_format.lower() == 'json':
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return json.dumps(data, indent=2)
            else:
                # For other formats, return basic text extraction
                # Implement proper parsing for PDF, DOCX, XLSX
                return f"Content from {file_format} file: {file_path.name}"
        except Exception as e:
            logger.error(f"Error loading questionnaire content: {e}")
            return ""
    
    async def _enhance_with_framework_analysis(
        self,
        result: Dict[str, Any],
        framework: Framework,
        content: str,
        confidence_threshold: float
    ) -> Dict[str, Any]:
        """Enhance results with framework-specific analysis"""
        try:
            framework_config = QIE_CONFIG["frameworks"].get(framework, {})
            
            # Add framework-specific enhancements
            enhanced_result = result.copy()
            enhanced_result.update({
                "framework_analysis": {
                    "control_coverage": await self._analyze_control_coverage(content, framework),
                    "gap_analysis": await self._perform_gap_analysis(result, framework),
                    "recommendations": await self._generate_recommendations(result, framework),
                    "confidence_scores": await self._calculate_confidence_scores(result, confidence_threshold)
                }
            })
            
            return enhanced_result
            
        except Exception as e:
            logger.error(f"Error enhancing framework analysis: {e}")
            return result
    
    async def _analyze_control_coverage(self, content: str, framework: Framework) -> Dict[str, Any]:
        """Analyze control coverage for the framework"""
        # Implement control coverage analysis
        return {
            "total_controls": 100,
            "covered_controls": 75,
            "coverage_percentage": 75.0
        }
    
    async def _perform_gap_analysis(self, result: Dict[str, Any], framework: Framework) -> List[Dict[str, Any]]:
        """Perform gap analysis for the framework"""
        # Implement gap analysis
        return [
            {
                "control_id": "CC6.1",
                "gap_type": "missing_evidence",
                "severity": "high",
                "description": "Access control procedures not documented"
            }
        ]
    
    async def _generate_recommendations(self, result: Dict[str, Any], framework: Framework) -> List[Dict[str, Any]]:
        """Generate recommendations based on results"""
        # Implement recommendation generation
        return [
            {
                "priority": "high",
                "category": "access_control",
                "recommendation": "Implement multi-factor authentication",
                "effort": "medium",
                "timeline": "2-4 weeks"
            }
        ]
    
    async def _calculate_confidence_scores(self, result: Dict[str, Any], threshold: float) -> Dict[str, float]:
        """Calculate confidence scores for different aspects"""
        # Implement confidence scoring
        return {
            "overall": 0.85,
            "control_mapping": 0.90,
            "gap_analysis": 0.80,
            "recommendations": 0.75
        }
    
    # Storage methods (implement based on your storage strategy)
    async def _store_questionnaire_metadata(self, data: Dict[str, Any]):
        """Store questionnaire metadata"""
        # Implement storage (database, Redis, etc.)
        pass
    
    async def _get_questionnaire_metadata(self, questionnaire_id: str) -> Optional[Dict[str, Any]]:
        """Get questionnaire metadata"""
        # Implement retrieval
        return None
    
    async def _update_processing_status(self, questionnaire_id: str, status: str, error: Optional[str] = None):
        """Update processing status"""
        # Implement status update
        pass
    
    async def _store_processing_results(self, questionnaire_id: str, results: Dict[str, Any]):
        """Store processing results"""
        # Implement results storage
        pass
    
    async def _get_processing_results(self, questionnaire_id: str) -> Optional[Dict[str, Any]]:
        """Get processing results"""
        # Implement results retrieval
        return None
    
    async def _list_questionnaires_from_storage(
        self,
        organization_id: str,
        status: Optional[str],
        framework: Optional[Framework],
        limit: int,
        offset: int
    ) -> List[Dict[str, Any]]:
        """List questionnaires from storage"""
        # Implement questionnaire listing
        return []
    
    async def _delete_questionnaire_data(self, questionnaire_id: str):
        """Delete questionnaire data from storage"""
        # Implement data deletion
        pass

# Global instance
questionnaire_processor = QuestionnaireProcessor()