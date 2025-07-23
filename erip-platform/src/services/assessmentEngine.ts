// Intelligent Assessment Engine for COMPASS
// Provides context-aware regulatory assessment with adaptive questioning

interface OrganizationProfile {
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  geography: string[];
  businessModel: string;
  dataHandling: string[];
  riskAppetite: 'low' | 'medium' | 'high';
  complianceMaturity: number; // 0-100
  existingFrameworks: string[];
  regulatoryHistory: {
    violations: number;
    fines: number;
    auditResults: string[];
  };
}

interface AssessmentQuestion {
  id: string;
  domain: string;
  framework: string;
  text: string;
  type: 'multiple-choice' | 'yes-no' | 'scale' | 'text' | 'file-upload';
  options?: string[];
  weight: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  prerequisites?: string[];
  followUpQuestions?: string[];
  helpText?: string;
  regulatoryReference?: string;
}

interface AssessmentResponse {
  questionId: string;
  answer: any;
  confidence: number; // 0-100
  timestamp: Date;
  context?: Record<string, any>;
}

interface ComplianceGap {
  id: string;
  framework: string;
  requirement: string;
  currentState: string;
  requiredState: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskLevel: number;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  dependencies: string[];
  recommendations: string[];
}

interface RecommendationAction {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  cost: 'low' | 'medium' | 'high';
  impact: string;
  steps: string[];
  resources: string[];
  dependencies: string[];
  frameworks: string[];
}

interface AssessmentResult {
  sessionId: string;
  organizationProfile: OrganizationProfile;
  completionRate: number;
  overallScore: number;
  frameworkScores: Record<string, number>;
  gaps: ComplianceGap[];
  recommendations: RecommendationAction[];
  roadmap: {
    phase: string;
    timeline: string;
    actions: string[];
    milestones: string[];
  }[];
  riskProfile: {
    overall: number;
    categories: Record<string, number>;
    trends: any[];
  };
  timestamp: Date;
}

class ContextAnalyzer {
  /**
   * Analyzes organization context to determine assessment approach
   */
  analyzeOrganization(profile: Partial<OrganizationProfile>): OrganizationProfile {
    const analyzed: OrganizationProfile = {
      industry: profile.industry || 'general',
      size: profile.size || 'medium',
      geography: profile.geography || ['US'],
      businessModel: profile.businessModel || 'standard',
      dataHandling: profile.dataHandling || ['personal'],
      riskAppetite: profile.riskAppetite || 'medium',
      complianceMaturity: profile.complianceMaturity || 50,
      existingFrameworks: profile.existingFrameworks || [],
      regulatoryHistory: profile.regulatoryHistory || {
        violations: 0,
        fines: 0,
        auditResults: []
      }
    };

    // Enhance profile with industry-specific insights
    this.enrichIndustryContext(analyzed);
    
    return analyzed;
  }

  /**
   * Determines applicable regulatory frameworks based on context
   */
  getApplicableFrameworks(profile: OrganizationProfile): string[] {
    const frameworks: string[] = [];

    // Geography-based frameworks
    if (profile.geography.includes('EU')) {
      frameworks.push('GDPR', 'NIS2', 'DORA');
    }
    if (profile.geography.includes('US')) {
      frameworks.push('SOX', 'CCPA', 'NIST CSF');
    }

    // Industry-specific frameworks
    const industryFrameworks = this.getIndustryFrameworks(profile.industry);
    frameworks.push(...industryFrameworks);

    // Size-based requirements
    if (profile.size === 'enterprise' || profile.size === 'large') {
      frameworks.push('ISO 27001', 'SOC 2');
    }

    // Data handling requirements
    if (profile.dataHandling.includes('payment')) {
      frameworks.push('PCI DSS');
    }
    if (profile.dataHandling.includes('health')) {
      frameworks.push('HIPAA');
    }

    return [...new Set(frameworks)];
  }

  private enrichIndustryContext(profile: OrganizationProfile): void {
    const industryProfiles = {
      'financial': {
        riskAppetite: 'low' as const,
        defaultFrameworks: ['SOX', 'PCI DSS', 'NIST CSF']
      },
      'healthcare': {
        riskAppetite: 'low' as const,
        defaultFrameworks: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11']
      },
      'technology': {
        riskAppetite: 'medium' as const,
        defaultFrameworks: ['SOC 2', 'ISO 27001', 'GDPR']
      }
    };

    const industryProfile = industryProfiles[profile.industry as keyof typeof industryProfiles];
    if (industryProfile) {
      if (!profile.riskAppetite) {
        profile.riskAppetite = industryProfile.riskAppetite;
      }
      profile.existingFrameworks = [
        ...new Set([...profile.existingFrameworks, ...industryProfile.defaultFrameworks])
      ];
    }
  }

