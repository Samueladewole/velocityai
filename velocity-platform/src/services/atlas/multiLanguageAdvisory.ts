/**
 * Multi-Language Advisory Service for EU Compliance
 * Provides vulnerability advisories in multiple EU languages with cultural context
 */

export interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  region: string[]
  script: 'latin' | 'cyrillic' | 'greek'
  rtl: boolean
  priority: number
}

export interface TranslationTemplate {
  id: string
  category: 'vulnerability' | 'threat' | 'advisory' | 'compliance'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  templates: Map<string, string> // language code -> template
  variables: string[]
  lastUpdated: Date
}

export interface LocalizedAdvisory {
  originalLanguage: string
  translations: Map<string, {
    content: string
    translationQuality: 'MACHINE' | 'HUMAN_REVIEWED' | 'NATIVE'
    translator: string
    reviewedBy?: string
    culturalAdaptations: string[]
    lastUpdated: Date
  }>
  distributionRegions: string[]
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  sectorSpecific: boolean
}

export interface CulturalContext {
  region: string
  businessCulture: {
    formalityLevel: 'FORMAL' | 'SEMI_FORMAL' | 'INFORMAL'
    directness: 'DIRECT' | 'INDIRECT'
    hierarchyEmphasis: 'HIGH' | 'MEDIUM' | 'LOW'
  }
  technicalTerminology: Map<string, string>
  regulatoryReferences: Map<string, string>
  emergencyContacts: {
    cert: string
    regulator: string
    emergency: string
  }
  timeFormat: string
  dateFormat: string
}

export class MultiLanguageAdvisoryService {
  private supportedLanguages: Map<string, LanguageConfig>
  private translationTemplates: Map<string, TranslationTemplate>
  private culturalContexts: Map<string, CulturalContext>
  private translationCache: Map<string, Map<string, string>>

  constructor() {
    this.supportedLanguages = this.initializeSupportedLanguages()
    this.translationTemplates = this.initializeTranslationTemplates()
    this.culturalContexts = this.initializeCulturalContexts()
    this.translationCache = new Map()
  }

  /**
   * Generate multi-language vulnerability advisory
   */
  async generateMultiLanguageAdvisory(
    vulnerability: any,
    baseLanguage: string = 'en',
    targetRegions: string[] = ['EU']
  ): Promise<LocalizedAdvisory> {
    
    const targetLanguages = this.getTargetLanguages(targetRegions)
    const baseContent = this.generateBaseContent(vulnerability, baseLanguage)
    
    const translations = new Map()
    
    // Generate translations for each target language
    for (const langCode of targetLanguages) {
      if (langCode === baseLanguage) continue
      
      const translation = await this.translateAdvisory(
        baseContent,
        baseLanguage,
        langCode,
        vulnerability
      )
      
      translations.set(langCode, translation)
    }

    return {
      originalLanguage: baseLanguage,
      translations,
      distributionRegions: targetRegions,
      urgencyLevel: this.calculateUrgencyLevel(vulnerability),
      sectorSpecific: this.isSectorSpecific(vulnerability)
    }
  }

