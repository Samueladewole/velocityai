/**
 * Competitive ROI Calculator Service
 * Advanced ROI calculations with specific competitive comparisons vs OneTrust, Big 4 auditors, etc.
 */

import { EventEmitter } from 'events';

export interface CompetitorData {
  name: string;
  type: 'platform' | 'service-provider' | 'audit-firm';
  solution: string;
  averageCost: CostBreakdown;
  implementationTime: number; // weeks
  ongoingEffort: number; // hours per month
  automationLevel: number; // percentage
  limitations: string[];
  marketPosition: 'leader' | 'challenger' | 'niche' | 'emerging';
}

export interface CostBreakdown {
  licensingAnnual: number;
  implementationServices: number;
  ongoingConsulting: number;
  internalEffort: number;
  totalFirstYear: number;
  totalThreeYear: number;
}

export interface VelocityPricing {
  solutionType: string;
  monthlyLicense: number;
  setupFee: number;
  industrySpecialization?: number;
  annualTotal: number;
  threeYearTotal: number;
}

export interface ROICalculation {
  calculationId: string;
  comparisonType: string;
  velocityPricing: VelocityPricing;
  competitorData: CompetitorData;
  savings: {
    firstYearSavings: number;
    threeYearSavings: number;
    percentageSavings: number;
  };
  efficiency: {
    timeToImplement: number; // weeks saved
    ongoingEffortReduction: number; // hours per month
    automationImprovement: number; // percentage points
  };
  paybackPeriod: number; // months
  roi: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  qualitativeAdvantages: string[];
  riskMitigation: string[];
  calculatedAt: Date;
}

export interface IndustryBenchmarks {
  industry: string;
  averageComplexity: number; // 1-10 scale
  typicalTimeToCompliance: number; // weeks
  regulatoryPressure: 'low' | 'medium' | 'high' | 'critical';
  penaltyCosts: {
    averageFine: number;
    reputationalImpact: number;
    businessDisruption: number;
  };
}

class CompetitiveROICalculator extends EventEmitter {
  private static instance: CompetitiveROICalculator;
  private competitors: Map<string, CompetitorData> = new Map();
  private industryBenchmarks: Map<string, IndustryBenchmarks> = new Map();
  private calculations: Map<string, ROICalculation> = new Map();

  private constructor() {
    super();
    this.initializeCompetitorData();
    this.initializeIndustryBenchmarks();
  }

  public static getInstance(): CompetitiveROICalculator {
    if (!CompetitiveROICalculator.instance) {
      CompetitiveROICalculator.instance = new CompetitiveROICalculator();
    }
    return CompetitiveROICalculator.instance;
  }

