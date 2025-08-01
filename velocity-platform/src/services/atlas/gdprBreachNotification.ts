/**
 * GDPR-Aligned Data Breach Notification System
 * Implements Article 33 (notification to supervisory authority) and Article 34 (communication to data subjects)
 */

export interface DataBreachIncident {
  id: string
  detectedAt: Date
  reportedAt?: Date
  nature: 'confidentiality' | 'integrity' | 'availability'
  categories: ('personal_data' | 'sensitive_data' | 'special_categories' | 'criminal_convictions')[]
  
  // Article 33 requirements
  description: string
  dataSubjectsAffected: {
    approximate: boolean
    count: number
    categories: string[]
  }
  likelyConsequences: string[]
  measuresProposed: string[]
  
  // Technical details
  vulnerability: {
    cveId?: string
    exploited: boolean
    attackVector: string
    securityMeasures: {
      encryption: boolean
      pseudonymisation: boolean
      accessControls: boolean
      backups: boolean
    }
  }
  
  // Impact assessment
  riskAssessment: {
    likelihood: 'LOW' | 'MEDIUM' | 'HIGH'
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    overallRisk: 'LOW' | 'MEDIUM' | 'HIGH'
    justification: string
  }
  
  // Notification requirements
  notification: {
    supervisoryAuthority: boolean
    dataSubjects: boolean
    reasons: string[]
    exemptions: string[]
  }
  
  // Cross-border implications
  crossBorder: {
    applicable: boolean
    leadSA?: string
    concernedSAs: string[]
    oneStopShop: boolean
  }
  
  // Response actions
  response: {
    containment: BreachContainmentAction[]
    investigation: BreachInvestigationAction[]
    communication: BreachCommunicationAction[]
    remediation: BreachRemediationAction[]
  }
}

export interface BreachContainmentAction {
  id: string
  action: string
  responsible: string
  deadline: Date
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  evidence: string[]
}

export interface BreachInvestigationAction {
  id: string
  investigationType: 'forensic' | 'technical' | 'legal' | 'compliance'
  scope: string
  findings: string[]
  evidence: string[]
  responsible: string
  completedAt?: Date
}

export interface BreachCommunicationAction {
  id: string
  recipient: 'supervisory_authority' | 'data_subjects' | 'media' | 'partners' | 'internal'
  timeline: Date
  method: 'email' | 'postal' | 'website' | 'phone' | 'formal_notice'
  content: string
  language: string
  status: 'DRAFTED' | 'SENT' | 'ACKNOWLEDGED' | 'FAILED'
}

export interface BreachRemediationAction {
  id: string
  type: 'technical' | 'organizational' | 'legal' | 'contractual'
  description: string
  implementation: {
    responsible: string
    deadline: Date
    budget?: number
    dependencies: string[]
  }
  effectiveness: {
    measurable: boolean
    metrics: string[]
    target: string
  }
}

export interface SupervisoryAuthority {
  country: string
  name: string
  contact: {
    email: string
    phone: string
    address: string
    website: string
  }
  notificationForm: string
  timeline: {
    initial: number // hours
    followUp: number // hours
  }
  languages: string[]
}

export interface GDPRNotificationTemplate {
  type: 'supervisory_authority' | 'data_subject'
  language: string
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  template: string
  requiredFields: string[]
  optionalFields: string[]
}

export class GDPRBreachNotificationService {
  private supervisoryAuthorities: Map<string, SupervisoryAuthority>
  private notificationTemplates: Map<string, GDPRNotificationTemplate>
  private breachRegistry: Map<string, DataBreachIncident>

  constructor() {
    this.supervisoryAuthorities = this.initializeSupervisoryAuthorities()
    this.notificationTemplates = this.initializeNotificationTemplates()
    this.breachRegistry = new Map()
  }

