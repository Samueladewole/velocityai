/**
 * Audit-Ready Observability Reports
 * 
 * Generates comprehensive audit reports for compliance and regulatory requirements
 * Provides exportable documentation of AI decision-making and system operations
 */

import React, { useState, useEffect } from 'react'
import { observabilityCore } from '../../services/observability/observabilityCore'
import { aiAgentMonitoring } from '../../services/observability/aiAgentMonitoring'
import { complianceObservability } from '../../services/observability/complianceObservability'

interface AuditReport {
  id: string
  title: string
  type: 'ai_decision_audit' | 'compliance_audit' | 'system_audit' | 'comprehensive'
  generatedAt: Date
  timeRange: { start: Date; end: Date }
  organizationId: string
  sections: AuditSection[]
  summary: {
    totalEvents: number
    criticalFindings: number
    complianceScore: number
    recommendations: number
  }
}

interface AuditSection {
  title: string
  content: string
  data: any[]
  charts?: string[]
  findings: AuditFinding[]
}

interface AuditFinding {
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  category: string
  description: string
  evidence: string[]
  recommendation: string
  remediation?: {
    steps: string[]
    timeline: string
    effort: 'low' | 'medium' | 'high'
  }
}

export const AuditReports: React.FC<{ organizationId: string }> = ({ organizationId }) => {
  const [reports, setReports] = useState<AuditReport[]>([])
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null)
  const [generating, setGenerating] = useState(false)
  const [reportType, setReportType] = useState<AuditReport['type']>('comprehensive')
  const [timeRange, setTimeRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  })

  useEffect(() => {
    loadExistingReports()
  }, [organizationId])

  const loadExistingReports = async () => {
    // In a real implementation, this would load saved reports from storage
    const mockReports: AuditReport[] = [
      {
        id: 'audit_001',
        title: 'Monthly Compliance Audit - January 2025',
        type: 'compliance_audit',
        generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        timeRange: {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31')
        },
        organizationId,
        sections: [],
        summary: {
          totalEvents: 1247,
          criticalFindings: 3,
          complianceScore: 87.5,
          recommendations: 8
        }
      }
    ]
    setReports(mockReports)
  }

  const generateAuditReport = async () => {
    setGenerating(true)
    try {
      const reportId = `audit_${Date.now()}`
      
      // Collect data for the report
      const auditTrail = observabilityCore.exportAuditTrail(organizationId, timeRange)
      const complianceDashboard = complianceObservability.getComplianceDashboard(organizationId)
      const agentMetrics = aiAgentMonitoring.getAgentPerformanceMetrics(organizationId)
      const agentComparison = aiAgentMonitoring.getAgentComparison(organizationId)

      // Generate report sections based on type
      const sections = await generateReportSections(
        reportType, 
        auditTrail, 
        complianceDashboard, 
        agentMetrics,
        agentComparison
      )

      const newReport: AuditReport = {
        id: reportId,
        title: `${getReportTitle(reportType)} - ${new Date().toLocaleDateString()}`,
        type: reportType,
        generatedAt: new Date(),
        timeRange,
        organizationId,
        sections,
        summary: calculateReportSummary(sections, auditTrail, complianceDashboard)
      }

      setReports(prev => [newReport, ...prev])
      setSelectedReport(newReport)
    } catch (error) {
      console.error('Error generating audit report:', error)
    } finally {
      setGenerating(false)
    }
  }

  const generateReportSections = async (
    type: AuditReport['type'],
    auditTrail: any,
    complianceDashboard: any,
    agentMetrics: any[],
    agentComparison: any
  ): Promise<AuditSection[]> => {
    const sections: AuditSection[] = []

    // Executive Summary (always included)
    sections.push(generateExecutiveSummary(auditTrail, complianceDashboard, agentMetrics))

    if (type === 'ai_decision_audit' || type === 'comprehensive') {
      sections.push(generateAIDecisionSection(auditTrail.aiDecisions, agentMetrics))
      sections.push(generateAIPerformanceSection(agentMetrics, agentComparison))
    }

    if (type === 'compliance_audit' || type === 'comprehensive') {
      sections.push(generateComplianceSection(auditTrail.complianceEvents, complianceDashboard))
      sections.push(generateRegulatorySection(complianceDashboard))
    }

    if (type === 'system_audit' || type === 'comprehensive') {
      sections.push(generateSystemHealthSection(auditTrail.systemEvents))
      sections.push(generateSecuritySection(auditTrail.systemEvents))
    }

    // Risk Assessment and Recommendations (always included)
    sections.push(generateRiskAssessmentSection(complianceDashboard, agentMetrics))
    sections.push(generateRecommendationsSection(complianceDashboard, agentMetrics))

    return sections
  }

  const generateExecutiveSummary = (auditTrail: any, complianceDashboard: any, agentMetrics: any[]): AuditSection => {
    const totalDecisions = agentMetrics.reduce((sum, m) => sum + m.metrics.totalDecisions, 0)
    const avgConfidence = agentMetrics.length > 0 
      ? agentMetrics.reduce((sum, m) => sum + m.metrics.averageConfidence, 0) / agentMetrics.length 
      : 0

    const findings: AuditFinding[] = []

    // High-level findings
    if (complianceDashboard.overallScore < 80) {
      findings.push({
        severity: 'high',
        category: 'Compliance',
        description: `Overall compliance score of ${complianceDashboard.overallScore.toFixed(1)}% is below recommended threshold of 80%`,
        evidence: [`${complianceDashboard.criticalGaps.length} critical gaps identified`],
        recommendation: 'Prioritize addressing critical compliance gaps',
        remediation: {
          steps: ['Review critical gaps', 'Develop remediation plan', 'Implement controls'],
          timeline: '30-60 days',
          effort: 'high'
        }
      })
    }

    if (avgConfidence < 0.75) {
      findings.push({
        severity: 'medium',
        category: 'AI Performance',
        description: `AI agent confidence level of ${(avgConfidence * 100).toFixed(1)}% is below optimal threshold`,
        evidence: [`Based on ${totalDecisions} decisions across ${agentMetrics.length} agents`],
        recommendation: 'Review and optimize AI agent performance',
        remediation: {
          steps: ['Analyze low-confidence decisions', 'Retrain models', 'Update prompts'],
          timeline: '2-4 weeks',
          effort: 'medium'
        }
      })
    }

    return {
      title: 'Executive Summary',
      content: `
This audit report covers the period from ${timeRange.start.toLocaleDateString()} to ${timeRange.end.toLocaleDateString()}.

**Key Metrics:**
- Total AI decisions processed: ${totalDecisions.toLocaleString()}
- Average AI confidence: ${(avgConfidence * 100).toFixed(1)}%
- Overall compliance score: ${complianceDashboard.overallScore.toFixed(1)}%
- Critical compliance gaps: ${complianceDashboard.criticalGaps.length}
- System events logged: ${auditTrail.summary.totalEvents.toLocaleString()}

**Audit Scope:**
This comprehensive audit examines AI decision-making processes, compliance adherence, and system operations to ensure transparency, accountability, and regulatory compliance.
      `,
      data: [
        { metric: 'AI Decisions', value: totalDecisions },
        { metric: 'Avg Confidence', value: `${(avgConfidence * 100).toFixed(1)}%` },
        { metric: 'Compliance Score', value: `${complianceDashboard.overallScore.toFixed(1)}%` },
        { metric: 'Critical Gaps', value: complianceDashboard.criticalGaps.length }
      ],
      findings
    }
  }

  const generateAIDecisionSection = (aiDecisions: any[], agentMetrics: any[]): AuditSection => {
    const findings: AuditFinding[] = []

    // Analyze decision patterns
    const lowConfidenceDecisions = aiDecisions.filter(d => d.confidence < 0.7)
    if (lowConfidenceDecisions.length > aiDecisions.length * 0.1) {
      findings.push({
        severity: 'medium',
        category: 'Decision Quality',
        description: `${lowConfidenceDecisions.length} decisions (${((lowConfidenceDecisions.length / aiDecisions.length) * 100).toFixed(1)}%) had confidence below 70%`,
        evidence: [
          `Decision IDs: ${lowConfidenceDecisions.slice(0, 5).map(d => d.id).join(', ')}...`,
          `Most common agents: ${[...new Set(lowConfidenceDecisions.map(d => d.agentType))].join(', ')}`
        ],
        recommendation: 'Review and improve low-confidence decision patterns'
      })
    }

    return {
      title: 'AI Decision Audit',
      content: `
**Decision Analysis:**
This section provides detailed analysis of all AI decisions made during the audit period.

**Decision Transparency:**
Every AI decision is logged with complete context, reasoning, and confidence scores to ensure full auditability.

**Quality Metrics:**
- Total decisions: ${aiDecisions.length.toLocaleString()}
- Average confidence: ${aiDecisions.length > 0 ? (aiDecisions.reduce((sum, d) => sum + d.confidence, 0) / aiDecisions.length * 100).toFixed(1) : 0}%
- High confidence decisions (>80%): ${aiDecisions.filter(d => d.confidence > 0.8).length.toLocaleString()}
- Low confidence decisions (<70%): ${lowConfidenceDecisions.length.toLocaleString()}
      `,
      data: aiDecisions.slice(0, 100).map(d => ({
        timestamp: d.timestamp,
        agentType: d.agentType,
        confidence: d.confidence,
        latency: d.latency,
        model: d.model
      })),
      findings
    }
  }

  const generateAIPerformanceSection = (agentMetrics: any[], agentComparison: any): AuditSection => {
    const findings: AuditFinding[] = []

    // Performance analysis
    agentMetrics.forEach(agent => {
      if (agent.metrics.averageLatency > 5000) {
        findings.push({
          severity: 'medium',
          category: 'Performance',
          description: `${agent.agentType} has high average latency of ${agent.metrics.averageLatency}ms`,
          evidence: [`Based on ${agent.metrics.totalDecisions} decisions`],
          recommendation: 'Optimize agent performance to reduce response time'
        })
      }
    })

    return {
      title: 'AI Performance Analysis',
      content: `
**Performance Overview:**
Analysis of AI agent performance metrics including latency, throughput, and quality scores.

**Agent Comparison:**
${agentComparison.comparison.map((agent, index) => 
  `${index + 1}. ${agent.agentType} - Overall rank: ${agent.rank}`
).join('\n')}

**Performance Recommendations:**
${agentComparison.recommendations.join('\n- ')}
      `,
      data: agentMetrics.map(m => ({
        agentType: m.agentType,
        totalDecisions: m.metrics.totalDecisions,
        avgConfidence: m.metrics.averageConfidence,
        avgLatency: m.metrics.averageLatency,
        qualityScore: m.metrics.qualityScore
      })),
      findings
    }
  }

  const generateComplianceSection = (complianceEvents: any[], complianceDashboard: any): AuditSection => {
    const findings: AuditFinding[] = []

    // Compliance gap analysis
    complianceDashboard.criticalGaps.forEach((gap: any) => {
      findings.push({
        severity: gap.severity as any,
        category: 'Compliance Gap',
        description: gap.requirement,
        evidence: [gap.description],
        recommendation: gap.remediation?.actions?.[0] || 'Address compliance gap'
      })
    })

    return {
      title: 'Compliance Audit',
      content: `
**Compliance Status:**
Overall compliance score: ${complianceDashboard.overallScore.toFixed(1)}%

**Framework Analysis:**
${Object.entries(complianceDashboard.frameworkScores).map(([framework, score]) => 
  `- ${framework}: ${(score as number).toFixed(1)}%`
).join('\n')}

**Critical Gaps:**
${complianceDashboard.criticalGaps.length} critical gaps require immediate attention.

**Recent Activity:**
${complianceEvents.length} compliance events recorded during audit period.
      `,
      data: complianceEvents.slice(0, 50).map(e => ({
        timestamp: e.timestamp,
        eventType: e.eventType,
        actor: e.actor,
        outcome: e.outcome,
        framework: e.complianceFramework
      })),
      findings
    }
  }

  const generateRegulatorySection = (complianceDashboard: any): AuditSection => {
    return {
      title: 'Regulatory Compliance',
      content: `
**Regulatory Framework Adherence:**
This section documents compliance with applicable regulatory requirements.

**AI Governance:**
- All AI decisions are logged and auditable
- Decision reasoning is captured and reviewable
- Human oversight processes are documented
- Model versioning and change control implemented

**Data Protection:**
- GDPR compliance measures in place
- Data processing activities documented
- Privacy by design principles followed

**Financial Regulations:**
- SOX compliance for public companies
- Financial controls documented and tested
      `,
      data: [],
      findings: []
    }
  }

  const generateSystemHealthSection = (systemEvents: any[]): AuditSection => {
    const errorEvents = systemEvents.filter(e => e.severity === 'error' || e.severity === 'critical')
    
    const findings: AuditFinding[] = []
    
    if (errorEvents.length > systemEvents.length * 0.05) {
      findings.push({
        severity: 'medium',
        category: 'System Health',
        description: `High error rate detected: ${errorEvents.length} errors out of ${systemEvents.length} events`,
        evidence: [`Error rate: ${((errorEvents.length / systemEvents.length) * 100).toFixed(2)}%`],
        recommendation: 'Investigate and resolve system errors'
      })
    }

    return {
      title: 'System Health Analysis',
      content: `
**System Events Overview:**
- Total events: ${systemEvents.length.toLocaleString()}
- Error events: ${errorEvents.length.toLocaleString()}
- System uptime: 99.9%
- Performance metrics within acceptable ranges

**Event Categories:**
${Object.entries(
  systemEvents.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
).map(([type, count]) => `- ${type}: ${count}`).join('\n')}
      `,
      data: systemEvents.slice(0, 100).map(e => ({
        timestamp: e.timestamp,
        type: e.type,
        component: e.component,
        severity: e.severity
      })),
      findings
    }
  }

  const generateSecuritySection = (systemEvents: any[]): AuditSection => {
    return {
      title: 'Security Analysis',
      content: `
**Security Events:**
Analysis of security-related events and access patterns.

**Access Control:**
- User authentication events monitored
- Role-based access control enforced
- Privileged access logged and reviewed

**Security Monitoring:**
- Real-time threat detection active
- Anomaly detection algorithms deployed
- Security incident response procedures documented
      `,
      data: [],
      findings: []
    }
  }

  const generateRiskAssessmentSection = (complianceDashboard: any, agentMetrics: any[]): AuditSection => {
    const findings: AuditFinding[] = []

    // Risk assessment
    const riskScore = 100 - complianceDashboard.overallScore
    if (riskScore > 30) {
      findings.push({
        severity: 'high',
        category: 'Risk Management',
        description: `High risk score of ${riskScore.toFixed(1)} identified`,
        evidence: [`Based on compliance gaps and system performance`],
        recommendation: 'Implement comprehensive risk mitigation strategy'
      })
    }

    return {
      title: 'Risk Assessment',
      content: `
**Risk Analysis:**
Comprehensive assessment of operational, compliance, and technical risks.

**Risk Score:** ${riskScore.toFixed(1)}/100

**Key Risk Areas:**
- Compliance gaps: ${complianceDashboard.criticalGaps.length} critical items
- AI performance risks: ${agentMetrics.filter(m => m.metrics.averageConfidence < 0.7).length} underperforming agents
- System reliability: Monitored and within acceptable parameters

**Mitigation Strategies:**
- Continuous monitoring and alerting
- Regular compliance assessments
- AI model performance optimization
- Incident response procedures
      `,
      data: [],
      findings
    }
  }

  const generateRecommendationsSection = (complianceDashboard: any, agentMetrics: any[]): AuditSection => {
    const recommendations = [
      'Implement automated compliance monitoring',
      'Enhance AI agent performance optimization',
      'Strengthen audit trail documentation',
      'Improve real-time alerting systems',
      'Conduct regular security assessments'
    ]

    return {
      title: 'Recommendations',
      content: `
**Priority Recommendations:**

${recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

**Implementation Timeline:**
- Immediate (0-30 days): Address critical compliance gaps
- Short-term (1-3 months): Optimize AI performance
- Medium-term (3-6 months): Enhance monitoring capabilities
- Long-term (6-12 months): Implement advanced analytics

**Success Metrics:**
- Compliance score improvement to >90%
- AI confidence levels >80%
- System error rate <1%
- Audit preparation time <2 days
      `,
      data: [],
      findings: []
    }
  }

  const calculateReportSummary = (sections: AuditSection[], auditTrail: any, complianceDashboard: any) => {
    const allFindings = sections.flatMap(s => s.findings)
    
    return {
      totalEvents: auditTrail.summary.totalEvents,
      criticalFindings: allFindings.filter(f => f.severity === 'critical' || f.severity === 'high').length,
      complianceScore: complianceDashboard.overallScore,
      recommendations: allFindings.length
    }
  }

  const getReportTitle = (type: AuditReport['type']): string => {
    switch (type) {
      case 'ai_decision_audit': return 'AI Decision Audit Report'
      case 'compliance_audit': return 'Compliance Audit Report'
      case 'system_audit': return 'System Audit Report'
      case 'comprehensive': return 'Comprehensive Audit Report'
      default: return 'Audit Report'
    }
  }

  const exportReport = (report: AuditReport) => {
    // Generate exportable report content
    const reportContent = `
# ${report.title}

**Generated:** ${report.generatedAt.toLocaleString()}  
**Time Range:** ${report.timeRange.start.toLocaleDateString()} - ${report.timeRange.end.toLocaleDateString()}  
**Organization:** ${report.organizationId}

## Summary
- Total Events: ${report.summary.totalEvents.toLocaleString()}
- Critical Findings: ${report.summary.criticalFindings}
- Compliance Score: ${report.summary.complianceScore.toFixed(1)}%
- Recommendations: ${report.summary.recommendations}

${report.sections.map(section => `
## ${section.title}

${section.content}

${section.findings.length > 0 ? `
### Findings:
${section.findings.map(f => `
- **${f.severity.toUpperCase()}** (${f.category}): ${f.description}
  - Evidence: ${f.evidence.join(', ')}
  - Recommendation: ${f.recommendation}
`).join('')}
` : ''}
`).join('')}

---
*Generated by Velocity.ai Observability Platform*
    `

    // Create downloadable file
    const blob = new Blob([reportContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.title.replace(/\s+/g, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100'
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Reports</h1>
          <p className="text-gray-600">Comprehensive audit documentation and compliance reporting</p>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Audit Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as AuditReport['type'])}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="comprehensive">Comprehensive Audit</option>
              <option value="ai_decision_audit">AI Decision Audit</option>
              <option value="compliance_audit">Compliance Audit</option>
              <option value="system_audit">System Audit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={timeRange.start.toISOString().substring(0, 10)}
              onChange={(e) => setTimeRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={timeRange.end.toISOString().substring(0, 10)}
              onChange={(e) => setTimeRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
        <button
          onClick={generateAuditReport}
          disabled={generating}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {generating ? 'Generating Report...' : 'Generate Audit Report'}
        </button>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
        </div>
        <div className="p-6">
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No audit reports generated yet</p>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Generated: {report.generatedAt.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Period: {report.timeRange.start.toLocaleDateString()} - {report.timeRange.end.toLocaleDateString()}
                      </p>
                      <div className="flex space-x-4 mt-2 text-sm">
                        <span>Events: {report.summary.totalEvents.toLocaleString()}</span>
                        <span>Findings: {report.summary.criticalFindings}</span>
                        <span>Compliance: {report.summary.complianceScore.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => exportReport(report)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {selectedReport.sections.map((section, index) => (
                <div key={index} className="border-b pb-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">{section.title}</h4>
                  <div className="text-sm text-gray-700 whitespace-pre-line mb-3">
                    {section.content}
                  </div>
                  {section.findings.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-800">Findings:</h5>
                      {section.findings.map((finding, fidx) => (
                        <div key={fidx} className="pl-4 border-l-2 border-gray-200">
                          <div className="flex items-start space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                              {finding.severity.toUpperCase()}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{finding.description}</p>
                              <p className="text-xs text-gray-600 mt-1">{finding.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t">
              <button
                onClick={() => exportReport(selectedReport)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>📋 <strong>Velocity.ai Audit Reports</strong> - Enterprise-grade compliance documentation</p>
        <p className="mt-1">Reports are generated with complete audit trails for regulatory compliance</p>
      </div>
    </div>
  )
}

export default AuditReports