'use client'

import Link from 'next/link'
import { ArrowRightIcon, HeartIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Personal{' '}
            <span className="text-primary-600">Health Vault</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Store, manage, and understand your medical reports with AI-powered insights. 
            Get summaries in English and Roman Urdu, track your vitals, and never lose 
            important health information again.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started Free
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="text-base font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="mt-16">
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 sm:p-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                    <HeartIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Upload Reports</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Upload PDFs, images, and scanned reports securely
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                    <SparklesIcon className="h-8 w-8 text-success-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">AI Analysis</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Get AI-powered summaries in English and Roman Urdu
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning-100">
                    <ShieldCheckIcon className="h-8 w-8 text-warning-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Secure Storage</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Your health data is encrypted and private
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16">
          <p className="text-center text-sm text-gray-500">
            Trusted by families across Pakistan
          </p>
          <div className="mt-4 flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">10K+</div>
              <div className="text-sm text-gray-500">Reports Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">5K+</div>
              <div className="text-sm text-gray-500">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
