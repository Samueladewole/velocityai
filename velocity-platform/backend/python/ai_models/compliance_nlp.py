"""
Advanced NLP Processing for Compliance Automation
Natural Language Processing engine for regulatory text analysis, compliance checking, and document processing
"""

import asyncio
import re
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple, Set, Union
from enum import Enum
from pydantic import BaseModel, Field
from dataclasses import dataclass
import numpy as np
from collections import defaultdict, Counter
import uuid
import string

class ComplianceFramework(str, Enum):
    """Supported compliance frameworks"""
    SOX = "sarbanes_oxley"
    GDPR = "gdpr"
    HIPAA = "hipaa"
    PCI_DSS = "pci_dss"
    ISO_27001 = "iso_27001"
    NIST = "nist_cybersecurity"
    BASEL_III = "basel_iii"
    CCPA = "ccpa"
    SOC2 = "soc2"
    FISMA = "fisma"

class DocumentType(str, Enum):
    """Types of documents for processing"""
    POLICY = "policy"
    PROCEDURE = "procedure"
    CONTROL = "control_description"
    AUDIT_REPORT = "audit_report"
    INCIDENT_REPORT = "incident_report"
    RISK_ASSESSMENT = "risk_assessment"
    COMPLIANCE_REPORT = "compliance_report"
    TRAINING_MATERIAL = "training_material"
    CONTRACT = "contract"
    REGULATION = "regulation"

class SentimentPolarity(str, Enum):
    """Sentiment analysis results"""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    MIXED = "mixed"

