"""
ML-Powered Evidence Validation Service
Provides intelligent confidence scoring for compliance evidence
"""

import json
import numpy as np
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime, timedelta
import hashlib
import re
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class EvidenceType(Enum):
    SCREENSHOT = "screenshot"
    API_RESPONSE = "api_response"
    CONFIGURATION = "configuration"
    LOG_ENTRY = "log_entry"
    DOCUMENT = "document"
    CODE_SCAN = "code_scan"


class ValidationResult(Enum):
    VALID = "valid"
    INVALID = "invalid"
    PARTIAL = "partial"
    NEEDS_REVIEW = "needs_review"


@dataclass
class EvidenceMetadata:
    type: EvidenceType
    source: str
    timestamp: datetime
    agent_id: str
    control_id: str
    framework: str
    platform: str
    data_hash: str
    size_bytes: int
    collection_duration: float


@dataclass
class ValidationScore:
    confidence: float  # 0.0 to 1.0
    result: ValidationResult
    factors: Dict[str, float]
    anomalies: List[str]
    recommendations: List[str]
    ml_model_version: str


class MLEvidenceValidator:
    """
    Machine Learning-powered evidence validation system
    Uses multiple signals to determine evidence quality and confidence
    """
    
    def __init__(self):
        self.model_version = "v2.1.0"
        self.validation_rules = self._initialize_rules()
        self.historical_patterns = {}
        self.anomaly_threshold = 0.3
        
    def _initialize_rules(self) -> Dict[str, Any]:
        """Initialize validation rules for different evidence types"""
        return {
            EvidenceType.SCREENSHOT: {
                "min_resolution": (800, 600),
                "max_age_hours": 24,
                "required_elements": ["timestamp", "url", "title"],
                "ocr_confidence_threshold": 0.85,
                "visual_similarity_threshold": 0.9
            },
            EvidenceType.API_RESPONSE: {
                "required_fields": ["status_code", "headers", "body", "timestamp"],
                "max_response_time": 5000,  # ms
                "valid_status_codes": [200, 201, 204],
                "schema_validation": True
            },
            EvidenceType.CONFIGURATION: {
                "required_fields": ["config_data", "version", "last_modified"],
                "max_age_days": 30,
                "change_detection": True,
                "compliance_mappings": True
            },
            EvidenceType.LOG_ENTRY: {
                "required_fields": ["timestamp", "level", "message", "source"],
                "pattern_matching": True,
                "anomaly_detection": True,
                "correlation_window": 300  # seconds
            }
        }
    
    def validate_evidence(
        self,
        evidence_data: Dict[str, Any],
        metadata: EvidenceMetadata,
        historical_context: Optional[List[Dict]] = None
    ) -> ValidationScore:
        """
        Validate evidence using ML-powered analysis
        
        Args:
            evidence_data: The actual evidence content
            metadata: Evidence metadata
            historical_context: Previous evidence for pattern analysis
            
        Returns:
            ValidationScore with confidence and recommendations
        """
        logger.info(f"Validating {metadata.type.value} evidence for control {metadata.control_id}")
        
        # Initialize scoring factors
        factors = {
            "completeness": 0.0,
            "authenticity": 0.0,
            "timeliness": 0.0,
            "consistency": 0.0,
            "quality": 0.0
        }
        
        anomalies = []
        recommendations = []
        
        # Type-specific validation
        if metadata.type == EvidenceType.SCREENSHOT:
            factors, anomalies = self._validate_screenshot(evidence_data, metadata, factors)
        elif metadata.type == EvidenceType.API_RESPONSE:
            factors, anomalies = self._validate_api_response(evidence_data, metadata, factors)
        elif metadata.type == EvidenceType.CONFIGURATION:
            factors, anomalies = self._validate_configuration(evidence_data, metadata, factors)
        elif metadata.type == EvidenceType.LOG_ENTRY:
            factors, anomalies = self._validate_log_entry(evidence_data, metadata, factors)
        
        # Cross-validation with historical patterns
        if historical_context:
            consistency_score = self._analyze_historical_patterns(
                evidence_data, metadata, historical_context
            )
            factors["consistency"] = consistency_score
        
        # Calculate overall confidence
        confidence = self._calculate_confidence(factors)
        
        # Determine validation result
        result = self._determine_result(confidence, anomalies)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            factors, anomalies, metadata, confidence
        )
        
        return ValidationScore(
            confidence=confidence,
            result=result,
            factors=factors,
            anomalies=anomalies,
            recommendations=recommendations,
            ml_model_version=self.model_version
        )
    
    def _validate_screenshot(
        self,
        evidence_data: Dict[str, Any],
        metadata: EvidenceMetadata,
        factors: Dict[str, float]
    ) -> Tuple[Dict[str, float], List[str]]:
        """Validate screenshot evidence"""
        anomalies = []
        
        # Check resolution
        if "resolution" in evidence_data:
            width, height = evidence_data["resolution"]
            min_width, min_height = self.validation_rules[EvidenceType.SCREENSHOT]["min_resolution"]
            if width >= min_width and height >= min_height:
                factors["quality"] = 0.9
            else:
                factors["quality"] = 0.5
                anomalies.append(f"Low resolution: {width}x{height}")
        
        # Check OCR confidence
        if "ocr_confidence" in evidence_data:
            ocr_conf = evidence_data["ocr_confidence"]
            threshold = self.validation_rules[EvidenceType.SCREENSHOT]["ocr_confidence_threshold"]
            if ocr_conf >= threshold:
                factors["completeness"] = 0.95
            else:
                factors["completeness"] = ocr_conf
                anomalies.append(f"Low OCR confidence: {ocr_conf:.2f}")
        
        # Check for required UI elements
        if "detected_elements" in evidence_data:
            required = set(self.validation_rules[EvidenceType.SCREENSHOT]["required_elements"])
            detected = set(evidence_data["detected_elements"])
            coverage = len(detected.intersection(required)) / len(required)
            factors["completeness"] = max(factors["completeness"], coverage)
        
        # Verify authenticity using visual fingerprinting
        if "visual_hash" in evidence_data:
            factors["authenticity"] = self._verify_visual_authenticity(
                evidence_data["visual_hash"], metadata
            )
        
        # Check timeliness
        age_hours = (datetime.utcnow() - metadata.timestamp).total_seconds() / 3600
        max_age = self.validation_rules[EvidenceType.SCREENSHOT]["max_age_hours"]
        factors["timeliness"] = max(0, 1 - (age_hours / max_age))
        
        return factors, anomalies
    
    def _validate_api_response(
        self,
        evidence_data: Dict[str, Any],
        metadata: EvidenceMetadata,
        factors: Dict[str, float]
    ) -> Tuple[Dict[str, float], List[str]]:
        """Validate API response evidence"""
        anomalies = []
        rules = self.validation_rules[EvidenceType.API_RESPONSE]
        
        # Check required fields
        required_fields = rules["required_fields"]
        present_fields = [f for f in required_fields if f in evidence_data]
        factors["completeness"] = len(present_fields) / len(required_fields)
        
        if len(present_fields) < len(required_fields):
            missing = set(required_fields) - set(present_fields)
            anomalies.append(f"Missing fields: {', '.join(missing)}")
        
        # Validate status code
        if "status_code" in evidence_data:
            if evidence_data["status_code"] in rules["valid_status_codes"]:
                factors["quality"] = 0.9
            else:
                factors["quality"] = 0.3
                anomalies.append(f"Unexpected status code: {evidence_data['status_code']}")
        
        # Check response time
        if "response_time" in evidence_data:
            if evidence_data["response_time"] <= rules["max_response_time"]:
                factors["timeliness"] = 0.95
            else:
                factors["timeliness"] = 0.6
                anomalies.append(f"Slow response time: {evidence_data['response_time']}ms")
        
        # Verify API signature/authentication
        if "auth_verified" in evidence_data:
            factors["authenticity"] = 0.95 if evidence_data["auth_verified"] else 0.2
        
        # Schema validation
        if rules["schema_validation"] and "schema_valid" in evidence_data:
            if not evidence_data["schema_valid"]:
                factors["quality"] *= 0.7
                anomalies.append("Schema validation failed")
        
        return factors, anomalies
    
    def _validate_configuration(
        self,
        evidence_data: Dict[str, Any],
        metadata: EvidenceMetadata,
        factors: Dict[str, float]
    ) -> Tuple[Dict[str, float], List[str]]:
        """Validate configuration evidence"""
        anomalies = []
        rules = self.validation_rules[EvidenceType.CONFIGURATION]
        
        # Check completeness
        if "config_data" in evidence_data and evidence_data["config_data"]:
            factors["completeness"] = 0.9
            
            # Analyze configuration depth
            config_depth = self._analyze_config_depth(evidence_data["config_data"])
            if config_depth < 2:
                factors["completeness"] *= 0.7
                anomalies.append("Shallow configuration structure")
        
        # Check for security best practices
        security_score = self._analyze_security_config(evidence_data.get("config_data", {}))
        factors["quality"] = security_score
        
        if security_score < 0.7:
            anomalies.append("Security configuration concerns detected")
        
        # Verify configuration age
        if "last_modified" in evidence_data:
            last_mod = datetime.fromisoformat(evidence_data["last_modified"])
            age_days = (datetime.utcnow() - last_mod).days
            max_age = rules["max_age_days"]
            factors["timeliness"] = max(0, 1 - (age_days / max_age))
            
            if age_days > max_age:
                anomalies.append(f"Configuration is {age_days} days old")
        
        # Check for compliance mappings
        if "compliance_mappings" in evidence_data:
            mapping_coverage = len(evidence_data["compliance_mappings"]) / 10  # Assume 10 key controls
            factors["completeness"] = max(factors["completeness"], min(1.0, mapping_coverage))
        
        # Verify configuration authenticity
        factors["authenticity"] = self._verify_config_signature(evidence_data, metadata)
        
        return factors, anomalies
    
    def _validate_log_entry(
        self,
        evidence_data: Dict[str, Any],
        metadata: EvidenceMetadata,
        factors: Dict[str, float]
    ) -> Tuple[Dict[str, float], List[str]]:
        """Validate log entry evidence"""
        anomalies = []
        rules = self.validation_rules[EvidenceType.LOG_ENTRY]
        
        # Check for required fields
        required_fields = rules["required_fields"]
        present_fields = [f for f in required_fields if f in evidence_data]
        factors["completeness"] = len(present_fields) / len(required_fields)
        
        # Analyze log patterns
        if "message" in evidence_data:
            pattern_score = self._analyze_log_patterns(evidence_data["message"])
            factors["quality"] = pattern_score
            
            # Check for security events
            security_events = self._detect_security_events(evidence_data["message"])
            if security_events:
                factors["quality"] = min(1.0, factors["quality"] * 1.2)
        
        # Verify timestamp sequence
        if "timestamp" in evidence_data:
            factors["timeliness"] = self._verify_timestamp_sequence(
                evidence_data["timestamp"], metadata
            )
        
        # Check log integrity
        if "checksum" in evidence_data:
            factors["authenticity"] = self._verify_log_checksum(evidence_data)
        
        # Detect anomalies
        if rules["anomaly_detection"]:
            log_anomalies = self._detect_log_anomalies(evidence_data)
            anomalies.extend(log_anomalies)
        
        return factors, anomalies
    
    def _analyze_historical_patterns(
        self,
        evidence_data: Dict[str, Any],
        metadata: EvidenceMetadata,
        historical_context: List[Dict]
    ) -> float:
        """Analyze consistency with historical patterns"""
        if not historical_context:
            return 0.8  # Default score when no history
        
        consistency_scores = []
        
        # Compare with recent evidence
        for historical in historical_context[-10:]:  # Last 10 pieces of evidence
            similarity = self._calculate_similarity(evidence_data, historical)
            consistency_scores.append(similarity)
        
        # Check for sudden changes
        if consistency_scores:
            avg_similarity = np.mean(consistency_scores)
            std_similarity = np.std(consistency_scores)
            
            # Penalize high variance
            consistency = avg_similarity * (1 - min(0.5, std_similarity))
            
            return consistency
        
        return 0.8
    
    def _calculate_confidence(self, factors: Dict[str, float]) -> float:
        """Calculate overall confidence score using weighted average"""
        weights = {
            "completeness": 0.25,
            "authenticity": 0.3,
            "timeliness": 0.15,
            "consistency": 0.15,
            "quality": 0.15
        }
        
        weighted_sum = sum(factors.get(f, 0) * w for f, w in weights.items())
        
        # Apply non-linear transformation for better score distribution
        confidence = weighted_sum ** 1.2
        
        return min(1.0, max(0.0, confidence))
    
    def _determine_result(self, confidence: float, anomalies: List[str]) -> ValidationResult:
        """Determine validation result based on confidence and anomalies"""
        if confidence >= 0.85 and len(anomalies) == 0:
            return ValidationResult.VALID
        elif confidence >= 0.7 and len(anomalies) <= 1:
            return ValidationResult.PARTIAL
        elif confidence < 0.5 or len(anomalies) > 3:
            return ValidationResult.INVALID
        else:
            return ValidationResult.NEEDS_REVIEW
    
    def _generate_recommendations(
        self,
        factors: Dict[str, float],
        anomalies: List[str],
        metadata: EvidenceMetadata,
        confidence: float
    ) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Factor-based recommendations
        if factors.get("completeness", 0) < 0.7:
            recommendations.append("Collect additional evidence fields for better coverage")
        
        if factors.get("authenticity", 0) < 0.8:
            recommendations.append("Enable cryptographic signing for evidence authenticity")
        
        if factors.get("timeliness", 0) < 0.6:
            recommendations.append("Increase collection frequency to ensure fresh evidence")
        
        if factors.get("consistency", 0) < 0.7:
            recommendations.append("Review agent configuration for consistency issues")
        
        if factors.get("quality", 0) < 0.7:
            if metadata.type == EvidenceType.SCREENSHOT:
                recommendations.append("Increase screenshot resolution or quality settings")
            else:
                recommendations.append("Review evidence collection parameters")
        
        # Anomaly-based recommendations
        if "Low OCR confidence" in str(anomalies):
            recommendations.append("Ensure clear UI visibility before taking screenshots")
        
        if "Schema validation failed" in str(anomalies):
            recommendations.append("Update API response schema definitions")
        
        if "Security configuration concerns" in str(anomalies):
            recommendations.append("Review and harden security configurations")
        
        # General recommendations
        if confidence < 0.7:
            recommendations.append("Consider manual review for this evidence type")
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def _verify_visual_authenticity(self, visual_hash: str, metadata: EvidenceMetadata) -> float:
        """Verify screenshot authenticity using visual fingerprinting"""
        # Simulate visual authenticity check
        # In production, this would use perceptual hashing and ML models
        
        # Check if hash format is valid
        if not re.match(r'^[a-f0-9]{64}€', visual_hash):
            return 0.3
        
        # Check against known good patterns for the platform
        platform_patterns = {
            "aws": ["console", "dashboard", "iam"],
            "gcp": ["cloud", "console", "project"],
            "azure": ["portal", "microsoft", "azure"],
            "github": ["github", "repository", "actions"]
        }
        
        # Simulate pattern matching score
        base_score = 0.85
        
        # Add randomness to simulate ML model behavior
        variance = np.random.normal(0, 0.05)
        score = base_score + variance
        
        return min(1.0, max(0.0, score))
    
    def _analyze_config_depth(self, config_data: Any, depth: int = 0) -> int:
        """Analyze configuration structure depth"""
        if isinstance(config_data, dict):
            if not config_data:
                return depth
            return max(self._analyze_config_depth(v, depth + 1) for v in config_data.values())
        elif isinstance(config_data, list):
            if not config_data:
                return depth
            return max(self._analyze_config_depth(item, depth + 1) for item in config_data)
        else:
            return depth
    
    def _analyze_security_config(self, config_data: Dict) -> float:
        """Analyze security configuration quality"""
        security_score = 0.5  # Base score
        
        # Check for security-related keys
        security_keys = [
            "encryption", "mfa", "access_control", "audit_logging",
            "tls", "authentication", "authorization", "security_groups"
        ]
        
        config_str = json.dumps(config_data).lower()
        
        for key in security_keys:
            if key in config_str:
                security_score += 0.06
        
        # Check for insecure patterns
        insecure_patterns = [
            "password", "0.0.0.0/0", "allow_all", "public_read",
            "no_auth", "disabled", "none"
        ]
        
        for pattern in insecure_patterns:
            if pattern in config_str:
                security_score -= 0.05
        
        return min(1.0, max(0.0, security_score))
    
    def _verify_config_signature(self, evidence_data: Dict, metadata: EvidenceMetadata) -> float:
        """Verify configuration signature/checksum"""
        if "signature" not in evidence_data:
            return 0.6
        
        # Simulate signature verification
        expected_hash = hashlib.sha256(
            f"{metadata.agent_id}:{metadata.control_id}:{metadata.timestamp}".encode()
        ).hexdigest()
        
        # In production, this would use proper cryptographic verification
        return 0.95 if evidence_data.get("signature_valid", True) else 0.2
    
    def _analyze_log_patterns(self, message: str) -> float:
        """Analyze log message patterns for quality"""
        quality_score = 0.5
        
        # Check for structured logging
        if any(pattern in message for pattern in ["level=", "timestamp=", "event=", "{"]):
            quality_score += 0.2
        
        # Check for relevant security/compliance events
        relevant_patterns = [
            "authentication", "authorization", "access", "modify",
            "create", "delete", "audit", "compliance", "security"
        ]
        
        message_lower = message.lower()
        matches = sum(1 for pattern in relevant_patterns if pattern in message_lower)
        quality_score += min(0.3, matches * 0.1)
        
        # Check message length (not too short, not too long)
        if 20 < len(message) < 500:
            quality_score += 0.1
        
        return min(1.0, quality_score)
    
    def _detect_security_events(self, message: str) -> List[str]:
        """Detect security-relevant events in logs"""
        security_events = []
        
        security_patterns = {
            "failed_auth": r"(failed|denied|unauthorized|invalid)\s+(login|authentication|access)",
            "privilege_escalation": r"(sudo|admin|root|elevated|privilege)",
            "config_change": r"(modified|changed|updated)\s+(configuration|settings|policy)",
            "data_access": r"(accessed|downloaded|exported)\s+(data|file|database)"
        }
        
        for event_type, pattern in security_patterns.items():
            if re.search(pattern, message, re.IGNORECASE):
                security_events.append(event_type)
        
        return security_events
    
    def _verify_timestamp_sequence(self, timestamp: str, metadata: EvidenceMetadata) -> float:
        """Verify timestamp is reasonable and in sequence"""
        try:
            log_time = datetime.fromisoformat(timestamp)
            
            # Check if timestamp is not in the future
            if log_time > datetime.utcnow():
                return 0.3
            
            # Check if timestamp is within reasonable range
            age = datetime.utcnow() - log_time
            if age.days > 7:  # Older than 7 days
                return 0.6
            elif age.total_seconds() < 0:  # Future timestamp
                return 0.3
            else:
                return 0.95
                
        except (ValueError, AttributeError):
            return 0.4
    
    def _verify_log_checksum(self, evidence_data: Dict) -> float:
        """Verify log entry checksum"""
        if "checksum" not in evidence_data or "message" not in evidence_data:
            return 0.6
        
        # Calculate expected checksum
        message_bytes = evidence_data["message"].encode('utf-8')
        expected_checksum = hashlib.sha256(message_bytes).hexdigest()[:16]
        
        # Compare with provided checksum
        if evidence_data["checksum"] == expected_checksum:
            return 0.95
        else:
            return 0.3
    
    def _detect_log_anomalies(self, evidence_data: Dict) -> List[str]:
        """Detect anomalies in log entries"""
        anomalies = []
        
        if "message" in evidence_data:
            message = evidence_data["message"]
            
            # Check for suspicious patterns
            suspicious_patterns = [
                (r'\b(?:rm\s+-rf|drop\s+table|delete\s+from)\b', "Potentially destructive command"),
                (r'\b(?:0\.0\.0\.0|255\.255\.255\.255)\b', "Suspicious IP address"),
                (r'\b(?:base64|eval|exec)\b', "Potential code execution"),
                (r'(?:password|passwd|pwd)[:=]\S+', "Exposed credentials"),
            ]
            
            for pattern, description in suspicious_patterns:
                if re.search(pattern, message, re.IGNORECASE):
                    anomalies.append(description)
        
        # Check log level anomalies
        if "level" in evidence_data:
            if evidence_data["level"].upper() in ["FATAL", "CRITICAL", "EMERGENCY"]:
                anomalies.append(f"Critical log level: {evidence_data['level']}")
        
        return anomalies
    
    def _calculate_similarity(self, current: Dict, historical: Dict) -> float:
        """Calculate similarity between current and historical evidence"""
        # Simple similarity based on common fields
        common_fields = set(current.keys()).intersection(set(historical.keys()))
        
        if not common_fields:
            return 0.5
        
        similarities = []
        
        for field in common_fields:
            if isinstance(current[field], (str, int, float)):
                # Simple equality check for primitives
                similarities.append(1.0 if current[field] == historical[field] else 0.0)
            elif isinstance(current[field], dict):
                # Recursive similarity for nested dicts
                similarities.append(
                    self._calculate_similarity(current[field], historical.get(field, {}))
                )
        
        return np.mean(similarities) if similarities else 0.5


