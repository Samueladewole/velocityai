/**
 * ENISA Compliance Service for ATLAS
 * Implements ENISA vulnerability disclosure guidelines and threat landscape alignment
 */

import { CVEData, EUThreatData, VulnerabilityCorrelation } from './vulnerabilityScanner'

export interface ENISAGuideline {
  id: string
  title: string
  category: 'disclosure' | 'coordination' | 'timeline' | 'communication'
  requirement: string
  implementationLevel: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL'
  sector: string[]
  lastUpdated: Date
}

export interface VulnerabilityDisclosure {
  id: string
  vulnerabilityId: string
  disclosureStatus: 'PRIVATE' | 'COORDINATED' | 'PUBLIC' | 'FULL_DISCLOSURE'
  timeline: {
    discovered: Date
    vendorNotified: Date
    publicDisclosure?: Date
    advisoryPublished?: Date
    fixAvailable?: Date
    endOfLife?: Date
  }
  stakeholders: {
    discoverer: string
    vendor: string
    coordinators: string[]
    affectedParties: string[]
  }
  enisaGuidelines: string[]
  communicationPlan: {
    initialNotification: string
    statusUpdates: string[]
    publicAdvisory: string
    technicalDetails: string
  }
}

export interface ENISAThreatLandscape {
  year: number
  topThreats: {
    rank: number
    threat: string
    description: string
    trendDirection: 'INCREASING' | 'STABLE' | 'DECREASING'
    affectedSectors: string[]
    mitigationStrategies: string[]
  }[]
  emergingThreats: string[]
  sectorialAnalysis: {
    sector: string
    keyRisks: string[]
    specificMeasures: string[]
  }[]
  recommendations: {
    strategic: string[]
    operational: string[]
    technical: string[]
  }
}

export interface ENISASectorGuidance {
  sector: 'energy' | 'transport' | 'banking' | 'health' | 'water' | 'digital' | 'space'
  framework: 'NIS2' | 'DORA' | 'GDPR' | 'CRA' | 'CER'
  requirements: {
    id: string
    title: string
    description: string
    mandatory: boolean
    deadline?: Date
    penalties: string
  }[]
  securityMeasures: {
    technical: string[]
    organizational: string[]
    physical: string[]
  }
  incidentReporting: {
    timeline: string
    thresholds: string[]
    recipients: string[]
    format: string
  }
}

export class ENISAComplianceService {
  private guidelines: ENISAGuideline[]
  private threatLandscape: ENISAThreatLandscape
  private sectorGuidance: Map<string, ENISASectorGuidance>

  constructor() {
    this.guidelines = this.initializeGuidelines()
    this.threatLandscape = this.loadThreatLandscape()
    this.sectorGuidance = this.loadSectorGuidance()
  }

  /**
   * Assess ENISA compliance for vulnerability disclosure
   */
  assessDisclosureCompliance(disclosure: VulnerabilityDisclosure): {
    compliant: boolean
    violations: string[]
    recommendations: string[]
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  } {
    const violations: string[] = []
    const recommendations: string[] = []

    // Check disclosure timeline compliance
    const timelineViolations = this.validateDisclosureTimeline(disclosure.timeline)
    violations.push(...timelineViolations)

    // Validate stakeholder coordination
    if (disclosure.stakeholders.coordinators.length === 0) {
      violations.push('Missing coordinated disclosure with security coordinators')
      recommendations.push('Engage with CERT-EU or national CERTs for coordinated disclosure')
    }

    // Check communication plan completeness
    if (!disclosure.communicationPlan.publicAdvisory) {
      violations.push('Missing public advisory in communication plan')
      recommendations.push('Prepare public advisory following ENISA communication guidelines')
    }

    // Assess sector-specific requirements
    const sectorRequirements = this.assessSectorRequirements(disclosure)
    violations.push(...sectorRequirements.violations)
    recommendations.push(...sectorRequirements.recommendations)

    const riskLevel = this.calculateComplianceRisk(violations.length)
    
    return {
      compliant: violations.length === 0,
      violations,
      recommendations,
      riskLevel
    }
  }

