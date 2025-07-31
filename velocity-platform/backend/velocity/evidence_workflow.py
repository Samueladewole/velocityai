"""
Evidence Workflow Management for Velocity AI Platform
Handles evidence upload, approval workflow, and expiration tracking
"""

import os
import uuid
import json
import shutil
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timezone, timedelta
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
import logging
from enum import Enum

from models import (
    Framework, Organization, User, Agent, EvidenceItem, TrustScore,
    AgentStatus, EvidenceStatus, EvidenceType, Base
)
from database import SessionLocal
from validation import VelocityException

logger = logging.getLogger(__name__)

class WorkflowStatus(Enum):
    """Evidence workflow status"""
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    REQUIRES_REVISION = "requires_revision"
    EXPIRED = "expired"

class EvidenceCategory(Enum):
    """Evidence categories for organization"""
    POLICY = "policy"
    PROCEDURE = "procedure"
    SCREENSHOT = "screenshot"
    LOG_FILE = "log_file"
    CONFIGURATION = "configuration"
    CERTIFICATE = "certificate"
    REPORT = "report"
    TRAINING_RECORD = "training_record"
    AUDIT_REPORT = "audit_report"
    RISK_ASSESSMENT = "risk_assessment"

# Evidence Configuration
EVIDENCE_CONFIG = {
    "max_file_size": 100 * 1024 * 1024,  # 100MB
    "allowed_extensions": [
        ".pdf", ".docx", ".xlsx", ".png", ".jpg", ".jpeg", ".txt", ".csv", 
        ".json", ".xml", ".log", ".zip", ".tar.gz"
    ],
    "retention_periods": {
        EvidenceCategory.POLICY: 1095,  # 3 years
        EvidenceCategory.PROCEDURE: 1095,  # 3 years
        EvidenceCategory.SCREENSHOT: 365,  # 1 year
        EvidenceCategory.LOG_FILE: 2555,  # 7 years
        EvidenceCategory.CONFIGURATION: 730,  # 2 years
        EvidenceCategory.CERTIFICATE: 1095,  # 3 years
        EvidenceCategory.REPORT: 2555,  # 7 years
        EvidenceCategory.TRAINING_RECORD: 2555,  # 7 years
        EvidenceCategory.AUDIT_REPORT: 2555,  # 7 years
        EvidenceCategory.RISK_ASSESSMENT: 1095,  # 3 years
    },
    "approval_requirements": {
        EvidenceCategory.POLICY: ["compliance_officer", "legal_review"],
        EvidenceCategory.PROCEDURE: ["compliance_officer"],
        EvidenceCategory.SCREENSHOT: ["auto_approve"],
        EvidenceCategory.LOG_FILE: ["auto_approve"],
        EvidenceCategory.CONFIGURATION: ["security_analyst"],
        EvidenceCategory.CERTIFICATE: ["compliance_officer"],
        EvidenceCategory.REPORT: ["compliance_officer"],
        EvidenceCategory.TRAINING_RECORD: ["hr_representative"],
        EvidenceCategory.AUDIT_REPORT: ["compliance_officer", "audit_committee"],
        EvidenceCategory.RISK_ASSESSMENT: ["risk_manager", "compliance_officer"],
    }
}

