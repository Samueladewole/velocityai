//! Professional Credential Verification Module
//! 
//! Cryptographic verification system for professional credentials and certifications
//! Supports ISACA, SOC, and other compliance professional credentials

use crate::*;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use std::collections::HashMap;
use chrono::{DateTime, Utc, NaiveDate};
use uuid::Uuid;

/// Professional credential with cryptographic verification
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ProfessionalCredential {
    pub credential_id: String,
    pub professional_id: String,
    pub credential_type: CredentialType,
    pub issuer: String,
    pub issuance_date: String,
    pub expiration_date: Option<String>,
    pub cryptographic_proof: CryptographicProof,
    pub skills_attestation: Vec<String>,
    pub reputation_score: f64,
    pub verification_history: Vec<CredentialVerification>,
}

/// Types of professional credentials
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum CredentialType {
    ISACA_CISA,      // Certified Information Systems Auditor
    ISACA_CISM,      // Certified Information Security Manager
    ISACA_CGEIT,     // Certified in the Governance of Enterprise IT
    ISACA_CRISC,     // Certified in Risk and Information Systems Control
    ISACA_CDPSE,     // Certified Data Privacy Solutions Engineer
    SOC_AUDITOR,     // SOC 1/2/3 Auditor
    COMPLIANCE_EXPERT, // General Compliance Expert
    CISSP,           // Certified Information Systems Security Professional
    CISA_GOV,        // Government CISA Certification
    ISO_AUDITOR,     // ISO 27001/27002 Auditor
    NIST_SPECIALIST, // NIST Framework Specialist
    GDPR_SPECIALIST, // GDPR Compliance Specialist
    CUSTOM(String),  // Custom credential type
}

/// Credential verification record
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CredentialVerification {
    pub verification_id: String,
    pub verifier_id: String,
    pub verifier_type: VerifierType,
    pub verification_method: VerificationMethod,
    pub verification_result: VerificationResult,
    pub confidence_score: f64,
    pub timestamp: String,
    pub cryptographic_signature: String,
    pub verification_details: VerificationDetails,
}

/// Types of verifiers
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum VerifierType {
    IssuingOrganization,  // Original issuing organization
    ThirdPartyValidator,  // Independent verification service
    PeerReview,          // Professional peer verification
    GovernmentAgency,    // Government verification
    BlockchainOracle,    // Blockchain-based oracle
    AISystem,           // AI-powered verification
}

/// Verification methods
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum VerificationMethod {
    DocumentReview,      // Manual document verification
    DatabaseLookup,      // Direct database verification
    BiometricMatch,      // Biometric verification
    CryptographicProof,  // Cryptographic signature verification
    BlockchainAttestation, // Blockchain-based attestation
    MultiFactor,         // Multiple verification methods
}

/// Verification results
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum VerificationResult {
    Verified,           // Credential fully verified
    Expired,           // Credential expired
    Revoked,           // Credential revoked
    Suspended,         // Credential temporarily suspended
    Disputed,          // Credential under dispute
    Insufficient,      // Insufficient evidence
    Fraudulent,        // Fraudulent credential detected
}

/// Verification details
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct VerificationDetails {
    pub verification_steps: Vec<VerificationStep>,
    pub evidence_collected: Vec<Evidence>,
    pub cross_references: Vec<String>,
    pub automated_checks: Vec<AutomatedCheck>,
}

/// Individual verification step
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct VerificationStep {
    pub step_id: String,
    pub description: String,
    pub method: VerificationMethod,
    pub result: bool,
    pub confidence: f64,
    pub timestamp: String,
}

/// Evidence for credential verification
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Evidence {
    pub evidence_id: String,
    pub evidence_type: EvidenceType,
    pub source: String,
    pub content_hash: String,
    pub authenticity_score: f64,
}

/// Types of evidence
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum EvidenceType {
    Certificate,         // Original certificate
    Transcript,         // Educational transcript
    ExamResults,        // Certification exam results
    ContinuingEducation, // CE credits/hours
    ProfessionalReference, // Professional reference
    EmploymentHistory,   // Employment verification
    ProjectPortfolio,    // Work samples/portfolio
}

