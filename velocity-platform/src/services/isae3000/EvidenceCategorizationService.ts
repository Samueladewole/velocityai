export interface ISAE3000Control {
  id: string;
  category: 'CC1' | 'CC2' | 'CC3' | 'CC4' | 'CC5' | 'CC6' | 'CC7' | 'CC8' | 'CC9';
  subcategory: string;
  title: string;
  description: string;
  requirements: string[];
  evidenceTypes: string[];
  bankingSpecific: boolean;
  automationLevel: number;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface EvidenceClassification {
  evidenceId: string;
  primaryCategory: string;
  secondaryCategories: string[];
  confidenceScore: number;
  isaeControls: string[];
  bankingRelevance: number;
  auditReadiness: 'ready' | 'requires-review' | 'incomplete';
  recommendations: string[];
  tags: string[];
}

export interface CategorizationMetrics {
  totalEvidence: number;
  categorizedEvidence: number;
  averageConfidence: number;
  auditReadyEvidence: number;
  bankingSpecificEvidence: number;
  controlCoverage: Record<string, number>;
  lastUpdate: Date;
}

class EvidenceCategorizationService {
  private static instance: EvidenceCategorizationService;
  private isaeControls: Map<string, ISAE3000Control> = new Map();
  private evidenceClassifications: Map<string, EvidenceClassification> = new Map();

  private constructor() {
    this.initializeISAE3000Controls();
  }

  public static getInstance(): EvidenceCategorizationService {
    if (!EvidenceCategorizationService.instance) {
      EvidenceCategorizationService.instance = new EvidenceCategorizationService();
    }
    return EvidenceCategorizationService.instance;
  }

  private initializeISAE3000Controls() {
    const controls: ISAE3000Control[] = [
      // Control Category 1: Control Environment
      {
        id: 'CC1.1',
        category: 'CC1',
        subcategory: 'Integrity and Ethical Values',
        title: 'Banking Ethics and Conduct Framework',
        description: 'The organization demonstrates a commitment to integrity and ethical values in banking operations',
        requirements: [
          'Code of conduct specific to banking operations',
          'Ethics training for banking personnel',
          'Disciplinary procedures for ethical violations',
          'Whistleblower protection programs'
        ],
        evidenceTypes: ['policy-documents', 'training-records', 'incident-reports', 'disciplinary-actions'],
        bankingSpecific: true,
        automationLevel: 85,
        riskLevel: 'high'
      },
      {
        id: 'CC1.2',
        category: 'CC1',
        subcategory: 'Board Independence',
        title: 'Board Oversight of Banking Operations',
        description: 'The board exercises independent oversight of banking operations and risk management',
        requirements: [
          'Independent board members with banking expertise',
          'Regular board meetings on banking operations',
          'Board risk committee oversight',
          'Banking regulatory compliance reporting to board'
        ],
        evidenceTypes: ['board-minutes', 'risk-reports', 'regulatory-filings', 'committee-charters'],
        bankingSpecific: true,
        automationLevel: 70,
        riskLevel: 'high'
      },
      // Control Category 2: Risk Assessment
      {
        id: 'CC2.1',
        category: 'CC2',
        subcategory: 'Banking Risk Identification',
        title: 'Comprehensive Banking Risk Assessment',
        description: 'The organization identifies risks relevant to banking operations and business objectives',
        requirements: [
          'Credit risk assessment procedures',
          'Operational risk identification frameworks',
          'Market risk evaluation processes',
          'Liquidity risk monitoring systems'
        ],
        evidenceTypes: ['risk-assessments', 'credit-models', 'stress-test-results', 'risk-registers'],
        bankingSpecific: true,
        automationLevel: 92,
        riskLevel: 'high'
      },
      {
        id: 'CC2.2',
        category: 'CC2',
        subcategory: 'Fraud Risk Assessment',
        title: 'Banking Fraud Risk Management',
        description: 'The organization assesses the risk of material misstatement due to fraud in banking transactions',
        requirements: [
          'Transaction monitoring systems',
          'Anti-money laundering (AML) procedures',
          'Fraud detection algorithms',
          'Suspicious activity reporting processes'
        ],
        evidenceTypes: ['fraud-reports', 'aml-reports', 'transaction-monitoring', 'suspicious-activity-reports'],
        bankingSpecific: true,
        automationLevel: 95,
        riskLevel: 'high'
      },
      // Control Category 5: Risk Assessment
      {
        id: 'CC5.1',
        category: 'CC5',
        subcategory: 'Financial Reporting Controls',
        title: 'Banking Financial Reporting Framework',
        description: 'The organization maintains controls over financial reporting specific to banking operations',
        requirements: [
          'Daily cash position reconciliations',
          'Loan loss provision calculations',
          'Interest income/expense accruals',
          'Regulatory capital calculations'
        ],
        evidenceTypes: ['reconciliations', 'provision-calculations', 'interest-calculations', 'capital-reports'],
        bankingSpecific: true,
        automationLevel: 88,
        riskLevel: 'medium'
      },
      // Control Category 6: Logical and Physical Access Controls
      {
        id: 'CC6.1',
        category: 'CC6',
        subcategory: 'Banking System Access',
        title: 'Core Banking System Access Controls',
        description: 'The organization restricts logical access to banking systems and data',
        requirements: [
          'Multi-factor authentication for banking systems',
          'Role-based access controls for banking functions',
          'Segregation of duties in transaction processing',
          'Regular access reviews for banking personnel'
        ],
        evidenceTypes: ['access-logs', 'user-provisioning', 'role-matrices', 'access-reviews'],
        bankingSpecific: true,
        automationLevel: 95,
        riskLevel: 'high'
      },
      {
        id: 'CC6.2',
        category: 'CC6',
        subcategory: 'Data Protection',
        title: 'Customer Data Protection Controls',
        description: 'The organization protects customer financial data through appropriate controls',
        requirements: [
          'Data encryption for customer information',
          'Data masking in non-production environments',
          'Data retention policies compliance',
          'Privacy controls for customer data'
        ],
        evidenceTypes: ['encryption-reports', 'data-masking-logs', 'retention-policies', 'privacy-controls'],
        bankingSpecific: true,
        automationLevel: 90,
        riskLevel: 'high'
      },
      // Control Category 7: System Operations
      {
        id: 'CC7.1',
        category: 'CC7',
        subcategory: 'Transaction Processing',
        title: 'Banking Transaction Processing Controls',
        description: 'The organization processes banking transactions in a controlled manner',
        requirements: [
          'Automated transaction validation rules',
          'Transaction limit controls',
          'Exception handling procedures',
          'End-of-day processing controls'
        ],
        evidenceTypes: ['transaction-logs', 'validation-reports', 'exception-reports', 'processing-controls'],
        bankingSpecific: true,
        automationLevel: 96,
        riskLevel: 'high'
      },
      {
        id: 'CC7.2',
        category: 'CC7',
        subcategory: 'Credit Processing',
        title: 'Credit Decision Processing Framework',
        description: 'The organization maintains controls over credit decision processes',
        requirements: [
          'Automated credit scoring models',
          'Credit approval workflows',
          'Credit committee oversight',
          'Loan documentation requirements'
        ],
        evidenceTypes: ['credit-models', 'approval-workflows', 'committee-minutes', 'loan-documentation'],
        bankingSpecific: true,
        automationLevel: 92,
        riskLevel: 'high'
      },
      // Control Category 8: Change Management
      {
        id: 'CC8.1',
        category: 'CC8',
        subcategory: 'Banking System Changes',
        title: 'Core Banking System Change Management',
        description: 'The organization manages changes to banking systems through appropriate controls',
        requirements: [
          'Change approval processes for banking systems',
          'Testing requirements for banking changes',
          'Rollback procedures for failed changes',
          'Regulatory notification for material changes'
        ],
        evidenceTypes: ['change-requests', 'test-results', 'deployment-logs', 'regulatory-notifications'],
        bankingSpecific: true,
        automationLevel: 90,
        riskLevel: 'medium'
      }
    ];

    controls.forEach(control => {
      this.isaeControls.set(control.id, control);
    });
  }

  public async categorizeEvidence(evidenceData: {
    id: string;
    type: string;
    description: string;
    source: string;
    content?: any;
    metadata?: Record<string, any>;
  }): Promise<EvidenceClassification> {
    
    // AI-powered categorization logic (simulated)
    const classification = await this.performClassification(evidenceData);
    
    // Store the classification
    this.evidenceClassifications.set(evidenceData.id, classification);
    
    return classification;
  }

  private async performClassification(evidenceData: {
    id: string;
    type: string;
    description: string;
    source: string;
    content?: any;
    metadata?: Record<string, any>;
  }): Promise<EvidenceClassification> {
    
    // Simulate AI categorization with rule-based logic
    const matchedControls: string[] = [];
    const tags: string[] = [];
    let bankingRelevance = 0;
    let primaryCategory = 'general';
    const secondaryCategories: string[] = [];
    
    // Analyze evidence type and description
    const evidenceText = `${evidenceData.type} ${evidenceData.description}`.toLowerCase();
    
    // Banking-specific keyword analysis
    const bankingKeywords = [
      'transaction', 'credit', 'loan', 'deposit', 'payment', 'swift', 'ach',
      'customer', 'account', 'balance', 'interest', 'fee', 'regulation',
      'compliance', 'aml', 'kyc', 'bsa', 'cra', 'fair lending', 'privacy'
    ];
    
    bankingKeywords.forEach(keyword => {
      if (evidenceText.includes(keyword)) {
        bankingRelevance += 10;
        tags.push(keyword);
      }
    });
    
    // Control mapping based on evidence type
    const controlMappings: Record<string, string[]> = {
      'transaction-log': ['CC7.1', 'CC6.1'],
      'access-log': ['CC6.1', 'CC6.2'],
      'reconciliation': ['CC5.1'],
      'credit-decision': ['CC7.2', 'CC2.1'],
      'approval-workflow': ['CC7.2', 'CC8.1'],
      'risk-assessment': ['CC2.1', 'CC2.2'],
      'change-request': ['CC8.1'],
      'policy-document': ['CC1.1', 'CC1.2'],
      'training-record': ['CC1.1'],
      'board-minutes': ['CC1.2'],
      'fraud-report': ['CC2.2'],
      'encryption-report': ['CC6.2'],
      'validation-report': ['CC7.1'],
      'exception-report': ['CC7.1', 'CC7.2']
    };
    
    // Find matching controls
    Object.entries(controlMappings).forEach(([type, controls]) => {
      if (evidenceText.includes(type.replace('-', ' ')) || evidenceData.type.includes(type)) {
        matchedControls.push(...controls);
        primaryCategory = type;
      }
    });
    
    // Determine secondary categories based on control categories
    matchedControls.forEach(controlId => {
      const control = this.isaeControls.get(controlId);
      if (control) {
        secondaryCategories.push(control.category);
        if (control.bankingSpecific) {
          bankingRelevance += 20;
        }
      }
    });
    
    // Calculate confidence score
    let confidenceScore = 0.6; // Base confidence
    if (matchedControls.length > 0) confidenceScore += 0.2;
    if (bankingRelevance > 30) confidenceScore += 0.1;
    if (tags.length > 2) confidenceScore += 0.1;
    
    // Determine audit readiness
    let auditReadiness: 'ready' | 'requires-review' | 'incomplete' = 'incomplete';
    if (confidenceScore > 0.8 && matchedControls.length > 0) {
      auditReadiness = 'ready';
    } else if (confidenceScore > 0.6) {
      auditReadiness = 'requires-review';
    }
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (confidenceScore < 0.7) {
      recommendations.push('Consider adding more descriptive metadata for better categorization');
    }
    if (matchedControls.length === 0) {
      recommendations.push('No direct ISAE 3000 control mapping found - manual review recommended');
    }
    if (bankingRelevance < 20) {
      recommendations.push('Evidence may not be directly relevant to banking operations');
    }
    
    return {
      evidenceId: evidenceData.id,
      primaryCategory,
      secondaryCategories: Array.from(new Set(secondaryCategories)),
      confidenceScore: Math.min(1.0, confidenceScore),
      isaeControls: Array.from(new Set(matchedControls)),
      bankingRelevance: Math.min(100, bankingRelevance),
      auditReadiness,
      recommendations,
      tags: Array.from(new Set(tags))
    };
  }

  public getControlById(controlId: string): ISAE3000Control | undefined {
    return this.isaeControls.get(controlId);
  }

  public getAllControls(): ISAE3000Control[] {
    return Array.from(this.isaeControls.values());
  }

  public getControlsByCategory(category: ISAE3000Control['category']): ISAE3000Control[] {
    return Array.from(this.isaeControls.values()).filter(control => control.category === category);
  }

  public getBankingSpecificControls(): ISAE3000Control[] {
    return Array.from(this.isaeControls.values()).filter(control => control.bankingSpecific);
  }

  public getEvidenceClassification(evidenceId: string): EvidenceClassification | undefined {
    return this.evidenceClassifications.get(evidenceId);
  }

  public getAllClassifications(): EvidenceClassification[] {
    return Array.from(this.evidenceClassifications.values());
  }

  public getClassificationsByControl(controlId: string): EvidenceClassification[] {
    return Array.from(this.evidenceClassifications.values())
      .filter(classification => classification.isaeControls.includes(controlId));
  }

  public getAuditReadyEvidence(): EvidenceClassification[] {
    return Array.from(this.evidenceClassifications.values())
      .filter(classification => classification.auditReadiness === 'ready');
  }

  public getMetrics(): CategorizationMetrics {
    const classifications = Array.from(this.evidenceClassifications.values());
    const controls = Array.from(this.isaeControls.values());
    
    const controlCoverage: Record<string, number> = {};
    controls.forEach(control => {
      const evidenceCount = classifications.filter(c => c.isaeControls.includes(control.id)).length;
      controlCoverage[control.id] = evidenceCount;
    });
    
    return {
      totalEvidence: classifications.length,
      categorizedEvidence: classifications.filter(c => c.confidenceScore > 0.6).length,
      averageConfidence: classifications.length > 0 
        ? classifications.reduce((sum, c) => sum + c.confidenceScore, 0) / classifications.length 
        : 0,
      auditReadyEvidence: classifications.filter(c => c.auditReadiness === 'ready').length,
      bankingSpecificEvidence: classifications.filter(c => c.bankingRelevance > 50).length,
      controlCoverage,
      lastUpdate: new Date()
    };
  }

  public async generateComplianceReport(): Promise<{
    summary: CategorizationMetrics;
    controlAnalysis: Array<{
      controlId: string;
      controlName: string;
      evidenceCount: number;
      coverageLevel: 'excellent' | 'good' | 'fair' | 'poor';
      recommendations: string[];
    }>;
    evidenceGaps: Array<{
      controlId: string;
      controlName: string;
      missingEvidenceTypes: string[];
      priority: 'high' | 'medium' | 'low';
    }>;
  }> {
    const metrics = this.getMetrics();
    const controls = Array.from(this.isaeControls.values());
    
    const controlAnalysis = controls.map(control => {
      const evidenceCount = metrics.controlCoverage[control.id] || 0;
      let coverageLevel: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
      const recommendations: string[] = [];
      
      if (evidenceCount >= 5) {
        coverageLevel = 'excellent';
      } else if (evidenceCount >= 3) {
        coverageLevel = 'good';
      } else if (evidenceCount >= 1) {
        coverageLevel = 'fair';
        recommendations.push('Consider collecting additional evidence for this control');
      } else {
        coverageLevel = 'poor';
        recommendations.push('No evidence found - immediate attention required');
      }
      
      if (control.riskLevel === 'high' && coverageLevel !== 'excellent') {
        recommendations.push('High-risk control requires comprehensive evidence coverage');
      }
      
      return {
        controlId: control.id,
        controlName: control.title,
        evidenceCount,
        coverageLevel,
        recommendations
      };
    });
    
    const evidenceGaps = controls
      .filter(control => (metrics.controlCoverage[control.id] || 0) < 2)
      .map(control => ({
        controlId: control.id,
        controlName: control.title,
        missingEvidenceTypes: control.evidenceTypes,
        priority: control.riskLevel
      }));
    
    return {
      summary: metrics,
      controlAnalysis,
      evidenceGaps
    };
  }

  public async bulkCategorizeEvidence(evidenceList: Array<{
    id: string;
    type: string;
    description: string;
    source: string;
    content?: any;
    metadata?: Record<string, any>;
  }>): Promise<EvidenceClassification[]> {
    const classifications: EvidenceClassification[] = [];
    
    for (const evidence of evidenceList) {
      try {
        const classification = await this.categorizeEvidence(evidence);
        classifications.push(classification);
      } catch (error) {
        console.error(`Failed to categorize evidence ${evidence.id}:`, error);
      }
    }
    
    return classifications;
  }
}

export default EvidenceCategorizationService;