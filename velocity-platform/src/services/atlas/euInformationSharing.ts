/**
 * EU Cross-Border Information Sharing Service
 * Implements EU-wide threat intelligence sharing mechanisms and coordination
 */

export interface EUMemberState {
  countryCode: string
  name: string
  certContact: {
    name: string
    email: string
    phone: string
    website: string
  }
  languages: string[]
  timeZone: string
  regulatoryFramework: {
    nis2: boolean
    dora: boolean
    cra: boolean
    gdpr: boolean
  }
  sectoralCSIRTs: {
    sector: string
    contact: string
  }[]
}

export interface ThreatIntelligenceReport {
  id: string
  type: 'vulnerability' | 'incident' | 'campaign' | 'ioc' | 'advisory'
  classification: 'TLP_WHITE' | 'TLP_GREEN' | 'TLP_AMBER' | 'TLP_RED'
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  
  content: {
    title: string
    description: string
    technicalDetails: string
    indicators: IOCIndicator[]
    mitigations: string[]
    attribution: {
      confidence: 'LOW' | 'MEDIUM' | 'HIGH'
      actor: string
      campaign?: string
      geopoliticalContext?: string
    }
  }
  
  distribution: {
    originatingCountry: string
    targetCountries: string[]
    sectors: string[]
    sharingGroups: string[]
    restrictedDistribution: boolean
  }
  
  timeline: {
    created: Date
    firstObserved?: Date
    lastObserved?: Date
    expires?: Date
  }
  
  sources: {
    origin: string
    reliability: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
    confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  }[]
  
  euContext: {
    nis2Relevance: boolean
    criticalInfrastructure: boolean
    crossBorderImpact: boolean
    coordinatedResponse: boolean
  }
}

export interface IOCIndicator {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'filename' | 'registry'
  value: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  context: string
  firstSeen: Date
  lastSeen: Date
  tags: string[]
}

export interface SharingGroup {
  id: string
  name: string
  type: 'bilateral' | 'multilateral' | 'sectoral' | 'geographic'
  members: string[] // Country codes or organization IDs
  scope: {
    sectors: string[]
    threatTypes: string[]
    geography: string[]
  }
  sharingRules: {
    automaticSharing: boolean
    manualApproval: boolean
    classification: ('TLP_WHITE' | 'TLP_GREEN' | 'TLP_AMBER' | 'TLP_RED')[]
    retentionPeriod: number // days
  }
  governance: {
    coordinator: string
    decisionMaking: 'consensus' | 'majority' | 'coordinator'
    disputeResolution: string
  }
}

export interface CoordinatedResponse {
  id: string
  triggerEvent: string
  type: 'incident_response' | 'vulnerability_coordination' | 'threat_campaign' | 'supply_chain'
  
  coordination: {
    leadCountry: string
    participatingCountries: string[]
    coordinator: string
    startDate: Date
    status: 'INITIATED' | 'ACTIVE' | 'RESOLVED' | 'SUSPENDED'
  }
  
  activities: {
    informationSharing: boolean
    jointInvestigation: boolean
    coordinatedMitigation: boolean
    publicCommunication: boolean
    diplomaticEngagement: boolean
  }
  
  timeline: CoordinationActivity[]
  
  outcomes: {
    threatsNeutralized: number
    vulnerabilitiesPatched: number
    actorsIdentified: string[]
    mitigationsMeasures: string[]
    lessonsLearned: string[]
  }
}

export interface CoordinationActivity {
  id: string
  type: 'meeting' | 'sharing' | 'action' | 'communication'
  date: Date
  participants: string[]
  description: string
  outcomes: string[]
  nextSteps: string[]
}

export interface EUFrameworkCompliance {
  framework: 'NIS2' | 'CER' | 'DORA' | 'CRA' | 'GDPR'
  requirements: {
    informationSharing: boolean
    incidentReporting: boolean
    coordinatedResponse: boolean
    crossBorderCooperation: boolean
  }
  obligations: {
    timeline: string
    recipients: string[]
    content: string[]
    format: string
  }
  penalties: {
    monetary: string
    administrative: string[]
    reputational: string[]
  }
}

