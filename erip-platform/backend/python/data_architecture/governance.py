"""
Data Governance and Privacy Controls for ERIP Data Architecture
Reusable components for data catalog, lineage tracking, privacy controls, and compliance automation
"""

from typing import Dict, List, Optional, Any, Union, Set
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
import asyncio
import json
from enum import Enum
import structlog
from pydantic import BaseModel, Field
import hashlib
import re
from pathlib import Path

logger = structlog.get_logger()

class DataClassification(str, Enum):
    """Data sensitivity classification levels"""
    PUBLIC = "public"           # Publicly available data
    INTERNAL = "internal"       # Internal company data
    CONFIDENTIAL = "confidential"  # Sensitive business data
    RESTRICTED = "restricted"   # Highly sensitive/regulated data
    PII = "pii"                # Personally identifiable information
    PHI = "phi"                # Protected health information
    FINANCIAL = "financial"    # Financial/payment data

class ComplianceFramework(str, Enum):
    """Supported compliance frameworks"""
    GDPR = "gdpr"              # General Data Protection Regulation
    CCPA = "ccpa"              # California Consumer Privacy Act
    HIPAA = "hipaa"            # Health Insurance Portability and Accountability Act
    SOX = "sox"                # Sarbanes-Oxley Act
    PCI_DSS = "pci_dss"        # Payment Card Industry Data Security Standard
    ISO27001 = "iso27001"      # ISO 27001 Information Security
    SOC2 = "soc2"              # Service Organization Control 2

class DataAsset(BaseModel):
    """Data asset metadata"""
    asset_id: str
    name: str
    description: str
    asset_type: str  # table, file, stream, api, etc.
    classification: DataClassification
    owner: str
    steward: str
    business_glossary_terms: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    schema: Dict[str, Any] = Field(default_factory=dict)
    location: str  # Physical or logical location
    created_at: datetime
    updated_at: datetime
    retention_period_days: Optional[int] = None
    compliance_frameworks: List[ComplianceFramework] = Field(default_factory=list)
    access_level: str = "restricted"
    metadata: Dict[str, Any] = Field(default_factory=dict)

class DataLineage(BaseModel):
    """Data lineage tracking"""
    lineage_id: str
    source_asset_id: str
    target_asset_id: str
    transformation_type: str  # copy, transform, aggregate, join, etc.
    transformation_logic: Optional[str] = None
    transformation_tool: Optional[str] = None
    created_at: datetime
    created_by: str
    confidence_score: float = 1.0  # How confident we are in this lineage
    metadata: Dict[str, Any] = Field(default_factory=dict)

class AccessPolicy(BaseModel):
    """Data access policy"""
    policy_id: str
    name: str
    description: str
    asset_id: str
    principal_type: str  # user, group, role, service
    principal_id: str
    permissions: List[str]  # read, write, delete, admin
    conditions: Dict[str, Any] = Field(default_factory=dict)  # Time, location, etc.
    effective_from: datetime
    effective_to: Optional[datetime] = None
    created_by: str
    approved_by: Optional[str] = None
    is_active: bool = True

