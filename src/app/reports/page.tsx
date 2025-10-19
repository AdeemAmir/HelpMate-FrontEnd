'use client'

import { useState, useEffect } from 'react'
import { useAuth, api } from '../providers'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  DocumentTextIcon, 
  EyeIcon, 
  SparklesIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Report {
  _id: string
  originalName: string
  reportType: string
  testDate: string
  labName?: string
  doctorName?: string
  isProcessed: boolean
  createdAt: string
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

export default function ReportsPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Ensure reports is always an array
  const safeReports = Array.isArray(reports) ? reports : []
  
  // Debug log to see what reports contains
  console.log('Reports state:', reports, 'Safe reports:', safeReports)

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login')
    return null
  }

  useEffect(() => {
    if (user && token) {
      fetchReports()
    }
  }, [user, token])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await api.get('/files', token)
      console.log('API Response:', response) // Debug log
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        setReports(response.data)
      } else if (response.data && response.data.files && Array.isArray(response.data.files)) {
        setReports(response.data.files)
      } else {
        console.warn('Unexpected API response structure:', response)
        setReports([])
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
      setReports([]) // Ensure reports is always an array
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

  if (!user) {
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

  const filteredReports = safeReports
    .filter(report => {
      const matchesSearch = report.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.labName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterType === 'all' || report.reportType === filterType
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
        case 'name':
          return a.originalName.localeCompare(b.originalName)
        case 'type':
          return a.reportType.localeCompare(b.reportType)
        default:
          return 0
      }
    })

  const reportTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'blood-test', label: 'Blood Test' },
    { value: 'urine-test', label: 'Urine Test' },
    { value: 'x-ray', label: 'X-Ray' },
    { value: 'ct-scan', label: 'CT Scan' },
    { value: 'mri', label: 'MRI' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'ecg', label: 'ECG' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'discharge-summary', label: 'Discharge Summary' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'other', label: 'Other' },
  ]

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
                <ClockIcon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Medical Reports</h1>
            </div>
            <Link
              href="/upload"
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Upload Report</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input-field"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="type">Sort by Type</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No reports found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Upload your first medical report to get started.'
              }
            </p>
            <div className="mt-6">
              <Link
                href="/upload"
                className="btn-primary"
              >
                Upload Report
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {report.originalName}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(report.reportType)}`}>
                        {getReportTypeLabel(report.reportType)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(new Date(report.testDate), 'MMM dd, yyyy')}</span>
                      </div>
                      {report.labName && (
                        <span>• {report.labName}</span>
                      )}
                      {report.doctorName && (
                        <span>• {report.doctorName}</span>
                      )}
                    </div>

                    {/* AI Insights Preview */}
                    {report.isProcessed && report.aiInsights && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <SparklesIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">AI Summary</span>
                        </div>
                        <p className="text-sm text-blue-800 line-clamp-2">
                          {report.aiInsights?.summary?.english || 'AI analysis completed'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 ml-4">
                    {report.isProcessed ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <SparklesIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">AI Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">Processing</span>
                      </div>
                    )}
                    
                    <Link
                      href={`/reports/${report._id}`}
                      className="btn-secondary flex items-center space-x-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {safeReports.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{safeReports.length}</div>
                <div className="text-sm text-gray-500">Total Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {safeReports.filter(r => r.isProcessed).length}
                </div>
                <div className="text-sm text-gray-500">AI Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(safeReports.map(r => r.reportType)).size}
                </div>
                <div className="text-sm text-gray-500">Report Types</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