  /**
   * Translate advisory with cultural adaptations
   */
  async translateAdvisory(
    content: string,
    sourceLanguage: string,
    targetLanguage: string,
    vulnerability: any
  ): Promise<{
    content: string
    translationQuality: 'MACHINE' | 'HUMAN_REVIEWED' | 'NATIVE'
    translator: string
    reviewedBy?: string
    culturalAdaptations: string[]
    lastUpdated: Date
  }> {
    
    const cacheKey = `€{sourceLanguage}-€{targetLanguage}-€{this.hashContent(content)}`
    
    // Check cache first
    if (this.translationCache.has(cacheKey)) {
      const cached = this.translationCache.get(cacheKey)!
      return {
        content: cached.get('content')!,
        translationQuality: 'MACHINE',
        translator: 'ATLAS Translation Service',
        culturalAdaptations: JSON.parse(cached.get('adaptations') || '[]'),
        lastUpdated: new Date()
      }
    }

    // Get cultural context for target language
    const culturalContext = this.culturalContexts.get(targetLanguage)
    if (!culturalContext) {
      throw new Error(`Cultural context not available for language: €{targetLanguage}`)
    }

    // Apply template-based translation
    const template = this.getTranslationTemplate(vulnerability.severity, targetLanguage)
    let translatedContent = this.applyTemplate(template, vulnerability, culturalContext)

    // Apply cultural adaptations
    const adaptations = this.applyCulturalAdaptations(
      translatedContent,
      culturalContext,
      vulnerability
    )
    
    translatedContent = adaptations.content
    
    // Cache the translation
    const cacheValue = new Map([
      ['content', translatedContent],
      ['adaptations', JSON.stringify(adaptations.adaptationsList)]
    ])
    this.translationCache.set(cacheKey, cacheValue)

    return {
      content: translatedContent,
      translationQuality: 'MACHINE',
      translator: 'ATLAS Translation Service',
      culturalAdaptations: adaptations.adaptationsList,
      lastUpdated: new Date()
    }
  }

  /**
   * Get distribution list for multi-language advisory
   */
  getDistributionList(advisory: LocalizedAdvisory): Map<string, string[]> {
    const distributionMap = new Map<string, string[]>()

    advisory.translations.forEach((translation, languageCode) => {
      const contacts = this.getLanguageSpecificContacts(languageCode, advisory.urgencyLevel)
      distributionMap.set(languageCode, contacts)
    })

    return distributionMap
  }

  /**
   * Validate translation quality
   */
  validateTranslationQuality(
    original: string,
    translation: string,
    languageCode: string
  ): {
    quality: number // 0-100
    issues: string[]
    suggestions: string[]
  } {
    const issues: string[] = []
    const suggestions: string[] = []
    let qualityScore = 100

    // Check for missing technical terms
    const technicalTerms = this.extractTechnicalTerms(original)
    technicalTerms.forEach(term => {
      if (!translation.toLowerCase().includes(term.toLowerCase())) {
        issues.push(`Technical term "€{term}" may be missing in translation`)
        qualityScore -= 10
      }
    })

    // Check length ratio (should be within reasonable bounds)
    const lengthRatio = translation.length / original.length
    if (lengthRatio < 0.7 || lengthRatio > 1.5) {
      issues.push('Translation length significantly differs from original')
      qualityScore -= 5
    }

    // Check for cultural context application
    const culturalContext = this.culturalContexts.get(languageCode)
    if (culturalContext) {
      const formalityCheck = this.checkFormality(translation, culturalContext.businessCulture.formalityLevel)
      if (!formalityCheck.appropriate) {
        issues.push('Translation formality level may not match cultural expectations')
        suggestions.push(formalityCheck.suggestion)
        qualityScore -= 5
      }
    }

    return {
      quality: Math.max(0, qualityScore),
      issues,
      suggestions
    }
  }

