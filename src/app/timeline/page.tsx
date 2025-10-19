'use client'

import { useState, useEffect } from 'react'
import { useAuth, api } from '../providers'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  DocumentTextIcon,
  HeartIcon,
  BeakerIcon,
  ScaleIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface TimelineItem {
  _id: string
  type: 'report' | 'vitals'
  date: string
  title: string
  description: string
  category: string
  data: any
}

export default function TimelinePage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'reports' | 'vitals'>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login')
    return null
  }

  useEffect(() => {
    if (user && token) {
      fetchTimelineData()
    }
  }, [user, token])

  const fetchTimelineData = async () => {
    try {
      setLoading(true)
      
      // Fetch both reports and vitals
      const [reportsResponse, vitalsResponse] = await Promise.all([
        api.get('/files', token),
        api.get('/vitals', token)
      ])

      const reports = reportsResponse.data.map((report: any) => ({
        _id: report._id,
        type: 'report' as const,
        date: report.testDate,
        title: report.originalName,
        description: `${report.reportType} report${report.labName ? ` from ${report.labName}` : ''}`,
        category: report.reportType,
        data: report
      }))

      const vitals = (vitalsResponse.data?.vitals || vitalsResponse.data || []).map((vital: any) => {
        const vitalsList = []
        if (vital.bloodPressure) vitalsList.push(`BP: ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`)
        if (vital.heartRate) vitalsList.push(`HR: ${vital.heartRate.value}`)
        if (vital.bloodSugar?.fasting) vitalsList.push(`Sugar: ${vital.bloodSugar.fasting}`)
        if (vital.weight) vitalsList.push(`Weight: ${vital.weight.value}kg`)
        if (vital.temperature) vitalsList.push(`Temp: ${vital.temperature.value}°F`)
        
        return {
          _id: vital._id,
          type: 'vitals' as const,
          date: vital.date,
          title: 'Health Vitals',
          description: vitalsList.length > 0 ? vitalsList.join(', ') : 'Vitals recorded',
          category: 'vitals',
          data: vital
        }
      })

      // Combine and sort
      const combined = [...reports, ...vitals].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
      })

      setTimelineItems(combined)
    } catch (error) {
      console.error('Failed to fetch timeline data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (timelineItems.length > 0) {
      const sorted = [...timelineItems].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
      })
      setTimelineItems(sorted)
    }
  }, [sortOrder])

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

  const getTypeIcon = (type: string, category: string) => {
    if (type === 'report') {
      return DocumentTextIcon
    } else {
      switch (category.toLowerCase()) {
        case 'blood pressure':
          return HeartIcon
        case 'blood sugar':
          return BeakerIcon
        case 'weight':
          return ScaleIcon
        default:
          return SparklesIcon
      }
    }
  }

  const getTypeColor = (type: string, category: string) => {
    if (type === 'report') {
      return 'bg-blue-100 text-blue-600'
    } else {
      switch (category.toLowerCase()) {
        case 'blood pressure':
          return 'bg-red-100 text-red-600'
        case 'blood sugar':
          return 'bg-yellow-100 text-yellow-600'
        case 'weight':
          return 'bg-green-100 text-green-600'
        case 'temperature':
          return 'bg-purple-100 text-purple-600'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    }
  }

  const getCategoryLabel = (type: string, category: string) => {
    if (type === 'report') {
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
      return labels[category] || 'Report'
    } else {
      return 'Health Vitals'
    }
  }

  const filteredItems = timelineItems.filter(item => {
    if (filterType === 'all') return true
    if (filterType === 'reports') return item.type === 'report'
    if (filterType === 'vitals') return item.type === 'vitals'
    return true
  })

  const groupedItems = filteredItems.reduce((groups, item) => {
    const date = format(new Date(item.date), 'yyyy-MM-dd')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
    return groups
  }, {} as Record<string, TimelineItem[]>)

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
              <h1 className="text-xl font-semibold text-gray-900">Health Timeline</h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="input-field"
              >
                <option value="all">All Items</option>
                <option value="reports">Reports Only</option>
                <option value="vitals">Vitals Only</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="input-field"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No timeline data</h3>
            <p className="mt-2 text-gray-500">
              Upload reports and add vitals to see your health timeline.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <Link href="/upload" className="btn-primary">
                Upload Report
              </Link>
              <Link href="/vitals/add" className="btn-secondary">
                Add Vitals
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems)
              .sort(([a], [b]) => sortOrder === 'newest' ? b.localeCompare(a) : a.localeCompare(b))
              .map(([date, items]) => (
                <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
                    </h2>
                    <span className="text-sm text-gray-500">({items.length} items)</span>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => {
                      const Icon = getTypeIcon(item.type, item.category)
                      const typeColor = getTypeColor(item.type, item.category)
                      const categoryLabel = getCategoryLabel(item.type, item.category)

                      return (
                        <div key={item._id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${typeColor}`}>
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.title}
                              </h3>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {categoryLabel}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{format(new Date(item.date), 'h:mm a')}</span>
                              {item.type === 'report' && item.data.isProcessed && (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <SparklesIcon className="h-3 w-3" />
                                  <span>AI Processed</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            {item.type === 'report' ? (
                              <Link
                                href={`/reports/${item._id}`}
                                className="btn-secondary flex items-center space-x-1"
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span>View</span>
                              </Link>
                            ) : (
                              <Link
                                href="/vitals"
                                className="btn-secondary flex items-center space-x-1"
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span>View Vitals</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{filteredItems.length}</div>
                <div className="text-sm text-gray-500">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredItems.filter(item => item.type === 'report').length}
                </div>
                <div className="text-sm text-gray-500">Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredItems.filter(item => item.type === 'vitals').length}
                </div>
                <div className="text-sm text-gray-500">Vitals Entries</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
