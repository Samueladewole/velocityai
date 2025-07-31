export interface DataSubject {
  id: string;
  type: 'customer' | 'employee' | 'vendor' | 'visitor';
  identifiers: string[];
  consentStatus: ConsentRecord[];
  dataProcessingActivities: string[];
  lastInteraction: Date;
  region: 'EU' | 'UK' | 'US' | 'OTHER';
}

export interface ConsentRecord {
  id: string;
  purpose: string;
  legalBasis: 'consent' | 'contract' | 'legal-obligation' | 'vital-interests' | 'public-task' | 'legitimate-interests';
  status: 'given' | 'withdrawn' | 'expired' | 'pending';
  grantedAt?: Date;
  withdrawnAt?: Date;
  expiresAt?: Date;
  evidence: string[];
  version: string;
}

export interface DataProcessingActivity {
  id: string;
  name: string;
  description: string;
  controller: string;
  jointControllers?: string[];
  dpo: string;
  categories: PersonalDataCategory[];
  purposes: ProcessingPurpose[];
  legalBases: string[];
  recipients: DataRecipient[];
  retentionPeriod: string;
  safeguards: SecurityMeasure[];
  thirdCountryTransfers: ThirdCountryTransfer[];
  riskAssessment: RiskAssessment;
  lastReviewed: Date;
  nextReview: Date;
  status: 'active' | 'inactive' | 'under-review';
}

export interface PersonalDataCategory {
  category: string;
  description: string;
  sensitivity: 'normal' | 'sensitive' | 'criminal' | 'biometric';
  examples: string[];
  volume: number;
  sources: string[];
}

export interface ProcessingPurpose {
  purpose: string;
  description: string;
  legalBasis: string;
  necessity: string;
  legitimateInterestAssessment?: string;
}

export interface DataRecipient {
  name: string;
  type: 'internal' | 'processor' | 'third-party' | 'authority';
  location: string;
  safeguards: string[];
  contractualArrangements: string[];
}

export interface SecurityMeasure {
  type: 'technical' | 'organisational';
  measure: string;
  description: string;
  implementationDate: Date;
  reviewDate: Date;
  responsible: string;
}

export interface ThirdCountryTransfer {
  recipient: string;
  country: string;
  adequacyDecision: boolean;
  safeguards: string[];
  necessity?: string;
  riskAssessment: string;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'very-high';
  likelihood: number;
  severity: number;
  riskSources: string[];
  mitigationMeasures: string[];
  residualRisk: 'low' | 'medium' | 'high';
  lastAssessed: Date;
  assessor: string;
}

export interface DataSubjectRequest {
  id: string;
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  dataSubjectId: string;
  submittedAt: Date;
  deadline: Date;
  status: 'received' | 'processing' | 'completed' | 'rejected' | 'extended';
  response?: string;
  responseDate?: Date;
  evidence: string[];
  handledBy: string;
  automatedResponse: boolean;
}

export interface PrivacyImpactAssessment {
  id: string;
  processingActivityId: string;
  conductedBy: string;
  conductedAt: Date;
  description: string;
  necessityAssessment: string;
  riskAnalysis: PIARiskAnalysis;
  consultationRequired: boolean;
  supervisoryAuthorityConsulted: boolean;
  recommendations: string[];
  status: 'draft' | 'completed' | 'approved' | 'rejected';
}

export interface PIARiskAnalysis {
  identifiedRisks: Array<{
    risk: string;
    likelihood: 'low' | 'medium' | 'high';
    severity: 'low' | 'medium' | 'high';
    impact: string;
  }>;
  mitigationMeasures: Array<{
    measure: string;
    effectiveness: 'low' | 'medium' | 'high';
    implementation: string;
  }>;
  residualRisk: 'acceptable' | 'requires-action' | 'unacceptable';
}