class PrivacyAnnotation(BaseModel):
    """Privacy annotation for data elements"""
    annotation_id: str
    asset_id: str
    column_name: Optional[str] = None
    privacy_category: str  # PII, sensitive, public, etc.
    purpose: str  # Purpose for data processing
    legal_basis: Optional[str] = None  # GDPR legal basis
    retention_period: Optional[int] = None  # Days
    anonymization_method: Optional[str] = None
    consent_required: bool = False
    cross_border_transfer: bool = False
    data_subject_rights: List[str] = Field(default_factory=list)  # access, rectification, erasure, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DataCatalog:
    """
    Reusable data catalog for metadata management and discovery
    """
    
    def __init__(self):
        self.assets: Dict[str, DataAsset] = {}
        self.lineages: Dict[str, DataLineage] = {}
        self.business_glossary: Dict[str, str] = {}
        self.search_index: Dict[str, Set[str]] = {}  # term -> set of asset_ids
        
    async def register_asset(self, asset: DataAsset) -> bool:
        """Register data asset in catalog"""
        try:
            self.assets[asset.asset_id] = asset
            
            # Update search index
            await self._update_search_index(asset)
            
            logger.info("Data asset registered", 
                       asset_id=asset.asset_id,
                       name=asset.name,
                       classification=asset.classification)
            return True
            
        except Exception as e:
            logger.error("Failed to register asset", 
                        asset_id=asset.asset_id,
                        error=str(e))
            return False
    
    async def update_asset(self, asset_id: str, updates: Dict[str, Any]) -> bool:
        """Update data asset metadata"""
        if asset_id not in self.assets:
            return False
        
        try:
            asset = self.assets[asset_id]
            
            # Apply updates
            for key, value in updates.items():
                if hasattr(asset, key):
                    setattr(asset, key, value)
            
            asset.updated_at = datetime.utcnow()
            
            # Update search index
            await self._update_search_index(asset)
            
            logger.info("Data asset updated", asset_id=asset_id)
            return True
            
        except Exception as e:
            logger.error("Failed to update asset", 
                        asset_id=asset_id,
                        error=str(e))
            return False
    
    async def search_assets(
        self, 
        query: str, 
        filters: Optional[Dict[str, Any]] = None
    ) -> List[DataAsset]:
        """Search data assets"""
        try:
            # Simple text search in names and descriptions
            matching_assets = []
            query_lower = query.lower()
            
            for asset in self.assets.values():
                # Text matching
                if (query_lower in asset.name.lower() or 
                    query_lower in asset.description.lower() or
                    any(query_lower in term.lower() for term in asset.business_glossary_terms) or
                    any(query_lower in tag.lower() for tag in asset.tags)):
                    
                    # Apply filters
                    if self._matches_filters(asset, filters or {}):
                        matching_assets.append(asset)
            
            logger.info("Asset search completed", 
                       query=query,
                       results_count=len(matching_assets))
            
            return matching_assets
            
        except Exception as e:
            logger.error("Asset search failed", 
                        query=query,
                        error=str(e))
            return []
    
    async def get_asset_by_id(self, asset_id: str) -> Optional[DataAsset]:
        """Get asset by ID"""
        return self.assets.get(asset_id)
    
    async def get_assets_by_owner(self, owner: str) -> List[DataAsset]:
        """Get assets by owner"""
        return [asset for asset in self.assets.values() if asset.owner == owner]
    
    async def get_assets_by_classification(
        self, 
        classification: DataClassification
    ) -> List[DataAsset]:
        """Get assets by classification level"""
        return [asset for asset in self.assets.values() if asset.classification == classification]
    
    def add_business_term(self, term: str, definition: str) -> None:
        """Add business glossary term"""
        self.business_glossary[term.lower()] = definition
        logger.info("Business term added", term=term)
    
    def get_business_term(self, term: str) -> Optional[str]:
        """Get business term definition"""
        return self.business_glossary.get(term.lower())
    
    async def _update_search_index(self, asset: DataAsset) -> None:
        """Update search index for asset"""
        # Clear existing entries for this asset
        for term_set in self.search_index.values():
            term_set.discard(asset.asset_id)
        
        # Add new index entries
        terms = [asset.name.lower()]
        terms.extend([term.lower() for term in asset.business_glossary_terms])
        terms.extend([tag.lower() for tag in asset.tags])
        
        for term in terms:
            if term not in self.search_index:
                self.search_index[term] = set()
            self.search_index[term].add(asset.asset_id)
    
    def _matches_filters(self, asset: DataAsset, filters: Dict[str, Any]) -> bool:
        """Check if asset matches filters"""
        for key, value in filters.items():
            if key == "classification" and asset.classification != value:
                return False
            elif key == "owner" and asset.owner != value:
                return False
            elif key == "asset_type" and asset.asset_type != value:
                return False
            elif key == "tags" and not any(tag in asset.tags for tag in value):
                return False
        return True