  /**
   * Generate ENISA-compliant vulnerability advisory
   */
  generateENISAAdvisory(vulnerability: CVEData, correlation: VulnerabilityCorrelation): {
    advisory: string
    translations: Map<string, string>
    distributionList: string[]
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  } {
    const urgency = this.calculateAdvisoryUrgency(vulnerability, correlation)
    
    const advisory = this.buildAdvisoryContent(vulnerability, correlation, urgency)
    
    // Generate translations for key EU languages
    const translations = new Map<string, string>()
    const languages = ['de', 'fr', 'es', 'it', 'nl', 'pl']
    
    languages.forEach(lang => {
      translations.set(lang, this.translateAdvisory(advisory, lang))
    })

    const distributionList = this.buildDistributionList(vulnerability, correlation)

    return {
      advisory,
      translations,
      distributionList,
      urgency
    }
  }

  /**
   * Map vulnerability to ENISA threat landscape
   */
  mapToThreatLandscape(vulnerability: CVEData): {
    threatCategory: string
    landscapePosition: number
    trendAlignment: boolean
    sectorImpact: string[]
    mitigationAlignment: string[]
  } {
    // Map to ENISA threat categories
    const threatCategory = this.categorizeThreat(vulnerability)
    
    // Find position in current threat landscape
    const landscapePosition = this.findLandscapePosition(threatCategory)
    
    // Check trend alignment
    const trendAlignment = this.assessTrendAlignment(vulnerability, threatCategory)
    
    // Identify impacted sectors
    const sectorImpact = this.identifyAffectedSectors(vulnerability)
    
    // Map to mitigation strategies
    const mitigationAlignment = this.mapMitigationStrategies(threatCategory)

    return {
      threatCategory,
      landscapePosition,
      trendAlignment,
      sectorImpact,
      mitigationAlignment
    }
  }

  /**
   * Generate sector-specific guidance
   */
  generateSectorGuidance(
    sector: string, 
    vulnerabilities: CVEData[]
  ): {
    guidance: ENISASectorGuidance
    priorityActions: string[]
    complianceGaps: string[]
    timeline: Map<string, Date>
  } {
    const guidance = this.sectorGuidance.get(sector)
    if (!guidance) {
      throw new Error(`Sector guidance not available for: €{sector}`)
    }

    const priorityActions = this.generatePriorityActions(vulnerabilities, guidance)
    const complianceGaps = this.identifyComplianceGaps(vulnerabilities, guidance)
    const timeline = this.buildImplementationTimeline(priorityActions, guidance)

    return {
      guidance,
      priorityActions,
      complianceGaps,
      timeline
    }
  }

  private initializeGuidelines(): ENISAGuideline[] {
    return [
      {
        id: 'ENISA-VD-001',
        title: 'Coordinated Vulnerability Disclosure',
        category: 'disclosure',
        requirement: 'Coordinate with vendors and security researchers before public disclosure',
        implementationLevel: 'MANDATORY',
        sector: ['all'],
        lastUpdated: new Date('2025-01-15')
      },
      {
        id: 'ENISA-VD-002',
        title: 'Disclosure Timeline',
        category: 'timeline',
        requirement: '90-day disclosure timeline with possible extension for complex vulnerabilities',
        implementationLevel: 'RECOMMENDED',
        sector: ['all'],
        lastUpdated: new Date('2025-01-15')
      },
      {
        id: 'ENISA-VD-003',
        title: 'Critical Infrastructure Notification',
        category: 'communication',
        requirement: 'Immediate notification to CERT-EU for critical infrastructure vulnerabilities',
        implementationLevel: 'MANDATORY',
        sector: ['energy', 'transport', 'banking', 'health'],
        lastUpdated: new Date('2025-01-15')
      },
      {
        id: 'ENISA-VD-004',
        title: 'Multi-language Communication',
        category: 'communication',
        requirement: 'Provide vulnerability information in multiple EU languages for widespread impact',
        implementationLevel: 'RECOMMENDED',
        sector: ['all'],
        lastUpdated: new Date('2025-01-15')
      }
    ]
  }

