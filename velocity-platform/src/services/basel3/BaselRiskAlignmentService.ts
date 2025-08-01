export interface BaselRiskCategory {
  id: string;
  pillar: 'Pillar1' | 'Pillar2' | 'Pillar3';
  category: 'credit' | 'market' | 'operational' | 'liquidity' | 'interest-rate' | 'concentration';
  subcategory: string;
  title: string;
  description: string;
  requirements: string[];
  riskMetrics: string[];
  isaeMapping: string[];
  automationLevel: number;
  bankingFocus: 'retail' | 'commercial' | 'investment' | 'universal';
  regulatoryImportance: 'critical' | 'high' | 'medium' | 'low';
}

export interface OperationalRiskEvent {
  id: string;
  eventType: 'internal-fraud' | 'external-fraud' | 'employment-practices' | 'clients-products' | 'damage-assets' | 'business-disruption' | 'execution-delivery';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  financialImpact: number;
  probability: number;
  businessLine: string;
  controlsAffected: string[];
  isaeControlsImpacted: string[];
  dateOccurred: Date;
  status: 'identified' | 'assessed' | 'mitigated' | 'closed';
  mitigationPlan: string;
  lessonsLearned: string[];
}

export interface RiskAlignment {
  baselRequirement: string;
  isaeControl: string;
  alignmentType: 'direct' | 'supportive' | 'complementary';
  coveragePercentage: number;
  sharedEvidence: string[];
  gapAnalysis: string[];
  enhancementOpportunities: string[];
}

export interface CapitalCalculation {
  id: string;
  calculationType: 'basic-indicator' | 'standardized' | 'advanced-measurement';
  businessLines: BusinessLineCapital[];
  totalCapitalRequirement: number;
  riskWeightedAssets: number;
  operationalRiskCapital: number;
  lastCalculated: Date;
  validationStatus: 'pending' | 'validated' | 'exception';
  isaeValidation: {
    controlsTested: string[];
    validationDate: Date;
    validatorName: string;
    findings: string[];
  };
}

export interface BusinessLineCapital {
  businessLine: string;
  grossIncome: number;
  betaFactor: number;
  capitalRequirement: number;
  riskProfile: 'low' | 'medium' | 'high';
  keyRiskIndicators: KRI[];
}

export interface KRI {
  id: string;
  name: string;
  value: number;
  threshold: number;
  trend: 'improving' | 'stable' | 'deteriorating';
  lastUpdated: Date;
  alertStatus: 'green' | 'amber' | 'red';
}

export interface BaselMetrics {
  totalRiskCategories: number;
  alignedControls: number;
  operationalRiskEvents: number;
  capitalRequirement: number;
  alignmentPercentage: number;
  automationLevel: number;
  lastUpdate: Date;
  krisInAlert: number;
  validatedCalculations: number;
}

export interface RiskDashboardData {
  operationalRiskTrend: Array<{ date: Date; events: number; impact: number }>;
  capitalTrend: Array<{ date: Date; requirement: number; available: number }>;
  controlEffectiveness: Array<{ control: string; effectiveness: number }>;
  businessLineRisk: Array<{ line: string; risk: number; capital: number }>;
}

class BaselRiskAlignmentService {
  private static instance: BaselRiskAlignmentService;
  private riskCategories: Map<string, BaselRiskCategory> = new Map();
  private riskEvents: Map<string, OperationalRiskEvent> = new Map();
  private riskAlignments: Map<string, RiskAlignment> = new Map();
  private capitalCalculations: Map<string, CapitalCalculation> = new Map();

  private constructor() {
    this.initializeRiskCategories();
    this.initializeRiskAlignments();
    this.initializeSampleData();
  }

  public static getInstance(): BaselRiskAlignmentService {
    if (!BaselRiskAlignmentService.instance) {
      BaselRiskAlignmentService.instance = new BaselRiskAlignmentService();
    }
    return BaselRiskAlignmentService.instance;
  }