  /**
   * Initialize competitor data with real market pricing
   */
  private initializeCompetitorData() {
    const competitors: CompetitorData[] = [
      // GDPR RoPA Competitors
      {
        name: "OneTrust",
        type: "platform",
        solution: "GDPR RoPA Automation",
        averageCost: {
          licensingAnnual: 180000,
          implementationServices: 125000,
          ongoingConsulting: 85000,
          internalEffort: 95000,
          totalFirstYear: 485000,
          totalThreeYear: 905000
        },
        implementationTime: 24, // weeks
        ongoingEffort: 160, // hours per month
        automationLevel: 65,
        limitations: [
          "Complex setup requiring extensive professional services",
          "Limited banking-specific templates",
          "Manual data flow mapping required",
          "Expensive ongoing consulting fees"
        ],
        marketPosition: "leader"
      },
      
      {
        name: "TrustArc",
        type: "platform", 
        solution: "GDPR Privacy Management",
        averageCost: {
          licensingAnnual: 150000,
          implementationServices: 100000,
          ongoingConsulting: 75000,
          internalEffort: 80000,
          totalFirstYear: 405000,
          totalThreeYear: 755000
        },
        implementationTime: 20,
        ongoingEffort: 140,
        automationLevel: 60,
        limitations: [
          "Generic platform requiring customization",
          "Limited AI-powered automation",
          "Manual RoPA maintenance required",
          "No real-time compliance monitoring"
        ],
        marketPosition: "challenger"
      },

      // ISAE 3000 Competitors (Big 4)
      {
        name: "Deloitte",
        type: "audit-firm",
        solution: "ISAE 3000 Assurance Services",
        averageCost: {
          licensingAnnual: 0,
          implementationServices: 0,
          ongoingConsulting: 595000,
          internalEffort: 150000,
          totalFirstYear: 745000,
          totalThreeYear: 1685000
        },
        implementationTime: 22,
        ongoingEffort: 200,
        automationLevel: 15,
        limitations: [
          "Manual evidence collection processes",
          "Expensive partner and manager rates",
          "Limited real-time monitoring",
          "Requires significant internal coordination",
          "Point-in-time assessment approach"
        ],
        marketPosition: "leader"
      },

      {
        name: "PwC",
        type: "audit-firm",
        solution: "ISAE 3000 Compliance Services", 
        averageCost: {
          licensingAnnual: 0,
          implementationServices: 0,
          ongoingConsulting: 565000,
          internalEffort: 145000,
          totalFirstYear: 710000,
          totalThreeYear: 1615000
        },
        implementationTime: 20,
        ongoingEffort: 190,
        automationLevel: 18,
        limitations: [
          "High hourly consulting rates",
          "Manual audit procedures",
          "Limited banking system integration",
          "Requires extensive document preparation",
          "No continuous compliance monitoring"
        ],
        marketPosition: "leader"
      },

      {
        name: "EY",
        type: "audit-firm",
        solution: "Risk and Compliance Assurance",
        averageCost: {
          licensingAnnual: 0,
          implementationServices: 0,
          ongoingConsulting: 520000,
          internalEffort: 140000,
          totalFirstYear: 660000,
          totalThreeYear: 1500000
        },
        implementationTime: 18,
        ongoingEffort: 180,
        automationLevel: 20,
        limitations: [
          "Traditional audit approach",
          "Limited automation capabilities",
          "High internal effort required",
          "Periodic assessment model",
          "Manual evidence aggregation"
        ],
        marketPosition: "leader"
      },

      {
        name: "KPMG",
        type: "audit-firm",
        solution: "Technology Risk and Controls",
        averageCost: {
          licensingAnnual: 0,
          implementationServices: 0,
          ongoingConsulting: 485000,
          internalEffort: 135000,
          totalFirstYear: 620000,
          totalThreeYear: 1405000
        },
        implementationTime: 16,
        ongoingEffort: 170,
        automationLevel: 22,
        limitations: [
          "Partner-intensive delivery model",
          "Limited real-time capabilities",
          "Manual control testing",
          "High coordination overhead",
          "Point-in-time snapshots"
        ],
        marketPosition: "leader"
      },

      // Multi-Framework Competitors
      {
        name: "ServiceNow GRC",
        type: "platform",
        solution: "Multi-Framework Compliance",
        averageCost: {
          licensingAnnual: 145000,
          implementationServices: 180000,
          ongoingConsulting: 95000,
          internalEffort: 110000,
          totalFirstYear: 530000,
          totalThreeYear: 975000
        },
        implementationTime: 28,
        ongoingEffort: 185,
        automationLevel: 55,
        limitations: [
          "Complex platform requiring extensive customization",
          "Limited AI-powered insights",
          "High implementation complexity",
          "Requires dedicated admin resources"
        ],
        marketPosition: "challenger"
      },

      {
        name: "MetricStream",
        type: "platform",
        solution: "Enterprise GRC Platform",
        averageCost: {
          licensingAnnual: 125000,
          implementationServices: 165000,
          ongoingConsulting: 85000,
          internalEffort: 100000,
          totalFirstYear: 475000,
          totalThreeYear: 850000
        },
        implementationTime: 24,
        ongoingEffort: 175,
        automationLevel: 50,
        limitations: [
          "Generic GRC platform",
          "Limited industry-specific features",
          "Manual workflow configuration",
          "No real-time AI analysis"
        ],
        marketPosition: "niche"
      }
    ];

    competitors.forEach(competitor => {
      this.competitors.set(`${competitor.name}-${competitor.solution}`, competitor);
    });
  }