class LineageTracker:
    """
    Reusable data lineage tracking system
    Tracks data flow and transformations across systems
    """
    
    def __init__(self, catalog: DataCatalog):
        self.catalog = catalog
        self.lineages: Dict[str, DataLineage] = {}
        self.lineage_graph: Dict[str, Dict[str, List[str]]] = {
            "upstream": {},    # asset_id -> list of upstream asset_ids
            "downstream": {}   # asset_id -> list of downstream asset_ids
        }
    
    async def record_lineage(self, lineage: DataLineage) -> bool:
        """Record data lineage relationship"""
        try:
            self.lineages[lineage.lineage_id] = lineage
            
            # Update lineage graph
            source_id = lineage.source_asset_id
            target_id = lineage.target_asset_id
            
            # Downstream relationship
            if source_id not in self.lineage_graph["downstream"]:
                self.lineage_graph["downstream"][source_id] = []
            if target_id not in self.lineage_graph["downstream"][source_id]:
                self.lineage_graph["downstream"][source_id].append(target_id)
            
            # Upstream relationship
            if target_id not in self.lineage_graph["upstream"]:
                self.lineage_graph["upstream"][target_id] = []
            if source_id not in self.lineage_graph["upstream"][target_id]:
                self.lineage_graph["upstream"][target_id].append(source_id)
            
            logger.info("Lineage recorded", 
                       lineage_id=lineage.lineage_id,
                       source=source_id,
                       target=target_id)
            return True
            
        except Exception as e:
            logger.error("Failed to record lineage", 
                        lineage_id=lineage.lineage_id,
                        error=str(e))
            return False
    
    async def get_upstream_assets(
        self, 
        asset_id: str, 
        max_depth: int = 5
    ) -> List[Dict[str, Any]]:
        """Get upstream assets (data sources)"""
        return await self._traverse_lineage(asset_id, "upstream", max_depth)
    
    async def get_downstream_assets(
        self, 
        asset_id: str, 
        max_depth: int = 5
    ) -> List[Dict[str, Any]]:
        """Get downstream assets (data consumers)"""
        return await self._traverse_lineage(asset_id, "downstream", max_depth)
    
    async def get_impact_analysis(self, asset_id: str) -> Dict[str, Any]:
        """Analyze impact of changes to an asset"""
        try:
            downstream_assets = await self.get_downstream_assets(asset_id)
            
            # Categorize impacts
            impact_summary = {
                "total_affected_assets": len(downstream_assets),
                "affected_by_classification": {},
                "affected_by_type": {},
                "critical_impacts": [],
                "recommendations": []
            }
            
            for asset_info in downstream_assets:
                asset = await self.catalog.get_asset_by_id(asset_info["asset_id"])
                if asset:
                    # Count by classification
                    classification = asset.classification.value
                    impact_summary["affected_by_classification"][classification] = \
                        impact_summary["affected_by_classification"].get(classification, 0) + 1
                    
                    # Count by type
                    asset_type = asset.asset_type
                    impact_summary["affected_by_type"][asset_type] = \
                        impact_summary["affected_by_type"].get(asset_type, 0) + 1
                    
                    # Check for critical impacts
                    if asset.classification in [DataClassification.RESTRICTED, DataClassification.PII]:
                        impact_summary["critical_impacts"].append({
                            "asset_id": asset.asset_id,
                            "name": asset.name,
                            "classification": asset.classification.value,
                            "reason": f"Sensitive data classification: {asset.classification.value}"
                        })
            
            # Generate recommendations
            if impact_summary["critical_impacts"]:
                impact_summary["recommendations"].append(
                    "High priority: Review impacts on sensitive data assets"
                )
            
            if impact_summary["total_affected_assets"] > 10:
                impact_summary["recommendations"].append(
                    "Consider staged deployment due to wide impact"
                )
            
            return impact_summary
            
        except Exception as e:
            logger.error("Impact analysis failed", 
                        asset_id=asset_id,
                        error=str(e))
            return {"error": str(e)}
    
    async def _traverse_lineage(
        self, 
        asset_id: str, 
        direction: str, 
        max_depth: int,
        visited: Optional[Set[str]] = None,
        current_depth: int = 0
    ) -> List[Dict[str, Any]]:
        """Traverse lineage graph in specified direction"""
        if visited is None:
            visited = set()
        
        if current_depth >= max_depth or asset_id in visited:
            return []
        
        visited.add(asset_id)
        results = []
        
        related_assets = self.lineage_graph.get(direction, {}).get(asset_id, [])
        
        for related_asset_id in related_assets:
            # Add this asset to results
            asset = await self.catalog.get_asset_by_id(related_asset_id)
            if asset:
                results.append({
                    "asset_id": related_asset_id,
                    "name": asset.name,
                    "asset_type": asset.asset_type,
                    "classification": asset.classification.value,
                    "depth": current_depth + 1
                })
            
            # Recursively traverse
            recursive_results = await self._traverse_lineage(
                related_asset_id, 
                direction, 
                max_depth, 
                visited.copy(),
                current_depth + 1
            )
            results.extend(recursive_results)
        
        return results