  private initializeSupportedLanguages(): Map<string, LanguageConfig> {
    const languages = new Map<string, LanguageConfig>()

    // Major EU languages with highest priority
    languages.set('en', {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      region: ['UK', 'IE', 'MT'],
      script: 'latin',
      rtl: false,
      priority: 1
    })

    languages.set('de', {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      region: ['DE', 'AT', 'LU'],
      script: 'latin',
      rtl: false,
      priority: 2
    })

    languages.set('fr', {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      region: ['FR', 'BE', 'LU'],
      script: 'latin',
      rtl: false,
      priority: 3
    })

    languages.set('es', {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      region: ['ES'],
      script: 'latin',
      rtl: false,
      priority: 4
    })

    languages.set('it', {
      code: 'it',
      name: 'Italian',
      nativeName: 'Italiano',
      region: ['IT'],
      script: 'latin',
      rtl: false,
      priority: 5
    })

    languages.set('nl', {
      code: 'nl',
      name: 'Dutch',
      nativeName: 'Nederlands',
      region: ['NL', 'BE'],
      script: 'latin',
      rtl: false,
      priority: 6
    })

    languages.set('pl', {
      code: 'pl',
      name: 'Polish',
      nativeName: 'Polski',
      region: ['PL'],
      script: 'latin',
      rtl: false,
      priority: 7
    })

    languages.set('sv', {
      code: 'sv',
      name: 'Swedish',
      nativeName: 'Svenska',
      region: ['SE'],
      script: 'latin',
      rtl: false,
      priority: 8
    })

    languages.set('da', {
      code: 'da',
      name: 'Danish',
      nativeName: 'Dansk',
      region: ['DK'],
      script: 'latin',
      rtl: false,
      priority: 9
    })

    languages.set('fi', {
      code: 'fi',
      name: 'Finnish',
      nativeName: 'Suomi',
      region: ['FI'],
      script: 'latin',
      rtl: false,
      priority: 10
    })

    return languages
  }

  private initializeTranslationTemplates(): Map<string, TranslationTemplate> {
    const templates = new Map<string, TranslationTemplate>()

    // Critical vulnerability template
    const criticalTemplate: TranslationTemplate = {
      id: 'critical-vulnerability',
      category: 'vulnerability',
      severity: 'CRITICAL',
      templates: new Map([
        ['en', 'CRITICAL SECURITY ADVISORY: {title}\n\nVulnerability: {cveId}\nSeverity: {severity}\nCVSS Score: {cvssScore}\n\nIMMEDIATE ACTION REQUIRED:\n{description}\n\nAFFECTED SYSTEMS:\n{affectedSystems}\n\nRECOMMENDATIONS:\n{recommendations}\n\nCONTACT: {emergencyContact}'],
        ['de', 'KRITISCHE SICHERHEITSWARNUNG: {title}\n\nSicherheitslücke: {cveId}\nSchweregrad: {severity}\nCVSS-Bewertung: {cvssScore}\n\nSOFORTMASSNAHMEN ERFORDERLICH:\n{description}\n\nBETROFFENE SYSTEME:\n{affectedSystems}\n\nEMPFEHLUNGEN:\n{recommendations}\n\nKONTAKT: {emergencyContact}'],
        ['fr', 'ALERTE DE SÉCURITÉ CRITIQUE: {title}\n\nVulnérabilité: {cveId}\nGravité: {severity}\nScore CVSS: {cvssScore}\n\nACTION IMMÉDIATE REQUISE:\n{description}\n\nSYSTÈMES AFFECTÉS:\n{affectedSystems}\n\nRECOMMANDATIONS:\n{recommendations}\n\nCONTACT: {emergencyContact}'],
        ['es', 'AVISO DE SEGURIDAD CRÍTICO: {title}\n\nVulnerabilidad: {cveId}\nGravedad: {severity}\nPuntuación CVSS: {cvssScore}\n\nACCIÓN INMEDIATA REQUERIDA:\n{description}\n\nSISTEMAS AFECTADOS:\n{affectedSystems}\n\nRECOMENDACIONES:\n{recommendations}\n\nCONTACTO: {emergencyContact}'],
        ['it', 'AVVISO DI SICUREZZA CRITICO: {title}\n\nVulnerabilità: {cveId}\nGravità: {severity}\nPunteggio CVSS: {cvssScore}\n\nAZIONE IMMEDIATA RICHIESTA:\n{description}\n\nSISTEMI INTERESSATI:\n{affectedSystems}\n\nRACCOMANDAZIONI:\n{recommendations}\n\nCONTATTO: {emergencyContact}'],
        ['nl', 'KRITIEKE BEVEILIGINGSWAARSCHUWING: {title}\n\nKwetsbaarheid: {cveId}\nErnst: {severity}\nCVSS Score: {cvssScore}\n\nONMIDDELLIJKE ACTIE VEREIST:\n{description}\n\nGETROFFEN SYSTEMEN:\n{affectedSystems}\n\nAANBEVELINGEN:\n{recommendations}\n\nCONTACT: {emergencyContact}'],
        ['pl', 'KRYTYCZNE OSTRZEŻENIE BEZPIECZEŃSTWA: {title}\n\nLuka: {cveId}\nPoważność: {severity}\nWynik CVSS: {cvssScore}\n\nWYMAGANE NATYCHMIASTOWE DZIAŁANIE:\n{description}\n\nSYSTEMY DOTKNIĘTE:\n{affectedSystems}\n\nZALECENIA:\n{recommendations}\n\nKONTAKT: {emergencyContact}']
      ]),
      variables: ['title', 'cveId', 'severity', 'cvssScore', 'description', 'affectedSystems', 'recommendations', 'emergencyContact'],
      lastUpdated: new Date()
    }

    templates.set('critical-vulnerability', criticalTemplate)

    return templates
  }