  private initializeRiskCategories() {
    const categories: BaselRiskCategory[] = [
      {
        id: 'BASEL-OR-001',
        pillar: 'Pillar1',
        category: 'operational',
        subcategory: 'Internal Fraud',
        title: 'Internal Fraud Risk Management',
        description: 'Controls and procedures to prevent losses due to acts intended to defraud, misappropriate property or circumvent regulations',
        requirements: [
          'Employee screening and background checks',
          'Segregation of duties in critical processes',
          'Authorization limits and approvals',
          'Monitoring and surveillance systems'
        ],
        riskMetrics: ['fraud-incidents', 'loss-amounts', 'detection-time', 'prevention-rate'],
        isaeMapping: ['CC1.1', 'CC6.1', 'CC7.1'],
        automationLevel: 88,
        bankingFocus: 'universal',
        regulatoryImportance: 'critical'
      },
      {
        id: 'BASEL-OR-002',
        pillar: 'Pillar1',
        category: 'operational',
        subcategory: 'External Fraud',
        title: 'External Fraud Risk Management',
        description: 'Controls to prevent losses due to acts by third parties intended to defraud, misappropriate property or circumvent the law',
        requirements: [
          'Customer authentication systems',
          'Transaction monitoring and fraud detection',
          'Cybersecurity controls and measures',
          'Vendor and third-party risk management'
        ],
        riskMetrics: ['external-fraud-attempts', 'successful-attacks', 'customer-losses', 'system-breaches'],
        isaeMapping: ['CC6.1', 'CC6.2', 'CC2.2'],
        automationLevel: 92,
        bankingFocus: 'universal',
        regulatoryImportance: 'critical'
      },
      {
        id: 'BASEL-OR-003',
        pillar: 'Pillar1',
        category: 'operational',
        subcategory: 'Employment Practices',
        title: 'Employment Practices and Workplace Safety',
        description: 'Controls related to employment practices, workplace safety, and discrimination issues',
        requirements: [
          'HR policies and procedures',
          'Training and competency programs',
          'Performance management systems',
          'Workplace safety protocols'
        ],
        riskMetrics: ['employment-disputes', 'safety-incidents', 'training-completion', 'compliance-violations'],
        isaeMapping: ['CC1.1', 'CC1.2'],
        automationLevel: 75,
        bankingFocus: 'universal',
        regulatoryImportance: 'medium'
      },
      {
        id: 'BASEL-OR-004',
        pillar: 'Pillar1',
        category: 'operational',
        subcategory: 'Clients, Products & Business Practices',
        title: 'Client and Product Risk Management',
        description: 'Controls over client relationships, product development, and business practice compliance',
        requirements: [
          'Product approval and oversight processes',
          'Client suitability assessments',
          'Complaint handling procedures',
          'Regulatory compliance monitoring'
        ],
        riskMetrics: ['client-complaints', 'product-defects', 'regulatory-violations', 'reputation-events'],
        isaeMapping: ['CC2.1', 'CC7.2', 'CC5.1'],
        automationLevel: 85,
        bankingFocus: 'retail',
        regulatoryImportance: 'high'
      },
      {
        id: 'BASEL-OR-005',
        pillar: 'Pillar1',
        category: 'operational',
        subcategory: 'Execution, Delivery & Process Management',
        title: 'Process and Transaction Management',
        description: 'Controls over transaction processing, delivery, and process management failures',
        requirements: [
          'Transaction processing controls',
          'Settlement and clearing procedures',
          'Data entry and validation controls',
          'Process documentation and training'
        ],
        riskMetrics: ['processing-errors', 'settlement-fails', 'data-quality-issues', 'process-breaks'],
        isaeMapping: ['CC7.1', 'CC7.2', 'CC8.1'],
        automationLevel: 94,
        bankingFocus: 'universal',
        regulatoryImportance: 'critical'
      },
      {
        id: 'BASEL-OR-006',
        pillar: 'Pillar2',
        category: 'operational',
        subcategory: 'Risk Assessment Process',
        title: 'Operational Risk Assessment and Management',
        description: 'Comprehensive risk assessment and management framework for operational risks',
        requirements: [
          'Risk identification and assessment procedures',
          'Risk appetite and tolerance frameworks',
          'Risk monitoring and reporting systems',
          'Risk mitigation and control strategies'
        ],
        riskMetrics: ['risk-assessments-completed', 'risks-above-tolerance', 'mitigation-effectiveness', 'control-gaps'],
        isaeMapping: ['CC2.1', 'CC2.2', 'CC5.1'],
        automationLevel: 80,
        bankingFocus: 'universal',
        regulatoryImportance: 'critical'
      }
    ];

    categories.forEach(category => {
      this.riskCategories.set(category.id, category);
    });
  }

