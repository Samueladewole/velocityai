export interface SOXControl {
  id: string;
  section: '302' | '404' | '906' | '409';
  subsection: string;
  title: string;
  description: string;
  requirements: string[];
  testingProcedures: string[];
  evidenceTypes: string[];
  frequency: 'quarterly' | 'annually' | 'continuous';
  riskLevel: 'high' | 'medium' | 'low';
  isaeMapping: string[]; // Maps to ISAE 3000 controls
  automationLevel: number;
  bankingSpecific: boolean;
}

export interface ControlMapping {
  soxControlId: string;
  isaeControlId: string;
  mappingType: 'direct' | 'partial' | 'complementary';
  overlapPercentage: number;
  sharedEvidence: string[];
  gapAnalysis: string[];
  coordinationPlan: string;
}

export interface ComplianceGap {
  id: string;
  controlId: string;
  framework: 'SOX' | 'ISAE3000';
  gapType: 'evidence' | 'testing' | 'documentation' | 'frequency';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  remediation: string;
  targetDate: Date;
  status: 'identified' | 'in-progress' | 'resolved';
  assignedTo: string;
}

export interface CoordinationMetrics {
  totalSOXControls: number;
  mappedControls: number;
  sharedEvidenceItems: number;
  coordinationEfficiency: number;
  gapsIdentified: number;
  gapsResolved: number;
  costSavings: number;
  timeReduction: number;
  lastUpdate: Date;
}

export interface DualComplianceReport {
  id: string;
  reportPeriod: {
    startDate: Date;
    endDate: Date;
  };
  soxCompliance: {
    overallScore: number;
    controlsEffective: number;
    controlsTotal: number;
    deficiencies: number;
    materialWeaknesses: number;
  };
  isaeCompliance: {
    overallScore: number;
    controlsCovered: number;
    controlsTotal: number;
    findings: number;
    recommendations: number;
  };
  coordination: {
    sharedControls: number;
    sharedEvidence: number;
    efficiencyGain: number;
    costReduction: number;
  };
  executiveSummary: string;
  recommendations: string[];
  nextReviewDate: Date;
  generatedAt: Date;
}

class SOXCoordinationService {
  private static instance: SOXCoordinationService;
  private soxControls: Map<string, SOXControl> = new Map();
  private controlMappings: Map<string, ControlMapping> = new Map();
  private complianceGaps: Map<string, ComplianceGap> = new Map();

  private constructor() {
    this.initializeSOXControls();
    this.initializeControlMappings();
    this.initializeSampleGaps();
  }

  public static getInstance(): SOXCoordinationService {
    if (!SOXCoordinationService.instance) {
      SOXCoordinationService.instance = new SOXCoordinationService();
    }
    return SOXCoordinationService.instance;
  }

