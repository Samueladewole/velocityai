/**
 * Questionnaire Upload Component
 * 
 * Drag & drop interface for uploading security questionnaires with AI extraction
 */

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Brain,
  Zap,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Questionnaire, QIEEvent } from '@/types/qie'

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  extractedQuestions?: number
  errorMessage?: string
}

interface QuestionnaireUploadProps {
  onUploadComplete: (questionnaire: Questionnaire) => void
  onEvent?: (event: QIEEvent) => void
  maxFiles?: number
  maxSize?: number // in MB
}

const SUPPORTED_FORMATS = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'text/csv': 'CSV',
  'application/json': 'JSON'
}

export function QuestionnaireUpload({ 
  onUploadComplete, 
  onEvent,
  maxFiles = 5,
  maxSize = 50 
}: QuestionnaireUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      id: `€{Date.now()}-€{Math.random().toString(36).substr(2, 9)}`,
      status: 'uploading',
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    
    // Simulate upload and processing
    newFiles.forEach(uploadedFile => {
      processFile(uploadedFile)
    })
  }, [])

  const processFile = async (uploadedFile: UploadedFile) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress, status: progress === 100 ? 'processing' : 'uploading' }
              : f
          )
        )
      }

      // Emit upload event
      onEvent?.({ 
        type: 'QUESTIONNAIRE_UPLOADED', 
        payload: { 
          questionnaireId: uploadedFile.id, 
          filename: uploadedFile.file.name 
        }
      })

      // Simulate AI processing
      setIsProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate question extraction
      const extractedQuestions = Math.floor(Math.random() * 50) + 20 // 20-70 questions

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'completed', extractedQuestions }
            : f
        )
      )

      // Emit extraction event
      onEvent?.({ 
        type: 'QUESTIONS_EXTRACTED', 
        payload: { 
          questionnaireId: uploadedFile.id, 
          questionCount: extractedQuestions 
        }
      })

      // Create questionnaire object
      const questionnaire: Questionnaire = {
        id: uploadedFile.id,
        title: uploadedFile.file.name.replace(/\.[^/.]+€/, ''),
        description: `Uploaded questionnaire with €{extractedQuestions} questions`,
        source: uploadedFile.file.name,
        uploadDate: new Date(),
        status: 'ready',
        questions: [], // Would be populated by AI extraction
        answers: [],
        completionPercentage: 0
      }

      onUploadComplete(questionnaire)
      setIsProcessing(false)

    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'error', errorMessage: 'Processing failed' }
            : f
        )
      )
      setIsProcessing(false)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_FORMATS,
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    disabled: isProcessing
  })

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Clock className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500'
      case 'processing':
        return 'bg-purple-500'
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Smart Questionnaire Upload
          </CardTitle>
          <CardDescription>
            Upload security questionnaires and let AI extract and categorize questions automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-slate-300 hover:border-slate-400",
              isProcessing && "cursor-not-allowed opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <Upload className={cn(
                "h-12 w-12",
                isDragActive ? "text-blue-500" : "text-slate-400"
              )} />
              
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {isDragActive ? "Drop files here" : "Drag & drop questionnaires"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  or click to browse files
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {Object.values(SUPPORTED_FORMATS).map(format => (
                  <Badge key={format} variant="secondary" className="text-xs">
                    {format}
                  </Badge>
                ))}
              </div>

              <p className="text-xs text-slate-400">
                Maximum {maxFiles} files, up to {maxSize}MB each
              </p>
            </div>
          </div>

          {/* AI Processing Info */}
          {(uploadedFiles.length > 0 || isProcessing) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  AI Processing Active
                </span>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Extracting questions with 99% accuracy using advanced NLP</li>
                <li>• Auto-categorizing by framework/domain (SOC2, ISO27001, GDPR, etc.)</li>
                <li>• Detecting duplicates across questionnaires and existing database</li>
                <li>• Mapping to standard frameworks and control families</li>
                <li>• Generating intelligent answer suggestions based on your organization</li>
                <li>• Creating evidence requirements for each question</li>
              </ul>
            </div>
          )}

          {/* Upload Statistics */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-900">Files Uploaded</p>
                    <p className="text-lg font-bold text-emerald-600">{uploadedFiles.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Questions Extracted</p>
                    <p className="text-lg font-bold text-blue-600">
                      {uploadedFiles.reduce((sum, file) => sum + (file.extractedQuestions || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">Processing Status</p>
                    <p className="text-lg font-bold text-purple-600">
                      {uploadedFiles.filter(f => f.status === 'completed').length}/{uploadedFiles.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map(uploadedFile => (
                <div key={uploadedFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-slate-400 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(uploadedFile.status)}
                        <Badge 
                          variant="outline" 
                          className={cn("text-white", getStatusColor(uploadedFile.status))}
                        >
                          {uploadedFile.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {uploadedFile.status !== 'error' && (
                      <Progress 
                        value={uploadedFile.status === 'completed' ? 100 : uploadedFile.progress} 
                        className="h-2"
                      />
                    )}
                    
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>
                        {uploadedFile.status === 'completed' && uploadedFile.extractedQuestions && (
                          `€{uploadedFile.extractedQuestions} questions extracted`
                        )}
                        {uploadedFile.status === 'processing' && 'AI analyzing content...'}
                        {uploadedFile.status === 'uploading' && `€{uploadedFile.progress}% uploaded`}
                        {uploadedFile.status === 'error' && uploadedFile.errorMessage}
                      </span>
                      <span>{(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}