  private loadThreatLandscape(): ENISAThreatLandscape {
    return {
      year: 2025,
      topThreats: [
        {
          rank: 1,
          threat: 'Ransomware',
          description: 'Ransomware attacks targeting critical infrastructure and essential services',
          trendDirection: 'INCREASING',
          affectedSectors: ['health', 'energy', 'transport', 'banking'],
          mitigationStrategies: ['Backup strategies', 'Network segmentation', 'Employee training']
        },
        {
          rank: 2,
          threat: 'Supply Chain Compromise',
          description: 'Attacks targeting software supply chains and third-party dependencies',
          trendDirection: 'INCREASING',
          affectedSectors: ['digital', 'energy', 'transport'],
          mitigationStrategies: ['Vendor assessment', 'Software composition analysis', 'Zero-trust architecture']
        },
        {
          rank: 3,
          threat: 'Data Breaches',
          description: 'Unauthorized access to personal and sensitive data',
          trendDirection: 'STABLE',
          affectedSectors: ['health', 'banking', 'digital'],
          mitigationStrategies: ['Data encryption', 'Access controls', 'Data minimization']
        }
      ],
      emergingThreats: [
        'AI-powered attacks',
        'Quantum computing threats',
        'IoT botnet proliferation',
        'Cloud infrastructure targeting'
      ],
      sectorialAnalysis: [
        {
          sector: 'health',
          keyRisks: ['Patient data breaches', 'Medical device vulnerabilities', 'Ransomware'],
          specificMeasures: ['GDPR compliance', 'Medical device security', 'Business continuity']
        },
        {
          sector: 'energy',
          keyRisks: ['Industrial control system attacks', 'Supply chain vulnerabilities', 'Physical security'],
          specificMeasures: ['OT security', 'Network segmentation', 'Incident response']
        }
      ],
      recommendations: {
        strategic: [
          'Develop comprehensive cybersecurity governance',
          'Implement risk-based security investments',
          'Establish public-private partnerships'
        ],
        operational: [
          'Regular security awareness training',
          'Incident response testing',
          'Supply chain security assessment'
        ],
        technical: [
          'Zero-trust network architecture',
          'Multi-factor authentication',
          'Continuous monitoring and detection'
        ]
      }
    }
  }

  private loadSectorGuidance(): Map<string, ENISASectorGuidance> {
    const guidance = new Map<string, ENISASectorGuidance>()
    
    // Health sector guidance
    guidance.set('health', {
      sector: 'health',
      framework: 'NIS2',
      requirements: [
        {
          id: 'NIS2-HEALTH-001',
          title: 'Cybersecurity Risk Management',
          description: 'Implement comprehensive cybersecurity risk management measures',
          mandatory: true,
          deadline: new Date('2025-10-18'),
          penalties: 'Up to €10 million or 2% of annual turnover'
        },
        {
          id: 'NIS2-HEALTH-002',
          title: 'Incident Reporting',
          description: 'Report significant cyber incidents within 24 hours',
          mandatory: true,
          penalties: 'Up to €7 million or 1.4% of annual turnover'
        }
      ],
      securityMeasures: {
        technical: [
          'Network security monitoring',
          'Encryption of data in transit and at rest',
          'Access control and authentication',
          'Business continuity measures'
        ],
        organizational: [
          'Cybersecurity policies and procedures',
          'Regular security training',
          'Supplier relationship security',
          'Incident response procedures'
        ],
        physical: [
          'Physical security of premises',
          'Environmental controls',
          'Secure disposal of equipment'
        ]
      },
      incidentReporting: {
        timeline: '24 hours for early warning, 72 hours for detailed report',
        thresholds: ['Service disruption', 'Data breach', 'Financial impact'],
        recipients: ['National CSIRT', 'Competent authority', 'ENISA'],
        format: 'Structured incident report as per NIS2 implementing acts'
      }
    })

    // Energy sector guidance
    guidance.set('energy', {
      sector: 'energy',
      framework: 'NIS2',
      requirements: [
        {
          id: 'NIS2-ENERGY-001',
          title: 'OT Security Measures',
          description: 'Implement operational technology security measures',
          mandatory: true,
          deadline: new Date('2025-10-18'),
          penalties: 'Up to €10 million or 2% of annual turnover'
        }
      ],
      securityMeasures: {
        technical: [
          'Industrial control system security',
          'Network segmentation between IT and OT',
          'Real-time monitoring of critical systems',
          'Backup and recovery procedures'
        ],
        organizational: [
          'Security governance framework',
          'Regular vulnerability assessments',
          'Third-party risk management',
          'Crisis management procedures'
        ],
        physical: [
          'Perimeter security of critical facilities',
          'Access control to operational areas',
          'Environmental monitoring'
        ]
      },
      incidentReporting: {
        timeline: 'Immediate notification for critical incidents, 24 hours for others',
        thresholds: ['Service interruption', 'Safety risk', 'Environmental impact'],
        recipients: ['National energy regulator', 'CSIRT', 'ENISA'],
        format: 'Energy-specific incident classification system'
      }
    })

    return guidance
  }