/// Automated verification check
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AutomatedCheck {
    pub check_id: String,
    pub check_type: String,
    pub algorithm: String,
    pub result: bool,
    pub confidence: f64,
    pub details: HashMap<String, serde_json::Value>,
}

/// Professional skill assessment
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SkillAssessment {
    pub skill_id: String,
    pub skill_name: String,
    pub proficiency_level: ProficiencyLevel,
    pub assessment_method: String,
    pub score: f64,
    pub assessor_id: String,
    pub assessment_date: String,
    pub validity_period: Option<u32>, // months
}

/// Proficiency levels
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum ProficiencyLevel {
    Beginner,
    Intermediate,
    Advanced,
    Expert,
    Master,
}

/// Credential renewal record
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CredentialRenewal {
    pub renewal_id: String,
    pub original_credential_id: String,
    pub renewal_date: String,
    pub new_expiration_date: String,
    pub continuing_education_credits: Vec<CECredit>,
    pub renewal_fee_paid: bool,
    pub renewal_proof: CryptographicProof,
}

/// Continuing Education credit
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CECredit {
    pub credit_id: String,
    pub provider: String,
    pub course_title: String,
    pub credit_hours: f64,
    pub completion_date: String,
    pub verification_code: String,
}

/// Credential verification engine
pub struct CredentialVerificationEngine {
    issuer_registry: HashMap<String, IssuerInfo>,
    verification_rules: HashMap<CredentialType, Vec<VerificationRule>>,
    blockchain_validators: Vec<String>,
}

/// Issuer information
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct IssuerInfo {
    pub issuer_id: String,
    pub organization_name: String,
    pub accreditation_status: String,
    pub public_key: String,
    pub verification_endpoint: String,
    pub trust_score: f64,
}

/// Verification rule
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct VerificationRule {
    pub rule_id: String,
    pub description: String,
    pub required_evidence: Vec<EvidenceType>,
    pub minimum_confidence: f64,
    pub mandatory: bool,
}

impl CredentialVerificationEngine {
    /// Create new credential verification engine
    pub fn new() -> Self {
        let mut engine = CredentialVerificationEngine {
            issuer_registry: HashMap::new(),
            verification_rules: HashMap::new(),
            blockchain_validators: Vec::new(),
        };
        
        engine.initialize_default_rules();
        engine
    }

    /// Issue new professional credential with cryptographic proof
    pub fn issue_credential(
        &self,
        professional_id: &str,
        credential_type: CredentialType,
        issuer: &str,
        skills_attestation: Vec<String>,
        validity_period_months: Option<u32>,
        crypto_engine: &mut VelocityCryptographicEngine,
    ) -> Result<ProfessionalCredential, String> {
        
        // Validate issuer authorization
        self.validate_issuer_authorization(issuer, &credential_type)?;

        let credential_id = format!("cred_{}", Uuid::new_v4());
        let issuance_date = Utc::now().to_rfc3339();
        let expiration_date = validity_period_months.map(|months| {
            let expiry = Utc::now() + chrono::Duration::days((months * 30) as i64);
            expiry.to_rfc3339()
        });

        // Create cryptographic proof
        let proof_data = format!(
            "{}{}{}{}{}",
            credential_id,
            professional_id,
            serde_json::to_string(&credential_type).unwrap_or_default(),
            issuer,
            issuance_date
        );
        let cryptographic_proof = self.create_credential_proof(&proof_data, crypto_engine);

        // Create initial verification
        let initial_verification = CredentialVerification {
            verification_id: format!("verify_{}", Uuid::new_v4()),
            verifier_id: issuer.to_string(),
            verifier_type: VerifierType::IssuingOrganization,
            verification_method: VerificationMethod::CryptographicProof,
            verification_result: VerificationResult::Verified,
            confidence_score: 0.95,
            timestamp: Utc::now().to_rfc3339(),
            cryptographic_signature: self.sign_verification(&credential_id, issuer),
            verification_details: VerificationDetails {
                verification_steps: vec![
                    VerificationStep {
                        step_id: "issuance_verification".to_string(),
                        description: "Initial credential issuance verification".to_string(),
                        method: VerificationMethod::CryptographicProof,
                        result: true,
                        confidence: 0.95,
                        timestamp: Utc::now().to_rfc3339(),
                    }
                ],
                evidence_collected: Vec::new(),
                cross_references: Vec::new(),
                automated_checks: Vec::new(),
            },
        };

        Ok(ProfessionalCredential {
            credential_id,
            professional_id: professional_id.to_string(),
            credential_type,
            issuer: issuer.to_string(),
            issuance_date,
            expiration_date,
            cryptographic_proof,
            skills_attestation,
            reputation_score: 0.8, // Initial reputation score
            verification_history: vec![initial_verification],
        })
    }

