'use client'

import { useState, useEffect } from 'react'
import { useAuth, api } from '../providers'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  PlusIcon,
  HeartIcon,
  BeakerIcon,
  ScaleIcon,
  FireIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface VitalsEntry {
  _id: string
  date: string
  bloodPressure?: {
    systolic: number
    diastolic: number
    unit: string
  }
  heartRate?: {
    value: number
    unit: string
  }
  bloodSugar?: {
    fasting?: number
    postPrandial?: number
    random?: number
    unit: string
  }
  weight?: {
    value: number
    unit: string
  }
  height?: {
    value: number
    unit: string
  }
  temperature?: {
    value: number
    unit: string
  }
  oxygenSaturation?: {
    value: number
    unit: string
  }
  notes?: string
  alerts?: string[]
  bmi?: number
  bmiCategory?: string
  createdAt: string
}

export default function VitalsPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [vitals, setVitals] = useState<VitalsEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPeriod, setFilterPeriod] = useState('30')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login')
    return null
  }

  useEffect(() => {
    if (user && token) {
      fetchVitals()
    }
  }, [user, token])

  const fetchVitals = async () => {
    try {
      setLoading(true)
      const response = await api.get('/vitals', token || undefined)
      console.log('Vitals API Response:', response) // Debug log
      
      if (response.success && response.data && response.data.vitals && Array.isArray(response.data.vitals)) {
        setVitals(response.data.vitals)
      } else if (response.success && response.data && Array.isArray(response.data)) {
        setVitals(response.data)
      } else if (Array.isArray(response.data)) {
        setVitals(response.data)
      } else {
        console.warn('Unexpected vitals API response structure:', response)
        setVitals([])
      }
    } catch (error) {
      console.error('Failed to fetch vitals:', error)
      setVitals([])
    } finally {
      setLoading(false)
    }
  }

  const deleteVitals = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vitals entry?')) {
      return
    }

    try {
      await api.delete(`/vitals/${id}`, token || undefined)
      setVitals(vitals.filter(v => v._id !== id))
    } catch (error) {
      console.error('Failed to delete vitals:', error)
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

  const getBMIColor = (category?: string) => {
    switch (category) {
      case 'underweight':
        return 'text-blue-600'
      case 'normal':
        return 'text-green-600'
      case 'overweight':
        return 'text-yellow-600'
      case 'obese':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getAlertColor = (alerts: string[]) => {
    if (alerts.length === 0) return 'border-gray-200'
    return 'border-red-200 bg-red-50'
  }

  const safeVitals = Array.isArray(vitals) ? vitals : []
  const sortedVitals = [...safeVitals].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  const filteredVitals = sortedVitals.filter(vital => {
    const vitalDate = new Date(vital.date)
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(filterPeriod))
    return vitalDate >= daysAgo
  })

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
              <h1 className="text-xl font-semibold text-gray-900">Health Vitals</h1>
            </div>
            <Link href="/vitals/add" className="btn-primary flex items-center space-x-2">
              <PlusIcon className="h-4 w-4" />
              <span>Add Vitals</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="input-field"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
                <option value="all">All time</option>
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

        {filteredVitals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No vitals recorded</h3>
            <p className="mt-2 text-gray-500">
              Start tracking your health vitals to monitor your wellness over time.
            </p>
            <div className="mt-6">
              <Link href="/vitals/add" className="btn-primary">
                Add First Vitals Entry
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredVitals.map((vital) => (
              <div key={vital._id} className={`bg-white rounded-lg shadow-sm border p-6 ${getAlertColor(vital.alerts || [])}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {format(new Date(vital.date), 'EEEE, MMMM dd, yyyy')}
                      </h3>
                      {vital.alerts && vital.alerts.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {vital.alerts.length} Alert{vital.alerts.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {/* Blood Pressure */}
                      {vital.bloodPressure && (
                        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                          <HeartIcon className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Blood Pressure</p>
                            <p className="text-lg font-semibold text-red-600">
                              {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic} {vital.bloodPressure.unit}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Heart Rate */}
                      {vital.heartRate && (
                        <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                          <HeartIcon className="h-5 w-5 text-pink-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Heart Rate</p>
                            <p className="text-lg font-semibold text-pink-600">
                              {vital.heartRate.value} {vital.heartRate.unit}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Blood Sugar */}
                      {vital.bloodSugar && (vital.bloodSugar.fasting || vital.bloodSugar.postPrandial || vital.bloodSugar.random) && (
                        <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <BeakerIcon className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Blood Sugar</p>
                            <div className="text-sm font-semibold text-yellow-600">
                              {vital.bloodSugar.fasting && (
                                <p>Fasting: {vital.bloodSugar.fasting} {vital.bloodSugar.unit}</p>
                              )}
                              {vital.bloodSugar.postPrandial && (
                                <p>Post-meal: {vital.bloodSugar.postPrandial} {vital.bloodSugar.unit}</p>
                              )}
                              {vital.bloodSugar.random && (
                                <p>Random: {vital.bloodSugar.random} {vital.bloodSugar.unit}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Weight */}
                      {vital.weight && (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <ScaleIcon className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Weight</p>
                            <p className="text-lg font-semibold text-green-600">
                              {vital.weight.value} {vital.weight.unit}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Temperature */}
                      {vital.temperature && (
                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <FireIcon className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Temperature</p>
                            <p className="text-lg font-semibold text-purple-600">
                              {vital.temperature.value} {vital.temperature.unit}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* BMI */}
                      {vital.bmi && (
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <ScaleIcon className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">BMI</p>
                            <p className={`text-lg font-semibold ${getBMIColor(vital.bmiCategory)}`}>
                              {vital.bmi} ({vital.bmiCategory})
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {vital.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600">{vital.notes}</p>
                      </div>
                    )}

                    {/* Alerts */}
                    {vital.alerts && vital.alerts.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-red-900 mb-2">Alerts:</h4>
                        <ul className="space-y-1">
                          {vital.alerts.map((alert, index) => (
                            <li key={index} className="text-sm text-red-700 flex items-center space-x-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span>{alert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                    <button
                      onClick={() => deleteVitals(vital._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete vitals entry"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredVitals.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vitals Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{filteredVitals.length}</div>
                <div className="text-sm text-gray-500">Total Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredVitals.filter(v => v.alerts && v.alerts.length > 0).length}
                </div>
                <div className="text-sm text-gray-500">With Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredVitals.filter(v => v.bloodPressure).length}
                </div>
                <div className="text-sm text-gray-500">BP Readings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredVitals.filter(v => v.weight).length}
                </div>
                <div className="text-sm text-gray-500">Weight Entries</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