  private initializeRiskAlignments() {
    const alignments: RiskAlignment[] = [
      {
        baselRequirement: 'BASEL-OR-001',
        isaeControl: 'CC1.1',
        alignmentType: 'direct',
        coveragePercentage: 85,
        sharedEvidence: ['internal-controls-documentation', 'segregation-duties-matrix', 'authorization-reports'],
        gapAnalysis: ['Basel requires specific fraud risk assessments', 'ISAE focuses on general control environment'],
        enhancementOpportunities: ['Integrate fraud risk assessment with ISAE control testing', 'Develop unified fraud prevention framework']
      },
      {
        baselRequirement: 'BASEL-OR-002',
        isaeControl: 'CC6.1',
        alignmentType: 'direct',
        coveragePercentage: 92,
        sharedEvidence: ['access-control-reports', 'authentication-logs', 'security-incident-reports'],
        gapAnalysis: ['Minor differences in scope of cybersecurity controls'],
        enhancementOpportunities: ['Leverage ISAE access controls for Basel fraud prevention', 'Enhance monitoring for external threats']
      },
      {
        baselRequirement: 'BASEL-OR-005',
        isaeControl: 'CC7.1',
        alignmentType: 'direct',
        coveragePercentage: 94,
        sharedEvidence: ['transaction-processing-logs', 'system-monitoring-reports', 'error-reports'],
        gapAnalysis: ['Excellent alignment between Basel operational risk and ISAE system operations'],
        enhancementOpportunities: ['Utilize ISAE transaction controls for Basel operational risk measurement']
      }
    ];

    alignments.forEach(alignment => {
      this.riskAlignments.set(`€{alignment.baselRequirement}-€{alignment.isaeControl}`, alignment);
    });
  }

  private initializeSampleData() {
    // Sample operational risk events
    const sampleEvents: OperationalRiskEvent[] = [
      {
        id: 'OR-EVENT-001',
        eventType: 'execution-delivery',
        severity: 'medium',
        financialImpact: 25000,
        probability: 0.15,
        businessLine: 'Retail Banking',
        controlsAffected: ['BASEL-OR-005'],
        isaeControlsImpacted: ['CC7.1'],
        dateOccurred: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        status: 'mitigated',
        mitigationPlan: 'Enhanced automated validation controls implemented',
        lessonsLearned: ['Need for real-time transaction monitoring', 'Importance of automated validation rules']
      },
      {
        id: 'OR-EVENT-002',
        eventType: 'external-fraud',
        severity: 'high',
        financialImpact: 150000,
        probability: 0.08,
        businessLine: 'Digital Banking',
        controlsAffected: ['BASEL-OR-002'],
        isaeControlsImpacted: ['CC6.1', 'CC6.2'],
        dateOccurred: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        status: 'closed',
        mitigationPlan: 'Multi-factor authentication implemented, customer education enhanced',
        lessonsLearned: ['Need for stronger customer authentication', 'Importance of fraud detection algorithms']
      }
    ];

    sampleEvents.forEach(event => {
      this.riskEvents.set(event.id, event);
    });

    // Sample capital calculation
    const sampleCapitalCalc: CapitalCalculation = {
      id: 'CAPITAL-2024-Q4',
      calculationType: 'standardized',
      businessLines: [
        {
          businessLine: 'Retail Banking',
          grossIncome: 50000000,
          betaFactor: 0.12,
          capitalRequirement: 6000000,
          riskProfile: 'medium',
          keyRiskIndicators: [
            { id: 'KRI-001', name: 'Processing Errors per 1000 transactions', value: 2.5, threshold: 5.0, trend: 'improving', lastUpdated: new Date(), alertStatus: 'green' },
            { id: 'KRI-002', name: 'Customer Complaints per month', value: 45, threshold: 50, trend: 'stable', lastUpdated: new Date(), alertStatus: 'green' }
          ]
        },
        {
          businessLine: 'Commercial Banking',
          grossIncome: 75000000,
          betaFactor: 0.15,
          capitalRequirement: 11250000,
          riskProfile: 'medium',
          keyRiskIndicators: [
            { id: 'KRI-003', name: 'Credit Processing Delays (hours)', value: 12, threshold: 24, trend: 'improving', lastUpdated: new Date(), alertStatus: 'green' },
            { id: 'KRI-004', name: 'Documentation Errors (%)', value: 0.8, threshold: 1.0, trend: 'stable', lastUpdated: new Date(), alertStatus: 'green' }
          ]
        }
      ],
      totalCapitalRequirement: 17250000,
      riskWeightedAssets: 1500000000,
      operationalRiskCapital: 17250000,
      lastCalculated: new Date(),
      validationStatus: 'validated',
      isaeValidation: {
        controlsTested: ['CC7.1', 'CC7.2', 'CC5.1'],
        validationDate: new Date(),
        validatorName: 'Internal Audit Team',
        findings: ['All controls operating effectively', 'Capital calculation methodology validated']
      }
    };

    this.capitalCalculations.set(sampleCapitalCalc.id, sampleCapitalCalc);
  }