  private getIndustryFrameworks(industry: string): string[] {
    const industryMap: Record<string, string[]> = {
      'financial': ['SOX', 'PCI DSS', 'FFIEC', 'GLBA'],
      'healthcare': ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11'],
      'technology': ['SOC 2', 'ISO 27001', 'NIST CSF'],
      'retail': ['PCI DSS', 'CCPA'],
      'manufacturing': ['ISO 27001', 'NIST CSF', 'IEC 62443'],
      'government': ['FedRAMP', 'FISMA', 'NIST SP 800-53'],
      'education': ['FERPA', 'COPPA', 'GDPR']
    };

    return industryMap[industry] || ['ISO 27001', 'NIST CSF'];
  }
}

class QuestionSelector {
  private questionBank: Map<string, AssessmentQuestion[]> = new Map();

  constructor() {
    this.initializeQuestionBank();
  }

  /**
   * Selects next question based on context and previous responses
   */
  selectNextQuestion(
    profile: OrganizationProfile,
    responses: AssessmentResponse[],
    targetFramework?: string
  ): AssessmentQuestion | null {
    const applicableFrameworks = targetFramework 
      ? [targetFramework] 
      : new ContextAnalyzer().getApplicableFrameworks(profile);

    // Get all available questions for applicable frameworks
    const availableQuestions = this.getAvailableQuestions(applicableFrameworks, responses);
    
    if (availableQuestions.length === 0) return null;

    // Prioritize questions based on context and adaptive logic
    const prioritizedQuestions = this.prioritizeQuestions(
      availableQuestions, 
      profile, 
      responses
    );

    return prioritizedQuestions[0];
  }

  /**
   * Gets questions for specific framework
   */
  getFrameworkQuestions(framework: string): AssessmentQuestion[] {
    return this.questionBank.get(framework) || [];
  }

  private getAvailableQuestions(
    frameworks: string[], 
    responses: AssessmentResponse[]
  ): AssessmentQuestion[] {
    const answeredIds = new Set(responses.map(r => r.questionId));
    const questions: AssessmentQuestion[] = [];

    for (const framework of frameworks) {
      const frameworkQuestions = this.questionBank.get(framework) || [];
      questions.push(
        ...frameworkQuestions.filter(q => !answeredIds.has(q.id))
      );
    }

    return questions;
  }

  private prioritizeQuestions(
    questions: AssessmentQuestion[],
    profile: OrganizationProfile,
    responses: AssessmentResponse[]
  ): AssessmentQuestion[] {
    return questions.sort((a, b) => {
      // Priority factors
      const criticalityWeight = this.getCriticalityWeight(a.criticality) - 
                               this.getCriticalityWeight(b.criticality);
      const contextWeight = this.getContextWeight(a, profile) - 
                           this.getContextWeight(b, profile);
      const adaptiveWeight = this.getAdaptiveWeight(a, responses) - 
                            this.getAdaptiveWeight(b, responses);

      return criticalityWeight + contextWeight + adaptiveWeight;
    });
  }

  private getCriticalityWeight(criticality: string): number {
    const weights = { critical: 100, high: 75, medium: 50, low: 25 };
    return weights[criticality as keyof typeof weights] || 0;
  }

  private getContextWeight(question: AssessmentQuestion, profile: OrganizationProfile): number {
    let weight = 0;

    // Industry relevance
    if (this.isIndustryRelevant(question, profile.industry)) weight += 20;
    
    // Size relevance
    if (this.isSizeRelevant(question, profile.size)) weight += 15;
    
    // Maturity relevance
    if (this.isMaturityRelevant(question, profile.complianceMaturity)) weight += 10;

    return weight;
  }

  private getAdaptiveWeight(question: AssessmentQuestion, responses: AssessmentResponse[]): number {
    let weight = 0;

    // Prerequisite satisfaction
    if (question.prerequisites) {
      const satisfiedPrereqs = question.prerequisites.filter(prereq =>
        responses.some(r => r.questionId === prereq)
      );
      weight += (satisfiedPrereqs.length / question.prerequisites.length) * 30;
    }

    // Follow-up question logic
    const hasRelevantResponses = responses.some(r => 
      question.followUpQuestions?.includes(r.questionId)
    );
    if (hasRelevantResponses) weight += 25;

    return weight;
  }