  /**
   * Assess if vulnerability constitutes a personal data breach under GDPR
   */
  assessGDPRBreach(vulnerability: any, systemContext: any): {
    isPersonalDataBreach: boolean
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    notificationRequired: {
      supervisoryAuthority: boolean
      dataSubjects: boolean
      timeline: Date
    }
    reasoning: string[]
  } {
    const reasoning: string[] = []
    let isPersonalDataBreach = false
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

    // Check if personal data is involved
    if (this.involvesPersonalData(vulnerability, systemContext)) {
      isPersonalDataBreach = true
      reasoning.push('System processes personal data')
      
      // Assess breach type and impact
      const breachNature = this.assessBreachNature(vulnerability)
      reasoning.push(`Breach affects data €{breachNature}`)

      // Calculate risk level
      riskLevel = this.calculateRiskLevel(vulnerability, systemContext, breachNature)
      reasoning.push(`Risk level: €{riskLevel} based on impact and likelihood`)
    }

    // Determine notification requirements
    const notificationRequired = this.determineNotificationRequirements(
      isPersonalDataBreach,
      riskLevel,
      vulnerability
    )

    return {
      isPersonalDataBreach,
      riskLevel,
      notificationRequired,
      reasoning
    }
  }

  /**
   * Create data breach incident record
   */
  createBreachIncident(
    vulnerability: any,
    systemContext: any,
    assessment: any
  ): DataBreachIncident {
    const incident: DataBreachIncident = {
      id: `BREACH_€{Date.now()}`,
      detectedAt: new Date(),
      nature: this.assessBreachNature(vulnerability) as any,
      categories: this.identifyDataCategories(systemContext),
      description: this.generateBreachDescription(vulnerability, systemContext),
      dataSubjectsAffected: this.estimateAffectedSubjects(systemContext),
      likelyConsequences: this.assessLikelyConsequences(vulnerability, systemContext),
      measuresProposed: this.generateProposedMeasures(vulnerability),
      vulnerability: {
        cveId: vulnerability.id,
        exploited: vulnerability.exploited || false,
        attackVector: vulnerability.attackVector || 'Unknown',
        securityMeasures: this.assessSecurityMeasures(systemContext)
      },
      riskAssessment: {
        likelihood: assessment.riskLevel === 'HIGH' ? 'HIGH' : 'MEDIUM',
        severity: assessment.riskLevel,
        overallRisk: assessment.riskLevel,
        justification: assessment.reasoning.join('; ')
      },
      notification: {
        supervisoryAuthority: assessment.notificationRequired.supervisoryAuthority,
        dataSubjects: assessment.notificationRequired.dataSubjects,
        reasons: assessment.reasoning,
        exemptions: []
      },
      crossBorder: this.assessCrossBorderImplications(systemContext),
      response: {
        containment: this.generateContainmentActions(vulnerability),
        investigation: this.generateInvestigationActions(vulnerability),
        communication: this.generateCommunicationActions(assessment),
        remediation: this.generateRemediationActions(vulnerability)
      }
    }

    this.breachRegistry.set(incident.id, incident)
    return incident
  }

  /**
   * Generate 72-hour notification to supervisory authority
   */
  async generate72HourNotification(
    incident: DataBreachIncident,
    jurisdiction: string
  ): Promise<{
    notification: string
    submitTo: SupervisoryAuthority
    deadline: Date
    followUpRequired: boolean
  }> {
    const supervisoryAuthority = this.supervisoryAuthorities.get(jurisdiction)
    if (!supervisoryAuthority) {
      throw new Error(`Supervisory authority not found for jurisdiction: €{jurisdiction}`)
    }

    const template = this.getNotificationTemplate('supervisory_authority', 'en', incident.riskAssessment.overallRisk)
    const notification = this.populateTemplate(template, incident, supervisoryAuthority)

    const deadline = new Date(incident.detectedAt.getTime() + 72 * 60 * 60 * 1000) // 72 hours

    return {
      notification,
      submitTo: supervisoryAuthority,
      deadline,
      followUpRequired: this.requiresFollowUp(incident)
    }
  }

  /**
   * Generate data subject notification (Article 34)
   */
  async generateDataSubjectNotification(
    incident: DataBreachIncident,
    language: string = 'en'
  ): Promise<{
    notification: string
    method: 'individual' | 'public'
    timeline: Date
    cost: number
  }> {
    const template = this.getNotificationTemplate('data_subject', language, incident.riskAssessment.overallRisk)
    const notification = this.populateDataSubjectTemplate(template, incident)

    // Determine notification method based on Article 34(3)
    const method = this.determineNotificationMethod(incident)
    
    // Calculate timeline (without undue delay)
    const timeline = new Date(incident.detectedAt.getTime() + 24 * 60 * 60 * 1000) // 24 hours recommended

    // Estimate notification cost
    const cost = this.estimateNotificationCost(incident, method)

    return {
      notification,
      method,
      timeline,
      cost
    }
  }