    /// Verify professional credential integrity
    pub fn verify_credential(
        &self,
        credential: &ProfessionalCredential,
        verification_method: VerificationMethod,
        verifier_id: &str,
    ) -> Result<CredentialVerificationResult, String> {
        
        // Check if credential is expired
        let is_expired = self.check_credential_expiry(credential);
        
        // Verify cryptographic proof
        let crypto_valid = self.verify_cryptographic_proof(&credential.cryptographic_proof);
        
        // Verify issuer authenticity
        let issuer_valid = self.verify_issuer_authenticity(&credential.issuer);
        
        // Check against revocation lists
        let not_revoked = self.check_revocation_status(&credential.credential_id);
        
        // Perform method-specific verification
        let method_verification = self.perform_method_verification(credential, &verification_method)?;
        
        // Calculate overall confidence
        let verification_confidence = self.calculate_credential_confidence(
            !is_expired,
            crypto_valid,
            issuer_valid,
            not_revoked,
            method_verification.success,
            method_verification.confidence,
        );

        // Determine verification result
        let result = if is_expired {
            VerificationResult::Expired
        } else if !not_revoked {
            VerificationResult::Revoked
        } else if crypto_valid && issuer_valid && method_verification.success {
            VerificationResult::Verified
        } else {
            VerificationResult::Insufficient
        };

        Ok(CredentialVerificationResult {
            credential_id: credential.credential_id.clone(),
            verification_result: result,
            confidence_score: verification_confidence,
            verification_details: CredentialVerificationDetails {
                is_expired,
                crypto_proof_valid: crypto_valid,
                issuer_authentic: issuer_valid,
                not_revoked,
                method_verification_success: method_verification.success,
                verification_steps: method_verification.steps,
            },
            verifier_id: verifier_id.to_string(),
            timestamp: Utc::now().to_rfc3339(),
        })
    }

    /// Perform skill assessment for credential holder
    pub fn assess_professional_skills(
        &self,
        professional_id: &str,
        credential_type: &CredentialType,
        assessment_method: &str,
        assessor_id: &str,
    ) -> Result<Vec<SkillAssessment>, String> {
        
        let required_skills = self.get_credential_required_skills(credential_type);
        let mut assessments = Vec::new();

        for skill in required_skills {
            // Simulate skill assessment (in real implementation, this would involve actual testing)
            let assessment_score = self.simulate_skill_assessment(&skill, assessment_method);
            
            let assessment = SkillAssessment {
                skill_id: format!("skill_{}", Uuid::new_v4()),
                skill_name: skill.clone(),
                proficiency_level: self.score_to_proficiency_level(assessment_score),
                assessment_method: assessment_method.to_string(),
                score: assessment_score,
                assessor_id: assessor_id.to_string(),
                assessment_date: Utc::now().to_rfc3339(),
                validity_period: Some(24), // 24 months validity
            };
            
            assessments.push(assessment);
        }

        Ok(assessments)
    }