class ComplianceRisk(str, Enum):
    """Compliance risk levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFORMATIONAL = "informational"

@dataclass
class EntityExtraction:
    """Named entity extraction result"""
    entity_text: str
    entity_type: str
    confidence: float
    start_position: int
    end_position: int
    context: str

@dataclass
class ComplianceRequirement:
    """Identified compliance requirement"""
    requirement_id: str
    framework: ComplianceFramework
    requirement_text: str
    control_reference: Optional[str]
    risk_level: ComplianceRisk
    mandatory: bool
    due_date: Optional[datetime]
    related_keywords: List[str]

@dataclass
class GapAnalysis:
    """Compliance gap analysis result"""
    requirement: ComplianceRequirement
    current_state: str
    target_state: str
    gap_severity: ComplianceRisk
    recommendations: List[str]
    remediation_effort: str  # "low", "medium", "high"
    estimated_cost: Optional[float]

@dataclass
class DocumentAnalysis:
    """Complete document analysis result"""
    document_id: str
    document_type: DocumentType
    word_count: int
    language: str
    sentiment: Dict[str, float]
    entities: List[EntityExtraction]
    compliance_requirements: List[ComplianceRequirement]
    risk_indicators: List[str]
    key_topics: List[str]
    compliance_score: float
    readability_score: float
    summary: str
    recommendations: List[str]
    processing_time: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ComplianceKeywordLibrary:
    """
    Comprehensive library of compliance-related keywords and patterns
    """
    
    def __init__(self):
        self.keywords = self._initialize_keywords()
        self.patterns = self._initialize_patterns()
        self.risk_indicators = self._initialize_risk_indicators()
    
    def _initialize_keywords(self) -> Dict[ComplianceFramework, Dict[str, List[str]]]:
        """Initialize framework-specific keywords"""
        
        return {
            ComplianceFramework.SOX: {
                "financial_controls": [
                    "internal controls", "financial reporting", "material weakness",
                    "deficiency", "control environment", "monitoring", "segregation of duties"
                ],
                "audit": [
                    "auditor independence", "audit committee", "external auditor",
                    "internal audit", "audit evidence", "management representation"
                ],
                "disclosure": [
                    "material information", "disclosure controls", "periodic reports",
                    "certification", "CEO certification", "CFO certification"
                ]
            },
            ComplianceFramework.GDPR: {
                "data_protection": [
                    "personal data", "data subject", "data controller", "data processor",
                    "consent", "lawful basis", "data minimization", "purpose limitation"
                ],
                "rights": [
                    "right to access", "right to rectification", "right to erasure",
                    "right to portability", "right to object", "automated decision-making"
                ],
                "security": [
                    "data breach", "security measures", "pseudonymization", "encryption",
                    "data protection by design", "privacy impact assessment"
                ]
            },
            ComplianceFramework.HIPAA: {
                "phi": [
                    "protected health information", "PHI", "health information",
                    "medical records", "patient data", "health data"
                ],
                "safeguards": [
                    "administrative safeguards", "physical safeguards", "technical safeguards",
                    "access controls", "audit controls", "integrity controls"
                ],
                "breach": [
                    "security incident", "unauthorized access", "breach notification",
                    "risk assessment", "mitigation", "business associate"
                ]
            },
            ComplianceFramework.PCI_DSS: {
                "cardholder_data": [
                    "cardholder data", "CHD", "payment card", "card data", "PAN",
                    "primary account number", "sensitive authentication data"
                ],
                "security": [
                    "secure network", "vulnerability management", "access control",
                    "network monitoring", "security testing", "security policy"
                ],
                "compliance": [
                    "PCI compliance", "validation", "assessment", "scanning",
                    "penetration testing", "compliance report"
                ]
            },
            ComplianceFramework.ISO_27001: {
                "isms": [
                    "information security management system", "ISMS", "security policy",
                    "risk management", "security objectives", "continual improvement"
                ],
                "controls": [
                    "security controls", "control implementation", "access control",
                    "cryptography", "system security", "network security"
                ],
                "audit": [
                    "internal audit", "management review", "nonconformity",
                    "corrective action", "certification", "surveillance audit"
                ]
            }
        }
    
    def _initialize_patterns(self) -> Dict[str, str]:
        """Initialize regex patterns for compliance detection"""
        
        return {
            "dates": r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b',
            "monetary": r'\€[\d,]+\.?\d*|\b\d+\.\d{2}\s*(dollars?|USD)\b',
            "percentages": r'\b\d+\.?\d*\s*%\b|\b\d+\.?\d*\s*percent\b',
            "requirements": r'\b(?:must|shall|should|required?|mandatory|obligated?)\b',
            "prohibitions": r'\b(?:shall not|must not|cannot|prohibited|forbidden|banned)\b',
            "exceptions": r'\b(?:except|unless|provided that|subject to|notwithstanding)\b',
            "timeframes": r'\b(?:within|by|no later than|before|after|during)\s+\d+\s*(?:days?|months?|years?)\b',
            "references": r'\b(?:section|clause|paragraph|subsection|article)\s*\d+(?:\.\d+)*\b',
            "roles": r'\b(?:data controller|data processor|CEO|CFO|CISO|auditor|administrator)\b'
        }
    
    def _initialize_risk_indicators(self) -> Dict[ComplianceRisk, List[str]]:
        """Initialize risk indicator keywords"""
        
        return {
            ComplianceRisk.CRITICAL: [
                "material weakness", "critical vulnerability", "data breach",
                "regulatory violation", "non-compliance", "significant deficiency",
                "critical failure", "security incident", "unauthorized access"
            ],
            ComplianceRisk.HIGH: [
                "control deficiency", "vulnerability", "risk exposure",
                "compliance gap", "policy violation", "security risk",
                "audit finding", "remediation required", "immediate action"
            ],
            ComplianceRisk.MEDIUM: [
                "improvement needed", "minor deficiency", "observation",
                "recommendation", "enhancement", "monitoring required",
                "periodic review", "documentation update"
            ],
            ComplianceRisk.LOW: [
                "best practice", "suggestion", "consideration",
                "informational", "awareness", "guidance", "reference"
            ]
        }
    
    def get_framework_keywords(self, framework: ComplianceFramework) -> List[str]:
        """Get all keywords for a specific framework"""
        
        if framework not in self.keywords:
            return []
        
        all_keywords = []
        for category_keywords in self.keywords[framework].values():
            all_keywords.extend(category_keywords)
        
        return all_keywords
    
    def detect_framework(self, text: str) -> List[Tuple[ComplianceFramework, float]]:
        """Detect which compliance frameworks are mentioned in text"""
        
        text_lower = text.lower()
        framework_scores = {}
        
        for framework, categories in self.keywords.items():
            score = 0
            total_keywords = 0
            
            for category_keywords in categories.values():
                for keyword in category_keywords:
                    total_keywords += 1
                    if keyword.lower() in text_lower:
                        score += 1
        
            if total_keywords > 0:
                framework_scores[framework] = score / total_keywords
        
        # Sort by score (descending)
        sorted_frameworks = sorted(
            framework_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return [(fw, score) for fw, score in sorted_frameworks if score > 0.1]

class ComplianceNLPProcessor:
    """
    Advanced NLP processor for compliance documents
    """
    
    def __init__(self):
        self.keyword_library = ComplianceKeywordLibrary()
        self.processing_cache = {}
        self.document_cache = {}
    
    async def analyze_document(
        self,
        document_text: str,
        document_type: DocumentType,
        document_id: Optional[str] = None,
        target_frameworks: List[ComplianceFramework] = None
    ) -> DocumentAnalysis:
        """Analyze document for compliance requirements and risks"""
        
        start_time = datetime.utcnow()
        doc_id = document_id or f"doc_{uuid.uuid4().hex[:8]}"
        
        # Basic document metrics
        word_count = len(document_text.split())
        language = self._detect_language(document_text)
        
        # Sentiment analysis
        sentiment = await self._analyze_sentiment(document_text)
        
        # Entity extraction
        entities = await self._extract_entities(document_text)
        
        # Detect relevant frameworks
        if not target_frameworks:
            detected_frameworks = self.keyword_library.detect_framework(document_text)
            target_frameworks = [fw for fw, score in detected_frameworks[:3]]  # Top 3
        
        # Extract compliance requirements
        compliance_requirements = await self._extract_compliance_requirements(
            document_text, target_frameworks
        )
        
        # Identify risk indicators
        risk_indicators = await self._identify_risk_indicators(document_text)
        
        # Extract key topics
        key_topics = await self._extract_key_topics(document_text)
        
        # Calculate compliance score
        compliance_score = self._calculate_compliance_score(
            document_text, compliance_requirements, risk_indicators
        )
        
        # Calculate readability score
        readability_score = self._calculate_readability(document_text)
        
        # Generate summary
        summary = await self._generate_summary(document_text, key_topics)
        
        # Generate recommendations
        recommendations = await self._generate_recommendations(
            document_text, compliance_requirements, risk_indicators, document_type
        )
        
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        
        analysis = DocumentAnalysis(
            document_id=doc_id,
            document_type=document_type,
            word_count=word_count,
            language=language,
            sentiment=sentiment,
            entities=entities,
            compliance_requirements=compliance_requirements,
            risk_indicators=risk_indicators,
            key_topics=key_topics,
            compliance_score=compliance_score,
            readability_score=readability_score,
            summary=summary,
            recommendations=recommendations,
            processing_time=processing_time
        )
        
        # Cache result
        self.document_cache[doc_id] = analysis
        
        return analysis
    
    async def perform_gap_analysis(
        self,
        current_policies: List[str],
        target_framework: ComplianceFramework,
        target_requirements: List[str] = None
    ) -> List[GapAnalysis]:
        """Perform gap analysis between current policies and target framework"""
        
        gap_analyses = []
        
        # Get framework requirements
        if not target_requirements:
            target_requirements = self._get_framework_requirements(target_framework)
        
        # Analyze current policies
        current_coverage = {}
        for policy_text in current_policies:
            analysis = await self.analyze_document(policy_text, DocumentType.POLICY)
            for req in analysis.compliance_requirements:
                if req.framework == target_framework:
                    current_coverage[req.requirement_id] = req
        
        # Identify gaps
        for target_req in target_requirements:
            if target_req not in current_coverage:
                # Missing requirement
                gap = GapAnalysis(
                    requirement=ComplianceRequirement(
                        requirement_id=target_req,
                        framework=target_framework,
                        requirement_text=f"Requirement {target_req}",
                        control_reference=None,
                        risk_level=ComplianceRisk.HIGH,
                        mandatory=True,
                        due_date=None,
                        related_keywords=[]
                    ),
                    current_state="Not implemented",
                    target_state="Fully implemented",
                    gap_severity=ComplianceRisk.HIGH,
                    recommendations=[
                        f"Implement controls for {target_req}",
                        "Document procedures and policies",
                        "Assign responsible parties",
                        "Establish monitoring and review process"
                    ],
                    remediation_effort="high",
                    estimated_cost=None
                )
                gap_analyses.append(gap)
        
        return gap_analyses
    
    async def extract_obligations(
        self,
        regulation_text: str,
        entity_type: str = "organization"
    ) -> List[Dict[str, Any]]:
        """Extract legal obligations from regulatory text"""
        
        obligations = []
        sentences = self._split_sentences(regulation_text)
        
        for i, sentence in enumerate(sentences):
            sentence_lower = sentence.lower()
            
            # Check for obligation indicators
            obligation_patterns = [
                r'\bshall\b', r'\bmust\b', r'\brequired to\b', r'\bobligated to\b',
                r'\bresponsible for\b', r'\bensure that\b', r'\bimplement\b'
            ]
            
            has_obligation = any(re.search(pattern, sentence_lower) for pattern in obligation_patterns)
            
            if has_obligation:
                # Extract key components
                subject = self._extract_obligation_subject(sentence)
                action = self._extract_obligation_action(sentence)
                conditions = self._extract_conditions(sentence)
                timeframe = self._extract_timeframe(sentence)
                
                obligation = {
                    "text": sentence.strip(),
                    "subject": subject,
                    "action": action,
                    "conditions": conditions,
                    "timeframe": timeframe,
                    "mandatory": "shall" in sentence_lower or "must" in sentence_lower,
                    "sentence_index": i,
                    "risk_level": self._assess_obligation_risk(sentence)
                }
                
                obligations.append(obligation)
        
        return obligations
    
    def _detect_language(self, text: str) -> str:
        """Detect document language (simplified)"""
        # Simplified language detection - in production would use proper language detection
        english_indicators = ["the", "and", "or", "of", "in", "to", "for", "with", "on"]
        english_count = sum(1 for word in english_indicators if word in text.lower().split()[:100])
        
        return "english" if english_count > 5 else "unknown"
    
    async def _analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze document sentiment"""
        
        # Simplified sentiment analysis
        positive_words = [
            "compliant", "effective", "successful", "adequate", "satisfactory",
            "approved", "implemented", "secure", "protected", "validated"
        ]
        
        negative_words = [
            "non-compliant", "deficient", "inadequate", "failed", "violation",
            "breach", "risk", "vulnerable", "exposed", "insufficient"
        ]
        
        words = text.lower().split()
        positive_count = sum(1 for word in words if word in positive_words)
        negative_count = sum(1 for word in words if word in negative_words)
        total_words = len(words)
        
        positive_score = positive_count / total_words if total_words > 0 else 0
        negative_score = negative_count / total_words if total_words > 0 else 0
        neutral_score = 1 - positive_score - negative_score
        
        return {
            "positive": positive_score,
            "negative": negative_score,
            "neutral": max(0, neutral_score),
            "compound": positive_score - negative_score
        }
    
    async def _extract_entities(self, text: str) -> List[EntityExtraction]:
        """Extract named entities from text"""
        
        entities = []
        
        # Extract dates
        date_pattern = self.keyword_library.patterns["dates"]
        for match in re.finditer(date_pattern, text):
            entities.append(EntityExtraction(
                entity_text=match.group(),
                entity_type="DATE",
                confidence=0.9,
                start_position=match.start(),
                end_position=match.end(),
                context=text[max(0, match.start()-50):match.end()+50]
            ))
        
        # Extract monetary amounts
        money_pattern = self.keyword_library.patterns["monetary"]
        for match in re.finditer(money_pattern, text):
            entities.append(EntityExtraction(
                entity_text=match.group(),
                entity_type="MONEY",
                confidence=0.85,
                start_position=match.start(),
                end_position=match.end(),
                context=text[max(0, match.start()-50):match.end()+50]
            ))
        
        # Extract roles
        roles_pattern = self.keyword_library.patterns["roles"]
        for match in re.finditer(roles_pattern, text, re.IGNORECASE):
            entities.append(EntityExtraction(
                entity_text=match.group(),
                entity_type="ROLE",
                confidence=0.8,
                start_position=match.start(),
                end_position=match.end(),
                context=text[max(0, match.start()-50):match.end()+50]
            ))
        
        return entities
    
    async def _extract_compliance_requirements(
        self,
        text: str,
        frameworks: List[ComplianceFramework]
    ) -> List[ComplianceRequirement]:
        """Extract compliance requirements from text"""
        
        requirements = []
        sentences = self._split_sentences(text)
        
        for i, sentence in enumerate(sentences):
            sentence_lower = sentence.lower()
            
            # Check if sentence contains requirement language
            requirement_pattern = self.keyword_library.patterns["requirements"]
            if not re.search(requirement_pattern, sentence_lower):
                continue
            
            # Determine which framework this relates to
            relevant_framework = None
            for framework in frameworks:
                framework_keywords = self.keyword_library.get_framework_keywords(framework)
                if any(keyword.lower() in sentence_lower for keyword in framework_keywords):
                    relevant_framework = framework
                    break
            
            if relevant_framework:
                # Extract key elements
                control_ref = self._extract_control_reference(sentence)
                risk_level = self._assess_requirement_risk(sentence)
                related_keywords = self._extract_related_keywords(sentence, relevant_framework)
                
                requirement = ComplianceRequirement(
                    requirement_id=f"{relevant_framework.value}_{i}_{uuid.uuid4().hex[:6]}",
                    framework=relevant_framework,
                    requirement_text=sentence.strip(),
                    control_reference=control_ref,
                    risk_level=risk_level,
                    mandatory="shall" in sentence_lower or "must" in sentence_lower,
                    due_date=self._extract_due_date(sentence),
                    related_keywords=related_keywords
                )
                
                requirements.append(requirement)
        
        return requirements
    
    async def _identify_risk_indicators(self, text: str) -> List[str]:
        """Identify risk indicators in text"""
        
        risk_indicators = []
        text_lower = text.lower()
        
        for risk_level, keywords in self.keyword_library.risk_indicators.items():
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    risk_indicators.append(f"{risk_level.value}: {keyword}")
        
        return risk_indicators
    
    async def _extract_key_topics(self, text: str) -> List[str]:
        """Extract key topics from text using simple frequency analysis"""
        
        # Remove common stop words
        stop_words = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
            "of", "with", "by", "is", "are", "was", "were", "be", "been", "have",
            "has", "had", "do", "does", "did", "will", "would", "could", "should"
        }
        
        # Clean and tokenize text
        clean_text = re.sub(r'[^\w\s]', ' ', text.lower())
        words = [word for word in clean_text.split() if word not in stop_words and len(word) > 3]
        
        # Get most frequent words
        word_freq = Counter(words)
        top_words = [word for word, count in word_freq.most_common(20) if count > 2]
        
        # Identify multi-word phrases
        phrases = []
        sentences = self._split_sentences(text)
        for sentence in sentences:
            sentence_lower = sentence.lower()
            for keyword in ["data protection", "access control", "risk assessment", "audit trail"]:
                if keyword in sentence_lower:
                    phrases.append(keyword)
        
        return list(set(top_words + phrases))
    
    def _calculate_compliance_score(
        self,
        text: str,
        requirements: List[ComplianceRequirement],
        risk_indicators: List[str]
    ) -> float:
        """Calculate overall compliance score for document"""
        
        score = 0.5  # Base score
        
        # Positive indicators
        positive_keywords = [
            "implemented", "compliant", "adequate", "effective", "secure",
            "documented", "approved", "validated", "monitored", "reviewed"
        ]
        
        text_lower = text.lower()
        positive_count = sum(1 for keyword in positive_keywords if keyword in text_lower)
        
        # Negative indicators (risk indicators)
        critical_risks = [ri for ri in risk_indicators if "critical" in ri.lower()]
        high_risks = [ri for ri in risk_indicators if "high" in ri.lower()]
        
        # Calculate score
        score += min(0.3, positive_count * 0.02)  # Positive contribution
        score -= len(critical_risks) * 0.15      # Critical risk penalty
        score -= len(high_risks) * 0.08          # High risk penalty
        score += len(requirements) * 0.01        # Requirements identified
        
        return max(0.0, min(1.0, score))
    
    def _calculate_readability(self, text: str) -> float:
        """Calculate readability score (simplified Flesch Reading Ease)"""
        
        sentences = self._split_sentences(text)
        words = text.split()
        syllables = sum(self._count_syllables(word) for word in words)
        
        if len(sentences) == 0 or len(words) == 0:
            return 0.0
        
        avg_sentence_length = len(words) / len(sentences)
        avg_syllables_per_word = syllables / len(words)
        
        # Simplified Flesch Reading Ease formula
        score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)
        
        # Normalize to 0-1 scale
        return max(0.0, min(1.0, score / 100))
    
    async def _generate_summary(self, text: str, key_topics: List[str]) -> str:
        """Generate document summary"""
        
        sentences = self._split_sentences(text)
        
        # Score sentences based on key topics
        sentence_scores = []
        for sentence in sentences:
            score = 0
            sentence_lower = sentence.lower()
            
            for topic in key_topics:
                if topic.lower() in sentence_lower:
                    score += 1
            
            # Bonus for requirement language
            if re.search(r'\b(?:shall|must|required|mandatory)\b', sentence_lower):
                score += 2
            
            sentence_scores.append((sentence, score))
        
        # Select top sentences for summary
        top_sentences = sorted(sentence_scores, key=lambda x: x[1], reverse=True)[:3]
        summary_sentences = [sentence for sentence, score in top_sentences if score > 0]
        
        return " ".join(summary_sentences) if summary_sentences else "No key requirements identified."
    
    async def _generate_recommendations(
        self,
        text: str,
        requirements: List[ComplianceRequirement],
        risk_indicators: List[str],
        document_type: DocumentType
    ) -> List[str]:
        """Generate actionable recommendations"""
        
        recommendations = []
        
        # Risk-based recommendations
        critical_risks = [ri for ri in risk_indicators if "critical" in ri.lower()]
        if critical_risks:
            recommendations.append("Address critical risk indicators immediately")
        
        high_risks = [ri for ri in risk_indicators if "high" in ri.lower()]
        if high_risks:
            recommendations.append("Develop remediation plan for high-risk items")
        
        # Document-specific recommendations
        if document_type == DocumentType.POLICY:
            if len(requirements) < 5:
                recommendations.append("Consider expanding policy coverage")
            recommendations.append("Ensure regular policy review and updates")
        
        elif document_type == DocumentType.AUDIT_REPORT:
            if any("deficiency" in ri.lower() for ri in risk_indicators):
                recommendations.append("Prioritize remediation of identified deficiencies")
        
        # General recommendations
        if not recommendations:
            recommendations.append("Document appears to meet basic compliance requirements")
        
        return recommendations
    
    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting - in production would use proper NLP library
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    def _count_syllables(self, word: str) -> int:
        """Count syllables in word (simplified)"""
        vowels = 'aeiouy'
        count = 0
        prev_was_vowel = False
        
        for char in word.lower():
            is_vowel = char in vowels
            if is_vowel and not prev_was_vowel:
                count += 1
            prev_was_vowel = is_vowel
        
        return max(1, count)  # Every word has at least one syllable
    
    def _extract_control_reference(self, sentence: str) -> Optional[str]:
        """Extract control reference from sentence"""
        ref_pattern = self.keyword_library.patterns["references"]
        match = re.search(ref_pattern, sentence, re.IGNORECASE)
        return match.group() if match else None
    
    def _assess_requirement_risk(self, sentence: str) -> ComplianceRisk:
        """Assess risk level of requirement"""
        sentence_lower = sentence.lower()
        
        if any(word in sentence_lower for word in ["critical", "material", "significant"]):
            return ComplianceRisk.CRITICAL
        elif any(word in sentence_lower for word in ["important", "essential", "mandatory"]):
            return ComplianceRisk.HIGH
        elif any(word in sentence_lower for word in ["should", "recommended"]):
            return ComplianceRisk.MEDIUM
        else:
            return ComplianceRisk.LOW
    
    def _extract_related_keywords(self, sentence: str, framework: ComplianceFramework) -> List[str]:
        """Extract framework-related keywords from sentence"""
        
        framework_keywords = self.keyword_library.get_framework_keywords(framework)
        sentence_lower = sentence.lower()
        
        found_keywords = []
        for keyword in framework_keywords:
            if keyword.lower() in sentence_lower:
                found_keywords.append(keyword)
        
        return found_keywords
    
    def _extract_due_date(self, sentence: str) -> Optional[datetime]:
        """Extract due date from sentence"""
        # Simplified date extraction
        timeframe_pattern = self.keyword_library.patterns["timeframes"]
        match = re.search(timeframe_pattern, sentence, re.IGNORECASE)
        
        if match:
            # Extract number of days/months/years and calculate due date
            time_text = match.group().lower()
            if "days" in time_text:
                days = int(re.search(r'\d+', time_text).group())
                return datetime.utcnow() + timedelta(days=days)
            elif "months" in time_text:
                months = int(re.search(r'\d+', time_text).group())
                return datetime.utcnow() + timedelta(days=months * 30)
        
        return None
    
    def _get_framework_requirements(self, framework: ComplianceFramework) -> List[str]:
        """Get standard requirements for framework"""
        
        # Simplified framework requirements - in production would load from database
        framework_requirements = {
            ComplianceFramework.SOX: [
                "SOX.302", "SOX.404", "SOX.409", "SOX.906"
            ],
            ComplianceFramework.GDPR: [
                "Art.5", "Art.6", "Art.7", "Art.13", "Art.17", "Art.25", "Art.32"
            ],
            ComplianceFramework.HIPAA: [
                "164.308", "164.310", "164.312", "164.314", "164.316"
            ]
        }
        
        return framework_requirements.get(framework, [])
    
    def _extract_obligation_subject(self, sentence: str) -> str:
        """Extract subject of obligation"""
        # Simplified subject extraction
        subjects = ["organization", "company", "entity", "controller", "processor"]
        sentence_lower = sentence.lower()
        
        for subject in subjects:
            if subject in sentence_lower:
                return subject
        
        return "entity"
    
    def _extract_obligation_action(self, sentence: str) -> str:
        """Extract action from obligation"""
        actions = ["implement", "establish", "maintain", "ensure", "document", "monitor", "review"]
        sentence_lower = sentence.lower()
        
        for action in actions:
            if action in sentence_lower:
                return action
        
        return "comply"
    
    def _extract_conditions(self, sentence: str) -> List[str]:
        """Extract conditions from obligation"""
        condition_pattern = self.keyword_library.patterns["exceptions"]
        conditions = re.findall(condition_pattern, sentence, re.IGNORECASE)
        return conditions
    
    def _extract_timeframe(self, sentence: str) -> Optional[str]:
        """Extract timeframe from obligation"""
        timeframe_pattern = self.keyword_library.patterns["timeframes"]
        match = re.search(timeframe_pattern, sentence, re.IGNORECASE)
        return match.group() if match else None
    
    def _assess_obligation_risk(self, sentence: str) -> ComplianceRisk:
        """Assess risk level of obligation"""
        return self._assess_requirement_risk(sentence)