export interface BreachIncident {
  id: string;
  detectedAt: Date;
  reportedAt: Date;
  category: 'confidentiality' | 'integrity' | 'availability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedDataSubjects: number;
  description: string;
  cause: string;
  personalDataInvolved: string[];
  likelyConsequences: string;
  measuresTaken: string[];
  measuresToBeTaken: string[];
  supervisoryAuthorityNotified: boolean;
  dataSubjectsNotified: boolean;
  notificationDeadline: Date;
  status: 'detected' | 'assessing' | 'containing' | 'investigating' | 'resolved';
  responsibleTeam: string;
  lessons: string[];
}

export interface GDPRMetrics {
  totalProcessingActivities: number;
  highRiskActivities: number;
  consentRecords: number;
  activeConsents: number;
  withdrawnConsents: number;
  dataSubjectRequests: number;
  requestsWithinDeadline: number;
  breachIncidents: number;
  notifiableBreaches: number;
  completedPIAs: number;
  complianceScore: number;
  lastUpdate: Date;
}

export interface BankingGDPRContext {
  customerAccounts: number;
  transactionVolume: number;
  internationalTransfers: number;
  thirdPartyProcessors: number;
  regulatoryRequirements: string[];
  supervisoryAuthorities: string[];
}

class GDPRComplianceService {
  private static instance: GDPRComplianceService;
  private processingActivities: Map<string, DataProcessingActivity> = new Map();
  private dataSubjects: Map<string, DataSubject> = new Map();
  private dataSubjectRequests: Map<string, DataSubjectRequest> = new Map();
  private privacyImpactAssessments: Map<string, PrivacyImpactAssessment> = new Map();
  private breachIncidents: Map<string, BreachIncident> = new Map();

  private constructor() {
    this.initializeBankingProcessingActivities();
    this.initializeSampleData();
  }

  public static getInstance(): GDPRComplianceService {
    if (!GDPRComplianceService.instance) {
      GDPRComplianceService.instance = new GDPRComplianceService();
    }
    return GDPRComplianceService.instance;
  }