    /// Process credential renewal
    pub fn process_credential_renewal(
        &self,
        original_credential: &ProfessionalCredential,
        ce_credits: Vec<CECredit>,
        crypto_engine: &mut VelocityCryptographicEngine,
    ) -> Result<CredentialRenewal, String> {
        
        // Validate continuing education requirements
        self.validate_ce_requirements(&original_credential.credential_type, &ce_credits)?;
        
        // Check if renewal is within allowed timeframe
        self.validate_renewal_timeframe(original_credential)?;

        let renewal_id = format!("renewal_{}", Uuid::new_v4());
        let renewal_date = Utc::now().to_rfc3339();
        let new_expiration_date = self.calculate_new_expiration_date(&original_credential.credential_type);

        // Create cryptographic proof for renewal
        let renewal_proof_data = format!(
            "{}{}{}{}",
            renewal_id,
            original_credential.credential_id,
            renewal_date,
            new_expiration_date
        );
        let renewal_proof = self.create_credential_proof(&renewal_proof_data, crypto_engine);

        Ok(CredentialRenewal {
            renewal_id,
            original_credential_id: original_credential.credential_id.clone(),
            renewal_date,
            new_expiration_date,
            continuing_education_credits: ce_credits,
            renewal_fee_paid: true, // Assume fee is paid
            renewal_proof,
        })
    }

    /// Generate credential analytics
    pub fn generate_credential_analytics(
        &self,
        credentials: &[ProfessionalCredential],
        time_range: (String, String),
    ) -> CredentialAnalytics {
        
        let total_credentials = credentials.len();
        
        // Analyze credential types
        let mut type_distribution = HashMap::new();
        for credential in credentials {
            let type_name = format!("{:?}", credential.credential_type);
            *type_distribution.entry(type_name).or_insert(0) += 1;
        }

        // Analyze expiration status
        let active_credentials = credentials.iter()
            .filter(|c| !self.check_credential_expiry(c))
            .count();
        
        let expired_credentials = total_credentials - active_credentials;

        // Calculate average reputation score
        let avg_reputation = if total_credentials > 0 {
            credentials.iter().map(|c| c.reputation_score).sum::<f64>() / total_credentials as f64
        } else {
            0.0
        };

        // Analyze verification success rate
        let verification_success_rate = self.calculate_verification_success_rate(credentials);

        CredentialAnalytics {
            time_range,
            total_credentials: total_credentials as u64,
            active_credentials: active_credentials as u64,
            expired_credentials: expired_credentials as u64,
            credential_type_distribution: type_distribution,
            average_reputation_score: avg_reputation,
            verification_success_rate,
            top_skills: self.analyze_top_skills(credentials),
            issuer_distribution: self.analyze_issuer_distribution(credentials),
        }
    }

    // Private helper methods

    fn initialize_default_rules(&mut self) {
        // Initialize verification rules for different credential types
        let isaca_rules = vec![
            VerificationRule {
                rule_id: "isaca_cert_check".to_string(),
                description: "Verify ISACA certificate authenticity".to_string(),
                required_evidence: vec![EvidenceType::Certificate, EvidenceType::ExamResults],
                minimum_confidence: 0.9,
                mandatory: true,
            },
            VerificationRule {
                rule_id: "isaca_ce_check".to_string(),
                description: "Verify continuing education requirements".to_string(),
                required_evidence: vec![EvidenceType::ContinuingEducation],
                minimum_confidence: 0.8,
                mandatory: true,
            },
        ];

        self.verification_rules.insert(CredentialType::ISACA_CISA, isaca_rules.clone());
        self.verification_rules.insert(CredentialType::ISACA_CISM, isaca_rules.clone());
        self.verification_rules.insert(CredentialType::ISACA_CGEIT, isaca_rules.clone());
        self.verification_rules.insert(CredentialType::ISACA_CRISC, isaca_rules);
    }

    fn validate_issuer_authorization(&self, issuer: &str, credential_type: &CredentialType) -> Result<(), String> {
        // Check if issuer is authorized to issue this type of credential
        if let Some(issuer_info) = self.issuer_registry.get(issuer) {
            if issuer_info.trust_score < 0.8 {
                return Err("Issuer trust score too low".to_string());
            }
        } else {
            // For demo purposes, allow unknown issuers
            return Ok(());
        }
        Ok(())
    }

    fn create_credential_proof(&self, data: &str, _crypto_engine: &mut VelocityCryptographicEngine) -> CryptographicProof {
        let hash = {
            let mut hasher = Sha256::new();
            hasher.update(data.as_bytes());
            hex::encode(hasher.finalize())
        };

        CryptographicProof {
            id: format!("cred_proof_{}", Uuid::new_v4()),
            hash: hash.clone(),
            signature: self.sign_data(&hash),
            timestamp: Utc::now().to_rfc3339(),
            previous_hash: None,
            merkle_root: None,
            block_height: 0,
            verification_status: "verified".to_string(),
        }
    }

