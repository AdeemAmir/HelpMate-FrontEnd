'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/providers'
import { 
  Bars3Icon, 
  XMarkIcon, 
  HeartIcon, 
  BellIcon, 
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface DashboardHeaderProps {
  user: any
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const { logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: true },
    { name: 'Reports', href: '/reports', current: false },
    { name: 'Vitals', href: '/vitals', current: false },
    { name: 'Timeline', href: '/timeline', current: false },
    { name: 'Insights', href: '/insights', current: false },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <HeartIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">HealthMate</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    item.current
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <BellIcon className="h-6 w-6" />
              {/* <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
              </span> */}
            </button>

            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-primary-600" />
                </div>
                <span className="hidden md:block text-gray-700 font-medium">
                  {user.name}
                </span>
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <UserCircleIcon className="mr-3 h-4 w-4" />
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <Cog6ToothIcon className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Mobile menu button */}
            <div className="md:hidden">
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
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center space-x-2">
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
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                        item.current
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/profile"
                      className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