  private initializeBankingProcessingActivities() {
    const bankingActivities: DataProcessingActivity[] = [
      {
        id: 'customer-onboarding',
        name: 'Customer Account Opening and KYC',
        description: 'Collection and processing of customer data for account opening and Know Your Customer compliance',
        controller: 'Velocity Bank Ltd',
        dpo: 'dpo@velocitybank.com',
        categories: [
          {
            category: 'Identity Data',
            description: 'Personal identification information',
            sensitivity: 'normal',
            examples: ['Full name', 'Date of birth', 'National ID/Passport', 'Address'],
            volume: 2500000,
            sources: ['Customer application', 'ID verification service', 'Address verification']
          },
          {
            category: 'Financial Data',
            description: 'Financial status and history information',
            sensitivity: 'sensitive',
            examples: ['Income details', 'Credit history', 'Employment status', 'Financial assets'],
            volume: 2500000,
            sources: ['Customer declaration', 'Credit reference agencies', 'Employer verification']
          }
        ],
        purposes: [
          {
            purpose: 'Account establishment',
            description: 'Opening and maintaining customer banking accounts',
            legalBasis: 'contract',
            necessity: 'Essential for providing banking services'
          },
          {
            purpose: 'KYC and AML compliance',
            description: 'Meeting legal obligations for customer identification and anti-money laundering',
            legalBasis: 'legal-obligation',
            necessity: 'Required by banking regulations'
          }
        ],
        legalBases: ['contract', 'legal-obligation'],
        recipients: [
          {
            name: 'Credit Reference Agencies',
            type: 'third-party',
            location: 'EU',
            safeguards: ['Contractual clauses', 'Regular audits'],
            contractualArrangements: ['Data Processing Agreement', 'Security requirements']
          },
          {
            name: 'Financial Regulatory Authorities',
            type: 'authority',
            location: 'EU',
            safeguards: ['Legal obligation', 'Secure transmission'],
            contractualArrangements: ['Regulatory reporting requirements']
          }
        ],
        retentionPeriod: '10 years after account closure or termination of relationship',
        safeguards: [
          {
            type: 'technical',
            measure: 'Encryption at rest and in transit',
            description: 'AES-256 encryption for stored data and TLS 1.3 for data transmission',
            implementationDate: new Date(2024, 0, 1),
            reviewDate: new Date(2024, 11, 31),
            responsible: 'IT Security Team'
          },
          {
            type: 'organisational',
            measure: 'Access controls and authentication',
            description: 'Role-based access control with multi-factor authentication',
            implementationDate: new Date(2024, 0, 1),
            reviewDate: new Date(2024, 5, 30),
            responsible: 'Identity and Access Management Team'
          }
        ],
        thirdCountryTransfers: [
          {
            recipient: 'Global Credit Verification Service',
            country: 'United Kingdom',
            adequacyDecision: true,
            safeguards: ['UK adequacy decision'],
            riskAssessment: 'Low risk due to adequacy decision and contractual safeguards'
          }
        ],
        riskAssessment: {
          overallRisk: 'medium',
          likelihood: 3,
          severity: 4,
          riskSources: ['Data breach', 'Unauthorized access', 'Third party processing'],
          mitigationMeasures: ['Strong encryption', 'Access controls', 'Regular audits', 'Staff training'],
          residualRisk: 'low',
          lastAssessed: new Date(2024, 2, 15),
          assessor: 'Data Protection Team'
        },
        lastReviewed: new Date(2024, 2, 15),
        nextReview: new Date(2024, 8, 15),
        status: 'active'
      },
      {
        id: 'payment-processing',
        name: 'Payment Transaction Processing',
        description: 'Processing of payment transactions including card payments, transfers, and direct debits',
        controller: 'Velocity Bank Ltd',
        dpo: 'dpo@velocitybank.com',
        categories: [
          {
            category: 'Payment Data',
            description: 'Transaction and payment information',
            sensitivity: 'sensitive',
            examples: ['Card details (tokenized)', 'Transaction amounts', 'Merchant information', 'Transaction history'],
            volume: 50000000,
            sources: ['Payment terminals', 'Online banking', 'Mobile app', 'ATM network']
          },
          {
            category: 'Device Data',
            description: 'Information about devices used for transactions',
            sensitivity: 'normal',
            examples: ['IP address', 'Device fingerprint', 'Location data', 'Browser information'],
            volume: 25000000,
            sources: ['Mobile devices', 'Web browsers', 'ATM machines', 'POS terminals']
          }
        ],
        purposes: [
          {
            purpose: 'Payment processing',
            description: 'Executing and settling payment transactions',
            legalBasis: 'contract',
            necessity: 'Essential for payment service delivery'
          },
          {
            purpose: 'Fraud prevention',
            description: 'Detecting and preventing fraudulent transactions',
            legalBasis: 'legitimate-interests',
            necessity: 'Protecting customers and bank from financial fraud',
            legitimateInterestAssessment: 'Balance between fraud prevention and privacy. Minimal data processing with strong safeguards.'
          }
        ],
        legalBases: ['contract', 'legitimate-interests'],
        recipients: [
          {
            name: 'Payment Network Processors',
            type: 'processor',
            location: 'EU, US',
            safeguards: ['Standard Contractual Clauses', 'Adequate security measures'],
            contractualArrangements: ['Payment network agreements', 'Security compliance requirements']
          },
          {
            name: 'Fraud Detection Service',
            type: 'processor',
            location: 'EU',
            safeguards: ['Data Processing Agreement', 'ISO 27001 certification'],
            contractualArrangements: ['Service agreement with data protection terms']
          }
        ],
        retentionPeriod: '7 years from transaction date for regulatory compliance',
        safeguards: [
          {
            type: 'technical',
            measure: 'Payment card tokenization',
            description: 'Replacement of card details with secure tokens',
            implementationDate: new Date(2023, 6, 1),
            reviewDate: new Date(2024, 6, 1),
            responsible: 'Payment Systems Team'
          },
          {
            type: 'technical',
            measure: 'Real-time fraud monitoring',
            description: 'AI-powered transaction monitoring for fraud detection',
            implementationDate: new Date(2023, 8, 1),
            reviewDate: new Date(2024, 8, 1),
            responsible: 'Fraud Prevention Team'
          }
        ],
        thirdCountryTransfers: [
          {
            recipient: 'US Payment Processor',
            country: 'United States',
            adequacyDecision: false,
            safeguards: ['Standard Contractual Clauses', 'Additional security measures'],
            riskAssessment: 'Medium risk mitigated by SCCs and strong technical safeguards'
          }
        ],
        riskAssessment: {
          overallRisk: 'high',
          likelihood: 4,
          severity: 5,
          riskSources: ['Payment fraud', 'Data breach', 'System compromise', 'Third country transfers'],
          mitigationMeasures: ['Tokenization', 'End-to-end encryption', 'Fraud monitoring', 'PCI DSS compliance'],
          residualRisk: 'medium',
          lastAssessed: new Date(2024, 1, 20),
          assessor: 'Risk Management Team'
        },
        lastReviewed: new Date(2024, 1, 20),
        nextReview: new Date(2024, 7, 20),
        status: 'active'
      },
      {
        id: 'digital-banking-analytics',
        name: 'Digital Banking Usage Analytics',
        description: 'Analysis of customer digital banking usage for service improvement and personalization',
        controller: 'Velocity Bank Ltd',
        dpo: 'dpo@velocitybank.com',
        categories: [
          {
            category: 'Usage Data',
            description: 'Digital banking platform usage information',
            sensitivity: 'normal',
            examples: ['Login frequency', 'Feature usage', 'Session duration', 'Navigation patterns'],
            volume: 15000000,
            sources: ['Mobile banking app', 'Online banking platform', 'System logs']
          },
          {
            category: 'Technical Data',
            description: 'Technical information about user interactions',
            sensitivity: 'normal',
            examples: ['IP address', 'Device type', 'Browser version', 'Operating system'],
            volume: 15000000,
            sources: ['Web analytics', 'Mobile app analytics', 'Server logs']
          }
        ],
        purposes: [
          {
            purpose: 'Service improvement',
            description: 'Analyzing usage patterns to improve digital banking services',
            legalBasis: 'legitimate-interests',
            necessity: 'Improving customer experience and service quality',
            legitimateInterestAssessment: 'Legitimate business interest in service improvement balanced with customer privacy through anonymization and aggregation.'
          },
          {
            purpose: 'Security monitoring',
            description: 'Monitoring for unusual patterns that may indicate security threats',
            legalBasis: 'legitimate-interests',
            necessity: 'Protecting customers and systems from security threats',
            legitimateInterestAssessment: 'Essential for cybersecurity and fraud prevention. Minimal impact on privacy with strong technical safeguards.'
          }
        ],
        legalBases: ['legitimate-interests'],
        recipients: [
          {
            name: 'Analytics Platform Provider',
            type: 'processor',
            location: 'EU',
            safeguards: ['Data Processing Agreement', 'Privacy by design'],
            contractualArrangements: ['Cloud service agreement with GDPR compliance terms']
          }
        ],
        retentionPeriod: '2 years from collection for analytics, 30 days for raw logs',
        safeguards: [
          {
            type: 'technical',
            measure: 'Data anonymization',
            description: 'Removal or pseudonymization of directly identifying information',
            implementationDate: new Date(2023, 9, 1),
            reviewDate: new Date(2024, 9, 1),
            responsible: 'Data Analytics Team'
          },
          {
            type: 'organisational',
            measure: 'Purpose limitation',
            description: 'Strict controls on data usage for specified purposes only',
            implementationDate: new Date(2023, 9, 1),
            reviewDate: new Date(2024, 3, 1),
            responsible: 'Data Governance Team'
          }
        ],
        thirdCountryTransfers: [],
        riskAssessment: {
          overallRisk: 'low',
          likelihood: 2,
          severity: 2,
          riskSources: ['Re-identification risk', 'Purpose creep', 'Third party access'],
          mitigationMeasures: ['Anonymization', 'Access controls', 'Purpose limitation', 'Regular audits'],
          residualRisk: 'low',
          lastAssessed: new Date(2024, 0, 10),
          assessor: 'Privacy Team'
        },
        lastReviewed: new Date(2024, 0, 10),
        nextReview: new Date(2024, 6, 10),
        status: 'active'
      }
    ];

    bankingActivities.forEach(activity => {
      this.processingActivities.set(activity.id, activity);
    });
  }

