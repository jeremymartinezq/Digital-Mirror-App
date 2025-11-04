'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChartBarIcon, CurrencyDollarIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Digital Mirror</span>
          </div>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="text-white hover:text-blue-300 transition"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            See Your Financial Future
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Before You Decide
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-powered financial simulations help you visualize the impact of life decisions.
            Make informed choices about purchases, loans, career changes, and investments.
          </p>
          <Link 
            href="/register" 
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105"
          >
            Start Simulating Free
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<ChartBarIcon className="w-8 h-8" />}
            title="Smart Dashboards"
            description="Track spending, net worth, and budgets with beautiful visualizations"
          />
          <FeatureCard
            icon={<SparklesIcon className="w-8 h-8" />}
            title="AI Simulations"
            description="Run what-if scenarios powered by machine learning predictions"
          />
          <FeatureCard
            icon={<CurrencyDollarIcon className="w-8 h-8" />}
            title="Bank Integration"
            description="Securely connect accounts via Plaid for automatic tracking"
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="w-8 h-8" />}
            title="Bank-Level Security"
            description="End-to-end encryption and compliance with industry standards"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to See Your Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands making smarter financial decisions every day
          </p>
          <Link 
            href="/register" 
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 Digital Mirror. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

