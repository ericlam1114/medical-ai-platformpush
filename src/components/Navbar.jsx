import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#0084C7] to-[#0099E6] bg-clip-text text-transparent">
              MedAI
            </span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-10">
            <Link 
              href="/agents" 
              className="text-gray-600 hover:text-[#0084C7] transition-colors text-sm font-medium"
            >
              AI Agents
            </Link>
            <Link 
              href="/features" 
              className="text-gray-600 hover:text-[#0084C7] transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-600 hover:text-[#0084C7] transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
          </div>

          {/* Auth Buttons - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/login"
              className="text-gray-600 hover:text-[#0084C7] transition-colors text-sm font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-[#0084C7] text-white px-5 py-2.5 rounded-lg hover:bg-[#0084C7]/90 transition-all shadow-[0_0_0_3px_rgba(0,132,199,0.1)] hover:shadow-[0_0_0_4px_rgba(0,132,199,0.2)] flex items-center gap-2 text-sm font-medium"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-[#0084C7] hover:bg-[#0084C7]/5 transition-colors">
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu - Add state management for toggle */}
      <div className="hidden md:hidden">
        <div className="px-3 pt-3 pb-4 space-y-1.5">
          <Link
            href="/agents"
            className="block px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#0084C7] hover:bg-[#0084C7]/5 transition-colors text-sm font-medium"
          >
            AI Agents
          </Link>
          <Link
            href="/features"
            className="block px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#0084C7] hover:bg-[#0084C7]/5 transition-colors text-sm font-medium"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="block px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#0084C7] hover:bg-[#0084C7]/5 transition-colors text-sm font-medium"
          >
            Pricing
          </Link>
          <div className="px-4 pt-3">
            <div className="border-t border-gray-200/80" />
          </div>
          <Link
            href="/login"
            className="block px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#0084C7] hover:bg-[#0084C7]/5 transition-colors text-sm font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="block mx-4 px-4 py-2.5 rounded-lg bg-[#0084C7] text-white hover:bg-[#0084C7]/90 transition-colors text-sm font-medium text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
} 