  private isIndustryRelevant(question: AssessmentQuestion, industry: string): boolean {
    const industryKeywords = {
      'financial': ['financial', 'banking', 'payment', 'sox', 'monetary'],
      'healthcare': ['health', 'patient', 'medical', 'hipaa', 'phi'],
      'technology': ['software', 'data', 'cloud', 'api', 'development']
    };

    const keywords = industryKeywords[industry as keyof typeof industryKeywords] || [];
    return keywords.some(keyword => 
      question.text.toLowerCase().includes(keyword) ||
      question.domain.toLowerCase().includes(keyword)
    );
  }

  private isSizeRelevant(question: AssessmentQuestion, size: string): boolean {
    const sizeKeywords = {
      'startup': ['basic', 'minimal', 'simple'],
      'small': ['essential', 'core', 'basic'],
      'medium': ['standard', 'comprehensive'],
      'large': ['advanced', 'complex', 'enterprise'],
      'enterprise': ['enterprise', 'advanced', 'comprehensive', 'complex']
    };

    const keywords = sizeKeywords[size as keyof typeof sizeKeywords] || [];
    return keywords.some(keyword => question.text.toLowerCase().includes(keyword));
  }

  private isMaturityRelevant(question: AssessmentQuestion, maturity: number): boolean {
    if (maturity < 30 && question.criticality === 'critical') return true;
    if (maturity < 50 && question.criticality === 'high') return true;
    if (maturity < 70 && question.criticality === 'medium') return true;
    return true; // All questions are relevant at some level
  }

  private initializeQuestionBank(): void {
    // Initialize with sample questions - in production, load from database
    this.questionBank.set('GDPR', [
      {
        id: 'gdpr-001',
        domain: 'data-protection',
        framework: 'GDPR',
        text: 'Does your organization process personal data of EU residents?',
        type: 'yes-no',
        weight: 100,
        criticality: 'critical',
        helpText: 'Personal data includes any information relating to an identified or identifiable natural person.',
        regulatoryReference: 'GDPR Article 4(1)'
      },
      {
        id: 'gdpr-002',
        domain: 'consent',
        framework: 'GDPR',
        text: 'How do you obtain consent for data processing?',
        type: 'multiple-choice',
        options: ['Explicit consent forms', 'Implied consent', 'Legitimate interest', 'No formal process'],
        weight: 85,
        criticality: 'high',
        prerequisites: ['gdpr-001'],
        helpText: 'Consent must be freely given, specific, informed and unambiguous.',
        regulatoryReference: 'GDPR Article 7'
      }
    ]);

    this.questionBank.set('SOX', [
      {
        id: 'sox-001',
        domain: 'financial-reporting',
        framework: 'SOX',
        text: 'Is your organization a public company or subsidiary of a public company?',
        type: 'yes-no',
        weight: 100,
        criticality: 'critical',
        helpText: 'SOX applies to all publicly traded companies and their subsidiaries.',
        regulatoryReference: 'SOX Section 302'
      }
    ]);

    // Add more frameworks and questions...
  }
}

class ResponseAnalyzer {
  /**
   * Analyzes responses to identify compliance gaps and risks
   */
  analyzeResponses(
    responses: AssessmentResponse[],
    profile: OrganizationProfile
  ): { gaps: ComplianceGap[]; riskScore: number } {
    const gaps: ComplianceGap[] = [];
    let totalRisk = 0;

    // Group responses by framework
    const responsesByFramework = this.groupResponsesByFramework(responses);

    for (const [framework, frameworkResponses] of responsesByFramework) {
      const frameworkGaps = this.analyzeFrameworkResponses(framework, frameworkResponses, profile);
      gaps.push(...frameworkGaps);
      
      // Calculate framework risk contribution
      const frameworkRisk = this.calculateFrameworkRisk(frameworkGaps);
      totalRisk += frameworkRisk;
    }

    const riskScore = Math.min(100, totalRisk / responsesByFramework.size);

    return { gaps, riskScore };
  }