# Global compliance NLP processor
compliance_nlp = ComplianceNLPProcessor()

# Utility functions

async def quick_compliance_check(
    document_text: str,
    framework: ComplianceFramework
) -> Dict[str, Any]:
    """Quick compliance check for document"""
    
    analysis = await compliance_nlp.analyze_document(
        document_text=document_text,
        document_type=DocumentType.POLICY,
        target_frameworks=[framework]
    )
    
    return {
        "compliance_score": analysis.compliance_score,
        "requirements_found": len(analysis.compliance_requirements),
        "risk_indicators": len(analysis.risk_indicators),
        "key_recommendations": analysis.recommendations[:3],
        "overall_assessment": "compliant" if analysis.compliance_score > 0.7 else "needs_improvement"
    }

def create_compliance_report(
    analyses: List[DocumentAnalysis]
) -> Dict[str, Any]:
    """Create comprehensive compliance report"""
    
    if not analyses:
        return {"error": "No analyses provided"}
    
    # Aggregate statistics
    total_requirements = sum(len(a.compliance_requirements) for a in analyses)
    avg_compliance_score = sum(a.compliance_score for a in analyses) / len(analyses)
    total_risks = sum(len(a.risk_indicators) for a in analyses)
    
    # Framework coverage
    frameworks = defaultdict(int)
    for analysis in analyses:
        for req in analysis.compliance_requirements:
            frameworks[req.framework.value] += 1
    
    # Risk distribution
    risk_distribution = defaultdict(int)
    for analysis in analyses:
        for risk in analysis.risk_indicators:
            risk_level = risk.split(":")[0] if ":" in risk else "unknown"
            risk_distribution[risk_level] += 1
    
    return {
        "executive_summary": {
            "documents_analyzed": len(analyses),
            "average_compliance_score": avg_compliance_score,
            "total_requirements": total_requirements,
            "total_risks": total_risks,
            "overall_status": "compliant" if avg_compliance_score > 0.7 else "non_compliant"
        },
        "framework_coverage": dict(frameworks),
        "risk_distribution": dict(risk_distribution),
        "recommendations": [
            rec for analysis in analyses for rec in analysis.recommendations
        ][:10]  # Top 10 recommendations
    }