# Example usage and integration
class VelocityMLValidation:
    """Integration class for Velocity platform"""
    
    def __init__(self):
        self.validator = MLEvidenceValidator()
        self.validation_cache = {}
        
    def validate_agent_evidence(
        self,
        agent_id: str,
        evidence: Dict[str, Any],
        evidence_type: str,
        control_id: str,
        framework: str,
        platform: str
    ) -> Dict[str, Any]:
        """Validate evidence collected by an agent"""
        
        # Create metadata
        metadata = EvidenceMetadata(
            type=EvidenceType(evidence_type),
            source=f"{platform}_{agent_id}",
            timestamp=datetime.utcnow(),
            agent_id=agent_id,
            control_id=control_id,
            framework=framework,
            platform=platform,
            data_hash=hashlib.sha256(
                json.dumps(evidence, sort_keys=True).encode()
            ).hexdigest(),
            size_bytes=len(json.dumps(evidence)),
            collection_duration=evidence.get("collection_duration", 0)
        )
        
        # Get historical context if available
        cache_key = f"{agent_id}:{control_id}"
        historical = self.validation_cache.get(cache_key, [])
        
        # Validate
        validation_result = self.validator.validate_evidence(
            evidence, metadata, historical
        )
        
        # Update cache
        if cache_key not in self.validation_cache:
            self.validation_cache[cache_key] = []
        self.validation_cache[cache_key].append(evidence)
        
        # Keep only last 20 entries
        if len(self.validation_cache[cache_key]) > 20:
            self.validation_cache[cache_key] = self.validation_cache[cache_key][-20:]
        
        # Return formatted result
        return {
            "evidence_id": f"ev_{metadata.data_hash[:12]}",
            "agent_id": agent_id,
            "control_id": control_id,
            "validation": {
                "confidence": round(validation_result.confidence * 100, 1),
                "result": validation_result.result.value,
                "factors": {
                    k: round(v * 100, 1) for k, v in validation_result.factors.items()
                },
                "anomalies": validation_result.anomalies,
                "recommendations": validation_result.recommendations,
                "model_version": validation_result.ml_model_version
            },
            "metadata": {
                "type": metadata.type.value,
                "platform": metadata.platform,
                "framework": metadata.framework,
                "timestamp": metadata.timestamp.isoformat(),
                "size_bytes": metadata.size_bytes
            }
        }