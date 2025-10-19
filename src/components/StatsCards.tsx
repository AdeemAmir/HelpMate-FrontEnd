'use client'

import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  SparklesIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

interface StatsCardsProps {
  statistics: {
    totalFiles: number
    totalVitals: number
    processedFiles: number
    criticalInsights: number
    processingRate: number
  }
}

export default function StatsCards({ statistics }: StatsCardsProps) {
  const stats = [
    {
      name: 'Total Reports',
      value: statistics.totalFiles,
      icon: DocumentTextIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Vitals Entries',
      value: statistics.totalVitals,
      icon: ChartBarIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'AI Processed',
      value: `${statistics.processingRate}%`,
      icon: SparklesIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      name: 'Critical Alerts',
      value: statistics.criticalInsights,
      icon: ExclamationTriangleIcon,
      color: 'text-danger-600',
      bgColor: 'bg-danger-100',
      change: statistics.criticalInsights > 0 ? 'Needs attention' : 'All clear',
      changeType: statistics.criticalInsights > 0 ? 'negative' as const : 'positive' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="card">
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {stat.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
