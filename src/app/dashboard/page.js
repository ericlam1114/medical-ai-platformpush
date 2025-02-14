// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mic, FileText, Clock, Settings, Search } from "lucide-react";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import Footer from "@/components/Footer";

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-lg text-gray-600">Loading...</div>
    </div>
  );

  if (!user) return null;

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav user={user} />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Quick Actions */}
          <div className="px-4 sm:px-0 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start New Visit */}
              <Link href="/dashboard/scribe" 
                className="bg-white rounded-xl border-2 border-[#0084C7] p-8 hover:shadow-lg transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0084C7]/5 rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#0084C7]/10 rounded-lg">
                      <Mic className="w-6 h-6 text-[#0084C7]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Start New Visit
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Begin a new patient consultation with voice-to-text SOAP notes
                  </p>
                  <div className="inline-flex items-center text-[#0084C7] font-medium">
                    Start Visit →
                  </div>
                </div>
              </Link>

              {/* Quick Search */}
              <Link href="/dashboard/search" 
                className="bg-white rounded-xl border border-gray-200 p-8 hover:border-[#0084C7]/20 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#0084C7]/10">
                    <Search className="w-6 h-6 text-gray-600 group-hover:text-[#0084C7]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Quick Search
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Search clinical guidelines, medications, or analyze lab results
                </p>
                <div className="inline-flex items-center text-gray-600 group-hover:text-[#0084C7] font-medium">
                  Search Now →
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Visits */}
          <div className="px-4 sm:px-0 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Visits</h2>
              <Link href="/dashboard/history" className="text-sm text-[#0084C7] hover:text-[#0084C7]/80">
                View all →
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
              <div className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">John Doe</h3>
                    <p className="text-sm text-gray-500">Follow-up consultation</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline-block mr-1" />
                      Today, 2:30 PM
                    </span>
                    <FileText className="w-4 h-4 text-[#0084C7]" />
                  </div>
                </div>
              </div>
              {/* Add more visit items here */}
            </div>
          </div>

          {/* Quick Tools */}
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/diagnosis" 
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#0084C7]/20 hover:shadow-sm transition-all text-center">
                <h3 className="text-sm font-medium text-gray-900">Differential Diagnosis</h3>
              </Link>
              <Link href="/dashboard/lab-analysis" 
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#0084C7]/20 hover:shadow-sm transition-all text-center">
                <h3 className="text-sm font-medium text-gray-900">Lab Analysis</h3>
              </Link>
              <Link href="/dashboard/medications" 
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#0084C7]/20 hover:shadow-sm transition-all text-center">
                <h3 className="text-sm font-medium text-gray-900">Medication Reference</h3>
              </Link>
              <Link href="/dashboard/clinical-support" 
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#0084C7]/20 hover:shadow-sm transition-all text-center">
                <h3 className="text-sm font-medium text-gray-900">Clinical Guidelines</h3>
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}