'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (session && mounted) {
          console.log('Existing session found, redirecting to dashboard...')
          window.location.href = '/dashboard'
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    }

    checkSession()
    
    return () => {
      mounted = false
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      console.log('Attempting to sign in with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
  
      if (error) throw error
      
      console.log('Sign in successful:', data)
      router.refresh()
      router.push('/dashboard')
      
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    try {
      setResendLoading(true)
      setError(null)
      console.log('Attempting to resend confirmation to:', email)
      
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log('Resend response:', { data, error })

      if (error) {
        throw error
      }
      
      setResendSuccess(true)
      setError(null)
    } catch (error) {
      console.error('Resend error:', error)
      setError(error.message || 'Failed to resend confirmation email. Please try signing up again.')
      setResendSuccess(false)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
                {(error.includes('Email link is invalid or has expired') || error.includes('Invalid login credentials')) && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendLoading || resendSuccess}
                    className="ml-2 text-[#0084C7] hover:text-[#0084C7]/80 font-medium disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending...' : resendSuccess ? 'Email sent!' : 'Resend confirmation email'}
                  </button>
                )}
              </div>
            )}
            {resendSuccess && !error && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                Confirmation email sent! Please check your inbox and spam folder.
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#0084C7] focus:border-[#0084C7] focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#0084C7] focus:border-[#0084C7] focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0084C7] hover:bg-[#0084C7]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0084C7] disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <Link href="/signup" className="font-medium text-[#0084C7] hover:text-[#0084C7]/80">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
} 