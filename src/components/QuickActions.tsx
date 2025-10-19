'use client'

import Link from 'next/link'
import { 
  DocumentPlusIcon, 
  ChartBarIcon, 
  EyeIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline'

export default function QuickActions() {
  const actions = [
    {
      name: 'Upload Report',
      description: 'Upload a new medical report',
      href: '/upload',
      icon: DocumentPlusIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      name: 'Add Vitals',
      description: 'Record your health vitals',
      href: '/vitals/add',
      icon: ChartBarIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      name: 'View Reports',
      description: 'Browse your medical reports',
      href: '/reports',
      icon: EyeIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      name: 'AI Insights',
      description: 'Get AI-powered health insights',
      href: '/insights',
      icon: SparklesIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`flex-shrink-0 rounded-md p-2 ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className={`h-5 w-5 ${action.color}`} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {action.name}
                </h4>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
