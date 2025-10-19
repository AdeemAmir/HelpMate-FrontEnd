'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/providers'
import { Bars3Icon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
  ]

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <HeartIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">HealthMate</span>
            </Link>
          </div>
          
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          
          <div className="ml-6 flex items-center space-x-4">
            {user ? (
              <Link
                href="/dashboard"
                className="btn-primary"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
          
          <div className="ml-6 lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <HeartIcon className="h-8 w-8 text-primary-600" />
                  <span className="text-xl font-bold text-gray-900">HealthMate</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    {user ? (
                      <Link
                        href="/dashboard"
                        className="btn-primary w-full justify-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <div className="space-y-4">
                        <Link
                          href="/login"
                          className="block text-base font-semibold leading-7 text-gray-900 hover:text-gray-700"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          className="btn-primary w-full justify-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Get started
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