  public async performRiskAlignment(): Promise<RiskAlignment[]> {
    // Simulate alignment analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return Array.from(this.riskAlignments.values());
  }

  public async calculateOperationalRiskCapital(
    calculationType: CapitalCalculation['calculationType'],
    businessLines: BusinessLineCapital[]
  ): Promise<CapitalCalculation> {
    // Simulate capital calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let totalCapitalRequirement = 0;
    
    switch (calculationType) {
      case 'basic-indicator':
        const totalGrossIncome = businessLines.reduce((sum, line) => sum + line.grossIncome, 0);
        totalCapitalRequirement = totalGrossIncome * 0.15; // 15% of gross income
        break;
        
      case 'standardized':
        totalCapitalRequirement = businessLines.reduce((sum, line) => {
          return sum + (line.grossIncome * line.betaFactor);
        }, 0);
        break;
        
      case 'advanced-measurement':
        // More complex calculation would be implemented here
        totalCapitalRequirement = businessLines.reduce((sum, line) => {
          return sum + line.capitalRequirement;
        }, 0);
        break;
    }
    
    const calculation: CapitalCalculation = {
      id: `CAPITAL-€{Date.now()}`,
      calculationType,
      businessLines,
      totalCapitalRequirement,
      riskWeightedAssets: totalCapitalRequirement * 8.7, // Approximate RWA multiplier
      operationalRiskCapital: totalCapitalRequirement,
      lastCalculated: new Date(),
      validationStatus: 'pending',
      isaeValidation: {
        controlsTested: [],
        validationDate: new Date(),
        validatorName: 'System Generated',
        findings: []
      }
    };
    
    this.capitalCalculations.set(calculation.id, calculation);
    return calculation;
  }

  public async validateCapitalWithISAE(calculationId: string, isaeControls: string[]): Promise<CapitalCalculation> {
    const calculation = this.capitalCalculations.get(calculationId);
    if (!calculation) {
      throw new Error(`Capital calculation €{calculationId} not found`);
    }
    
    // Simulate ISAE validation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedCalculation = {
      ...calculation,
      validationStatus: 'validated' as const,
      isaeValidation: {
        controlsTested: isaeControls,
        validationDate: new Date(),
        validatorName: 'ISAE Validation Service',
        findings: [
          'Capital calculation methodology aligns with ISAE controls',
          'All supporting data validated through ISAE evidence',
          'Process controls operating effectively'
        ]
      }
    };
    
