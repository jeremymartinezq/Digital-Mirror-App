'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import DashboardLayout from '@/components/DashboardLayout'
import NetWorthCard from '@/components/NetWorthCard'
import SpendingChart from '@/components/SpendingChart'
import RecentTransactions from '@/components/RecentTransactions'
import { 
  BanknotesIcon, 
  CreditCardIcon, 
  ChartBarIcon,
  SparklesIcon,
  PlusIcon 
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [netWorth, setNetWorth] = useState<any>(null)
  const [spendingData, setSpendingData] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all dashboard data in parallel
      const [netWorthData, monthlySpending, recentTransactions] = await Promise.all([
        api.getNetWorth().catch(() => ({ net_worth: 0, total_assets: 0, total_liabilities: 0 })),
        api.getMonthlySpending().catch(() => ({ total_spending: 0, breakdown: [] })),
        api.getTransactions({ limit: 10 }).catch(() => [])
      ])

      setNetWorth(netWorthData)
      setSpendingData(monthlySpending)
      setTransactions(recentTransactions)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your financial overview.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Net Worth"
            value={`$${netWorth?.net_worth?.toLocaleString() || '0'}`}
            icon={<BanknotesIcon className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total Assets"
            value={`$${netWorth?.total_assets?.toLocaleString() || '0'}`}
            icon={<ChartBarIcon className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Total Liabilities"
            value={`$${netWorth?.total_liabilities?.toLocaleString() || '0'}`}
            icon={<CreditCardIcon className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Net Worth Overview */}
        {netWorth && <NetWorthCard data={netWorth} />}

        {/* Spending Breakdown */}
        {spendingData && <SpendingChart data={spendingData} />}

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions} />

        {/* Financial Goals Progress */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Financial Goals</h2>
          <div className="space-y-4">
            <GoalProgress
              title="Emergency Fund"
              current={8500}
              target={15000}
              color="blue"
            />
            <GoalProgress
              title="Home Down Payment"
              current={12000}
              target={50000}
              color="green"
            />
            <GoalProgress
              title="Retirement Savings"
              current={45000}
              target={100000}
              color="purple"
            />
          </div>
        </div>

        {/* Monthly Cash Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Cash Flow This Month</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div>
                  <p className="text-green-400 text-sm">Income</p>
                  <p className="text-2xl font-bold text-white">$5,240</p>
                </div>
                <div className="text-green-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div>
                  <p className="text-red-400 text-sm">Expenses</p>
                  <p className="text-2xl font-bold text-white">$3,890</p>
                </div>
                <div className="text-red-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-7.414V7a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div>
                  <p className="text-blue-400 text-sm">Net Cash Flow</p>
                  <p className="text-3xl font-bold text-white">+$1,350</p>
                </div>
                <p className="text-blue-400 text-sm">25.7% savings rate</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Financial Health Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(82 / 100) * 552} 552`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-white">82</p>
                    <p className="text-gray-400">Excellent</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <HealthMetric label="Debt Ratio" value="28%" status="good" />
              <HealthMetric label="Savings Rate" value="25%" status="good" />
              <HealthMetric label="Credit Score" value="750" status="excellent" />
              <HealthMetric label="Emergency Fund" value="3mo" status="good" />
            </div>
          </div>
        </div>

        {/* Action Items & Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📋 Action Items</h2>
            <div className="space-y-3">
              <ActionItem
                priority="high"
                title="Review credit card balance"
                description="Your credit utilization is at 28%. Consider paying down to below 30%."
              />
              <ActionItem
                priority="medium"
                title="Increase emergency fund"
                description="Add $500 this month to reach your 6-month goal faster."
              />
              <ActionItem
                priority="low"
                title="Review subscription services"
                description="You have 8 active subscriptions totaling $127/month."
              />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">💡 Smart Insights</h2>
            <div className="space-y-3">
              <InsightItem
                type="positive"
                title="Great job on savings!"
                description="You're saving 25% of your income, above the recommended 20%."
              />
              <InsightItem
                type="warning"
                title="Dining expenses are high"
                description="You've spent $340 on dining this month, up 23% from last month."
              />
              <InsightItem
                type="info"
                title="Investment opportunity"
                description="Consider moving $2,000 from checking to your investment account."
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="New Simulation"
            description="Run what-if scenarios"
            icon={<SparklesIcon className="w-6 h-6" />}
            color="blue"
            onClick={() => router.push('/simulations')}
          />
          <QuickActionCard
            title="Add Transaction"
            description="Log income or expense"
            icon={<PlusIcon className="w-6 h-6" />}
            color="green"
            onClick={() => router.push('/transactions')}
          />
          <QuickActionCard
            title="Calculate Taxes"
            description="Quarterly tax estimator"
            icon={<ChartBarIcon className="w-6 h-6" />}
            color="purple"
            onClick={() => router.push('/tax-calculator')}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function GoalProgress({ title, current, target, color }: any) {
  const percentage = (current / target) * 100
  const colorClasses: any = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium">{title}</span>
        <span className="text-gray-400 text-sm">
          ${current.toLocaleString()} / ${target.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-gray-500 text-xs mt-1">{percentage.toFixed(1)}% complete</p>
    </div>
  )
}

function HealthMetric({ label, value, status }: any) {
  const statusColors: any = {
    excellent: 'text-green-400',
    good: 'text-blue-400',
    warning: 'text-yellow-400',
    poor: 'text-red-400',
  }

  return (
    <div className="bg-slate-900/50 rounded-lg p-3">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-lg font-bold ${statusColors[status]}`}>{value}</p>
    </div>
  )
}

function ActionItem({ priority, title, description }: any) {
  const priorityColors: any = {
    high: 'border-red-500/30 bg-red-500/10',
    medium: 'border-yellow-500/30 bg-yellow-500/10',
    low: 'border-blue-500/30 bg-blue-500/10',
  }

  const priorityDots: any = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  }

  return (
    <div className={`border ${priorityColors[priority]} rounded-lg p-4`}>
      <div className="flex items-start space-x-3">
        <div className={`w-2 h-2 ${priorityDots[priority]} rounded-full mt-2`} />
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{title}</h4>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}

function InsightItem({ type, title, description }: any) {
  const typeIcons: any = {
    positive: '✓',
    warning: '⚠',
    info: 'ℹ',
  }

  const typeColors: any = {
    positive: 'text-green-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  }

  return (
    <div className="flex items-start space-x-3 p-3 bg-slate-900/50 rounded-lg">
      <span className={`text-xl ${typeColors[type]}`}>{typeIcons[type]}</span>
      <div>
        <h4 className="text-white font-semibold mb-1">{title}</h4>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  )
}

function QuickActionCard({ title, description, icon, color, onClick }: any) {
  const colorClasses: any = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
  }

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-left transition transform hover:scale-105`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </button>
  )
}