  private initializeSampleData() {
    // Sample data subjects
    const sampleDataSubjects: DataSubject[] = [
      {
        id: 'customer-001',
        type: 'customer',
        identifiers: ['john.doe@email.com', 'customer-ref-12345'],
        consentStatus: [
          {
            id: 'consent-001',
            purpose: 'Marketing communications',
            legalBasis: 'consent',
            status: 'given',
            grantedAt: new Date(2023, 5, 15),
            evidence: ['email-opt-in-confirmation'],
            version: '1.2'
          }
        ],
        dataProcessingActivities: ['customer-onboarding', 'payment-processing'],
        lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000),
        region: 'EU'
      }
    ];

    // Sample data subject requests
    const sampleRequests: DataSubjectRequest[] = [
      {
        id: 'request-001',
        requestType: 'access',
        dataSubjectId: 'customer-001',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'processing',
        evidence: ['email-request', 'identity-verification'],
        handledBy: 'Privacy Team',
        automatedResponse: false
      }
    ];

    // Sample breach incidents
    const sampleBreaches: BreachIncident[] = [
      {
        id: 'breach-001',
        detectedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        reportedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        category: 'confidentiality',
        severity: 'medium',
        affectedDataSubjects: 150,
        description: 'Unauthorized access to customer database due to misconfigured access controls',
        cause: 'Human error in access control configuration',
        personalDataInvolved: ['Names', 'Email addresses', 'Account numbers'],
        likelyConsequences: 'Low risk of harm due to limited data scope and quick containment',
        measuresTaken: ['Access revoked', 'System patched', 'Affected customers notified'],
        measuresToBeTaken: ['Additional staff training', 'Enhanced monitoring'],
        supervisoryAuthorityNotified: true,
        dataSubjectsNotified: true,
        notificationDeadline: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        status: 'resolved',
        responsibleTeam: 'Incident Response Team',
        lessons: ['Need for automated access control validation', 'Importance of regular security reviews']
      }
    ];