class EvidenceWorkflowManager:
    """Manages evidence workflow, approval, and lifecycle"""
    
    def __init__(self):
        self.upload_dir = Path("uploads/evidence")
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.config = EVIDENCE_CONFIG
        
    async def upload_evidence(
        self,
        db: Session,
        file_content: bytes,
        filename: str,
        user_id: str,
        organization_id: str,
        framework: Framework,
        control_id: str,
        evidence_type: EvidenceType,
        evidence_category: EvidenceCategory,
        description: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Upload evidence file and create workflow entry"""
        try:
            # Validate file
            file_extension = Path(filename).suffix.lower()
            if file_extension not in self.config["allowed_extensions"]:
                raise VelocityException(f"File type not allowed: {file_extension}")
            
            if len(file_content) > self.config["max_file_size"]:
                raise VelocityException("File size exceeds maximum limit (100MB)")
            
            # Generate unique filename and evidence ID
            evidence_id = str(uuid.uuid4())
            stored_filename = f"{evidence_id}_{filename}"
            file_path = self.upload_dir / stored_filename
            
            # Save file
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            # Calculate retention period
            retention_days = self.config["retention_periods"].get(
                evidence_category, 
                365
            )
            expires_at = datetime.now(timezone.utc) + timedelta(days=retention_days)
            
            # Create evidence item in database
            evidence_item = EvidenceItem(
                id=evidence_id,
                control_id=control_id,
                framework=framework,
                evidence_type=evidence_type,
                status=EvidenceStatus.PENDING,
                data={
                    "filename": filename,
                    "stored_filename": stored_filename,
                    "file_path": str(file_path),
                    "file_size": len(file_content),
                    "evidence_category": evidence_category.value,
                    "workflow_status": WorkflowStatus.SUBMITTED.value,
                    "description": description or "",
                    "metadata": metadata or {}
                },
                evidence_metadata={
                    "uploaded_by": user_id,
                    "upload_timestamp": datetime.now(timezone.utc).isoformat(),
                    "file_hash": self._calculate_file_hash(file_content),
                    "approval_requirements": self.config["approval_requirements"].get(
                        evidence_category, ["compliance_officer"]
                    )
                },
                confidence_score=0.8,  # Initial confidence
                organization_id=organization_id,
                collected_by=f"user_{user_id}",
                expires_at=expires_at
            )
            
            db.add(evidence_item)
            db.commit()
            
            # Initialize approval workflow
            workflow_result = await self._initialize_approval_workflow(
                db, evidence_id, evidence_category, user_id
            )
            
            logger.info(f"Evidence uploaded successfully: {evidence_id}")
            
            return {
                "evidence_id": evidence_id,
                "filename": filename,
                "file_size": len(file_content),
                "status": EvidenceStatus.PENDING.value,
                "workflow_status": WorkflowStatus.SUBMITTED.value,
                "control_id": control_id,
                "framework": framework.value,
                "expires_at": expires_at.isoformat(),
                "workflow_info": workflow_result,
                "message": "Evidence uploaded and submitted for review"
            }
            
        except Exception as e:
            logger.error(f"Error uploading evidence: {e}")
            # Clean up file if it was created
            if 'file_path' in locals() and Path(file_path).exists():
                Path(file_path).unlink()
            raise VelocityException(f"Failed to upload evidence: {str(e)}")
    
    async def approve_evidence(
        self,
        db: Session,
        evidence_id: str,
        approver_id: str,
        approval_notes: Optional[str] = None,
        confidence_adjustment: Optional[float] = None
    ) -> Dict[str, Any]:
        """Approve evidence item"""
        try:
            evidence = db.query(EvidenceItem).filter(EvidenceItem.id == evidence_id).first()
            if not evidence:
                raise VelocityException(f"Evidence not found: {evidence_id}")
            
            # Check if evidence is in correct status for approval
            current_workflow_status = evidence.data.get("workflow_status")
            if current_workflow_status not in [WorkflowStatus.SUBMITTED.value, WorkflowStatus.UNDER_REVIEW.value]:
                raise VelocityException(f"Evidence cannot be approved in current status: {current_workflow_status}")
            
            # Update evidence status
            evidence.status = EvidenceStatus.VERIFIED
            evidence.data["workflow_status"] = WorkflowStatus.APPROVED.value
            evidence.data["approved_by"] = approver_id
            evidence.data["approved_at"] = datetime.now(timezone.utc).isoformat()
            evidence.data["approval_notes"] = approval_notes or ""
            
            # Adjust confidence score if provided
            if confidence_adjustment is not None:
                evidence.confidence_score = max(0.0, min(1.0, confidence_adjustment))
            else:
                # Increase confidence score for approved evidence
                evidence.confidence_score = min(1.0, evidence.confidence_score + 0.1)
            
            # Update evidence metadata
            if not evidence.evidence_metadata:
                evidence.evidence_metadata = {}
            evidence.evidence_metadata["approval_history"] = evidence.evidence_metadata.get("approval_history", [])
            evidence.evidence_metadata["approval_history"].append({
                "approver_id": approver_id,
                "approved_at": datetime.now(timezone.utc).isoformat(),
                "notes": approval_notes,
                "confidence_score": evidence.confidence_score
            })
            
            db.commit()
            
            # Update trust score
            await self._update_trust_score(db, evidence.organization_id, evidence.framework)
            
            logger.info(f"Evidence approved: {evidence_id} by {approver_id}")
            
            return {
                "evidence_id": evidence_id,
                "status": EvidenceStatus.VERIFIED.value,
                "workflow_status": WorkflowStatus.APPROVED.value,
                "approved_by": approver_id,
                "approved_at": evidence.data["approved_at"],
                "confidence_score": evidence.confidence_score,
                "message": "Evidence approved successfully"
            }
            
        except Exception as e:
            logger.error(f"Error approving evidence: {e}")
            raise VelocityException(f"Failed to approve evidence: {str(e)}")
    
    async def reject_evidence(
        self,
        db: Session,
        evidence_id: str,
        reviewer_id: str,
        rejection_reason: str,
        requires_revision: bool = False
    ) -> Dict[str, Any]:
        """Reject evidence item"""
        try:
            evidence = db.query(EvidenceItem).filter(EvidenceItem.id == evidence_id).first()
            if not evidence:
                raise VelocityException(f"Evidence not found: {evidence_id}")
            
            # Update evidence status
            if requires_revision:
                evidence.status = EvidenceStatus.PENDING
                workflow_status = WorkflowStatus.REQUIRES_REVISION.value
            else:
                evidence.status = EvidenceStatus.REJECTED
                workflow_status = WorkflowStatus.REJECTED.value
            
            evidence.data["workflow_status"] = workflow_status
            evidence.data["rejected_by"] = reviewer_id
            evidence.data["rejected_at"] = datetime.now(timezone.utc).isoformat()
            evidence.data["rejection_reason"] = rejection_reason
            
            # Update evidence metadata
            if not evidence.evidence_metadata:
                evidence.evidence_metadata = {}
            evidence.evidence_metadata["rejection_history"] = evidence.evidence_metadata.get("rejection_history", [])
            evidence.evidence_metadata["rejection_history"].append({
                "reviewer_id": reviewer_id,
                "rejected_at": datetime.now(timezone.utc).isoformat(),
                "reason": rejection_reason,
                "requires_revision": requires_revision
            })
            
            db.commit()
            
            logger.info(f"Evidence {'marked for revision' if requires_revision else 'rejected'}: {evidence_id}")
            
            return {
                "evidence_id": evidence_id,
                "status": evidence.status.value,
                "workflow_status": workflow_status,
                "rejected_by": reviewer_id,
                "rejection_reason": rejection_reason,
                "requires_revision": requires_revision,
                "message": f"Evidence {'marked for revision' if requires_revision else 'rejected'}"
            }
            
        except Exception as e:
            logger.error(f"Error rejecting evidence: {e}")
            raise VelocityException(f"Failed to reject evidence: {str(e)}")
    
    async def get_expiring_evidence(
        self,
        db: Session,
        organization_id: str,
        days_ahead: int = 30,
        framework: Optional[Framework] = None
    ) -> List[Dict[str, Any]]:
        """Get evidence items expiring within specified days"""
        try:
            cutoff_date = datetime.now(timezone.utc) + timedelta(days=days_ahead)
            
            query = db.query(EvidenceItem).filter(
                and_(
                    EvidenceItem.organization_id == organization_id,
                    EvidenceItem.expires_at <= cutoff_date,
                    EvidenceItem.expires_at > datetime.now(timezone.utc),
                    EvidenceItem.status == EvidenceStatus.VERIFIED
                )
            )
            
            if framework:
                query = query.filter(EvidenceItem.framework == framework)
            
            expiring_items = query.order_by(EvidenceItem.expires_at).all()
            
            results = []
            for item in expiring_items:
                days_until_expiry = (item.expires_at - datetime.now(timezone.utc)).days
                results.append({
                    "evidence_id": str(item.id),
                    "control_id": item.control_id,
                    "framework": item.framework.value,
                    "evidence_type": item.evidence_type.value,
                    "filename": item.data.get("filename", "Unknown"),
                    "expires_at": item.expires_at.isoformat(),
                    "days_until_expiry": days_until_expiry,
                    "urgency": "critical" if days_until_expiry <= 7 else "high" if days_until_expiry <= 14 else "medium",
                    "description": item.data.get("description", "")
                })
            
            logger.info(f"Found {len(results)} expiring evidence items")
            
            return results
            
        except Exception as e:
            logger.error(f"Error getting expiring evidence: {e}")
            raise VelocityException(f"Failed to get expiring evidence: {str(e)}")
    
    async def renew_evidence(
        self,
        db: Session,
        evidence_id: str,
        user_id: str,
        new_expiry_date: Optional[datetime] = None,
        extend_days: int = 365
    ) -> Dict[str, Any]:
        """Renew evidence item"""
        try:
            evidence = db.query(EvidenceItem).filter(EvidenceItem.id == evidence_id).first()
            if not evidence:
                raise VelocityException(f"Evidence not found: {evidence_id}")
            
            # Calculate new expiry date
            if new_expiry_date:
                evidence.expires_at = new_expiry_date
            else:
                evidence.expires_at = datetime.now(timezone.utc) + timedelta(days=extend_days)
            
            # Update evidence metadata
            if not evidence.evidence_metadata:
                evidence.evidence_metadata = {}
            evidence.evidence_metadata["renewal_history"] = evidence.evidence_metadata.get("renewal_history", [])
            evidence.evidence_metadata["renewal_history"].append({
                "renewed_by": user_id,
                "renewed_at": datetime.now(timezone.utc).isoformat(),
                "new_expiry_date": evidence.expires_at.isoformat(),
                "extended_days": extend_days if not new_expiry_date else None
            })
            
            db.commit()
            
            logger.info(f"Evidence renewed: {evidence_id}")
            
            return {
                "evidence_id": evidence_id,
                "new_expiry_date": evidence.expires_at.isoformat(),
                "renewed_by": user_id,
                "message": "Evidence renewed successfully"
            }
            
        except Exception as e:
            logger.error(f"Error renewing evidence: {e}")
            raise VelocityException(f"Failed to renew evidence: {str(e)}")
    
    async def get_workflow_status(
        self,
        db: Session,
        organization_id: str,
        framework: Optional[Framework] = None
    ) -> Dict[str, Any]:
        """Get workflow status summary"""
        try:
            query = db.query(EvidenceItem).filter(EvidenceItem.organization_id == organization_id)
            
            if framework:
                query = query.filter(EvidenceItem.framework == framework)
            
            all_evidence = query.all()
            
            # Count by workflow status
            workflow_counts = {}
            for status in WorkflowStatus:
                workflow_counts[status.value] = 0
            
            for item in all_evidence:
                workflow_status = item.data.get("workflow_status", WorkflowStatus.SUBMITTED.value)
                workflow_counts[workflow_status] = workflow_counts.get(workflow_status, 0) + 1
            
            # Count by evidence status
            status_counts = {}
            for status in EvidenceStatus:
                status_counts[status.value] = 0
            
            for item in all_evidence:
                status_counts[item.status.value] += 1
            
            # Get expiring evidence count
            expiring_30_days = await self.get_expiring_evidence(db, organization_id, 30, framework)
            expiring_7_days = await self.get_expiring_evidence(db, organization_id, 7, framework)
            
            return {
                "organization_id": organization_id,
                "framework": framework.value if framework else "all",
                "total_evidence_items": len(all_evidence),
                "workflow_status_counts": workflow_counts,
                "evidence_status_counts": status_counts,
                "expiring_evidence": {
                    "expiring_30_days": len(expiring_30_days),
                    "expiring_7_days": len(expiring_7_days),
                    "critical_items": [item for item in expiring_30_days if item["urgency"] == "critical"]
                },
                "summary": {
                    "pending_approval": workflow_counts.get(WorkflowStatus.UNDER_REVIEW.value, 0) + workflow_counts.get(WorkflowStatus.SUBMITTED.value, 0),
                    "approved": workflow_counts.get(WorkflowStatus.APPROVED.value, 0),
                    "requires_attention": workflow_counts.get(WorkflowStatus.REQUIRES_REVISION.value, 0) + workflow_counts.get(WorkflowStatus.REJECTED.value, 0) + len(expiring_7_days)
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting workflow status: {e}")
            raise VelocityException(f"Failed to get workflow status: {str(e)}")
    
    # Helper methods
    async def _initialize_approval_workflow(
        self,
        db: Session,
        evidence_id: str,
        evidence_category: EvidenceCategory,
        submitter_id: str
    ) -> Dict[str, Any]:
        """Initialize approval workflow for evidence"""
        try:
            approval_requirements = self.config["approval_requirements"].get(
                evidence_category, ["compliance_officer"]
            )
            
            # Check for auto-approval
            if "auto_approve" in approval_requirements:
                # Auto-approve the evidence
                await self.approve_evidence(
                    db, evidence_id, "system_auto_approval", 
                    "Automatically approved based on evidence category"
                )
                return {
                    "workflow_type": "auto_approval",
                    "status": "approved",
                    "message": "Evidence automatically approved"
                }
            
            # Set status to under review
            evidence = db.query(EvidenceItem).filter(EvidenceItem.id == evidence_id).first()
            if evidence:
                evidence.data["workflow_status"] = WorkflowStatus.UNDER_REVIEW.value
                evidence.data["approval_requirements"] = approval_requirements
                db.commit()
            
            return {
                "workflow_type": "manual_approval",
                "status": "under_review",
                "approval_requirements": approval_requirements,
                "message": "Evidence submitted for manual review"
            }
            
        except Exception as e:
            logger.error(f"Error initializing approval workflow: {e}")
            return {
                "workflow_type": "error",
                "status": "failed",
                "error": str(e)
            }
    
    def _calculate_file_hash(self, file_content: bytes) -> str:
        """Calculate SHA-256 hash of file content"""
        import hashlib
        return hashlib.sha256(file_content).hexdigest()
    
    async def _update_trust_score(
        self,
        db: Session,
        organization_id: str,
        framework: Framework
    ):
        """Update trust score after evidence approval"""
        try:
            # Get current trust score
            trust_score = db.query(TrustScore).filter(
                and_(
                    TrustScore.organization_id == organization_id,
                    TrustScore.framework == framework
                )
            ).first()
            
            if not trust_score:
                # Create new trust score
                trust_score = TrustScore(
                    organization_id=organization_id,
                    framework=framework,
                    total_score=0,
                    framework_scores={framework.value: 0}
                )
                db.add(trust_score)
            
            # Calculate new score based on approved evidence
            approved_evidence_count = db.query(EvidenceItem).filter(
                and_(
                    EvidenceItem.organization_id == organization_id,
                    EvidenceItem.framework == framework,
                    EvidenceItem.status == EvidenceStatus.VERIFIED
                )
            ).count()
            
            # Simple scoring: 10 points per approved evidence item (max 100)
            new_score = min(100, approved_evidence_count * 10)
            trust_score.total_score = new_score
            trust_score.framework_scores[framework.value] = new_score
            
            db.commit()
            
        except Exception as e:
            logger.warning(f"Error updating trust score: {e}")

# Global instance
evidence_workflow_manager = EvidenceWorkflowManager()