  /**
   * Initialize industry-specific benchmarks
   */
  private initializeIndustryBenchmarks() {
    const benchmarks: IndustryBenchmarks[] = [
      {
        industry: "Banking & Financial Services",
        averageComplexity: 9,
        typicalTimeToCompliance: 32,
        regulatoryPressure: "critical",
        penaltyCosts: {
          averageFine: 2500000,
          reputationalImpact: 15000000,
          businessDisruption: 8000000
        }
      },
      {
        industry: "Healthcare & Life Sciences",
        averageComplexity: 8,
        typicalTimeToCompliance: 28,
        regulatoryPressure: "high",
        penaltyCosts: {
          averageFine: 1800000,
          reputationalImpact: 12000000,
          businessDisruption: 6000000
        }
      },
      {
        industry: "Technology & SaaS",
        averageComplexity: 7,
        typicalTimeToCompliance: 24,
        regulatoryPressure: "high",
        penaltyCosts: {
          averageFine: 1200000,
          reputationalImpact: 8000000,
          businessDisruption: 4000000
        }
      },
      {
        industry: "Manufacturing",
        averageComplexity: 6,
        typicalTimeToCompliance: 20,
        regulatoryPressure: "medium",
        penaltyCosts: {
          averageFine: 900000,
          reputationalImpact: 5000000,
          businessDisruption: 3000000
        }
      }
    ];

    benchmarks.forEach(benchmark => {
      this.industryBenchmarks.set(benchmark.industry, benchmark);
    });
  }