    sampleDataSubjects.forEach(subject => {
      this.dataSubjects.set(subject.id, subject);
    });

    sampleRequests.forEach(request => {
      this.dataSubjectRequests.set(request.id, request);
    });

    sampleBreaches.forEach(breach => {
      this.breachIncidents.set(breach.id, breach);
    });
  }

  public async conductDataDiscovery(): Promise<{
    activitiesFound: number;
    dataSubjectsIdentified: number;
    highRiskActivities: number;
    complianceGaps: string[];
  }> {
    // Simulate AI-powered data discovery process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const activities = Array.from(this.processingActivities.values());
    const highRiskActivities = activities.filter(a => a.riskAssessment.overallRisk === 'high' || a.riskAssessment.overallRisk === 'very-high').length;
    
    const complianceGaps = [
      'Missing privacy notices for digital analytics processing',
      'Incomplete retention schedules for employee data',
      'Need for updated consent mechanisms in mobile app'
    ];

    return {
      activitiesFound: activities.length,
      dataSubjectsIdentified: this.dataSubjects.size,
      highRiskActivities,
      complianceGaps
    };
  }

  public async generateRoPA(): Promise<DataProcessingActivity[]> {
    // Simulate automated RoPA generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return Array.from(this.processingActivities.values());
  }

  public async handleDataSubjectRequest(request: Omit<DataSubjectRequest, 'id' | 'submittedAt' | 'deadline'>): Promise<DataSubjectRequest> {
    const requestId = `request-${Date.now()}`;
    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    
    const newRequest: DataSubjectRequest = {
      ...request,
      id: requestId,
      submittedAt: new Date(),
      deadline,
      status: 'received'
    };

    this.dataSubjectRequests.set(requestId, newRequest);
    return newRequest;
  }

  public async processDataSubjectRequest(requestId: string): Promise<{
    dataFound: boolean;
    dataExport?: any;
    processingActivities: string[];
    estimatedCompletionTime: string;
  }> {
    const request = this.dataSubjectRequests.get(requestId);
    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    // Update request status
    const updatedRequest = {
      ...request,
      status: 'processing' as const
    };
    this.dataSubjectRequests.set(requestId, updatedRequest);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const dataSubject = this.dataSubjects.get(request.dataSubjectId);
    const processingActivities = dataSubject?.dataProcessingActivities || [];

    return {
      dataFound: true,
      dataExport: request.requestType === 'access' ? {
        personalData: 'Encrypted data export package',
        processingActivities: processingActivities,
        retentionPeriods: '7-10 years depending on data type'
      } : undefined,
      processingActivities,
      estimatedCompletionTime: '5-7 business days'
    };
  }

  public async conductPrivacyImpactAssessment(processingActivityId: string): Promise<PrivacyImpactAssessment> {
    const activity = this.processingActivities.get(processingActivityId);
    if (!activity) {
      throw new Error(`Processing activity ${processingActivityId} not found`);
    }

    const pia: PrivacyImpactAssessment = {
      id: `pia-${Date.now()}`,
      processingActivityId,
      conductedBy: 'Privacy Team',
      conductedAt: new Date(),
      description: `Privacy Impact Assessment for ${activity.name}`,
      necessityAssessment: 'Processing is necessary for the specified purposes and proportionate to the risks',
      riskAnalysis: {
        identifiedRisks: [
          {
            risk: 'Unauthorized access to personal data',
            likelihood: 'medium',
            severity: 'high',
            impact: 'Potential financial and reputational harm to data subjects'
          },
          {
            risk: 'Data breach during third country transfer',
            likelihood: 'low',
            severity: 'high',
            impact: 'Exposure of personal data to unauthorized parties'
          }
        ],
        mitigationMeasures: [
          {
            measure: 'Strong encryption and access controls',
            effectiveness: 'high',
            implementation: 'Technical safeguards implemented and regularly reviewed'
          },
          {
            measure: 'Standard Contractual Clauses for transfers',
            effectiveness: 'medium',
            implementation: 'Legal safeguards in place with regular compliance monitoring'
          }
        ],
        residualRisk: 'acceptable'
      },
      consultationRequired: activity.riskAssessment.overallRisk === 'high',
      supervisoryAuthorityConsulted: false,
      recommendations: [
        'Continue regular security assessments',
        'Enhance staff training on data protection',
        'Implement additional monitoring for third country transfers'
      ],
      status: 'completed'
    };

    this.privacyImpactAssessments.set(pia.id, pia);
    return pia;
  }

  public async recordBreachIncident(incident: Omit<BreachIncident, 'id' | 'detectedAt'>): Promise<BreachIncident> {
    const incidentId = `breach-${Date.now()}`;
    
    const breach: BreachIncident = {
      ...incident,
      id: incidentId,
      detectedAt: new Date()
    };

    this.breachIncidents.set(incidentId, breach);
    return breach;
  }

  public async assessBreachNotificationRequirement(incidentId: string): Promise<{
    supervisoryAuthorityRequired: boolean;
    dataSubjectNotificationRequired: boolean;
    deadline: Date;
    rationale: string;
  }> {
    const incident = this.breachIncidents.get(incidentId);
    if (!incident) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    const supervisoryAuthorityRequired = incident.severity !== 'low';
    const dataSubjectNotificationRequired = incident.severity === 'high' || incident.severity === 'critical';
    const deadline = new Date(incident.detectedAt.getTime() + 72 * 60 * 60 * 1000); // 72 hours

    return {
      supervisoryAuthorityRequired,
      dataSubjectNotificationRequired,
      deadline,
      rationale: `Based on severity level ${incident.severity} and number of affected data subjects (${incident.affectedDataSubjects})`
    };
  }

  public getProcessingActivity(activityId: string): DataProcessingActivity | undefined {
    return this.processingActivities.get(activityId);
  }

  public getAllProcessingActivities(): DataProcessingActivity[] {
    return Array.from(this.processingActivities.values());
  }

  public getHighRiskProcessingActivities(): DataProcessingActivity[] {
    return Array.from(this.processingActivities.values()).filter(
      activity => activity.riskAssessment.overallRisk === 'high' || activity.riskAssessment.overallRisk === 'very-high'
    );
  }

  public getDataSubjectRequests(): DataSubjectRequest[] {
    return Array.from(this.dataSubjectRequests.values());
  }

  public getDataSubjectRequestsByStatus(status: DataSubjectRequest['status']): DataSubjectRequest[] {
    return Array.from(this.dataSubjectRequests.values()).filter(request => request.status === status);
  }

  public getBreachIncidents(): BreachIncident[] {
    return Array.from(this.breachIncidents.values());
  }

  public getPrivacyImpactAssessments(): PrivacyImpactAssessment[] {
    return Array.from(this.privacyImpactAssessments.values());
  }

  public getMetrics(): GDPRMetrics {
    const activities = Array.from(this.processingActivities.values());
    const requests = Array.from(this.dataSubjectRequests.values());
    const breaches = Array.from(this.breachIncidents.values());
    const consents = Array.from(this.dataSubjects.values()).flatMap(subject => subject.consentStatus);

    const highRiskActivities = activities.filter(a => a.riskAssessment.overallRisk === 'high' || a.riskAssessment.overallRisk === 'very-high').length;
    const activeConsents = consents.filter(c => c.status === 'given').length;
    const withdrawnConsents = consents.filter(c => c.status === 'withdrawn').length;
    
    const requestsWithinDeadline = requests.filter(r => 
      r.status === 'completed' && r.responseDate && r.responseDate <= r.deadline
    ).length;
    
    const notifiableBreaches = breaches.filter(b => b.supervisoryAuthorityNotified).length;
    
    // Calculate compliance score based on various factors
    const complianceFactors = [
      highRiskActivities === 0 ? 100 : Math.max(0, 100 - (highRiskActivities * 20)),
      requestsWithinDeadline / Math.max(1, requests.length) * 100,
      (breaches.length - notifiableBreaches) / Math.max(1, breaches.length) * 100 || 100,
      activities.filter(a => a.status === 'active' && a.nextReview > new Date()).length / Math.max(1, activities.length) * 100
    ];
    
    const complianceScore = complianceFactors.reduce((sum, score) => sum + score, 0) / complianceFactors.length;

    return {
      totalProcessingActivities: activities.length,
      highRiskActivities,
      consentRecords: consents.length,
      activeConsents,
      withdrawnConsents,
      dataSubjectRequests: requests.length,
      requestsWithinDeadline,
      breachIncidents: breaches.length,
      notifiableBreaches,
      completedPIAs: this.privacyImpactAssessments.size,
      complianceScore: Math.round(complianceScore),
      lastUpdate: new Date()
    };
  }

  public getBankingContext(): BankingGDPRContext {
    return {
      customerAccounts: 2500000,
      transactionVolume: 50000000,
      internationalTransfers: 125000,
      thirdPartyProcessors: 15,
      regulatoryRequirements: [
        'GDPR Article 6 (Lawfulness)',
        'GDPR Article 9 (Special categories)',
        'PSD2 Strong Customer Authentication',
        'Banking Act customer data protection',
        'AML/KYC data retention requirements'
      ],
      supervisoryAuthorities: [
        'Information Commissioner\'s Office (ICO)',
        'Financial Conduct Authority (FCA)',
        'Prudential Regulation Authority (PRA)'
      ]
    };
  }
}

export default GDPRComplianceService;