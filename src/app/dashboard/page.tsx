'use client'

import { useEffect, useState } from 'react'
import { useAuth, api } from '../providers'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/DashboardHeader'
import StatsCards from '@/components/StatsCards'
import RecentFiles from '@/components/RecentFiles'
import RecentVitals from '@/components/RecentVitals'
import HealthInsights from '@/components/HealthInsights'
import QuickActions from '@/components/QuickActions'

interface DashboardData {
  user: any
  recentFiles: any[]
  recentVitals: any[]
  statistics: {
    totalFiles: number
    totalVitals: number
    processedFiles: number
    criticalInsights: number
    processingRate: number
  }
  followUpInsights: any[]
  vitalsTrends: any
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && token) {
      fetchDashboardData()
    }
  }, [user, token, authLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await api.get('/users/dashboard', token)
      setDashboardData(data.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your health data and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        {dashboardData && (
          <StatsCards statistics={dashboardData.statistics} />
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Recent Files */}
          <div className="lg:col-span-2">
            <RecentFiles 
              files={dashboardData?.recentFiles || []} 
              loading={loading}
            />
          </div>

          {/* Recent Vitals */}
          <div>
            <RecentVitals 
              vitals={dashboardData?.recentVitals || []} 
              loading={loading}
            />
          </div>
        </div>

        {/* Health Insights */}
        {dashboardData?.followUpInsights && dashboardData.followUpInsights.length > 0 && (
          <div className="mt-8">
            <HealthInsights insights={dashboardData.followUpInsights} />
          </div>
        )}
      </main>
    </div>
  )
}