  private groupResponsesByFramework(responses: AssessmentResponse[]): Map<string, AssessmentResponse[]> {
    const grouped = new Map<string, AssessmentResponse[]>();
    
    // This would typically query the question bank to get framework info
    responses.forEach(response => {
      const framework = this.getQuestionFramework(response.questionId);
      if (!grouped.has(framework)) {
        grouped.set(framework, []);
      }
      grouped.get(framework)!.push(response);
    });

    return grouped;
  }

  private analyzeFrameworkResponses(
    framework: string,
    responses: AssessmentResponse[],
    profile: OrganizationProfile
  ): ComplianceGap[] {
    const gaps: ComplianceGap[] = [];

    responses.forEach(response => {
      const gap = this.identifyGap(response, framework, profile);
      if (gap) {
        gaps.push(gap);
      }
    });

    return gaps;
  }

  private identifyGap(
    response: AssessmentResponse,
    framework: string,
    profile: OrganizationProfile
  ): ComplianceGap | null {
    // Gap identification logic based on response analysis
    const question = this.getQuestion(response.questionId);
    if (!question) return null;

    // Check if response indicates non-compliance
    const isNonCompliant = this.isNonCompliantResponse(response, question);
    
    if (!isNonCompliant) return null;

    return {
      id: `gap-${framework}-${Date.now()}`,
      framework,
      requirement: question.text,
      currentState: this.describeCurrentState(response),
      requiredState: this.describeRequiredState(question),
      severity: this.calculateGapSeverity(response, question, profile),
      riskLevel: this.calculateGapRisk(response, question),
      effort: this.estimateEffort(response, question, profile),
      timeline: this.estimateTimeline(response, question, profile),
      dependencies: this.identifyDependencies(response, question),
      recommendations: this.generateGapRecommendations(response, question)
    };
  }

  private isNonCompliantResponse(response: AssessmentResponse, question: AssessmentQuestion): boolean {
    if (question.type === 'yes-no') {
      return response.answer === 'no' || response.answer === false;
    }
    if (question.type === 'scale') {
      return response.answer < 60; // Below 60% considered non-compliant
    }
    if (question.type === 'multiple-choice') {
      const nonCompliantOptions = ['No formal process', 'Not implemented', 'Unknown'];
      return nonCompliantOptions.some(option => 
        response.answer?.toString().toLowerCase().includes(option.toLowerCase())
      );
    }
    return response.confidence < 50; // Low confidence suggests gaps
  }

  private calculateGapSeverity(
    response: AssessmentResponse,
    question: AssessmentQuestion,
    profile: OrganizationProfile
  ): 'low' | 'medium' | 'high' | 'critical' {
    let severity = question.criticality;
    
    // Adjust based on organization profile
    if (profile.riskAppetite === 'low' && severity === 'medium') {
      severity = 'high';
    }
    if (profile.complianceMaturity < 30 && severity === 'low') {
      severity = 'medium';
    }

    return severity as 'low' | 'medium' | 'high' | 'critical';
  }

  private calculateGapRisk(response: AssessmentResponse, question: AssessmentQuestion): number {
    const baseRisk = question.weight * (1 - response.confidence / 100);
    const criticalityMultiplier = {
      'low': 1,
      'medium': 1.5,
      'high': 2,
      'critical': 3
    }[question.criticality];

    return Math.min(100, baseRisk * criticalityMultiplier);
  }

  private estimateEffort(
    response: AssessmentResponse,
    question: AssessmentQuestion,
    profile: OrganizationProfile
  ): 'low' | 'medium' | 'high' {
    // Effort estimation logic
    if (question.criticality === 'critical') return 'high';
    if (profile.complianceMaturity < 30) return 'high';
    if (question.type === 'file-upload') return 'medium';
    return 'low';
  }

  private estimateTimeline(
    response: AssessmentResponse,
    question: AssessmentQuestion,
    profile: OrganizationProfile
  ): string {
    const effort = this.estimateEffort(response, question, profile);
    const timelineMap = {
      'low': '1-2 weeks',
      'medium': '1-3 months',
      'high': '3-6 months'
    };
    return timelineMap[effort];
  }

  private identifyDependencies(response: AssessmentResponse, question: AssessmentQuestion): string[] {
    return question.prerequisites || [];
  }

  private generateGapRecommendations(response: AssessmentResponse, question: AssessmentQuestion): string[] {
    // Generate context-specific recommendations
    const baseRecommendations = [
      `Review and implement requirements for: ${question.text}`,
      'Conduct staff training on compliance requirements',
      'Establish monitoring and review processes'
    ];

    return baseRecommendations;
  }

