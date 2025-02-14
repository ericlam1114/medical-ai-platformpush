import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroDoctor from '../../public/hero-doctor.svg'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white lg:-mt-20 mt-0">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="text-left">
                <div className="mb-6">
                  <span className="bg-[#0084C7]/10 text-[#0084C7] px-4 py-1.5 rounded-full text-sm font-medium">
                    AI Agents for Healthcare
                  </span>
                </div>
                <h1 className="text-[#0a4a6e] text-5xl sm:text-6xl font-bold mb-6">
                  Smart Physicians Leverage AI
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Use AI agents to compliment your medical workflow. Save time and focus 
                  on what matters most - your patients.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="/signup" 
                    className="bg-[#0084C7] text-white px-6 py-3 rounded-lg hover:bg-[#0084C7]/90 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,132,199,0.3)] hover:-translate-y-0.5 flex items-center justify-center sm:justify-start gap-2 font-medium group"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </a>
                  <a 
                    href="/gallery"
                    className="bg-white text-gray-600 px-6 py-3 rounded-lg border border-gray-200 hover:border-[#0084C7]/20 hover:bg-[#0084C7]/5 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center sm:justify-start gap-2 font-medium"
                  >
                    View Pricing
                  </a>
                </div>
              </div>

              {/* Right side - Image */}
              <div className="hidden md:block">
                <HeroDoctor className="w-full h-[500px]" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
