'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogOut, User, Settings, FileText } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (!session) {
          window.location.href = '/login'
          return
        }

        setUser(session.user)
      } catch (error) {
        console.error('Error checking auth status:', error)
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[#0084C7]">
                AI Medical Agents
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-white text-gray-600 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 sm:px-0 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
          <p className="mt-1 text-gray-600">
            Here's an overview of your AI medical assistance tools.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Start New Session Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#0084C7]/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">New Session</h3>
                <FileText className="w-5 h-5 text-[#0084C7]" />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Start a new consultation with AI assistance for documentation.
              </p>
              <button className="w-full bg-[#0084C7] text-white px-4 py-2 rounded-md hover:bg-[#0084C7]/90 transition-colors">
                Start Session
              </button>
            </div>

            {/* Previous Sessions Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#0084C7]/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Previous Sessions</h3>
                <FileText className="w-5 h-5 text-[#0084C7]" />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                View and manage your previous consultation sessions.
              </p>
              <button className="w-full bg-white text-gray-600 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                View History
              </button>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#0084C7]/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <Settings className="w-5 h-5 text-[#0084C7]" />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Configure your preferences and account settings.
              </p>
              <button className="w-full bg-white text-gray-600 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                Open Settings
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Add your recent activity content here */}
            <div className="p-6 text-center text-gray-500">
              No recent activity to show
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}