export class EUInformationSharingService {
  private memberStates: Map<string, EUMemberState>
  private sharingGroups: Map<string, SharingGroup>
  private threatReports: Map<string, ThreatIntelligenceReport>
  private coordinatedResponses: Map<string, CoordinatedResponse>
  private frameworkCompliance: Map<string, EUFrameworkCompliance>

  constructor() {
    this.memberStates = this.initializeMemberStates()
    this.sharingGroups = this.initializeSharingGroups()
    this.threatReports = new Map()
    this.coordinatedResponses = new Map()
    this.frameworkCompliance = this.initializeFrameworkCompliance()
  }

  /**
   * Share threat intelligence across EU member states
   */
  async shareThreatIntelligence(
    report: ThreatIntelligenceReport,
    sharingGroupIds: string[]
  ): Promise<{
    shared: boolean
    recipients: string[]
    restrictions: string[]
    estimatedReach: number
  }> {
    const recipients: string[] = []
    const restrictions: string[] = []

    // Validate sharing permissions
    const sharingValidation = this.validateSharingPermissions(report)
    if (!sharingValidation.allowed) {
      throw new Error(`Sharing not permitted: €{sharingValidation.reasons.join(', ')}`)
    }

    // Determine recipients based on sharing groups
    for (const groupId of sharingGroupIds) {
      const group = this.sharingGroups.get(groupId)
      if (group) {
        const groupRecipients = this.getGroupRecipients(group, report)
        recipients.push(...groupRecipients)
      }
    }

    // Apply classification restrictions
    const classificationRestrictions = this.applyClassificationRestrictions(report)
    restrictions.push(...classificationRestrictions)

    // Estimate reach based on distribution
    const estimatedReach = this.calculateSharingReach(recipients, report)

    // Store and distribute
    this.threatReports.set(report.id, report)
    await this.distributeThreatIntelligence(report, recipients)

    return {
      shared: true,
      recipients: [...new Set(recipients)],
      restrictions,
      estimatedReach
    }
  }

  /**
   * Initiate coordinated response to major threat
   */
  async initiateCoordinatedResponse(
    triggerEvent: string,
    type: CoordinatedResponse['type'],
    leadCountry: string,
    targetCountries: string[]
  ): Promise<CoordinatedResponse> {
    const response: CoordinatedResponse = {
      id: `COORD_€{Date.now()}`,
      triggerEvent,
      type,
      coordination: {
        leadCountry,
        participatingCountries: targetCountries,
        coordinator: this.getCountryCoordinator(leadCountry),
        startDate: new Date(),
        status: 'INITIATED'
      },
      activities: {
        informationSharing: true,
        jointInvestigation: type === 'incident_response',
        coordinatedMitigation: true,
        publicCommunication: false,
        diplomaticEngagement: type === 'supply_chain'
      },
      timeline: [],
      outcomes: {
        threatsNeutralized: 0,
        vulnerabilitiesPatched: 0,
        actorsIdentified: [],
        mitigationsMeasures: [],
        lessonsLearned: []
      }
    }

    // Notify participating countries
    await this.notifyParticipatingCountries(response)

    // Schedule initial coordination meeting
    const initialMeeting = this.scheduleCoordinationMeeting(response)
    response.timeline.push(initialMeeting)

    this.coordinatedResponses.set(response.id, response)
    return response
  }