  private initializeCulturalContexts(): Map<string, CulturalContext> {
    const contexts = new Map<string, CulturalContext>()

    // German cultural context
    contexts.set('de', {
      region: 'DACH',
      businessCulture: {
        formalityLevel: 'FORMAL',
        directness: 'DIRECT',
        hierarchyEmphasis: 'HIGH'
      },
      technicalTerminology: new Map([
        ['vulnerability', 'Sicherheitslücke'],
        ['exploit', 'Exploit'],
        ['patch', 'Sicherheitsupdate'],
        ['incident', 'Sicherheitsvorfall'],
        ['breach', 'Datenschutzverletzung']
      ]),
      regulatoryReferences: new Map([
        ['GDPR', 'DSGVO'],
        ['NIS2', 'NIS2-Richtlinie'],
        ['BSI', 'Bundesamt für Sicherheit in der Informationstechnik']
      ]),
      emergencyContacts: {
        cert: 'CERT-Bund',
        regulator: 'BSI',
        emergency: '110'
      },
      timeFormat: '24h',
      dateFormat: 'DD.MM.YYYY'
    })

    // French cultural context
    contexts.set('fr', {
      region: 'France',
      businessCulture: {
        formalityLevel: 'FORMAL',
        directness: 'INDIRECT',
        hierarchyEmphasis: 'HIGH'
      },
      technicalTerminology: new Map([
        ['vulnerability', 'vulnérabilité'],
        ['exploit', 'exploitation'],
        ['patch', 'correctif'],
        ['incident', 'incident'],
        ['breach', 'violation de données']
      ]),
      regulatoryReferences: new Map([
        ['GDPR', 'RGPD'],
        ['NIS2', 'Directive NIS2'],
        ['ANSSI', 'Agence nationale de la sécurité des systèmes d\'information']
      ]),
      emergencyContacts: {
        cert: 'CERT-FR',
        regulator: 'ANSSI',
        emergency: '15'
      },
      timeFormat: '24h',
      dateFormat: 'DD/MM/YYYY'
    })

    // Dutch cultural context
    contexts.set('nl', {
      region: 'Netherlands',
      businessCulture: {
        formalityLevel: 'SEMI_FORMAL',
        directness: 'DIRECT',
        hierarchyEmphasis: 'MEDIUM'
      },
      technicalTerminology: new Map([
        ['vulnerability', 'kwetsbaarheid'],
        ['exploit', 'misbruik'],
        ['patch', 'beveiligingsupdate'],
        ['incident', 'incident'],
        ['breach', 'datalek']
      ]),
      regulatoryReferences: new Map([
        ['GDPR', 'AVG'],
        ['NIS2', 'NIS2-richtlijn'],
        ['NCSC', 'Nationaal Cyber Security Centrum']
      ]),
      emergencyContacts: {
        cert: 'NCSC-NL',
        regulator: 'NCSC',
        emergency: '112'
      },
      timeFormat: '24h',
      dateFormat: 'DD-MM-YYYY'
    })

    return contexts
  }