  private calculateFrameworkRisk(gaps: ComplianceGap[]): number {
    return gaps.reduce((total, gap) => total + gap.riskLevel, 0) / Math.max(gaps.length, 1);
  }

  private getQuestionFramework(questionId: string): string {
    // Extract framework from question ID (simplified)
    return questionId.split('-')[0].toUpperCase();
  }

  private getQuestion(questionId: string): AssessmentQuestion | null {
    // In production, this would query the question database
    return null;
  }

  private describeCurrentState(response: AssessmentResponse): string {
    return `Current implementation: ${response.answer}`;
  }

  private describeRequiredState(question: AssessmentQuestion): string {
    return `Full compliance with: ${question.text}`;
  }
}

class RecommendationEngine {
  /**
   * Generates actionable recommendations and roadmaps
   */
  generateRecommendations(
    gaps: ComplianceGap[],
    profile: OrganizationProfile
  ): { recommendations: RecommendationAction[]; roadmap: any[] } {
    const recommendations = this.createRecommendations(gaps, profile);
    const roadmap = this.createImplementationRoadmap(recommendations, gaps, profile);

    return { recommendations, roadmap };
  }

  private createRecommendations(gaps: ComplianceGap[], profile: OrganizationProfile): RecommendationAction[] {
    const recommendations: RecommendationAction[] = [];

    // Group gaps by framework for comprehensive recommendations
    const gapsByFramework = this.groupGapsByFramework(gaps);

    for (const [framework, frameworkGaps] of gapsByFramework) {
      const frameworkRecommendations = this.createFrameworkRecommendations(
        framework, 
        frameworkGaps, 
        profile
      );
      recommendations.push(...frameworkRecommendations);
    }

    // Add cross-cutting recommendations
    const crossCuttingRecommendations = this.createCrossCuttingRecommendations(gaps, profile);
    recommendations.push(...crossCuttingRecommendations);

    return this.prioritizeRecommendations(recommendations, profile);
  }

  private createFrameworkRecommendations(
    framework: string,
    gaps: ComplianceGap[],
    profile: OrganizationProfile
  ): RecommendationAction[] {
    const recommendations: RecommendationAction[] = [];

    // Critical gaps first
    const criticalGaps = gaps.filter(g => g.severity === 'critical');
    if (criticalGaps.length > 0) {
      recommendations.push({
        id: `rec-${framework}-critical`,
        title: `Address Critical ${framework} Compliance Gaps`,
        description: `Immediate action required for ${criticalGaps.length} critical compliance gaps`,
        priority: 'critical',
        effort: 'high',
        timeline: '30-60 days',
        cost: 'high',
        impact: 'Prevents regulatory violations and potential fines',
        steps: this.generateCriticalSteps(criticalGaps),
        resources: ['Compliance team', 'Legal counsel', 'IT security'],
        dependencies: [],
        frameworks: [framework]
      });
    }

    // Process improvement recommendations
    if (gaps.length > 3) {
      recommendations.push({
        id: `rec-${framework}-process`,
        title: `Implement ${framework} Compliance Management Process`,
        description: 'Establish systematic approach to ongoing compliance management',
        priority: 'high',
        effort: 'medium',
        timeline: '2-3 months',
        cost: 'medium',
        impact: 'Reduces future compliance gaps and improves efficiency',
        steps: [
          'Designate compliance owner',
          'Create compliance checklist',
          'Establish regular review process',
          'Implement monitoring tools'
        ],
        resources: ['Compliance officer', 'Process documentation', 'Monitoring tools'],
        dependencies: [],
        frameworks: [framework]
      });
    }

    return recommendations;
  }

