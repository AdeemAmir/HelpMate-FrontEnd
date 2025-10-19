'use client'

import { 
  DocumentPlusIcon, 
  SparklesIcon, 
  EyeIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'

const steps = [
  {
    id: 1,
    name: 'Upload Report',
    description: 'Upload your medical reports, prescriptions, or test results. We support PDFs, images, and scanned documents.',
    icon: DocumentPlusIcon,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    id: 2,
    name: 'AI Analysis',
    description: 'Our AI reads and analyzes your reports, extracting key information and medical parameters.',
    icon: SparklesIcon,
    color: 'text-success-600',
    bgColor: 'bg-success-100',
  },
  {
    id: 3,
    name: 'Get Insights',
    description: 'Receive easy-to-understand summaries in English and Roman Urdu with health recommendations.',
    icon: EyeIcon,
    color: 'text-warning-600',
    bgColor: 'bg-warning-100',
  },
  {
    id: 4,
    name: 'Track Progress',
    description: 'Monitor your health trends over time and get personalized insights for better health management.',
    icon: ChartBarIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
]

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How HealthMate Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with HealthMate in just a few simple steps. 
            Your health data is secure and private.
          </p>
        </div>
        
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {steps.map((step, stepIdx) => (
              <div key={step.name} className="relative">
                {stepIdx !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-12 w-full h-0.5 bg-gray-200">
                    <div className="absolute top-0 left-0 w-0 h-0.5 bg-primary-300 transition-all duration-1000 ease-out"></div>
                  </div>
                )}
                
                <div className="relative">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${step.bgColor}`}>
                    <step.icon className={`h-6 w-6 ${step.color}`} aria-hidden="true" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.id}. {step.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Example workflow */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Example: Blood Test Report
          </h3>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">1. Upload</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Upload your blood test PDF</p>
                <p>• Add test date and lab name</p>
                <p>• AI starts processing immediately</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">2. AI Analysis</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Extracts hemoglobin, sugar levels</p>
                <p>• Identifies normal/abnormal values</p>
                <p>• Generates health insights</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">3. Get Summary</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• "Your sugar is slightly high"</p>
                <p>• "Aapka sugar thoda high hai"</p>
                <p>• Doctor questions & recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