class PrivacyController:
    """
    Reusable privacy controls and GDPR compliance automation
    """
    
    def __init__(self, catalog: DataCatalog):
        self.catalog = catalog
        self.privacy_annotations: Dict[str, List[PrivacyAnnotation]] = {}  # asset_id -> annotations
        self.consent_records: Dict[str, Dict[str, Any]] = {}  # data_subject_id -> consent info
        self.processing_activities: List[Dict[str, Any]] = []
        
    async def annotate_privacy(self, annotation: PrivacyAnnotation) -> bool:
        """Add privacy annotation to data asset"""
        try:
            asset_id = annotation.asset_id
            
            if asset_id not in self.privacy_annotations:
                self.privacy_annotations[asset_id] = []
            
            self.privacy_annotations[asset_id].append(annotation)
            
            logger.info("Privacy annotation added", 
                       asset_id=asset_id,
                       privacy_category=annotation.privacy_category)
            return True
            
        except Exception as e:
            logger.error("Failed to add privacy annotation", 
                        error=str(e))
            return False
    
    async def get_privacy_annotations(self, asset_id: str) -> List[PrivacyAnnotation]:
        """Get privacy annotations for asset"""
        return self.privacy_annotations.get(asset_id, [])
    
    async def identify_pii_assets(self) -> List[str]:
        """Identify assets containing PII"""
        pii_assets = []
        
        for asset_id, annotations in self.privacy_annotations.items():
            for annotation in annotations:
                if annotation.privacy_category.lower() in ["pii", "personal", "sensitive"]:
                    pii_assets.append(asset_id)
                    break
        
        return pii_assets
    
    async def generate_privacy_report(
        self, 
        framework: ComplianceFramework = ComplianceFramework.GDPR
    ) -> Dict[str, Any]:
        """Generate privacy compliance report"""
        try:
            report = {
                "framework": framework.value,
                "generated_at": datetime.utcnow().isoformat(),
                "summary": {
                    "total_assets_with_privacy_annotations": len(self.privacy_annotations),
                    "pii_assets": len(await self.identify_pii_assets()),
                    "consent_required_assets": 0,
                    "cross_border_transfers": 0
                },
                "compliance_gaps": [],
                "recommendations": []
            }
            
            # Analyze privacy annotations for compliance gaps
            for asset_id, annotations in self.privacy_annotations.items():
                asset = await self.catalog.get_asset_by_id(asset_id)
                if not asset:
                    continue
                
                for annotation in annotations:
                    # Check for consent requirements
                    if annotation.consent_required:
                        report["summary"]["consent_required_assets"] += 1
                    
                    # Check for cross-border transfers
                    if annotation.cross_border_transfer:
                        report["summary"]["cross_border_transfers"] += 1
                    
                    # GDPR-specific checks
                    if framework == ComplianceFramework.GDPR:
                        if not annotation.legal_basis:
                            report["compliance_gaps"].append({
                                "asset_id": asset_id,
                                "issue": "Missing legal basis for processing",
                                "severity": "high"
                            })
                        
                        if not annotation.retention_period:
                            report["compliance_gaps"].append({
                                "asset_id": asset_id,
                                "issue": "Missing retention period",
                                "severity": "medium"
                            })
            
            # Generate recommendations
            if report["compliance_gaps"]:
                report["recommendations"].append(
                    "Address identified compliance gaps to ensure regulatory compliance"
                )
            
            if report["summary"]["cross_border_transfers"] > 0:
                report["recommendations"].append(
                    "Review cross-border data transfers for adequate safeguards"
                )
            
            return report
            
        except Exception as e:
            logger.error("Privacy report generation failed", error=str(e))
            return {"error": str(e)}
    
    async def handle_data_subject_request(
        self, 
        request_type: str, 
        data_subject_id: str
    ) -> Dict[str, Any]:
        """Handle data subject rights requests (GDPR Article 15-20)"""
        try:
            if request_type == "access":
                # Right of access - provide data subject with their data
                return await self._handle_access_request(data_subject_id)
            
            elif request_type == "rectification":
                # Right to rectification - correct inaccurate data
                return await self._handle_rectification_request(data_subject_id)
            
            elif request_type == "erasure":
                # Right to erasure (right to be forgotten)
                return await self._handle_erasure_request(data_subject_id)
            
            elif request_type == "portability":
                # Right to data portability
                return await self._handle_portability_request(data_subject_id)
            
            else:
                return {"error": f"Unsupported request type: {request_type}"}
                
        except Exception as e:
            logger.error("Data subject request failed", 
                        request_type=request_type,
                        error=str(e))
            return {"error": str(e)}
    
    async def _handle_access_request(self, data_subject_id: str) -> Dict[str, Any]:
        """Handle access request"""
        # This would integrate with actual data systems to find and return data
        return {
            "request_type": "access",
            "data_subject_id": data_subject_id,
            "status": "processed",
            "data_located_in": await self._find_data_subject_data(data_subject_id),
            "processed_at": datetime.utcnow().isoformat()
        }
    
    async def _handle_erasure_request(self, data_subject_id: str) -> Dict[str, Any]:
        """Handle erasure request"""
        # This would integrate with actual data systems to delete data
        affected_assets = await self._find_data_subject_data(data_subject_id)
        
        return {
            "request_type": "erasure",
            "data_subject_id": data_subject_id,
            "status": "processed",
            "affected_assets": affected_assets,
            "deletion_method": "secure_overwrite",
            "processed_at": datetime.utcnow().isoformat()
        }
    
    async def _find_data_subject_data(self, data_subject_id: str) -> List[str]:
        """Find assets containing data for specific data subject"""
        # This would query actual data systems
        # For now, return assets with PII annotations
        return await self.identify_pii_assets()