    this.capitalCalculations.set(calculationId, updatedCalculation);
    return updatedCalculation;
  }

  public async recordOperationalRiskEvent(eventData: Omit<OperationalRiskEvent, 'id' | 'dateOccurred'>): Promise<OperationalRiskEvent> {
    const eventId = `OR-EVENT-€{Date.now()}`;
    
    const riskEvent: OperationalRiskEvent = {
      ...eventData,
      id: eventId,
      dateOccurred: new Date()
    };
    
    this.riskEvents.set(eventId, riskEvent);
    return riskEvent;
  }

  public async generateRiskDashboardData(): Promise<RiskDashboardData> {
    // Generate sample dashboard data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dashboardData: RiskDashboardData = {
      operationalRiskTrend: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000),
        events: Math.floor(Math.random() * 5) + 1,
        impact: Math.floor(Math.random() * 100000) + 10000
      })),
      capitalTrend: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000),
        requirement: 15000000 + Math.floor(Math.random() * 5000000),
        available: 20000000 + Math.floor(Math.random() * 10000000)
      })),
      controlEffectiveness: Array.from(this.riskCategories.values()).map(category => ({
        control: category.id,
        effectiveness: category.automationLevel + Math.floor((Math.random() - 0.5) * 10)
      })),
      businessLineRisk: [
        { line: 'Retail Banking', risk: 75, capital: 6000000 },
        { line: 'Commercial Banking', risk: 68, capital: 11250000 },
        { line: 'Investment Banking', risk: 82, capital: 8500000 },
        { line: 'Digital Banking', risk: 70, capital: 4200000 }
      ]
    };
    
    return dashboardData;
  }

  public getRiskCategory(categoryId: string): BaselRiskCategory | undefined {
    return this.riskCategories.get(categoryId);
  }

  public getAllRiskCategories(): BaselRiskCategory[] {
    return Array.from(this.riskCategories.values());
  }

  public getRiskCategoriesByPillar(pillar: BaselRiskCategory['pillar']): BaselRiskCategory[] {
    return Array.from(this.riskCategories.values()).filter(category => category.pillar === pillar);
  }

  public getOperationalRiskCategories(): BaselRiskCategory[] {
    return Array.from(this.riskCategories.values()).filter(category => category.category === 'operational');
  }

  public getRiskEvent(eventId: string): OperationalRiskEvent | undefined {
    return this.riskEvents.get(eventId);
  }

  public getAllRiskEvents(): OperationalRiskEvent[] {
    return Array.from(this.riskEvents.values());
  }

  public getRiskEventsByType(eventType: OperationalRiskEvent['eventType']): OperationalRiskEvent[] {
    return Array.from(this.riskEvents.values()).filter(event => event.eventType === eventType);
  }

  public getRiskEventsByStatus(status: OperationalRiskEvent['status']): OperationalRiskEvent[] {
    return Array.from(this.riskEvents.values()).filter(event => event.status === status);
  }

  public getRiskAlignment(baselRequirement: string, isaeControl: string): RiskAlignment | undefined {
    return this.riskAlignments.get(`€{baselRequirement}-€{isaeControl}`);
  }

  public getAllRiskAlignments(): RiskAlignment[] {
    return Array.from(this.riskAlignments.values());
  }

  public getCapitalCalculation(calculationId: string): CapitalCalculation | undefined {
    return this.capitalCalculations.get(calculationId);
  }

  public getAllCapitalCalculations(): CapitalCalculation[] {
    return Array.from(this.capitalCalculations.values());
  }

  public getMetrics(): BaselMetrics {
    const categories = Array.from(this.riskCategories.values());
    const events = Array.from(this.riskEvents.values());
    const alignments = Array.from(this.riskAlignments.values());
    const calculations = Array.from(this.capitalCalculations.values());
    
    const alignedControls = new Set(alignments.map(a => a.isaeControl)).size;
    const operationalCategories = categories.filter(c => c.category === 'operational');
    const alignmentPercentage = operationalCategories.length > 0 
      ? (alignedControls / operationalCategories.length) * 100 
      : 0;
    
    const avgAutomation = categories.length > 0
      ? categories.reduce((sum, c) => sum + c.automationLevel, 0) / categories.length
      : 0;
    
    const totalCapitalRequirement = calculations.reduce((sum, calc) => sum + calc.totalCapitalRequirement, 0);
    
    // Count KRIs in alert status
    const allKRIs = calculations.flatMap(calc => 
      calc.businessLines.flatMap(line => line.keyRiskIndicators)
    );
    const krisInAlert = allKRIs.filter(kri => kri.alertStatus === 'amber' || kri.alertStatus === 'red').length;
    
    const validatedCalculations = calculations.filter(calc => calc.validationStatus === 'validated').length;
    
    return {
      totalRiskCategories: categories.length,
      alignedControls,
      operationalRiskEvents: events.length,
      capitalRequirement: totalCapitalRequirement,
      alignmentPercentage,
      automationLevel: avgAutomation,
      lastUpdate: new Date(),
      krisInAlert,
      validatedCalculations
    };
  }
}

export default BaselRiskAlignmentService;