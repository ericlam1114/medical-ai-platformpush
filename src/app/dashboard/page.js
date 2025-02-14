// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Settings, FileText, Mic } from "lucide-react";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        setLoading(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (!session) {
        router.refresh()
        router.push('/login')
      }
    })

    checkUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav user={user} />

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
              {/* AI Scribe Card */}
              <Link href="/dashboard/scribe" className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#0084C7]/20 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Medical Scribe
                  </h3>
                  <Mic className="w-5 h-5 text-[#0084C7] group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Start a new consultation with AI-powered SOAP note generation.
                </p>
                <div className="w-full bg-[#0084C7] text-white px-4 py-2 rounded-md hover:bg-[#0084C7]/90 transition-colors text-center">
                  Start AI Scribe
                </div>
              </Link>

              {/* Previous Sessions Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#0084C7]/20 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Previous Sessions
                  </h3>
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    Settings
                  </h3>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 text-center text-gray-500">
                No recent activity to show
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}