'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { 
  ChartBarIcon, 
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

interface RecentVitalsProps {
  vitals: any[]
  loading: boolean
}

export default function RecentVitals({ vitals, loading }: RecentVitalsProps) {
  const getVitalStatus = (vital: any) => {
    const alerts = []
    
    if (vital.bloodPressure) {
      if (vital.bloodPressure.systolic > 140 || vital.bloodPressure.diastolic > 90) {
        alerts.push('High BP')
      }
      if (vital.bloodPressure.systolic < 90 || vital.bloodPressure.diastolic < 60) {
        alerts.push('Low BP')
      }
    }
    
    if (vital.bloodSugar?.fasting > 126) {
      alerts.push('High Sugar')
    }
    
    if (vital.heartRate && (vital.heartRate.value > 100 || vital.heartRate.value < 60)) {
      alerts.push('Abnormal HR')
    }
    
    return alerts.length > 0 ? 'warning' : 'normal'
  }

  const formatVitalValue = (vital: any) => {
    const values = []
    
    if (vital.bloodPressure) {
      values.push(`BP: ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`)
    }
    
    if (vital.bloodSugar?.fasting) {
      values.push(`Sugar: ${vital.bloodSugar.fasting}`)
    }
    
    if (vital.heartRate) {
      values.push(`HR: ${vital.heartRate.value}`)
    }
    
    if (vital.weight) {
      values.push(`Weight: ${vital.weight.value}kg`)
    }
    
    return values.slice(0, 2).join(' • ')
  }

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Vitals</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Vitals</h3>
        <Link
          href="/vitals"
          className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
        >
          View all
        </Link>
      </div>
      
      {vitals.length === 0 ? (
        <div className="text-center py-8">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vitals recorded</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start tracking your health vitals.
          </p>
          <div className="mt-6">
            <Link
              href="/vitals/add"
              className="btn-primary"
            >
              Add Vitals
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {vitals.map((vital) => {
            const status = getVitalStatus(vital)
            const vitalValue = formatVitalValue(vital)
            
            return (
              <div key={vital._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200">
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    status === 'warning' ? 'bg-warning-100' : 'bg-success-100'
                  }`}>
                    {status === 'warning' ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
                    ) : (
                      <CheckCircleIcon className="h-5 w-5 text-success-600" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {format(new Date(vital.date), 'MMM dd, yyyy')}
                    </h4>
                    {status === 'warning' && (
                      <span className="badge-warning text-xs">Alerts</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 truncate">
                    {vitalValue}
                  </p>
                  
                  {vital.notes && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {vital.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/vitals/${vital._id}`}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <HeartIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