  private initializeSOXControls() {
    const controls: SOXControl[] = [
      // Section 404 - Management Assessment of Internal Controls
      {
        id: 'SOX-404.1',
        section: '404',
        subsection: 'Management Assessment',
        title: 'Internal Control Framework Assessment',
        description: 'Management assessment of the effectiveness of internal control over financial reporting',
        requirements: [
          'Annual assessment of ICFR effectiveness',
          'Documentation of control design and operation',
          'Testing of key controls',
          'Management assertion on effectiveness'
        ],
        testingProcedures: [
          'Walkthrough procedures',
          'Control design evaluation',
          'Operating effectiveness testing',
          'Deficiency evaluation'
        ],
        evidenceTypes: ['control-documentation', 'test-results', 'management-assertions', 'deficiency-reports'],
        frequency: 'annually',
        riskLevel: 'high',
        isaeMapping: ['CC1.1', 'CC2.1', 'CC5.1'],
        automationLevel: 85,
        bankingSpecific: true
      },
      {
        id: 'SOX-404.2',
        section: '404',
        subsection: 'Entity Level Controls',
        title: 'Banking Entity Level Controls',
        description: 'Controls that operate at the entity level affecting multiple transaction classes',
        requirements: [
          'Board oversight of financial reporting',
          'Management philosophy and operating style',
          'Organizational structure and authority',
          'Risk assessment processes'
        ],
        testingProcedures: [
          'Board meeting review',
          'Management interview procedures',
          'Policy review and testing',
          'Risk assessment validation'
        ],
        evidenceTypes: ['board-minutes', 'management-interviews', 'policy-documents', 'risk-assessments'],
        frequency: 'annually',
        riskLevel: 'high',
        isaeMapping: ['CC1.1', 'CC1.2', 'CC2.1'],
        automationLevel: 70,
        bankingSpecific: true
      },
      {
        id: 'SOX-404.3',
        section: '404',
        subsection: 'Transaction Level Controls',
        title: 'Banking Transaction Processing Controls',
        description: 'Controls over the processing of banking transactions and account balances',
        requirements: [
          'Transaction authorization controls',
          'Recording and processing controls',
          'Reconciliation controls',
          'Management review controls'
        ],
        testingProcedures: [
          'Transaction testing',
          'Reconciliation review',
          'System controls testing',
          'Management review testing'
        ],
        evidenceTypes: ['transaction-logs', 'reconciliations', 'system-reports', 'approval-records'],
        frequency: 'quarterly',
        riskLevel: 'high',
        isaeMapping: ['CC7.1', 'CC7.2', 'CC5.1'],
        automationLevel: 95,
        bankingSpecific: true
      },
      {
        id: 'SOX-404.4',
        section: '404',
        subsection: 'IT General Controls',
        title: 'Banking IT General Controls',
        description: 'Controls over the IT environment supporting financial reporting',
        requirements: [
          'Access controls to financial systems',
          'Change management procedures',
          'Data backup and recovery',
          'Computer operations controls'
        ],
        testingProcedures: [
          'Access rights testing',
          'Change management review',
          'Backup testing',
          'Operations review'
        ],
        evidenceTypes: ['access-reports', 'change-logs', 'backup-reports', 'operations-logs'],
        frequency: 'quarterly',
        riskLevel: 'high',
        isaeMapping: ['CC6.1', 'CC6.2', 'CC8.1'],
        automationLevel: 90,
        bankingSpecific: true
      },
      // Section 302 - CEO/CFO Certifications
      {
        id: 'SOX-302.1',
        section: '302',
        subsection: 'Management Certifications',
        title: 'CEO/CFO Quarterly Certifications',
        description: 'Quarterly certifications by CEO and CFO regarding financial statements and controls',
        requirements: [
          'Review of quarterly financial statements',
          'Assessment of disclosure controls',
          'Evaluation of internal control changes',
          'Certification of accuracy and completeness'
        ],
        testingProcedures: [
          'Certification process review',
          'Supporting documentation review',
          'Management interview',
          'Disclosure controls testing'
        ],
        evidenceTypes: ['certifications', 'review-documentation', 'management-representations'],
        frequency: 'quarterly',
        riskLevel: 'high',
        isaeMapping: ['CC1.2', 'CC5.1'],
        automationLevel: 75,
        bankingSpecific: true
      }
    ];

    controls.forEach(control => {
      this.soxControls.set(control.id, control);
    });
  }

  private initializeControlMappings() {
    const mappings: ControlMapping[] = [
      {
        soxControlId: 'SOX-404.1',
        isaeControlId: 'CC1.1',
        mappingType: 'direct',
        overlapPercentage: 85,
        sharedEvidence: ['control-documentation', 'management-assertions'],
        gapAnalysis: ['SOX requires annual assertion, ISAE requires continuous monitoring'],
        coordinationPlan: 'Leverage ISAE continuous monitoring to support SOX annual assessment'
      },
      {
        soxControlId: 'SOX-404.3',
        isaeControlId: 'CC7.1',
        mappingType: 'direct',
        overlapPercentage: 92,
        sharedEvidence: ['transaction-logs', 'system-reports', 'reconciliations'],
        gapAnalysis: ['Minor differences in testing frequency and scope'],
        coordinationPlan: 'Combine testing procedures and share evidence between both frameworks'
      },
      {
        soxControlId: 'SOX-404.4',
        isaeControlId: 'CC6.1',
        mappingType: 'partial',
        overlapPercentage: 78,
        sharedEvidence: ['access-reports', 'change-logs'],
        gapAnalysis: ['SOX focuses on financial systems, ISAE covers broader IT environment'],
        coordinationPlan: 'Expand ISAE IT controls testing to cover SOX-specific requirements'
      },
      {
        soxControlId: 'SOX-302.1',
        isaeControlId: 'CC1.2',
        mappingType: 'complementary',
        overlapPercentage: 65,
        sharedEvidence: ['management-representations', 'board-minutes'],
        gapAnalysis: ['SOX certification process differs from ISAE management oversight'],
        coordinationPlan: 'Coordinate management review processes to support both requirements'
      }
    ];

    mappings.forEach(mapping => {
      this.controlMappings.set(`€{mapping.soxControlId}-€{mapping.isaeControlId}`, mapping);
    });
  }