  /**
   * Track notification compliance
   */
  trackNotificationCompliance(incidentId: string): {
    compliance: {
      supervisoryAuthority: {
        required: boolean
        submitted: boolean
        onTime: boolean
        deadline: Date
        submittedAt?: Date
      }
      dataSubjects: {
        required: boolean
        notified: boolean
        onTime: boolean
        deadline: Date
        notifiedAt?: Date
      }
    }
    violations: string[]
    penalties: {
      potential: string
      amount?: number
    }
  } {
    const incident = this.breachRegistry.get(incidentId)
    if (!incident) {
      throw new Error(`Incident not found: €{incidentId}`)
    }

    const violations: string[] = []
    const now = new Date()

    // Check supervisory authority notification compliance
    const saDeadline = new Date(incident.detectedAt.getTime() + 72 * 60 * 60 * 1000)
    const saSubmitted = incident.reportedAt !== undefined
    const saOnTime = incident.reportedAt ? incident.reportedAt <= saDeadline : false

    if (incident.notification.supervisoryAuthority && !saSubmitted && now > saDeadline) {
      violations.push('Failed to notify supervisory authority within 72 hours')
    }

    // Check data subject notification compliance
    const dsDeadline = new Date(incident.detectedAt.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days reasonable
    const dsNotified = incident.response.communication.some(c => c.recipient === 'data_subjects' && c.status === 'SENT')
    const dsOnTime = true // Would be calculated based on actual notification times

    if (incident.notification.dataSubjects && !dsNotified && now > dsDeadline) {
      violations.push('Failed to notify data subjects without undue delay')
    }

    return {
      compliance: {
        supervisoryAuthority: {
          required: incident.notification.supervisoryAuthority,
          submitted: saSubmitted,
          onTime: saOnTime,
          deadline: saDeadline,
          submittedAt: incident.reportedAt
        },
        dataSubjects: {
          required: incident.notification.dataSubjects,
          notified: dsNotified,
          onTime: dsOnTime,
          deadline: dsDeadline
        }
      },
      violations,
      penalties: this.calculatePotentialPenalties(violations, incident)
    }
  }

  private initializeSupervisoryAuthorities(): Map<string, SupervisoryAuthority> {
    const authorities = new Map<string, SupervisoryAuthority>()

    // German supervisory authority (Federal)
    authorities.set('DE', {
      country: 'Germany',
      name: 'Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)',
      contact: {
        email: 'poststelle@bfdi.bund.de',
        phone: '+49 228 997799-0',
        address: 'Graurheindorfer Str. 153, 53117 Bonn',
        website: 'https://www.bfdi.bund.de'
      },
      notificationForm: 'https://www.bfdi.bund.de/meldung',
      timeline: {
        initial: 72,
        followUp: 168 // 1 week
      },
      languages: ['de', 'en']
    })

    // French supervisory authority
    authorities.set('FR', {
      country: 'France',
      name: 'Commission Nationale de l\'Informatique et des Libertés (CNIL)',
      contact: {
        email: 'notification@cnil.fr',
        phone: '+33 1 53 73 22 22',
        address: '3 Place de Fontenoy, 75007 Paris',
        website: 'https://www.cnil.fr'
      },
      notificationForm: 'https://www.cnil.fr/notification-violation',
      timeline: {
        initial: 72,
        followUp: 168
      },
      languages: ['fr', 'en']
    })

    // Dutch supervisory authority
    authorities.set('NL', {
      country: 'Netherlands',
      name: 'Autoriteit Persoonsgegevens (AP)',
      contact: {
        email: 'datalek@autoriteitpersoonsgegevens.nl',
        phone: '+31 70 888 8500',
        address: 'Bezuidenhoutseweg 30, 2594 AV Den Haag',
        website: 'https://autoriteitpersoonsgegevens.nl'
      },
      notificationForm: 'https://autoriteitpersoonsgegevens.nl/datalekken',
      timeline: {
        initial: 72,
        followUp: 168
      },
      languages: ['nl', 'en']
    })

    return authorities
  }

  private initializeNotificationTemplates(): Map<string, GDPRNotificationTemplate> {
    const templates = new Map<string, GDPRNotificationTemplate>()

    // Supervisory Authority Template (English)
    templates.set('sa_en_high', {
      type: 'supervisory_authority',
      language: 'en',
      urgency: 'HIGH',
      template: `PERSONAL DATA BREACH NOTIFICATION - Article 33 GDPR

Organization: {organizationName}
Contact: {contactEmail}
DPO: {dpoContact}

BREACH DETAILS:
Incident ID: {incidentId}
Detection Date: {detectionDate}
Notification Date: {notificationDate}

NATURE OF BREACH:
{breachDescription}

DATA SUBJECTS AFFECTED:
Approximate number: {affectedCount}
Categories: {dataSubjectCategories}

DATA CATEGORIES:
{dataCategories}

LIKELY CONSEQUENCES:
{likelyConsequences}

MEASURES TAKEN:
{measuresProposed}

CROSS-BORDER IMPLICATIONS:
Lead SA: {leadSA}
Concerned SAs: {concernedSAs}

We confirm this notification is submitted within 72 hours of becoming aware of the breach as required by Article 33 GDPR.`,
      requiredFields: ['organizationName', 'contactEmail', 'incidentId', 'detectionDate', 'breachDescription'],
      optionalFields: ['dpoContact', 'leadSA', 'concernedSAs']
    })

    // Data Subject Template (English)
    templates.set('ds_en_high', {
      type: 'data_subject',
      language: 'en',
      urgency: 'HIGH',
      template: `IMPORTANT: Security Incident Notification

Dear [Name/Customer],

We are writing to inform you of a security incident that may affect your personal data.

WHAT HAPPENED:
{breachDescription}

WHAT INFORMATION WAS INVOLVED:
{dataCategories}

WHAT WE ARE DOING:
{measuresProposed}

WHAT YOU CAN DO:
{recommendedActions}

If you have any questions or concerns, please contact us:
{contactInformation}

We sincerely apologize for this incident and any inconvenience it may cause.`,
      requiredFields: ['breachDescription', 'dataCategories', 'measuresProposed'],
      optionalFields: ['recommendedActions', 'contactInformation']
    })

    return templates
  }

  private involvesPersonalData(vulnerability: any, systemContext: any): boolean {
    // Check if the vulnerable system processes personal data
    const personalDataIndicators = [
      'customer', 'user', 'employee', 'patient', 'citizen',
      'email', 'name', 'address', 'phone', 'id',
      'database', 'crm', 'hr', 'medical', 'financial'
    ]

    const systemDescription = (systemContext.description || '').toLowerCase()
    return personalDataIndicators.some(indicator => systemDescription.includes(indicator))
  }

  private assessBreachNature(vulnerability: any): string {
    // Determine if breach affects confidentiality, integrity, or availability
    const description = vulnerability.description?.toLowerCase() || ''
    
    if (description.includes('disclosure') || description.includes('unauthorized access')) {
      return 'confidentiality'
    }
    if (description.includes('modification') || description.includes('corruption')) {
      return 'integrity'
    }
    if (description.includes('denial') || description.includes('unavailable')) {
      return 'availability'
    }
    
    return 'confidentiality' // Default assumption
  }

  private calculateRiskLevel(vulnerability: any, systemContext: any, breachNature: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    let riskScore = 0

    // CVSS score contribution
    if (vulnerability.cvssScore >= 9.0) riskScore += 30
    else if (vulnerability.cvssScore >= 7.0) riskScore += 20
    else if (vulnerability.cvssScore >= 4.0) riskScore += 10

    // Data sensitivity
    if (systemContext.dataTypes?.includes('sensitive')) riskScore += 20
    if (systemContext.dataTypes?.includes('special_categories')) riskScore += 30

    // Number of affected subjects
    if (systemContext.userCount > 100000) riskScore += 20
    else if (systemContext.userCount > 10000) riskScore += 10

    // Active exploitation
    if (vulnerability.exploited) riskScore += 20

    if (riskScore >= 60) return 'HIGH'
    if (riskScore >= 30) return 'MEDIUM'
    return 'LOW'
  }

  private determineNotificationRequirements(
    isPersonalDataBreach: boolean,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
    vulnerability: any
  ): { supervisoryAuthority: boolean; dataSubjects: boolean; timeline: Date } {
    const now = new Date()

    // Article 33: Always notify SA for personal data breaches
    const supervisoryAuthority = isPersonalDataBreach

    // Article 34: Notify data subjects if high risk
    const dataSubjects = isPersonalDataBreach && riskLevel === 'HIGH'

    const timeline = new Date(now.getTime() + 72 * 60 * 60 * 1000) // 72 hours

    return { supervisoryAuthority, dataSubjects, timeline }
  }

  private identifyDataCategories(systemContext: any): ('personal_data' | 'sensitive_data' | 'special_categories' | 'criminal_convictions')[] {
    const categories: ('personal_data' | 'sensitive_data' | 'special_categories' | 'criminal_convictions')[] = ['personal_data']
    
    if (systemContext.dataTypes?.includes('health')) categories.push('special_categories')
    if (systemContext.dataTypes?.includes('financial')) categories.push('sensitive_data')
    if (systemContext.dataTypes?.includes('criminal')) categories.push('criminal_convictions')
    
    return categories
  }

  private generateBreachDescription(vulnerability: any, systemContext: any): string {
    return `A security vulnerability (€{vulnerability.id}) was identified in €{systemContext.name || 'the system'} that could potentially allow unauthorized access to personal data. €{vulnerability.description}`
  }

  private estimateAffectedSubjects(systemContext: any): { approximate: boolean; count: number; categories: string[] } {
    return {
      approximate: true,
      count: systemContext.userCount || 1000,
      categories: ['customers', 'users']
    }
  }

  private assessLikelyConsequences(vulnerability: any, systemContext: any): string[] {
    const consequences = [
      'Potential unauthorized access to personal data',
      'Risk of identity theft or fraud',
      'Possible financial loss to data subjects'
    ]

    if (systemContext.dataTypes?.includes('health')) {
      consequences.push('Risk to health and safety of data subjects')
    }

    return consequences
  }

  private generateProposedMeasures(vulnerability: any): string[] {
    return [
      'Immediate security patch application',
      'Enhanced monitoring and logging',
      'Access control review and strengthening',
      'Incident response team activation',
      'Third-party security assessment'
    ]
  }

  private assessSecurityMeasures(systemContext: any): any {
    return {
      encryption: systemContext.security?.encryption || false,
      pseudonymisation: systemContext.security?.pseudonymisation || false,
      accessControls: systemContext.security?.accessControls || true,
      backups: systemContext.security?.backups || true
    }
  }

  private assessCrossBorderImplications(systemContext: any): any {
    return {
      applicable: systemContext.geography?.length > 1,
      leadSA: systemContext.headquarters || 'DE',
      concernedSAs: systemContext.geography || ['DE'],
      oneStopShop: true
    }
  }

  private generateContainmentActions(vulnerability: any): BreachContainmentAction[] {
    return [
      {
        id: 'CONTAIN_001',
        action: 'Apply security patch immediately',
        responsible: 'IT Security Team',
        deadline: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
        status: 'PENDING',
        evidence: []
      }
    ]
  }

  private generateInvestigationActions(vulnerability: any): BreachInvestigationAction[] {
    return [
      {
        id: 'INVEST_001',
        investigationType: 'forensic',
        scope: 'Determine scope of potential data access',
        findings: [],
        evidence: [],
        responsible: 'Forensics Team'
      }
    ]
  }

  private generateCommunicationActions(assessment: any): BreachCommunicationAction[] {
    const actions: BreachCommunicationAction[] = []

    if (assessment.notificationRequired.supervisoryAuthority) {
      actions.push({
        id: 'COMM_SA_001',
        recipient: 'supervisory_authority',
        timeline: assessment.notificationRequired.timeline,
        method: 'email',
        content: '',
        language: 'en',
        status: 'DRAFTED'
      })
    }

    if (assessment.notificationRequired.dataSubjects) {
      actions.push({
        id: 'COMM_DS_001',
        recipient: 'data_subjects',
        timeline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        method: 'email',
        content: '',
        language: 'en',
        status: 'DRAFTED'
      })
    }

    return actions
  }

  private generateRemediationActions(vulnerability: any): BreachRemediationAction[] {
    return [
      {
        id: 'REMED_001',
        type: 'technical',
        description: 'Implement additional security controls',
        implementation: {
          responsible: 'Security Team',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          dependencies: []
        },
        effectiveness: {
          measurable: true,
          metrics: ['vulnerability scan results', 'penetration test results'],
          target: 'Zero critical vulnerabilities'
        }
      }
    ]
  }

  private getNotificationTemplate(
    type: 'supervisory_authority' | 'data_subject',
    language: string,
    urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  ): GDPRNotificationTemplate {
    const key = `€{type === 'supervisory_authority' ? 'sa' : 'ds'}_€{language}_€{urgency.toLowerCase()}`
    return this.notificationTemplates.get(key) || this.notificationTemplates.get(`sa_en_high`)!
  }

  private populateTemplate(
    template: GDPRNotificationTemplate,
    incident: DataBreachIncident,
    authority: SupervisoryAuthority
  ): string {
    let content = template.template

    const replacements = new Map([
      ['{organizationName}', 'ERIP Organization'],
      ['{contactEmail}', 'dpo@erip.example.com'],
      ['{incidentId}', incident.id],
      ['{detectionDate}', incident.detectedAt.toISOString()],
      ['{notificationDate}', new Date().toISOString()],
      ['{breachDescription}', incident.description],
      ['{affectedCount}', incident.dataSubjectsAffected.count.toString()],
      ['{dataSubjectCategories}', incident.dataSubjectsAffected.categories.join(', ')],
      ['{dataCategories}', incident.categories.join(', ')],
      ['{likelyConsequences}', incident.likelyConsequences.join('; ')],
      ['{measuresProposed}', incident.measuresProposed.join('; ')],
      ['{leadSA}', incident.crossBorder.leadSA || 'N/A'],
      ['{concernedSAs}', incident.crossBorder.concernedSAs.join(', ')]
    ])

    replacements.forEach((value, key) => {
      content = content.replace(new RegExp(key, 'g'), value)
    })

    return content
  }

  private populateDataSubjectTemplate(template: GDPRNotificationTemplate, incident: DataBreachIncident): string {
    let content = template.template

    const replacements = new Map([
      ['{breachDescription}', incident.description],
      ['{dataCategories}', incident.categories.join(', ')],
      ['{measuresProposed}', incident.measuresProposed.join('; ')],
      ['{recommendedActions}', 'Monitor accounts for suspicious activity; Change passwords if applicable'],
      ['{contactInformation}', 'privacy@erip.example.com']
    ])

    replacements.forEach((value, key) => {
      content = content.replace(new RegExp(key, 'g'), value)
    })

    return content
  }

  private determineNotificationMethod(incident: DataBreachIncident): 'individual' | 'public' {
    // Use public communication if individual notification would involve disproportionate effort
    const affectedCount = incident.dataSubjectsAffected.count
    const hasContactDetails = true // Would check actual system capabilities
    
    if (affectedCount > 10000 || !hasContactDetails) {
      return 'public'
    }
    
    return 'individual'
  }

  private estimateNotificationCost(incident: DataBreachIncident, method: 'individual' | 'public'): number {
    const affectedCount = incident.dataSubjectsAffected.count
    
    if (method === 'individual') {
      return affectedCount * 0.5 // €0.50 per individual notification
    } else {
      return 5000 // Fixed cost for public notification (website, media)
    }
  }

  private requiresFollowUp(incident: DataBreachIncident): boolean {
    // Follow-up required if initial information was incomplete
    return incident.dataSubjectsAffected.approximate || 
           incident.riskAssessment.overallRisk === 'HIGH'
  }

  private calculatePotentialPenalties(violations: string[], incident: DataBreachIncident): any {
    if (violations.length === 0) {
      return { potential: 'No violations identified' }
    }

    // GDPR Article 83 penalties
    const hasNotificationViolations = violations.some(v => 
      v.includes('notify') || v.includes('72 hours') || v.includes('delay')
    )

    if (hasNotificationViolations) {
      return {
        potential: 'Up to €10 million or 2% of annual worldwide turnover, whichever is higher',
        amount: 10000000 // €10 million
      }
    }

    return { potential: 'Administrative measures may apply' }
  }
}