  private createCrossCuttingRecommendations(gaps: ComplianceGap[], profile: OrganizationProfile): RecommendationAction[] {
    const recommendations: RecommendationAction[] = [];

    // If multiple frameworks affected, suggest unified approach
    const affectedFrameworks = [...new Set(gaps.map(g => g.framework))];
    if (affectedFrameworks.length > 2) {
      recommendations.push({
        id: 'rec-unified-compliance',
        title: 'Implement Unified Compliance Framework',
        description: 'Create integrated approach to manage multiple regulatory requirements',
        priority: 'high',
        effort: 'high',
        timeline: '3-6 months',
        cost: 'medium',
        impact: 'Reduces compliance overhead and improves coverage across frameworks',
        steps: [
          'Map common requirements across frameworks',
          'Design unified control library',
          'Implement compliance management platform',
          'Train staff on integrated approach'
        ],
        resources: ['Compliance team', 'IT infrastructure', 'Training budget'],
        dependencies: [],
        frameworks: affectedFrameworks
      });
    }

    // Training recommendation if many gaps
    if (gaps.length > 5) {
      recommendations.push({
        id: 'rec-compliance-training',
        title: 'Comprehensive Compliance Training Program',
        description: 'Organization-wide training to address compliance knowledge gaps',
        priority: 'medium',
        effort: 'medium',
        timeline: '1-2 months',
        cost: 'low',
        impact: 'Improves overall compliance awareness and reduces future gaps',
        steps: [
          'Assess training needs by role',
          'Develop role-specific training materials',
          'Deliver training sessions',
          'Implement ongoing awareness program'
        ],
        resources: ['Training budget', 'Internal trainers', 'Learning management system'],
        dependencies: [],
        frameworks: affectedFrameworks
      });
    }

    return recommendations;
  }

  private createImplementationRoadmap(
    recommendations: RecommendationAction[],
    gaps: ComplianceGap[],
    profile: OrganizationProfile
  ): any[] {
    const roadmap = [];

    // Phase 1: Critical and immediate items (0-30 days)
    const phase1Actions = recommendations.filter(r => 
      r.priority === 'critical' || r.timeline.includes('30')
    );
    
    if (phase1Actions.length > 0) {
      roadmap.push({
        phase: 'Immediate Action (0-30 days)',
        timeline: '30 days',
        actions: phase1Actions.map(a => a.title),
        milestones: [
          'Critical compliance gaps addressed',
          'Legal risk significantly reduced',
          'Immediate regulatory requirements met'
        ]
      });
    }

    // Phase 2: High priority items (1-3 months)
    const phase2Actions = recommendations.filter(r => 
      r.priority === 'high' && !phase1Actions.includes(r)
    );
    
    if (phase2Actions.length > 0) {
      roadmap.push({
        phase: 'Foundation Building (1-3 months)',
        timeline: '3 months',
        actions: phase2Actions.map(a => a.title),
        milestones: [
          'Core compliance processes established',
          'Framework coverage significantly improved',
          'Regular monitoring in place'
        ]
      });
    }

    // Phase 3: Medium priority and optimization (3-6 months)
    const phase3Actions = recommendations.filter(r => 
      r.priority === 'medium' && !phase1Actions.includes(r) && !phase2Actions.includes(r)
    );
    
    if (phase3Actions.length > 0) {
      roadmap.push({
        phase: 'Optimization & Enhancement (3-6 months)',
        timeline: '6 months',
        actions: phase3Actions.map(a => a.title),
        milestones: [
          'Comprehensive compliance coverage achieved',
          'Process automation implemented',
          'Continuous improvement established'
        ]
      });
    }

    return roadmap;
  }

  private groupGapsByFramework(gaps: ComplianceGap[]): Map<string, ComplianceGap[]> {
    const grouped = new Map<string, ComplianceGap[]>();
    
    gaps.forEach(gap => {
      if (!grouped.has(gap.framework)) {
        grouped.set(gap.framework, []);
      }
      grouped.get(gap.framework)!.push(gap);
    });

    return grouped;
  }

  private generateCriticalSteps(gaps: ComplianceGap[]): string[] {
    return [
      `Review ${gaps.length} critical compliance requirements`,
      'Assign immediate ownership and accountability',
      'Implement temporary controls if needed',
      'Develop permanent solution plans',
      'Execute remediation actions',
      'Validate compliance achievement'
    ];
  }

  private prioritizeRecommendations(
    recommendations: RecommendationAction[],
    profile: OrganizationProfile
  ): RecommendationAction[] {
    return recommendations.sort((a, b) => {
      // Priority ordering
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Impact vs effort consideration
      const impactOrder = { high: 3, medium: 2, low: 1 };
      const effortOrder = { low: 3, medium: 2, high: 1 }; // Lower effort = higher score
      
      const aScore = impactOrder[a.impact?.includes('high') ? 'high' : 'medium'] + effortOrder[a.effort];
      const bScore = impactOrder[b.impact?.includes('high') ? 'high' : 'medium'] + effortOrder[b.effort];
      
      return bScore - aScore;
    });
  }
}