  private validateDisclosureTimeline(timeline: VulnerabilityDisclosure['timeline']): string[] {
    const violations: string[] = []
    const now = new Date()
    
    // Check if vendor was notified within reasonable time
    if (timeline.vendorNotified && timeline.discovered) {
      const notificationDelay = timeline.vendorNotified.getTime() - timeline.discovered.getTime()
      const maxDelay = 7 * 24 * 60 * 60 * 1000 // 7 days
      
      if (notificationDelay > maxDelay) {
        violations.push('Vendor notification exceeded 7-day recommended timeline')
      }
    }

    // Check 90-day disclosure rule
    if (timeline.publicDisclosure && timeline.vendorNotified) {
      const disclosureDelay = timeline.publicDisclosure.getTime() - timeline.vendorNotified.getTime()
      const maxDisclosureDelay = 90 * 24 * 60 * 60 * 1000 // 90 days
      
      if (disclosureDelay > maxDisclosureDelay && !timeline.fixAvailable) {
        violations.push('Public disclosure exceeded 90-day coordinated disclosure timeline')
      }
    }

    return violations
  }

  private assessSectorRequirements(disclosure: VulnerabilityDisclosure): {
    violations: string[]
    recommendations: string[]
  } {
    // Implementation would assess sector-specific requirements
    // This is a simplified version
    return {
      violations: [],
      recommendations: [
        'Consider sector-specific notification requirements',
        'Coordinate with relevant sectoral authorities'
      ]
    }
  }

  private calculateComplianceRisk(violationCount: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (violationCount === 0) return 'LOW'
    if (violationCount <= 2) return 'MEDIUM'
    if (violationCount <= 4) return 'HIGH'
    return 'CRITICAL'
  }

  private buildAdvisoryContent(
    vulnerability: CVEData, 
    correlation: VulnerabilityCorrelation, 
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ): string {
    return `
ENISA VULNERABILITY ADVISORY - €{urgency} PRIORITY

Vulnerability ID: €{vulnerability.id}
CVSS Score: €{vulnerability.cvssScore}
Severity: €{vulnerability.severity}

DESCRIPTION:
€{vulnerability.description}

AFFECTED SYSTEMS:
€{correlation.threatIntelligence.geographicTargeting.join(', ')}

MITRE ATT&CK MAPPING:
€{correlation.mitreAttackTechniques.map(t => `€{t.techniqueId}: €{t.techniqueName}`).join('\n')}

RECOMMENDATIONS:
- Immediately apply available patches
- Implement recommended security controls
- Monitor for exploitation indicators
- Report incidents to national CSIRT

REFERENCES:
€{vulnerability.references.join('\n')}

Published: €{vulnerability.publishedDate.toISOString()}
Last Modified: €{vulnerability.lastModified.toISOString()}
    `.trim()
  }

  private translateAdvisory(advisory: string, language: string): string {
    // In a real implementation, this would use a translation service
    // For now, return a placeholder
    return `[€{language.toUpperCase()}] €{advisory}`
  }

  private buildDistributionList(vulnerability: CVEData, correlation: VulnerabilityCorrelation): string[] {
    const distributionList: string[] = [
      'cert-eu@ec.europa.eu',
      'enisa-cert@enisa.europa.eu'
    ]

    // Add sector-specific contacts based on vulnerability impact
    if (correlation.threatIntelligence.geographicTargeting.includes('EU')) {
      distributionList.push('eu-cert-network@enisa.europa.eu')
    }

    return distributionList
  }

  private calculateAdvisoryUrgency(
    vulnerability: CVEData, 
    correlation: VulnerabilityCorrelation
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (vulnerability.cvssScore >= 9.0 && correlation.threatIntelligence.activeExploitation) {
      return 'CRITICAL'
    }
    if (vulnerability.cvssScore >= 7.0 && correlation.cisaKevListed) {
      return 'HIGH'
    }
    if (vulnerability.cvssScore >= 4.0) {
      return 'MEDIUM'
    }
    return 'LOW'
  }