    fn sign_data(&self, data: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(format!("cred_sign_{}", data).as_bytes());
        hex::encode(hasher.finalize())
    }

    fn sign_verification(&self, credential_id: &str, verifier_id: &str) -> String {
        let data = format!("{}{}{}", credential_id, verifier_id, Utc::now().to_rfc3339());
        self.sign_data(&data)
    }

    fn check_credential_expiry(&self, credential: &ProfessionalCredential) -> bool {
        if let Some(expiration_date) = &credential.expiration_date {
            if let Ok(expiry) = DateTime::parse_from_rfc3339(expiration_date) {
                return Utc::now() > expiry;
            }
        }
        false
    }

    fn verify_cryptographic_proof(&self, proof: &CryptographicProof) -> bool {
        proof.verification_status == "verified" && 
        proof.hash.len() == 64 && 
        proof.signature.len() > 0
    }

    fn verify_issuer_authenticity(&self, issuer: &str) -> bool {
        // In a real implementation, this would verify the issuer's digital signature
        !issuer.is_empty()
    }

    fn check_revocation_status(&self, _credential_id: &str) -> bool {
        // In a real implementation, this would check against revocation lists
        true // Assume not revoked for demo
    }

    fn perform_method_verification(&self, credential: &ProfessionalCredential, method: &VerificationMethod) -> Result<MethodVerificationResult, String> {
        match method {
            VerificationMethod::CryptographicProof => {
                Ok(MethodVerificationResult {
                    success: self.verify_cryptographic_proof(&credential.cryptographic_proof),
                    confidence: 0.95,
                    steps: vec!["Cryptographic signature verified".to_string()],
                })
            },
            VerificationMethod::DatabaseLookup => {
                // Simulate database lookup
                Ok(MethodVerificationResult {
                    success: true,
                    confidence: 0.9,
                    steps: vec!["Database lookup completed".to_string()],
                })
            },
            _ => {
                Ok(MethodVerificationResult {
                    success: true,
                    confidence: 0.8,
                    steps: vec!["Basic verification completed".to_string()],
                })
            }
        }
    }

    fn calculate_credential_confidence(&self, not_expired: bool, crypto_valid: bool, issuer_valid: bool, not_revoked: bool, method_success: bool, method_confidence: f64) -> f64 {
        let base_factors = [not_expired, crypto_valid, issuer_valid, not_revoked, method_success];
        let base_score = base_factors.iter().filter(|&&b| b).count() as f64 / base_factors.len() as f64;
        
        // Weight the method confidence
        (base_score * 0.7) + (method_confidence * 0.3)
    }

    fn get_credential_required_skills(&self, credential_type: &CredentialType) -> Vec<String> {
        match credential_type {
            CredentialType::ISACA_CISA => vec![
                "Information Systems Auditing".to_string(),
                "Risk Assessment".to_string(),
                "Compliance Management".to_string(),
                "IT Governance".to_string(),
            ],
            CredentialType::ISACA_CISM => vec![
                "Information Security Management".to_string(),
                "Risk Management".to_string(),
                "Incident Response".to_string(),
                "Security Program Development".to_string(),
            ],
            CredentialType::SOC_AUDITOR => vec![
                "SOC 1 Auditing".to_string(),
                "SOC 2 Auditing".to_string(),
                "Internal Controls".to_string(),
                "Financial Reporting".to_string(),
            ],
            _ => vec!["General Compliance".to_string()],
        }
    }

    fn simulate_skill_assessment(&self, _skill: &str, _method: &str) -> f64 {
        // Simulate assessment score between 0.6 and 1.0
        0.6 + (rand::random::<f64>() * 0.4)
    }

    fn score_to_proficiency_level(&self, score: f64) -> ProficiencyLevel {
        match score {
            s if s >= 0.9 => ProficiencyLevel::Expert,
            s if s >= 0.8 => ProficiencyLevel::Advanced,
            s if s >= 0.7 => ProficiencyLevel::Intermediate,
            _ => ProficiencyLevel::Beginner,
        }
    }