class AccessController:
    """
    Reusable access control management
    Implements role-based and attribute-based access control
    """
    
    def __init__(self, catalog: DataCatalog):
        self.catalog = catalog
        self.policies: Dict[str, AccessPolicy] = {}
        self.role_permissions: Dict[str, List[str]] = {}
        
    async def create_policy(self, policy: AccessPolicy) -> bool:
        """Create access policy"""
        try:
            self.policies[policy.policy_id] = policy
            
            logger.info("Access policy created", 
                       policy_id=policy.policy_id,
                       asset_id=policy.asset_id,
                       principal_id=policy.principal_id)
            return True
            
        except Exception as e:
            logger.error("Failed to create access policy", error=str(e))
            return False
    
    async def check_access(
        self, 
        principal_id: str, 
        asset_id: str, 
        permission: str,
        context: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Check if principal has permission to access asset"""
        try:
            # Find applicable policies
            applicable_policies = [
                policy for policy in self.policies.values()
                if (policy.asset_id == asset_id and 
                    policy.principal_id == principal_id and
                    policy.is_active and
                    self._is_policy_effective(policy))
            ]
            
            # Check if any policy grants the requested permission
            for policy in applicable_policies:
                if permission in policy.permissions:
                    # Check additional conditions
                    if self._evaluate_conditions(policy.conditions, context or {}):
                        logger.info("Access granted", 
                                   principal_id=principal_id,
                                   asset_id=asset_id,
                                   permission=permission)
                        return True
            
            logger.warning("Access denied", 
                          principal_id=principal_id,
                          asset_id=asset_id,
                          permission=permission)
            return False
            
        except Exception as e:
            logger.error("Access check failed", error=str(e))
            return False
    
    async def get_user_permissions(self, principal_id: str) -> Dict[str, List[str]]:
        """Get all permissions for a principal"""
        permissions = {}
        
        for policy in self.policies.values():
            if (policy.principal_id == principal_id and 
                policy.is_active and 
                self._is_policy_effective(policy)):
                
                if policy.asset_id not in permissions:
                    permissions[policy.asset_id] = []
                
                permissions[policy.asset_id].extend(policy.permissions)
        
        # Remove duplicates
        for asset_id in permissions:
            permissions[asset_id] = list(set(permissions[asset_id]))
        
        return permissions
    
    def _is_policy_effective(self, policy: AccessPolicy) -> bool:
        """Check if policy is currently effective"""
        now = datetime.utcnow()
        return (now >= policy.effective_from and 
                (policy.effective_to is None or now <= policy.effective_to))
    
    def _evaluate_conditions(
        self, 
        conditions: Dict[str, Any], 
        context: Dict[str, Any]
    ) -> bool:
        """Evaluate policy conditions against context"""
        for condition_key, condition_value in conditions.items():
            if condition_key == "time_range":
                # Check if current time is within allowed range
                current_hour = datetime.utcnow().hour
                start_hour, end_hour = condition_value
                if not (start_hour <= current_hour <= end_hour):
                    return False
            
            elif condition_key == "ip_range":
                # Check if request comes from allowed IP range
                client_ip = context.get("client_ip")
                if client_ip and client_ip not in condition_value:
                    return False
            
            elif condition_key == "required_attributes":
                # Check if context contains required attributes
                for attr, expected_value in condition_value.items():
                    if context.get(attr) != expected_value:
                        return False
        
        return True

class DataClassifier:
    """
    Reusable automatic data classification
    Uses pattern matching and ML to classify data sensitivity
    """
    
    def __init__(self):
        self.classification_rules: Dict[str, Dict[str, Any]] = {
            "pii_patterns": {
                "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
                "phone": r'\b\d{3}-\d{3}-\d{4}\b',
                "credit_card": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
            },
            "column_name_patterns": {
                DataClassification.PII: ["email", "ssn", "social", "phone", "address", "name"],
                DataClassification.FINANCIAL: ["salary", "revenue", "cost", "price", "payment"],
                DataClassification.CONFIDENTIAL: ["password", "secret", "token", "key"]
            }
        }
    
    async def classify_asset(self, asset: DataAsset, sample_data: Optional[Any] = None) -> DataClassification:
        """Automatically classify data asset"""
        try:
            # Start with the lowest classification
            classification = DataClassification.PUBLIC
            
            # Check column names for patterns
            if asset.schema:
                for column_name in asset.schema.keys():
                    column_classification = self._classify_by_column_name(column_name)
                    if self._is_higher_classification(column_classification, classification):
                        classification = column_classification
            
            # Check actual data content if available
            if sample_data:
                content_classification = await self._classify_by_content(sample_data)
                if self._is_higher_classification(content_classification, classification):
                    classification = content_classification
            
            # Check asset metadata for classification hints
            metadata_classification = self._classify_by_metadata(asset)
            if self._is_higher_classification(metadata_classification, classification):
                classification = metadata_classification
            
            logger.info("Asset classified", 
                       asset_id=asset.asset_id,
                       classification=classification.value)
            
            return classification
            
        except Exception as e:
            logger.error("Asset classification failed", 
                        asset_id=asset.asset_id,
                        error=str(e))
            return DataClassification.INTERNAL  # Default to internal on error
    
    def _classify_by_column_name(self, column_name: str) -> DataClassification:
        """Classify based on column name patterns"""
        column_lower = column_name.lower()
        
        for classification, patterns in self.classification_rules["column_name_patterns"].items():
            for pattern in patterns:
                if pattern in column_lower:
                    return classification
        
        return DataClassification.INTERNAL
    
    async def _classify_by_content(self, sample_data: Any) -> DataClassification:
        """Classify based on data content patterns"""
        if not sample_data:
            return DataClassification.INTERNAL
        
        # Convert sample data to string for pattern matching
        if isinstance(sample_data, (list, dict)):
            content = json.dumps(sample_data)
        else:
            content = str(sample_data)
        
        # Check for PII patterns
        for pattern_name, pattern in self.classification_rules["pii_patterns"].items():
            if re.search(pattern, content):
                logger.info("PII pattern detected", pattern=pattern_name)
                return DataClassification.PII
        
        return DataClassification.INTERNAL
    
    def _classify_by_metadata(self, asset: DataAsset) -> DataClassification:
        """Classify based on asset metadata"""
        # Check tags for classification hints
        for tag in asset.tags:
            tag_lower = tag.lower()
            if any(keyword in tag_lower for keyword in ["pii", "personal", "sensitive"]):
                return DataClassification.PII
            elif any(keyword in tag_lower for keyword in ["financial", "payment", "revenue"]):
                return DataClassification.FINANCIAL
            elif any(keyword in tag_lower for keyword in ["confidential", "secret", "restricted"]):
                return DataClassification.CONFIDENTIAL
        
        return DataClassification.INTERNAL
    
    def _is_higher_classification(
        self, 
        new_classification: DataClassification, 
        current_classification: DataClassification
    ) -> bool:
        """Check if new classification is higher than current"""
        classification_levels = {
            DataClassification.PUBLIC: 0,
            DataClassification.INTERNAL: 1,
            DataClassification.CONFIDENTIAL: 2,
            DataClassification.FINANCIAL: 3,
            DataClassification.PII: 4,
            DataClassification.PHI: 5,
            DataClassification.RESTRICTED: 6
        }
        
        return classification_levels.get(new_classification, 0) > classification_levels.get(current_classification, 0)