  private initializeSampleGaps() {
    const gaps: ComplianceGap[] = [
      {
        id: 'gap-001',
        controlId: 'SOX-404.1',
        framework: 'SOX',
        gapType: 'frequency',
        severity: 'medium',
        description: 'SOX requires annual management assessment while ISAE requires continuous monitoring',
        impact: 'Potential duplication of assessment activities and increased costs',
        remediation: 'Implement continuous monitoring approach that satisfies both SOX annual and ISAE ongoing requirements',
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        status: 'in-progress',
        assignedTo: 'Internal Audit Team'
      },
      {
        id: 'gap-002',
        controlId: 'SOX-404.4',
        framework: 'SOX',
        gapType: 'evidence',
        severity: 'low',
        description: 'Need additional evidence for SOX-specific IT controls not covered by ISAE',
        impact: 'Minor additional testing required for SOX compliance',
        remediation: 'Extend ISAE IT controls testing to include SOX-specific requirements',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'identified',
        assignedTo: 'IT Security Team'
      }
    ];

    gaps.forEach(gap => {
      this.complianceGaps.set(gap.id, gap);
    });
  }

  public async analyzeControlMappings(): Promise<ControlMapping[]> {
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Array.from(this.controlMappings.values());
  }

  public async identifyComplianceGaps(): Promise<ComplianceGap[]> {
    // Simulate gap analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const soxControls = Array.from(this.soxControls.values());
    const mappings = Array.from(this.controlMappings.values());
    
    // Identify controls without mappings
    const unmappedSOXControls = soxControls.filter(control => 
      !mappings.some(mapping => mapping.soxControlId === control.id)
    );
    
    // Generate gaps for unmapped controls
    const newGaps: ComplianceGap[] = unmappedSOXControls.map(control => ({
      id: `gap-unmapped-€{control.id}`,
      controlId: control.id,
      framework: 'SOX',
      gapType: 'documentation',
      severity: control.riskLevel === 'high' ? 'high' : 'medium',
      description: `SOX control €{control.id} has no corresponding ISAE 3000 mapping`,
      impact: 'Requires separate compliance processes and evidence collection',
      remediation: 'Establish mapping between SOX and ISAE controls or implement dedicated SOX testing',
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'identified',
      assignedTo: 'Compliance Team'
    }));
    
    // Add to existing gaps
    newGaps.forEach(gap => {
      this.complianceGaps.set(gap.id, gap);
    });
    
    return Array.from(this.complianceGaps.values());
  }

  public async generateCoordinationPlan(): Promise<{
    sharedControls: ControlMapping[];
    efficiencyOpportunities: string[];
    implementationSteps: string[];
    expectedBenefits: {
      costReduction: number;
      timeReduction: number;
      efficiencyGain: number;
    };
  }> {
    const mappings = await this.analyzeControlMappings();
    const sharedControls = mappings.filter(mapping => mapping.overlapPercentage > 70);
    
    const efficiencyOpportunities = [
      'Combine SOX and ISAE control testing procedures',
      'Leverage shared evidence for both compliance frameworks',
      'Implement unified monitoring and reporting systems',
      'Coordinate audit schedules and procedures',
      'Establish common risk assessment processes'
    ];
    
    const implementationSteps = [
      '1. Map all SOX 404 controls to ISAE 3000 equivalents',
      '2. Identify shared evidence and testing procedures',
      '3. Develop unified control testing approach',
      '4. Implement coordinated monitoring systems',
      '5. Establish integrated reporting processes',
      '6. Train staff on dual compliance requirements',
      '7. Monitor and optimize coordination effectiveness'
    ];
    
    const expectedBenefits = {
      costReduction: 35, // 35% cost reduction through coordination
      timeReduction: 45, // 45% time reduction in compliance activities
      efficiencyGain: 40  // 40% efficiency improvement
    };
    
    return {
      sharedControls,
      efficiencyOpportunities,
      implementationSteps,
      expectedBenefits
    };
  }