  /**
   * Process EU framework compliance requirements
   */
  assessFrameworkCompliance(
    vulnerability: any,
    affectedCountries: string[],
    sectors: string[]
  ): {
    applicableFrameworks: string[]
    obligations: Map<string, any>
    timeline: Map<string, Date>
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  } {
    const applicableFrameworks: string[] = []
    const obligations = new Map()
    const timeline = new Map()

    // Check NIS2 applicability
    if (this.isNIS2Applicable(vulnerability, sectors)) {
      applicableFrameworks.push('NIS2')
      const nis2Compliance = this.frameworkCompliance.get('NIS2')!
      obligations.set('NIS2', nis2Compliance.obligations)
      timeline.set('NIS2', new Date(Date.now() + 24 * 60 * 60 * 1000)) // 24 hours
    }

    // Check DORA applicability for financial sector
    if (sectors.includes('banking') || sectors.includes('finance')) {
      applicableFrameworks.push('DORA')
      const doraCompliance = this.frameworkCompliance.get('DORA')!
      obligations.set('DORA', doraCompliance.obligations)
      timeline.set('DORA', new Date(Date.now() + 2 * 60 * 60 * 1000)) // 2 hours for financial
    }

    // Check CRA applicability for digital products
    if (this.isCRAApplicable(vulnerability)) {
      applicableFrameworks.push('CRA')
      const craCompliance = this.frameworkCompliance.get('CRA')!
      obligations.set('CRA', craCompliance.obligations)
      timeline.set('CRA', new Date(Date.now() + 72 * 60 * 60 * 1000)) // 72 hours
    }

    const riskLevel = this.assessComplianceRisk(vulnerability, applicableFrameworks)

    return {
      applicableFrameworks,
      obligations,
      timeline,
      riskLevel
    }
  }

  /**
   * Generate EU-wide threat landscape report
   */
  generateEUThreatLandscape(timeframe: string): {
    period: string
    topThreats: {
      threat: string
      affectedCountries: string[]
      incidents: number
      trend: 'INCREASING' | 'STABLE' | 'DECREASING'
    }[]
    sectorAnalysis: Map<string, any>
    geographicDistribution: Map<string, number>
    coordinatedResponses: number
    recommendations: string[]
  } {
    const reports = Array.from(this.threatReports.values())
    const responses = Array.from(this.coordinatedResponses.values())

    // Analyze top threats
    const threatFrequency = new Map<string, { count: number; countries: Set<string> }>()
    reports.forEach(report => {
      const threat = report.content.title
      if (!threatFrequency.has(threat)) {
        threatFrequency.set(threat, { count: 0, countries: new Set() })
      }
      const entry = threatFrequency.get(threat)!
      entry.count++
      report.distribution.targetCountries.forEach(country => entry.countries.add(country))
    })

    const topThreats = Array.from(threatFrequency.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([threat, data]) => ({
        threat,
        affectedCountries: Array.from(data.countries),
        incidents: data.count,
        trend: 'INCREASING' as const // Would be calculated from historical data
      }))

    // Analyze by sector
    const sectorAnalysis = new Map()
    const sectors = ['energy', 'transport', 'banking', 'health', 'water', 'digital']
    sectors.forEach(sector => {
      const sectorReports = reports.filter(r => r.distribution.sectors.includes(sector))
      sectorAnalysis.set(sector, {
        incidents: sectorReports.length,
        severity: this.calculateAverageSeverity(sectorReports),
        topVulnerabilities: this.getTopVulnerabilities(sectorReports)
      })
    })

    // Geographic distribution
    const geographicDistribution = new Map<string, number>()
    this.memberStates.forEach((_, countryCode) => {
      const countryReports = reports.filter(r => 
        r.distribution.targetCountries.includes(countryCode)
      )
      geographicDistribution.set(countryCode, countryReports.length)
    })

    return {
      period: timeframe,
      topThreats,
      sectorAnalysis,
      geographicDistribution,
      coordinatedResponses: responses.length,
      recommendations: this.generateRecommendations(topThreats, sectorAnalysis)
    }
  }

