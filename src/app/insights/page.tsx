'use client'

import { useState, useEffect } from 'react'
import { useAuth, api } from '../providers'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { 
  SparklesIcon,
  HeartIcon,
  BeakerIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface HealthInsight {
  _id: string
  file: {
    _id: string
    originalName: string
    reportType: string
    testDate: string
  }
  summary: {
    english: string
    urdu: string
  }
  keyFindings: Array<{
    parameter: string
    value: string
    status: string
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
    description: {
      english: string
      urdu: string
    }
  }>
  followUpRequired: boolean
  confidence: number
  createdAt: string
}

interface VitalsTrend {
  date: string
  bloodPressure: { systolic: number; diastolic: number } | null
  heartRate: number | null
  bloodSugar: { fasting: number; postPrandial: number; random: number } | null
  weight: number | null
  temperature: number | null
}

export default function InsightsPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [insights, setInsights] = useState<HealthInsight[]>([])
  const [vitalsTrends, setVitalsTrends] = useState<VitalsTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login')
    return null
  }

  useEffect(() => {
    if (user && token) {
      fetchInsights()
      fetchVitalsTrends()
    }
  }, [user, token])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const response = await api.get('/ai/insights', token)
      console.log('Insights API Response:', response) // Debug log
      
      // Handle different response structures
      if (response.success && response.data && response.data.insights && Array.isArray(response.data.insights)) {
        setInsights(response.data.insights)
      } else if (response.success && response.data && Array.isArray(response.data)) {
        setInsights(response.data)
      } else if (Array.isArray(response.data)) {
        setInsights(response.data)
      } else {
        console.warn('Unexpected insights API response structure:', response)
        setInsights([])
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
      setInsights([])
    } finally {
      setLoading(false)
    }
  }

  const fetchVitalsTrends = async () => {
    try {
      const response = await api.get('/vitals/trends', token)
      setVitalsTrends(response.data)
    } catch (error) {
      console.error('Failed to fetch vitals trends:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getSeverityColor = (status: string) => {
    switch (status) {
      case 'critical':
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'abnormal':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'normal':
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getReportTypeIcon = (reportType: string) => {
    switch (reportType) {
      case 'blood-test':
        return BeakerIcon
      case 'x-ray':
      case 'ct-scan':
      case 'mri':
      case 'ultrasound':
        return SparklesIcon
      case 'ecg':
        return HeartIcon
      case 'prescription':
        return DocumentTextIcon
      default:
        return DocumentTextIcon
    }
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
    return labels[reportType] || 'Report'
  }

  const categories = [
    { value: 'all', label: 'All Reports' },
    { value: 'blood-test', label: 'Blood Tests' },
    { value: 'x-ray', label: 'Imaging' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'other', label: 'Other' },
  ]

  const safeInsights = Array.isArray(insights) ? insights : []
  const filteredInsights = safeInsights.filter(insight => 
    selectedCategory === 'all' || insight.file.reportType === selectedCategory
  )

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
              <h1 className="text-xl font-semibold text-gray-900">AI Health Insights</h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredInsights.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No AI insights available</h3>
            <p className="mt-2 text-gray-500">
              Upload medical reports to get AI-powered health insights and analysis.
            </p>
            <div className="mt-6">
              <Link href="/upload" className="btn-primary">
                Upload Report
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInsights.map((insight) => {
              const ReportIcon = getReportTypeIcon(insight.file.reportType)
              const reportLabel = getReportTypeLabel(insight.file.reportType)
              const hasAbnormalFindings = insight.keyFindings.some(f => f.status === 'abnormal' || f.status === 'critical')
              const severityColor = hasAbnormalFindings ? 'border-red-200' : 'border-gray-200'
              
              return (
                <div key={insight._id} className={`bg-white rounded-lg shadow-sm border p-6 ${severityColor}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ReportIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {insight.file.originalName}
                          </h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {reportLabel}
                          </span>
                          {hasAbnormalFindings && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Attention Required
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {insight.summary.english}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                          <span>{format(new Date(insight.file.testDate), 'MMM dd, yyyy')}</span>
                          <span>Confidence: {insight.confidence}%</span>
                          {insight.followUpRequired && (
                            <span className="text-orange-600 font-medium">Follow-up Required</span>
                          )}
                        </div>

                        {/* Key Findings Preview */}
                        {insight.keyFindings.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Findings:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {insight.keyFindings.slice(0, 4).map((finding, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.status)}`}>
                                    {finding.parameter}: {finding.value}
                                  </span>
                                </div>
                              ))}
                              {insight.keyFindings.length > 4 && (
                                <span className="text-xs text-gray-500">
                                  +{insight.keyFindings.length - 4} more findings
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <Link
                        href={`/reports/${insight.file._id}`}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View Report</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Vitals Trends Chart */}
        {vitalsTrends.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vitals Trends</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">Vitals trends visualization would go here</p>
              <p className="text-sm text-gray-400 mt-2">
                This would show charts of your blood pressure, sugar, weight trends over time
              </p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredInsights.length}</div>
              <div className="text-sm text-gray-500">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredInsights.filter(i => i.keyFindings.some(f => f.status === 'critical' || f.status === 'abnormal')).length}
              </div>
              <div className="text-sm text-gray-500">Need Attention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredInsights.filter(i => i.followUpRequired).length}
              </div>
              <div className="text-sm text-gray-500">Follow-up Required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredInsights.filter(i => i.keyFindings.every(f => f.status === 'normal')).length}
              </div>
              <div className="text-sm text-gray-500">Normal Reports</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