  private getTargetLanguages(regions: string[]): string[] {
    const targetLanguages: string[] = []

    if (regions.includes('EU') || regions.includes('ALL')) {
      // Return all supported EU languages, prioritized
      return Array.from(this.supportedLanguages.keys())
        .sort((a, b) => {
          const priorityA = this.supportedLanguages.get(a)?.priority || 999
          const priorityB = this.supportedLanguages.get(b)?.priority || 999
          return priorityA - priorityB
        })
    }

    // Map specific regions to languages
    regions.forEach(region => {
      this.supportedLanguages.forEach((config, code) => {
        if (config.region.includes(region)) {
          targetLanguages.push(code)
        }
      })
    })

    return [...new Set(targetLanguages)]
  }

  private generateBaseContent(vulnerability: any, language: string): string {
    const template = this.getTranslationTemplate(vulnerability.severity, language)
    const culturalContext = this.culturalContexts.get(language)

    if (!culturalContext) {
      throw new Error(`Cultural context not available for language: €{language}`)
    }

    return this.applyTemplate(template, vulnerability, culturalContext)
  }

  private getTranslationTemplate(severity: string, language: string): string {
    const templateKey = `€{severity.toLowerCase()}-vulnerability`
    const template = this.translationTemplates.get(templateKey)
    
    if (!template) {
      // Fallback to generic template
      return this.translationTemplates.get('critical-vulnerability')?.templates.get(language) || ''
    }

    return template.templates.get(language) || template.templates.get('en') || ''
  }

  private applyTemplate(
    template: string, 
    vulnerability: any, 
    culturalContext: CulturalContext
  ): string {
    let content = template

    // Replace variables with actual values
    const replacements = new Map([
      ['{title}', vulnerability.name || 'Security Vulnerability'],
      ['{cveId}', vulnerability.id || 'N/A'],
      ['{severity}', vulnerability.severity || 'UNKNOWN'],
      ['{cvssScore}', vulnerability.cvssScore?.toString() || 'N/A'],
      ['{description}', vulnerability.description || 'No description available'],
      ['{affectedSystems}', 'See technical details'],
      ['{recommendations}', 'Apply security patches immediately'],
      ['{emergencyContact}', culturalContext.emergencyContacts.cert]
    ])

    replacements.forEach((value, key) => {
      content = content.replace(new RegExp(key, 'g'), value)
    })

    return content
  }

  private applyCulturalAdaptations(
    content: string,
    culturalContext: CulturalContext,
    vulnerability: any
  ): { content: string; adaptationsList: string[] } {
    const adaptations: string[] = []
    let adaptedContent = content

    // Apply formality adjustments
    if (culturalContext.businessCulture.formalityLevel === 'FORMAL') {
      adaptedContent = this.increaseFormalityLevel(adaptedContent)
      adaptations.push('Increased formality level for business culture')
    }

    // Apply technical terminology translations
    culturalContext.technicalTerminology.forEach((translation, original) => {
      const regex = new RegExp(`\\b€{original}\\b`, 'gi')
      if (regex.test(adaptedContent)) {
        adaptedContent = adaptedContent.replace(regex, translation)
        adaptations.push(`Translated technical term: €{original} → €{translation}`)
      }
    })

    // Apply regulatory reference translations
    culturalContext.regulatoryReferences.forEach((translation, original) => {
      const regex = new RegExp(`\\b€{original}\\b`, 'g')
      if (regex.test(adaptedContent)) {
        adaptedContent = adaptedContent.replace(regex, translation)
        adaptations.push(`Localized regulatory reference: €{original} → €{translation}`)
      }
    })

    // Add cultural-specific emergency contact information
    adaptedContent += `\n\nLOCAL EMERGENCY CONTACTS:\n`
    adaptedContent += `CERT: €{culturalContext.emergencyContacts.cert}\n`
    adaptedContent += `Regulator: €{culturalContext.emergencyContacts.regulator}\n`
    adaptations.push('Added localized emergency contact information')

    return {
      content: adaptedContent,
      adaptationsList: adaptations
    }
  }