    fn validate_ce_requirements(&self, credential_type: &CredentialType, credits: &[CECredit]) -> Result<(), String> {
        let required_hours = match credential_type {
            CredentialType::ISACA_CISA | CredentialType::ISACA_CISM | 
            CredentialType::ISACA_CGEIT | CredentialType::ISACA_CRISC => 40.0,
            CredentialType::SOC_AUDITOR => 80.0,
            _ => 20.0,
        };

        let total_hours: f64 = credits.iter().map(|c| c.credit_hours).sum();
        
        if total_hours < required_hours {
            return Err(format!("Insufficient CE credits: {} required, {} provided", required_hours, total_hours));
        }

        Ok(())
    }

    fn validate_renewal_timeframe(&self, credential: &ProfessionalCredential) -> Result<(), String> {
        if let Some(expiration_date) = &credential.expiration_date {
            if let Ok(expiry) = DateTime::parse_from_rfc3339(expiration_date) {
                let renewal_window = expiry - chrono::Duration::days(90); // 90-day renewal window
                if Utc::now() < renewal_window {
                    return Err("Renewal attempted too early".to_string());
                }
            }
        }
        Ok(())
    }

    fn calculate_new_expiration_date(&self, credential_type: &CredentialType) -> String {
        let years = match credential_type {
            CredentialType::ISACA_CISA | CredentialType::ISACA_CISM | 
            CredentialType::ISACA_CGEIT | CredentialType::ISACA_CRISC => 3,
            CredentialType::SOC_AUDITOR => 2,
            _ => 1,
        };

        let expiry = Utc::now() + chrono::Duration::days(years * 365);
        expiry.to_rfc3339()
    }

    fn calculate_verification_success_rate(&self, credentials: &[ProfessionalCredential]) -> f64 {
        if credentials.is_empty() {
            return 0.0;
        }

        let successful_verifications = credentials.iter()
            .filter(|c| c.verification_history.iter()
                .any(|v| matches!(v.verification_result, VerificationResult::Verified)))
            .count();

        successful_verifications as f64 / credentials.len() as f64
    }

    fn analyze_top_skills(&self, credentials: &[ProfessionalCredential]) -> Vec<String> {
        let mut skill_counts = HashMap::new();
        
        for credential in credentials {
            for skill in &credential.skills_attestation {
                *skill_counts.entry(skill.clone()).or_insert(0) += 1;
            }
        }

        let mut skills: Vec<(String, u32)> = skill_counts.into_iter().collect();
        skills.sort_by(|a, b| b.1.cmp(&a.1));
        
        skills.into_iter().take(10).map(|(skill, _)| skill).collect()
    }

    fn analyze_issuer_distribution(&self, credentials: &[ProfessionalCredential]) -> HashMap<String, u32> {
        let mut distribution = HashMap::new();
        
        for credential in credentials {
            *distribution.entry(credential.issuer.clone()).or_insert(0) += 1;
        }
        
        distribution
    }
}

/// Supporting structures

#[derive(Debug)]
struct MethodVerificationResult {
    success: bool,
    confidence: f64,
    steps: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CredentialVerificationResult {
    pub credential_id: String,
    pub verification_result: VerificationResult,
    pub confidence_score: f64,
    pub verification_details: CredentialVerificationDetails,
    pub verifier_id: String,
    pub timestamp: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CredentialVerificationDetails {
    pub is_expired: bool,
    pub crypto_proof_valid: bool,
    pub issuer_authentic: bool,
    pub not_revoked: bool,
    pub method_verification_success: bool,
    pub verification_steps: Vec<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CredentialAnalytics {
    pub time_range: (String, String),
    pub total_credentials: u64,
    pub active_credentials: u64,
    pub expired_credentials: u64,
    pub credential_type_distribution: HashMap<String, u32>,
    pub average_reputation_score: f64,
    pub verification_success_rate: f64,
    pub top_skills: Vec<String>,
    pub issuer_distribution: HashMap<String, u32>,
}