  private initializeMemberStates(): Map<string, EUMemberState> {
    const states = new Map<string, EUMemberState>()

    // Germany
    states.set('DE', {
      countryCode: 'DE',
      name: 'Germany',
      certContact: {
        name: 'CERT-Bund',
        email: 'certbund@bsi.bund.de',
        phone: '+49 228 99 9582 0',
        website: 'https://www.bsi.bund.de'
      },
      languages: ['de', 'en'],
      timeZone: 'Europe/Berlin',
      regulatoryFramework: {
        nis2: true,
        dora: true,
        cra: true,
        gdpr: true
      },
      sectoralCSIRTs: [
        { sector: 'energy', contact: 'energy-cert@bsi.bund.de' },
        { sector: 'finance', contact: 'finance-cert@bsi.bund.de' }
      ]
    })

    // France
    states.set('FR', {
      countryCode: 'FR',
      name: 'France',
      certContact: {
        name: 'CERT-FR',
        email: 'cert-fr@ssi.gouv.fr',
        phone: '+33 1 71 75 84 68',
        website: 'https://www.cert.ssi.gouv.fr'
      },
      languages: ['fr', 'en'],
      timeZone: 'Europe/Paris',
      regulatoryFramework: {
        nis2: true,
        dora: true,
        cra: true,
        gdpr: true
      },
      sectoralCSIRTs: [
        { sector: 'energy', contact: 'energie@cert.ssi.gouv.fr' },
        { sector: 'finance', contact: 'finance@cert.ssi.gouv.fr' }
      ]
    })

    // Netherlands
    states.set('NL', {
      countryCode: 'NL',
      name: 'Netherlands',
      certContact: {
        name: 'NCSC-NL',
        email: 'info@ncsc.nl',
        phone: '+31 70 888 7500',
        website: 'https://www.ncsc.nl'
      },
      languages: ['nl', 'en'],
      timeZone: 'Europe/Amsterdam',
      regulatoryFramework: {
        nis2: true,
        dora: true,
        cra: true,
        gdpr: true
      },
      sectoralCSIRTs: [
        { sector: 'finance', contact: 'finance@ncsc.nl' },
        { sector: 'energy', contact: 'energy@ncsc.nl' }
      ]
    })

    return states
  }

  private initializeSharingGroups(): Map<string, SharingGroup> {
    const groups = new Map<string, SharingGroup>()

    // EU CSIRT Network
    groups.set('EU_CSIRT_NETWORK', {
      id: 'EU_CSIRT_NETWORK',
      name: 'EU CSIRT Network',
      type: 'multilateral',
      members: Array.from(this.memberStates.keys()),
      scope: {
        sectors: ['all'],
        threatTypes: ['vulnerability', 'incident', 'campaign'],
        geography: ['EU']
      },
      sharingRules: {
        automaticSharing: true,
        manualApproval: false,
        classification: ['TLP_WHITE', 'TLP_GREEN', 'TLP_AMBER'],
        retentionPeriod: 365
      },
      governance: {
        coordinator: 'ENISA',
        decisionMaking: 'consensus',
        disputeResolution: 'ENISA mediation'
      }
    })

    // Critical Infrastructure Protection
    groups.set('CIP_EU', {
      id: 'CIP_EU',
      name: 'Critical Infrastructure Protection EU',
      type: 'sectoral',
      members: ['DE', 'FR', 'NL', 'IT', 'ES', 'PL'],
      scope: {
        sectors: ['energy', 'transport', 'banking', 'health', 'water'],
        threatTypes: ['vulnerability', 'incident'],
        geography: ['EU']
      },
      sharingRules: {
        automaticSharing: false,
        manualApproval: true,
        classification: ['TLP_AMBER', 'TLP_RED'],
        retentionPeriod: 1095 // 3 years
      },
      governance: {
        coordinator: 'Rotating',
        decisionMaking: 'majority',
        disputeResolution: 'Council mediation'
      }
    })

    return groups
  }

