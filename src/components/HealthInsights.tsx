'use client'

import Link from 'next/link'
import { 
  ExclamationTriangleIcon, 
  SparklesIcon,
  ClockIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

interface HealthInsightsProps {
  insights: any[]
}

export default function HealthInsights({ insights }: HealthInsightsProps) {
  if (insights.length === 0) {
    return null
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Health Insights</h3>
        <Link
          href="/insights"
          className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
        >
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight._id} className="border border-warning-200 rounded-lg p-4 bg-warning-50">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Follow-up Required
                  </h4>
                  <span className="badge-warning text-xs">
                    {insight.file?.reportType?.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {insight.summary?.english || 'AI analysis suggests follow-up is needed.'}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>Follow-up in {insight.followUpTimeframe}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SparklesIcon className="h-4 w-4" />
                    <span>{insight.confidence}% confidence</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link
                  href={`/insights/${insight._id}`}
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  View details
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
