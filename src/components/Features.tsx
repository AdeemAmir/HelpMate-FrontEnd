'use client'

import { 
  DocumentTextIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  ClockIcon,
  LanguageIcon,
  HeartIcon,
  BellIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Smart Report Upload',
    description: 'Upload PDFs, images, and scanned reports. Our AI can read and understand any medical document.',
    icon: DocumentTextIcon,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    name: 'AI-Powered Analysis',
    description: 'Get instant summaries and insights from your medical reports using advanced AI technology.',
    icon: SparklesIcon,
    color: 'text-success-600',
    bgColor: 'bg-success-100',
  },
  {
    name: 'Bilingual Support',
    description: 'Read summaries in English and Roman Urdu. Perfect for Pakistani families.',
    icon: LanguageIcon,
    color: 'text-warning-600',
    bgColor: 'bg-warning-100',
  },
  {
    name: 'Vitals Tracking',
    description: 'Manually add and track your blood pressure, sugar, weight, and other health metrics.',
    icon: ChartBarIcon,
    color: 'text-danger-600',
    bgColor: 'bg-danger-100',
  },
  {
    name: 'Health Timeline',
    description: 'View your complete health history in one organized timeline.',
    icon: ClockIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Secure Storage',
    description: 'Your health data is encrypted and stored securely. Only you can access your information.',
    icon: ShieldCheckIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    name: 'Health Insights',
    description: 'Get personalized health recommendations and doctor questions based on your reports.',
    icon: HeartIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    name: 'Smart Reminders',
    description: 'Get reminders for follow-up appointments and regular health checkups.',
    icon: BellIcon,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
]

export default function Features() {
  return (
    <div id="features" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for health management
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            HealthMate provides all the tools you need to manage your health records 
            and understand your medical reports with AI assistance.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="card hover:shadow-lg transition-shadow">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Additional benefits */}
        <div className="mt-16 bg-white rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Why choose HealthMate?
              </h3>
              <p className="mt-4 text-lg text-gray-600">
                We understand the challenges of managing health records in Pakistan. 
                That's why we built HealthMate with local needs in mind.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100">
                      <svg className="h-4 w-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <strong>No more lost reports:</strong> All your medical documents in one secure place
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100">
                      <svg className="h-4 w-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <strong>AI that understands:</strong> Get explanations in simple English and Roman Urdu
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100">
                      <svg className="h-4 w-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <strong>Family-friendly:</strong> Perfect for managing health records for the whole family
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100">
                      <svg className="h-4 w-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    <strong>Privacy first:</strong> Your health data is encrypted and never shared
                  </p>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Real user feedback
              </h4>
              <blockquote className="text-gray-700 italic">
                "Finally, I can understand my medical reports! The AI explanations in Roman Urdu 
                are so helpful. My whole family uses HealthMate now."
              </blockquote>
              <div className="mt-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">A.K.</span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">Ayesha Khan</div>
                  <div className="text-sm text-gray-500">Lahore, Pakistan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
