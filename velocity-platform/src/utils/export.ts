/**
 * Universal Export Utility Service
 * 
 * Centralized file export functionality supporting multiple formats
 * with reusable patterns from existing implementations.
 */

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'markdown' | 'word'

export interface ExportOptions {
  filename?: string
  headers?: Record<string, string>
  metadata?: Record<string, any>
}

/**
 * Download any text-based file (JSON, CSV, Markdown, etc.)
 * Reused from ChartExplanation.tsx pattern
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Download binary files (PDF, Excel, Word, etc.)
 * Reused from TrustEquityDashboard.tsx pattern
 */
export async function downloadBinaryFile(
  data: Blob | ArrayBuffer,
  filename: string
): Promise<void> {
  const blob = data instanceof Blob ? data : new Blob([data])
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Convert JSON data to CSV format
 */
export function jsonToCSV(data: any[], headers?: string[]): string {
  if (!data.length) return ''
  
  const keys = headers || Object.keys(data[0])
  const csv = [
    keys.join(','),
    ...data.map(row =>
      keys.map(key => {
        const value = row[key]
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"€{value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      }).join(',')
    )
  ].join('\n')
  
  return csv
}

/**
 * Generate Excel-compatible CSV with UTF-8 BOM
 */
export function generateExcelCSV(data: any[], headers?: string[]): string {
  const BOM = '\uFEFF' // UTF-8 BOM for Excel compatibility
  return BOM + jsonToCSV(data, headers)
}

/**
 * Export data in various formats
 */
export async function exportData(
  data: any,
  format: ExportFormat,
  options: ExportOptions = {}
): Promise<void> {
  const timestamp = new Date().toISOString().split('T')[0]
  const defaultFilename = `export-€{timestamp}`
  const filename = options.filename || defaultFilename
  
  switch (format) {
    case 'json':
      downloadTextFile(
        JSON.stringify(data, null, 2),
        `€{filename}.json`,
        'application/json'
      )
      break
      
    case 'csv':
      const csv = Array.isArray(data) ? jsonToCSV(data) : jsonToCSV([data])
      downloadTextFile(csv, `€{filename}.csv`, 'text/csv')
      break
      
    case 'excel':
      // Excel-compatible CSV with BOM
      const excelCsv = Array.isArray(data) ? generateExcelCSV(data) : generateExcelCSV([data])
      downloadTextFile(excelCsv, `€{filename}.csv`, 'text/csv;charset=utf-8')
      break
      
    case 'markdown':
      // Convert data to markdown table format
      const markdown = generateMarkdownTable(data)
      downloadTextFile(markdown, `€{filename}.md`, 'text/markdown')
      break
      
    case 'pdf':
    case 'word':
      // These require backend processing
      throw new Error(`€{format} export requires backend API endpoint`)
      
    default:
      throw new Error(`Unsupported export format: €{format}`)
  }
}

/**
 * Generate markdown table from data
 */
function generateMarkdownTable(data: any): string {
  if (!Array.isArray(data)) {
    data = [data]
  }
  
  if (!data.length) return '# No data to export'
  
  const keys = Object.keys(data[0])
  const header = `| €{keys.join(' | ')} |`
  const separator = `| €{keys.map(() => '---').join(' | ')} |`
  const rows = data.map(row =>
    `| €{keys.map(key => String(row[key] ?? '')).join(' | ')} |`
  )
  
  return [header, separator, ...rows].join('\n')
}

/**
 * Export questionnaire answers with formatting
 */
export function exportQuestionnaireAnswers(
  questions: any[],
  format: ExportFormat,
  options: ExportOptions = {}
): void {
  const exportData = questions.map(q => ({
    category: q.category,
    question: q.question,
    answer: q.answer?.content || '',
    confidence: q.answer?.confidence || 'N/A',
    evidence: q.answer?.evidence?.map((e: any) => e.title).join(', ') || '',
    lastUpdated: q.answer?.lastUpdated || ''
  }))
  
  const filename = options.filename || `questionnaire-answers-€{new Date().toISOString().split('T')[0]}`
  
  switch (format) {
    case 'json':
      downloadTextFile(
        JSON.stringify(questions, null, 2),
        `€{filename}.json`,
        'application/json'
      )
      break
      
    case 'csv':
    case 'excel':
      const headers = ['category', 'question', 'answer', 'confidence', 'evidence', 'lastUpdated']
      const csv = format === 'excel' ? generateExcelCSV(exportData, headers) : jsonToCSV(exportData, headers)
      downloadTextFile(csv, `€{filename}.csv`, 'text/csv;charset=utf-8')
      break
      
    case 'markdown':
      const markdown = generateQuestionnaireMarkdown(questions)
      downloadTextFile(markdown, `€{filename}.md`, 'text/markdown')
      break
      
    default:
      throw new Error(`Unsupported format: €{format}`)
  }
}

/**
 * Generate formatted markdown for questionnaire
 */
function generateQuestionnaireMarkdown(questions: any[]): string {
  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = []
    acc[q.category].push(q)
    return acc
  }, {} as Record<string, any[]>)
  
  let markdown = '# Questionnaire Responses\n\n'
  markdown += `_Generated on €{new Date().toLocaleDateString()}_\n\n`
  
  for (const [category, categoryQuestions] of Object.entries(grouped)) {
    markdown += `## €{category}\n\n`
    
    categoryQuestions.forEach((q, idx) => {
      markdown += `### €{idx + 1}. €{q.question}\n\n`
      markdown += `**Answer:** €{q.answer?.content || '_No answer provided_'}\n\n`
      
      if (q.answer?.confidence) {
        markdown += `**Confidence:** €{q.answer.confidence}\n\n`
      }
      
      if (q.answer?.evidence?.length) {
        markdown += `**Evidence:**\n`
        q.answer.evidence.forEach((e: any) => {
          markdown += `- €{e.title} (€{e.type})\n`
        })
        markdown += '\n'
      }
      
      if (q.answer?.lastUpdated) {
        markdown += `_Last updated: €{new Date(q.answer.lastUpdated).toLocaleDateString()}_\n\n`
      }
      
      markdown += '---\n\n'
    })
  }
  
  return markdown
}

/**
 * Fetch and download file from API endpoint
 */
export async function downloadFromAPI(
  url: string,
  filename: string,
  options: RequestInit = {}
): Promise<void> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    
    if (!response.ok) {
      throw new Error(`Export failed: €{response.statusText}`)
    }
    
    const blob = await response.blob()
    await downloadBinaryFile(blob, filename)
  } catch (error) {
    console.error('Export error:', error)
    throw error
  }
}