  public async generateDualComplianceReport(
    reportPeriod: { startDate: Date; endDate: Date }
  ): Promise<DualComplianceReport> {
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mappings = Array.from(this.controlMappings.values());
    const gaps = Array.from(this.complianceGaps.values());
    
    const report: DualComplianceReport = {
      id: `dual-compliance-€{Date.now()}`,
      reportPeriod,
      soxCompliance: {
        overallScore: 94,
        controlsEffective: 23,
        controlsTotal: 25,
        deficiencies: 2,
        materialWeaknesses: 0
      },
      isaeCompliance: {
        overallScore: 96,
        controlsCovered: 9,
        controlsTotal: 10,
        findings: 1,
        recommendations: 3
      },
      coordination: {
        sharedControls: mappings.filter(m => m.overlapPercentage > 70).length,
        sharedEvidence: mappings.reduce((sum, m) => sum + m.sharedEvidence.length, 0),
        efficiencyGain: 42,
        costReduction: 38
      },
      executiveSummary: `The coordinated SOX 404 and ISAE 3000 compliance program achieved significant efficiency gains during the €{reportPeriod.startDate.getFullYear()} reporting period. Through integrated control testing and shared evidence collection, the organization realized 38% cost reduction and 42% efficiency improvement compared to separate compliance programs.`,
      recommendations: [
        'Continue expanding shared control testing procedures',
        'Implement additional automation for evidence collection',
        'Enhance coordination between internal audit and external assurance teams',
        'Develop integrated risk assessment processes'
      ],
      nextReviewDate: new Date(reportPeriod.endDate.getTime() + 90 * 24 * 60 * 60 * 1000),
      generatedAt: new Date()
    };
    
    return report;
  }

  public getSOXControl(controlId: string): SOXControl | undefined {
    return this.soxControls.get(controlId);
  }

  public getAllSOXControls(): SOXControl[] {
    return Array.from(this.soxControls.values());
  }

  public getSOXControlsBySection(section: SOXControl['section']): SOXControl[] {
    return Array.from(this.soxControls.values()).filter(control => control.section === section);
  }

  public getBankingSpecificSOXControls(): SOXControl[] {
    return Array.from(this.soxControls.values()).filter(control => control.bankingSpecific);
  }

  public getControlMapping(soxControlId: string, isaeControlId: string): ControlMapping | undefined {
    return this.controlMappings.get(`€{soxControlId}-€{isaeControlId}`);
  }

  public getAllControlMappings(): ControlMapping[] {
    return Array.from(this.controlMappings.values());
  }

  public getComplianceGap(gapId: string): ComplianceGap | undefined {
    return this.complianceGaps.get(gapId);
  }

  public getAllComplianceGaps(): ComplianceGap[] {
    return Array.from(this.complianceGaps.values());
  }

  public getComplianceGapsByStatus(status: ComplianceGap['status']): ComplianceGap[] {
    return Array.from(this.complianceGaps.values()).filter(gap => gap.status === status);
  }

  public async updateComplianceGap(gapId: string, updates: Partial<ComplianceGap>): Promise<ComplianceGap> {
    const existingGap = this.complianceGaps.get(gapId);
    if (!existingGap) {
      throw new Error(`Compliance gap €{gapId} not found`);
    }

    const updatedGap = { ...existingGap, ...updates };
    this.complianceGaps.set(gapId, updatedGap);
    
    return updatedGap;
  }

  public getMetrics(): CoordinationMetrics {
    const soxControls = Array.from(this.soxControls.values());
    const mappings = Array.from(this.controlMappings.values());
    const gaps = Array.from(this.complianceGaps.values());
    
    const mappedControls = new Set(mappings.map(m => m.soxControlId)).size;
    const sharedEvidenceItems = mappings.reduce((sum, m) => sum + m.sharedEvidence.length, 0);
    const coordinationEfficiency = mappedControls > 0 ? (mappedControls / soxControls.length) * 100 : 0;
    
    const gapsResolved = gaps.filter(g => g.status === 'resolved').length;
    
    // Estimated benefits based on coordination level
    const costSavings = coordinationEfficiency * 1000; // €1000 per percent efficiency
    const timeReduction = coordinationEfficiency * 0.5; // 0.5 days per percent efficiency
    
    return {
      totalSOXControls: soxControls.length,
      mappedControls,
      sharedEvidenceItems,
      coordinationEfficiency,
      gapsIdentified: gaps.length,
      gapsResolved,
      costSavings,
      timeReduction,
      lastUpdate: new Date()
    };
  }
}

export default SOXCoordinationService;