  private categorizeThreat(vulnerability: CVEData): string {
    // Simple categorization based on CWE and description
    const description = vulnerability.description.toLowerCase()
    
    if (description.includes('injection') || description.includes('xss')) {
      return 'Web Application Attacks'
    }
    if (description.includes('authentication') || description.includes('authorization')) {
      return 'Identity and Access Management'
    }
    if (description.includes('buffer') || description.includes('memory')) {
      return 'Memory Corruption'
    }
    if (description.includes('crypto') || description.includes('encryption')) {
      return 'Cryptographic Failures'
    }
    
    return 'General Software Vulnerabilities'
  }

  private findLandscapePosition(threatCategory: string): number {
    // Map threat category to ENISA threat landscape position
    const threatMap = new Map([
      ['Ransomware', 1],
      ['Supply Chain Compromise', 2],
      ['Data Breaches', 3],
      ['Web Application Attacks', 4],
      ['Identity and Access Management', 5]
    ])
    
    return threatMap.get(threatCategory) || 10
  }

  private assessTrendAlignment(vulnerability: CVEData, threatCategory: string): boolean {
    // Check if vulnerability aligns with current threat trends
    const increasingThreats = ['Ransomware', 'Supply Chain Compromise']
    return increasingThreats.includes(threatCategory)
  }

  private identifyAffectedSectors(vulnerability: CVEData): string[] {
    // Identify sectors based on vulnerability characteristics
    const sectors: string[] = []
    const description = vulnerability.description.toLowerCase()
    
    if (description.includes('scada') || description.includes('industrial')) {
      sectors.push('energy', 'water', 'transport')
    }
    if (description.includes('medical') || description.includes('health')) {
      sectors.push('health')
    }
    if (description.includes('financial') || description.includes('banking')) {
      sectors.push('banking')
    }
    if (description.includes('cloud') || description.includes('saas')) {
      sectors.push('digital')
    }
    
    return sectors.length > 0 ? sectors : ['all']
  }

  private mapMitigationStrategies(threatCategory: string): string[] {
    const mitigationMap = new Map([
      ['Ransomware', ['Backup strategies', 'Network segmentation', 'Employee training']],
      ['Supply Chain Compromise', ['Vendor assessment', 'Software composition analysis', 'Zero-trust architecture']],
      ['Data Breaches', ['Data encryption', 'Access controls', 'Data minimization']],
      ['Web Application Attacks', ['Input validation', 'Web application firewalls', 'Security testing']],
      ['Identity and Access Management', ['Multi-factor authentication', 'Privileged access management', 'Identity governance']]
    ])
    
    return mitigationMap.get(threatCategory) || ['General security hardening', 'Regular patching', 'Security monitoring']
  }

  private generatePriorityActions(vulnerabilities: CVEData[], guidance: ENISASectorGuidance): string[] {
    const actions: string[] = []
    
    // Generate actions based on vulnerabilities and sector requirements
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'CRITICAL')
    if (criticalVulns.length > 0) {
      actions.push(`Immediately patch €{criticalVulns.length} critical vulnerabilities`)
    }
    
    // Add sector-specific actions
    guidance.requirements.forEach(req => {
      if (req.mandatory && req.deadline && req.deadline > new Date()) {
        actions.push(`Ensure compliance with €{req.title} by €{req.deadline.toDateString()}`)
      }
    })
    
    return actions
  }

  private identifyComplianceGaps(vulnerabilities: CVEData[], guidance: ENISASectorGuidance): string[] {
    const gaps: string[] = []
    
    // Identify gaps based on vulnerability patterns and sector requirements
    const highSeverityCount = vulnerabilities.filter(v => 
      v.severity === 'HIGH' || v.severity === 'CRITICAL'
    ).length
    
    if (highSeverityCount > 10) {
      gaps.push('High number of critical vulnerabilities indicates insufficient patch management')
    }
    
    // Check mandatory requirements
    guidance.requirements.forEach(req => {
      if (req.mandatory) {
        gaps.push(`Mandatory requirement: €{req.title}`)
      }
    })
    
    return gaps
  }

  private buildImplementationTimeline(actions: string[], guidance: ENISASectorGuidance): Map<string, Date> {
    const timeline = new Map<string, Date>()
    const now = new Date()
    
    // Assign deadlines to actions
    actions.forEach((action, index) => {
      const daysToAdd = (index + 1) * 30 // Stagger actions by 30 days
      const deadline = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
      timeline.set(action, deadline)
    })
    
    return timeline
  }
}