  private initializeFrameworkCompliance(): Map<string, EUFrameworkCompliance> {
    const compliance = new Map<string, EUFrameworkCompliance>()

    // NIS2 Directive
    compliance.set('NIS2', {
      framework: 'NIS2',
      requirements: {
        informationSharing: true,
        incidentReporting: true,
        coordinatedResponse: true,
        crossBorderCooperation: true
      },
      obligations: {
        timeline: '24 hours initial, 72 hours detailed',
        recipients: ['National CSIRT', 'ENISA', 'CERT-EU'],
        content: ['Incident details', 'Impact assessment', 'Mitigation measures'],
        format: 'Structured reporting template'
      },
      penalties: {
        monetary: 'Up to €10 million or 2% of annual turnover',
        administrative: ['Compliance orders', 'Regular audits'],
        reputational: ['Public disclosure', 'Certification suspension']
      }
    })

    // DORA
    compliance.set('DORA', {
      framework: 'DORA',
      requirements: {
        informationSharing: true,
        incidentReporting: true,
        coordinatedResponse: true,
        crossBorderCooperation: true
      },
      obligations: {
        timeline: '2 hours for major incidents, 24 hours detailed',
        recipients: ['National competent authority', 'EBA/ESMA/EIOPA', 'ECB'],
        content: ['ICT incident classification', 'Third-party impact', 'Recovery measures'],
        format: 'DORA incident reporting template'
      },
      penalties: {
        monetary: 'Up to €20 million or 4% of annual turnover',
        administrative: ['Operational restrictions', 'Enhanced supervision'],
        reputational: ['Public warnings', 'License restrictions']
      }
    })

    return compliance
  }

  private validateSharingPermissions(report: ThreatIntelligenceReport): {
    allowed: boolean
    reasons: string[]
  } {
    const reasons: string[] = []

    // Check classification restrictions
    if (report.classification === 'TLP_RED') {
      if (report.distribution.restrictedDistribution) {
        reasons.push('TLP:RED classification requires explicit approval')
      }
    }

    // Check originating country policies
    const originState = this.memberStates.get(report.distribution.originatingCountry)
    if (!originState) {
      reasons.push('Unknown originating country')
    }

    // Check sector restrictions
    if (report.distribution.sectors.includes('classified')) {
      reasons.push('Classified sector information requires special clearance')
    }

    return {
      allowed: reasons.length === 0,
      reasons
    }
  }

  private getGroupRecipients(group: SharingGroup, report: ThreatIntelligenceReport): string[] {
    const recipients: string[] = []

    // Check if report matches group scope
    const scopeMatch = this.checkScopeMatch(group, report)
    if (!scopeMatch) return []

    // Add group members as recipients
    group.members.forEach(member => {
      if (this.memberStates.has(member)) {
        recipients.push(this.memberStates.get(member)!.certContact.email)
      }
    })

    return recipients
  }

  private applyClassificationRestrictions(report: ThreatIntelligenceReport): string[] {
    const restrictions: string[] = []

    switch (report.classification) {
      case 'TLP_RED':
        restrictions.push('Limited to named recipients only')
        restrictions.push('No automated sharing permitted')
        break
      case 'TLP_AMBER':
        restrictions.push('Sharing within organization and trusted partners only')
        break
      case 'TLP_GREEN':
        restrictions.push('Community sharing permitted')
        break
      case 'TLP_WHITE':
        // No restrictions
        break
    }

    if (report.distribution.restrictedDistribution) {
      restrictions.push('Additional distribution restrictions apply')
    }

    return restrictions
  }

  private calculateSharingReach(recipients: string[], report: ThreatIntelligenceReport): number {
    // Estimate number of organizations/entities that will receive the information
    let reach = recipients.length

    // Factor in automatic distribution within recipient organizations
    if (report.classification === 'TLP_WHITE' || report.classification === 'TLP_GREEN') {
      reach *= 3 // Assume 3x multiplier for broader distribution
    }

    // Factor in sector-specific distribution lists
    report.distribution.sectors.forEach(sector => {
      if (sector !== 'all') {
        reach += 10 // Assume 10 additional entities per sector
      }
    })

    return reach
  }

  private async distributeThreatIntelligence(
    report: ThreatIntelligenceReport,
    recipients: string[]
  ): Promise<void> {
    // In a real implementation, this would send the intelligence to recipients
    // via secure channels (MISP, TLP, secure email, etc.)
    console.log(`Distributing threat intelligence €{report.id} to €{recipients.length} recipients`)
  }

  private getCountryCoordinator(countryCode: string): string {
    const state = this.memberStates.get(countryCode)
    return state?.certContact.name || 'Unknown'
  }