// Main Assessment Engine
export class IntelligentAssessmentEngine {
  private contextAnalyzer = new ContextAnalyzer();
  private questionSelector = new QuestionSelector();
  private responseAnalyzer = new ResponseAnalyzer();
  private recommendationEngine = new RecommendationEngine();

  /**
   * Starts a new assessment session
   */
  startAssessment(organizationData: Partial<OrganizationProfile>): {
    sessionId: string;
    profile: OrganizationProfile;
    firstQuestion: AssessmentQuestion | null;
  } {
    const sessionId = `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const profile = this.contextAnalyzer.analyzeOrganization(organizationData);
    const firstQuestion = this.questionSelector.selectNextQuestion(profile, []);

    return { sessionId, profile, firstQuestion };
  }

  /**
   * Processes a response and gets next question
   */
  processResponse(
    sessionId: string,
    profile: OrganizationProfile,
    responses: AssessmentResponse[],
    newResponse: AssessmentResponse
  ): {
    nextQuestion: AssessmentQuestion | null;
    progress: number;
    intermediateResults?: Partial<AssessmentResult>;
  } {
    const allResponses = [...responses, newResponse];
    const nextQuestion = this.questionSelector.selectNextQuestion(profile, allResponses);
    
    // Calculate progress
    const applicableFrameworks = this.contextAnalyzer.getApplicableFrameworks(profile);
    const totalQuestions = applicableFrameworks.reduce((sum, framework) => 
      sum + this.questionSelector.getFrameworkQuestions(framework).length, 0
    );
    const progress = (allResponses.length / totalQuestions) * 100;

    // Provide intermediate results if significant progress
    let intermediateResults: Partial<AssessmentResult> | undefined;
    if (progress > 25) {
      const { gaps, riskScore } = this.responseAnalyzer.analyzeResponses(allResponses, profile);
      intermediateResults = {
        completionRate: progress,
        overallScore: 100 - riskScore,
        gaps: gaps.slice(0, 5), // Top 5 gaps
        riskProfile: {
          overall: riskScore,
          categories: {},
          trends: []
        }
      };
    }

    return { nextQuestion, progress, intermediateResults };
  }

  /**
   * Completes assessment and generates final results
   */
  completeAssessment(
    sessionId: string,
    profile: OrganizationProfile,
    responses: AssessmentResponse[]
  ): AssessmentResult {
    const { gaps, riskScore } = this.responseAnalyzer.analyzeResponses(responses, profile);
    const { recommendations, roadmap } = this.recommendationEngine.generateRecommendations(gaps, profile);

    // Calculate framework-specific scores
    const frameworkScores: Record<string, number> = {};
    const applicableFrameworks = this.contextAnalyzer.getApplicableFrameworks(profile);
    
    for (const framework of applicableFrameworks) {
      const frameworkGaps = gaps.filter(g => g.framework === framework);
      const frameworkRisk = frameworkGaps.reduce((sum, gap) => sum + gap.riskLevel, 0) / 
                           Math.max(frameworkGaps.length, 1);
      frameworkScores[framework] = Math.max(0, 100 - frameworkRisk);
    }

    return {
      sessionId,
      organizationProfile: profile,
      completionRate: 100,
      overallScore: Math.max(0, 100 - riskScore),
      frameworkScores,
      gaps,
      recommendations,
      roadmap,
      riskProfile: {
        overall: riskScore,
        categories: this.calculateCategoryRisks(gaps),
        trends: [] // Would be populated with historical data
      },
      timestamp: new Date()
    };
  }

  private calculateCategoryRisks(gaps: ComplianceGap[]): Record<string, number> {
    const categories: Record<string, number[]> = {};
    
    gaps.forEach(gap => {
      // Categorize gaps (simplified)
      const category = gap.framework.includes('GDPR') ? 'Data Protection' :
                      gap.framework.includes('SOX') ? 'Financial' :
                      gap.framework.includes('ISO') ? 'Security' :
                      'Operational';
      
      if (!categories[category]) categories[category] = [];
      categories[category].push(gap.riskLevel);
    });

    const categoryRisks: Record<string, number> = {};
    for (const [category, risks] of Object.entries(categories)) {
      categoryRisks[category] = risks.reduce((sum, risk) => sum + risk, 0) / risks.length;
    }

    return categoryRisks;
  }
}

export type {
  OrganizationProfile,
  AssessmentQuestion,
  AssessmentResponse,
  ComplianceGap,
  RecommendationAction,
  AssessmentResult
};