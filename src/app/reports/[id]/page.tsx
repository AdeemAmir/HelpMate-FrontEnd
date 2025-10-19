'use client'

import { useState, useEffect } from 'react'
import { useAuth, api } from '../../providers'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  SparklesIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Report {
  _id: string
  originalName: string
  reportType: string
  testDate: string
  labName?: string
  doctorName?: string
  notes?: string
  isProcessed: boolean
  createdAt: string
  fileUrl: string
  aiInsights?: {
    summary: {
      english: string
      urdu: string
    }
    keyFindings: Array<{
      parameter: string
      value: string
      unit?: string
      status: string
      normalRange?: string
      significance?: {
        english?: string
        urdu?: string
      }
    }>
    recommendations: {
      english: string[]
      urdu: string[]
    }
    doctorQuestions: {
      english: string[]
      urdu: string[]
    }
    riskFactors: Array<{
      factor: string
      level: string
      description?: {
        english?: string
        urdu?: string
      }
    }>
    followUpRequired: boolean
    followUpTimeframe?: string
    confidence: number
  }
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<'en' | 'ur'>('en')
  const [showFullSummary, setShowFullSummary] = useState(false)

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login')
    return null
  }

  useEffect(() => {
    if (user && token) {
      fetchReport()
    }
  }, [user, token, params.id])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/files/${params.id}`, token)
      console.log('Report API Response:', response) // Debug log
      
      // Handle different response structures
      if (response.success && response.data && response.data.file) {
        setReport(response.data.file)
      } else if (response.data) {
        setReport(response.data)
      } else {
        console.warn('Unexpected API response structure:', response)
        setReport(null)
      }
    } catch (error) {
      console.error('Failed to fetch report:', error)
      router.push('/reports')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    )
  }

  if (!user || !report) {
    return null
  }

  const getReportTypeColor = (reportType: string) => {
    const colors: { [key: string]: string } = {
      'blood-test': 'bg-red-100 text-red-800',
      'urine-test': 'bg-yellow-100 text-yellow-800',
      'x-ray': 'bg-blue-100 text-blue-800',
      'ct-scan': 'bg-purple-100 text-purple-800',
      'mri': 'bg-indigo-100 text-indigo-800',
      'ultrasound': 'bg-green-100 text-green-800',
      'ecg': 'bg-pink-100 text-pink-800',
      'prescription': 'bg-orange-100 text-orange-800',
      'discharge-summary': 'bg-gray-100 text-gray-800',
      'consultation': 'bg-teal-100 text-teal-800',
      'other': 'bg-gray-100 text-gray-800',
    }
    return colors[reportType] || 'bg-gray-100 text-gray-800'
  }

  const getReportTypeLabel = (reportType: string) => {
    const labels: { [key: string]: string } = {
      'blood-test': 'Blood Test',
      'urine-test': 'Urine Test',
      'x-ray': 'X-Ray',
      'ct-scan': 'CT Scan',
      'mri': 'MRI',
      'ultrasound': 'Ultrasound',
      'ecg': 'ECG',
      'prescription': 'Prescription',
      'discharge-summary': 'Discharge Summary',
      'consultation': 'Consultation',
      'other': 'Other',
    }
    return labels[reportType] || 'Other'
  }

  const currentSummary = language === 'ur' && report.aiInsights?.summary?.urdu 
    ? report.aiInsights.summary.urdu 
    : report.aiInsights?.summary?.english || 'No summary available'

  // Safe date formatting function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No date available'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      return format(date, 'MMMM dd, yyyy')
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid date'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {report.originalName}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={report.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Report Information
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(report.reportType)}`}>
                      {getReportTypeLabel(report.reportType)}
                    </span>
                    {report.isProcessed ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <SparklesIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">AI Processed</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">Processing</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Test Date</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(report.testDate)}
                    </p>
                  </div>
                </div>

                {report.labName && (
                  <div className="flex items-center space-x-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Lab/Hospital</p>
                      <p className="text-sm text-gray-500">{report.labName}</p>
                    </div>
                  </div>
                )}

                {report.doctorName && (
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Doctor</p>
                      <p className="text-sm text-gray-500">{report.doctorName}</p>
                    </div>
                  </div>
                )}
              </div>

              {report.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {report.notes}
                  </p>
                </div>
              )}

              {/* Debug Information */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-800 mb-2">Debug Info:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Report ID:</strong> {report._id}</p>
                  <p><strong>File URL:</strong> {report.fileUrl ? 'Available' : 'Missing'}</p>
                  <p><strong>AI Processed:</strong> {report.isProcessed ? 'Yes' : 'No'}</p>
                  <p><strong>AI Insights:</strong> {report.aiInsights ? 'Available' : 'Missing'}</p>
                  <p><strong>Created:</strong> {formatDate(report.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            {report.isProcessed && report.aiInsights && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-blue-600" />
                    AI Summary
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        language === 'en' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('ur')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        language === 'ur' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Roman Urdu
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {showFullSummary ? String(currentSummary) : `${String(currentSummary)?.slice(0, 200)}...`}
                  </p>
                  {currentSummary && String(currentSummary).length > 200 && (
                    <button
                      onClick={() => setShowFullSummary(!showFullSummary)}
                      className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      {showFullSummary ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Key Findings */}
            {report.isProcessed && report.aiInsights?.keyFindings && report.aiInsights.keyFindings.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Findings</h2>
                <div className="space-y-4">
                  {report.aiInsights.keyFindings.map((finding, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{finding.parameter}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          finding.status === 'normal' ? 'bg-green-100 text-green-800' :
                          finding.status === 'high' ? 'bg-red-100 text-red-800' :
                          finding.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {finding.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Value:</span> {finding.value} {finding.unit}
                        {finding.normalRange && (
                          <span className="ml-2">
                            <span className="font-medium">Normal Range:</span> {finding.normalRange}
                          </span>
                        )}
                      </div>
                      {finding.significance && (
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">Significance:</p>
                          <p>{language === 'ur' && finding.significance.urdu ? finding.significance.urdu : finding.significance.english}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report.isProcessed && report.aiInsights?.recommendations && (
              (language === 'ur' ? report.aiInsights.recommendations.urdu : report.aiInsights.recommendations.english).length > 0
            ) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
                <ul className="space-y-2">
                  {(language === 'ur' ? report.aiInsights.recommendations.urdu : report.aiInsights.recommendations.english).map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Doctor Questions */}
            {report.isProcessed && report.aiInsights?.doctorQuestions && (
              (language === 'ur' ? report.aiInsights.doctorQuestions.urdu : report.aiInsights.doctorQuestions.english).length > 0
            ) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-600" />
                  Questions for Your Doctor
                </h2>
                <ul className="space-y-2">
                  {(language === 'ur' ? report.aiInsights.doctorQuestions.urdu : report.aiInsights.doctorQuestions.english).map((question, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">{question}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h3>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {report.fileUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {report.fileUrl.includes('.pdf') ? (
                      <div className="text-center">
                        <DocumentTextIcon className="mx-auto h-12 w-12 text-red-500" />
                        <p className="mt-2 text-sm text-gray-500">PDF Document</p>
                        <p className="text-xs text-gray-400">{report.originalName}</p>
                      </div>
                    ) : (
                      <img 
                        src={report.fileUrl} 
                        alt={report.originalName}
                        className="max-w-full max-h-full object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'block'
                        }}
                      />
                    )}
                    <div className="hidden text-center">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Document Preview</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No preview available</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col space-y-2">
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View Full Document</span>
                </a>
                <a
                  href={report.fileUrl}
                  download={report.originalName}
                  className="btn-outline flex items-center justify-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Processing Status */}
            {!report.isProcessed && (
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Processing Report</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      AI is analyzing your report. This may take a few minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Important Disclaimer</h4>
              <p className="text-xs text-gray-600">
                AI analysis is for informational purposes only and should not replace professional medical advice. 
                Always consult with your healthcare provider for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