  private async notifyParticipatingCountries(response: CoordinatedResponse): Promise<void> {
    // Send notifications to participating countries about coordination effort
    console.log(`Notifying €{response.coordination.participatingCountries.length} countries about coordination €{response.id}`)
  }

  private scheduleCoordinationMeeting(response: CoordinatedResponse): CoordinationActivity {
    return {
      id: `MEETING_€{Date.now()}`,
      type: 'meeting',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      participants: response.coordination.participatingCountries,
      description: 'Initial coordination meeting to align response efforts',
      outcomes: [],
      nextSteps: ['Establish communication channels', 'Define roles and responsibilities']
    }
  }

  private isNIS2Applicable(vulnerability: any, sectors: string[]): boolean {
    const nis2Sectors = ['energy', 'transport', 'banking', 'health', 'water', 'digital', 'space']
    return sectors.some(sector => nis2Sectors.includes(sector)) ||
           vulnerability.cvssScore >= 7.0
  }

  private isCRAApplicable(vulnerability: any): boolean {
    const description = vulnerability.description?.toLowerCase() || ''
    const craKeywords = ['software', 'firmware', 'hardware', 'iot', 'digital product']
    return craKeywords.some(keyword => description.includes(keyword))
  }

  private assessComplianceRisk(vulnerability: any, frameworks: string[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    let riskScore = 0

    // Base risk from vulnerability severity
    if (vulnerability.cvssScore >= 9.0) riskScore += 30
    else if (vulnerability.cvssScore >= 7.0) riskScore += 20
    else if (vulnerability.cvssScore >= 4.0) riskScore += 10

    // Increase risk for each applicable framework
    riskScore += frameworks.length * 10

    // Special consideration for financial sector (DORA)
    if (frameworks.includes('DORA')) riskScore += 15

    if (riskScore >= 50) return 'CRITICAL'
    if (riskScore >= 35) return 'HIGH'
    if (riskScore >= 20) return 'MEDIUM'
    return 'LOW'
  }

  private checkScopeMatch(group: SharingGroup, report: ThreatIntelligenceReport): boolean {
    // Check if report matches group's scope criteria
    const sectorMatch = group.scope.sectors.includes('all') ||
                       group.scope.sectors.some(s => report.distribution.sectors.includes(s))
    
    const threatMatch = group.scope.threatTypes.includes(report.type)
    
    const geoMatch = group.scope.geography.includes('EU') ||
                    group.scope.geography.some(g => report.distribution.targetCountries.includes(g))

    return sectorMatch && threatMatch && geoMatch
  }

  private calculateAverageSeverity(reports: ThreatIntelligenceReport[]): number {
    if (reports.length === 0) return 0
    
    const severityValues = reports.map(r => {
      switch (r.urgency) {
        case 'CRITICAL': return 4
        case 'HIGH': return 3
        case 'MEDIUM': return 2
        case 'LOW': return 1
        default: return 0
      }
    })

    return severityValues.reduce((a, b) => a + b, 0) / severityValues.length
  }

  private getTopVulnerabilities(reports: ThreatIntelligenceReport[]): string[] {
    const vulnerabilities = new Map<string, number>()
    
    reports.forEach(report => {
      const vuln = report.content.title
      vulnerabilities.set(vuln, (vulnerabilities.get(vuln) || 0) + 1)
    })

    return Array.from(vulnerabilities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([vuln]) => vuln)
  }

  private generateRecommendations(topThreats: any[], sectorAnalysis: Map<string, any>): string[] {
    const recommendations = [
      'Enhance cross-border information sharing mechanisms',
      'Strengthen sectoral CSIRT capabilities',
      'Implement coordinated vulnerability disclosure processes',
      'Develop joint threat hunting capabilities',
      'Establish regular coordination exercises'
    ]

    // Add threat-specific recommendations
    topThreats.forEach(threat => {
      if (threat.threat.toLowerCase().includes('ransomware')) {
        recommendations.push('Prioritize ransomware prevention and response coordination')
      }
      if (threat.threat.toLowerCase().includes('supply chain')) {
        recommendations.push('Develop EU-wide supply chain security standards')
      }
    })

    return recommendations
  }
}