  private getLanguageSpecificContacts(languageCode: string, urgencyLevel: string): string[] {
    const contacts: string[] = []
    const culturalContext = this.culturalContexts.get(languageCode)

    if (culturalContext) {
      contacts.push(culturalContext.emergencyContacts.cert)
      contacts.push(culturalContext.emergencyContacts.regulator)
    }

    // Add EU-wide contacts for critical vulnerabilities
    if (urgencyLevel === 'CRITICAL') {
      contacts.push('cert-eu@ec.europa.eu')
      contacts.push('enisa-cert@enisa.europa.eu')
    }

    return contacts
  }

  private hashContent(content: string): string {
    // Simple hash function for content caching
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }

  private calculateUrgencyLevel(vulnerability: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (vulnerability.severity === 'CRITICAL' || vulnerability.cvssScore >= 9.0) {
      return 'CRITICAL'
    }
    if (vulnerability.severity === 'HIGH' || vulnerability.cvssScore >= 7.0) {
      return 'HIGH'
    }
    if (vulnerability.severity === 'MEDIUM' || vulnerability.cvssScore >= 4.0) {
      return 'MEDIUM'
    }
    return 'LOW'
  }

  private isSectorSpecific(vulnerability: any): boolean {
    const description = vulnerability.description?.toLowerCase() || ''
    const sectorKeywords = ['scada', 'industrial', 'medical', 'financial', 'banking', 'energy']
    return sectorKeywords.some(keyword => description.includes(keyword))
  }

  private extractTechnicalTerms(content: string): string[] {
    // Extract technical terms that should be preserved in translation
    const technicalTerms = [
      'CVE', 'CVSS', 'MITRE', 'ATT&CK', 'ENISA', 'CERT', 'GDPR', 'NIS2',
      'vulnerability', 'exploit', 'patch', 'malware', 'ransomware'
    ]
    
    return technicalTerms.filter(term => 
      content.toLowerCase().includes(term.toLowerCase())
    )
  }

  private checkFormality(
    content: string, 
    expectedLevel: 'FORMAL' | 'SEMI_FORMAL' | 'INFORMAL'
  ): { appropriate: boolean; suggestion: string } {
    // Simple formality check based on content patterns
    const formalIndicators = ['please', 'kindly', 'recommend', 'advise', 'request']
    const informalIndicators = ['you should', 'just', 'simply', 'quick']
    
    const formalCount = formalIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length
    
    const informalCount = informalIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length

    const actualLevel = formalCount > informalCount ? 'FORMAL' : 'INFORMAL'
    
    return {
      appropriate: actualLevel === expectedLevel || expectedLevel === 'SEMI_FORMAL',
      suggestion: expectedLevel === 'FORMAL' 
        ? 'Consider using more formal language and polite requests'
        : 'Content formality level is appropriate'
    }
  }

  private increaseFormalityLevel(content: string): string {
    // Apply formal language transformations
    let formalContent = content
    
    // Replace informal contractions
    formalContent = formalContent.replace(/can't/g, 'cannot')
    formalContent = formalContent.replace(/won't/g, 'will not')
    formalContent = formalContent.replace(/don't/g, 'do not')
    
    // Replace direct commands with polite requests
    formalContent = formalContent.replace(/Apply/g, 'Please apply')
    formalContent = formalContent.replace(/Update/g, 'Please update')
    formalContent = formalContent.replace(/Install/g, 'Please install')
    
    return formalContent
  }
}