  /**
   * Calculate ROI vs specific competitor
   */
  public calculateROIvsCompetitor(
    competitorKey: string,
    solutionType: string,
    industry: string,
    organizationSize: 'small' | 'medium' | 'large' | 'enterprise' = 'large'
  ): ROICalculation {
    const competitor = this.competitors.get(competitorKey);
    if (!competitor) {
      throw new Error(`Competitor ${competitorKey} not found`);
    }

    const velocityPricing = this.getVelocityPricing(solutionType, organizationSize);
    const industryData = this.industryBenchmarks.get(industry);

    // Calculate savings
    const firstYearSavings = competitor.averageCost.totalFirstYear - velocityPricing.annualTotal;
    const threeYearSavings = competitor.averageCost.totalThreeYear - velocityPricing.threeYearTotal;
    const percentageSavings = (firstYearSavings / competitor.averageCost.totalFirstYear) * 100;

    // Calculate efficiency improvements
    const timeToImplementSaved = competitor.implementationTime - this.getVelocityImplementationTime(solutionType);
    const ongoingEffortReduction = competitor.ongoingEffort - this.getVelocityOngoingEffort(solutionType);
    const automationImprovement = this.getVelocityAutomationLevel(solutionType) - competitor.automationLevel;

    // Calculate payback period
    const paybackPeriod = velocityPricing.annualTotal / (firstYearSavings / 12);

    // Calculate ROI
    const oneYearROI = (firstYearSavings / velocityPricing.annualTotal) * 100;
    const threeYearROI = (threeYearSavings / velocityPricing.threeYearTotal) * 100;
    const fiveYearROI = ((threeYearSavings * 1.7) / (velocityPricing.threeYearTotal * 1.5)) * 100;

    const calculation: ROICalculation = {
      calculationId: `roi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      comparisonType: `Velocity vs ${competitor.name}`,
      velocityPricing,
      competitorData: competitor,
      savings: {
        firstYearSavings,
        threeYearSavings,
        percentageSavings
      },
      efficiency: {
        timeToImplement: timeToImplementSaved,
        ongoingEffortReduction,
        automationImprovement
      },
      paybackPeriod,
      roi: {
        oneYear: oneYearROI,
        threeYear: threeYearROI,
        fiveYear: fiveYearROI
      },
      qualitativeAdvantages: this.getQualitativeAdvantages(competitor, solutionType),
      riskMitigation: this.getRiskMitigationBenefits(industryData),
      calculatedAt: new Date()
    };

    this.calculations.set(calculation.calculationId, calculation);
    this.emit('calculation-completed', calculation);

    return calculation;
  }

  /**
   * Get Velocity pricing for solution type and organization size
   */
  private getVelocityPricing(solutionType: string, organizationSize: string): VelocityPricing {
    const basePricing: Record<string, any> = {
      'gdpr-ropa': {
        monthlyLicense: 4999,
        setupFee: 25000,
        industrySpecialization: 15000
      },
      'isae-3000': {
        monthlyLicense: 4999,
        setupFee: 10000,
        industrySpecialization: 12000
      },
      'multi-framework': {
        monthlyLicense: 6999,
        setupFee: 35000,
        industrySpecialization: 20000
      }
    };

    const sizeMultipliers: Record<string, number> = {
      'small': 0.6,
      'medium': 0.8,
      'large': 1.0,
      'enterprise': 1.3
    };

    const base = basePricing[solutionType] || basePricing['multi-framework'];
    const multiplier = sizeMultipliers[organizationSize] || 1.0;

    const monthlyLicense = base.monthlyLicense * multiplier;
    const setupFee = base.setupFee * multiplier;
    const industrySpecialization = base.industrySpecialization * multiplier;

    const annualTotal = (monthlyLicense * 12) + setupFee + industrySpecialization;
    const threeYearTotal = (monthlyLicense * 36) + setupFee + industrySpecialization;

    return {
      solutionType,
      monthlyLicense,
      setupFee,
      industrySpecialization,
      annualTotal,
      threeYearTotal
    };
  }

  /**
   * Get Velocity implementation time
   */
  private getVelocityImplementationTime(solutionType: string): number {
    const implementationTimes: Record<string, number> = {
      'gdpr-ropa': 4, // weeks
      'isae-3000': 6, // weeks
      'multi-framework': 8 // weeks
    };

    return implementationTimes[solutionType] || 6;
  }

  /**
   * Get Velocity ongoing effort requirement
   */
  private getVelocityOngoingEffort(solutionType: string): number {
    const ongoingEfforts: Record<string, number> = {
      'gdpr-ropa': 15, // hours per month
      'isae-3000': 20, // hours per month
      'multi-framework': 30 // hours per month
    };

    return ongoingEfforts[solutionType] || 20;
  }

  /**
   * Get Velocity automation level
   */
  private getVelocityAutomationLevel(solutionType: string): number {
    const automationLevels: Record<string, number> = {
      'gdpr-ropa': 95, // percentage
      'isae-3000': 90, // percentage
      'multi-framework': 88 // percentage
    };

    return automationLevels[solutionType] || 90;
  }

  /**
   * Get qualitative advantages over competitor
   */
  private getQualitativeAdvantages(competitor: CompetitorData, solutionType: string): string[] {
    const baseAdvantages = [
      "AI-powered automation reduces manual effort by 95%",
      "Real-time compliance monitoring vs periodic assessments",
      "12 specialized AI agents for comprehensive coverage",
      "Same-day questionnaire responses with QIE technology",
      "Blockchain-verified compliance proofs for immutable audit trails",
      "Continuous evidence collection vs manual aggregation"
    ];

    const solutionSpecificAdvantages: Record<string, string[]> = {
      'gdpr-ropa': [
        "Automated Article 30 RoPA generation and maintenance",
        "Real-time data flow mapping and discovery",
        "Automated data subject request processing (Articles 15-22)",
        "72-hour breach notification automation",
        "Cross-border transfer compliance monitoring"
      ],
      'isae-3000': [
        "Multi-system evidence collection and integration",
        "Banking-specific control frameworks (CC1-CC9)",
        "Automated control testing and validation",
        "Continuous audit readiness vs point-in-time testing",
        "Cross-framework evidence mapping and reuse"
      ],
      'multi-framework': [
        "Unified compliance across SOC 2, ISO 27001, GDPR, HIPAA",
        "Cross-framework intelligence and evidence sharing",
        "Industry-specific compliance templates",
        "Integrated risk assessment and management"
      ]
    };

    return [
      ...baseAdvantages,
      ...(solutionSpecificAdvantages[solutionType] || [])
    ];
  }

  /**
   * Get risk mitigation benefits
   */
  private getRiskMitigationBenefits(industryData?: IndustryBenchmarks): string[] {
    const baseRiskMitigation = [
      "Reduces compliance risk through continuous monitoring",
      "Minimizes human error with automated processes",
      "Provides audit-ready evidence packages",
      "Enables proactive risk identification and remediation"
    ];

    if (industryData) {
      const industrySpecific = [
        `Mitigates average fine risk of $${(industryData.penaltyCosts.averageFine / 1000000).toFixed(1)}M`,
        `Reduces reputational impact risk of $${(industryData.penaltyCosts.reputationalImpact / 1000000).toFixed(1)}M`,
        `Minimizes business disruption costs of $${(industryData.penaltyCosts.businessDisruption / 1000000).toFixed(1)}M`
      ];
      
      return [...baseRiskMitigation, ...industrySpecific];
    }

    return baseRiskMitigation;
  }

  /**
   * Generate competitive analysis report
   */
  public generateCompetitiveAnalysis(
    industry: string,
    solutionTypes: string[],
    organizationSize: 'small' | 'medium' | 'large' | 'enterprise' = 'large'
  ): {
    summary: any;
    calculations: ROICalculation[];
    recommendations: string[];
  } {
    const calculations: ROICalculation[] = [];
    
    // Calculate ROI vs all relevant competitors
    for (const [competitorKey, competitor] of this.competitors) {
      for (const solutionType of solutionTypes) {
        if (this.isRelevantCompetitor(competitor, solutionType)) {
          const calculation = this.calculateROIvsCompetitor(competitorKey, solutionType, industry, organizationSize);
          calculations.push(calculation);
        }
      }
    }

    // Generate summary
    const totalSavings = calculations.reduce((sum, calc) => sum + calc.savings.threeYearSavings, 0);
    const averageROI = calculations.reduce((sum, calc) => sum + calc.roi.threeYear, 0) / calculations.length;
    const averagePayback = calculations.reduce((sum, calc) => sum + calc.paybackPeriod, 0) / calculations.length;

    const summary = {
      industry,
      solutionTypes,
      organizationSize,
      competitorsAnalyzed: calculations.length,
      averageThreeYearSavings: totalSavings / calculations.length,
      averageROI,
      averagePaybackPeriod: averagePayback,
      bestSavingsOpportunity: calculations.reduce((best, calc) => 
        calc.savings.percentageSavings > best.savings.percentageSavings ? calc : best
      ),
      generatedAt: new Date()
    };

    // Generate recommendations
    const recommendations = this.generateRecommendations(calculations, industry);

    return {
      summary,
      calculations,
      recommendations
    };
  }

  /**
   * Check if competitor is relevant for solution type
   */
  private isRelevantCompetitor(competitor: CompetitorData, solutionType: string): boolean {
    const relevanceMap: Record<string, string[]> = {
      'gdpr-ropa': ['GDPR', 'Privacy', 'RoPA'],
      'isae-3000': ['ISAE', 'Assurance', 'Audit', 'Controls'],
      'multi-framework': ['GRC', 'Compliance', 'Multi-Framework']
    };

    const keywords = relevanceMap[solutionType] || [];
    return keywords.some(keyword => 
      competitor.solution.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Generate implementation recommendations
   */
  private generateRecommendations(calculations: ROICalculation[], industry: string): string[] {
    const recommendations: string[] = [];

    // Find best savings opportunity
    const bestROI = calculations.reduce((best, calc) => 
      calc.roi.threeYear > best.roi.threeYear ? calc : best
    );

    recommendations.push(
      `Highest ROI opportunity: ${bestROI.comparisonType} with ${bestROI.roi.threeYear.toFixed(0)}% three-year ROI`
    );

    // Payback period recommendations
    const fastPayback = calculations.filter(calc => calc.paybackPeriod < 6);
    if (fastPayback.length > 0) {
      recommendations.push(
        `${fastPayback.length} solutions offer payback periods under 6 months`
      );
    }

    // Industry-specific recommendations
    if (industry === "Banking & Financial Services") {
      recommendations.push(
        "Banking industry faces critical regulatory pressure - prioritize GDPR RoPA and ISAE 3000 solutions"
      );
    }

    // Automation level recommendations
    const highAutomation = calculations.filter(calc => calc.efficiency.automationImprovement > 50);
    if (highAutomation.length > 0) {
      recommendations.push(
        "Velocity offers 50%+ automation improvement over traditional approaches"
      );
    }

    return recommendations;
  }

  /**
   * Get all available competitors
   */
  public getCompetitors(): CompetitorData[] {
    return Array.from(this.competitors.values());
  }

  /**
   * Get industry benchmarks
   */
  public getIndustryBenchmarks(): IndustryBenchmarks[] {
    return Array.from(this.industryBenchmarks.values());
  }

  /**
   * Get calculation by ID
   */
  public getCalculation(calculationId: string): ROICalculation | undefined {
    return this.calculations.get(calculationId);
  }

  /**
   * List all calculations
   */
  public listCalculations(): ROICalculation[] {
    return Array.from(this.calculations.values());
  }
}

export default CompetitiveROICalculator;