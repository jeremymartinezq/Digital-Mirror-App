'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { api } from '@/services/api'
import {
  BanknotesIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'

export default function AccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAccount, setNewAccount] = useState({
    account_name: '',
    account_type: 'checking',
    balance: 0,
    institution: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    loadAccounts()
  }, [router])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const data = await api.getAccounts()
      setAccounts(data)
    } catch (error) {
      console.error('Failed to load accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAccount = async () => {
    try {
      await api.createAccount(newAccount)
      setShowAddModal(false)
      setNewAccount({
        account_name: '',
        account_type: 'checking',
        balance: 0,
        institution: '',
      })
      loadAccounts()
    } catch (error) {
      console.error('Failed to add account:', error)
      alert('Failed to add account')
    }
  }

  const handleDeleteAccount = async (accountId: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return
    
    try {
      await api.deleteAccount(accountId)
      loadAccounts()
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Failed to delete account')
    }
  }

  const accountTypeColors: any = {
    checking: 'bg-blue-500',
    savings: 'bg-green-500',
    credit_card: 'bg-red-500',
    investment: 'bg-purple-500',
    loan: 'bg-orange-500',
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Accounts</h1>
            <p className="text-gray-400 mt-1">Manage your financial accounts</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Account</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Assets"
            value={accounts
              .filter(a => ['checking', 'savings', 'investment'].includes(a.account_type))
              .reduce((sum, a) => sum + parseFloat(a.balance || 0), 0)}
            color="green"
            trend="+5.2%"
          />
          <SummaryCard
            title="Total Liabilities"
            value={accounts
              .filter(a => ['credit_card', 'loan'].includes(a.account_type))
              .reduce((sum, a) => sum + parseFloat(a.balance || 0), 0)}
            color="red"
            trend="-2.1%"
          />
          <SummaryCard
            title="Net Worth"
            value={accounts
              .filter(a => ['checking', 'savings', 'investment'].includes(a.account_type))
              .reduce((sum, a) => sum + parseFloat(a.balance || 0), 0) -
              accounts
              .filter(a => ['credit_card', 'loan'].includes(a.account_type))
              .reduce((sum, a) => sum + parseFloat(a.balance || 0), 0)}
            color="blue"
            trend="+8.3%"
          />
          <SummaryCard
            title="Total Accounts"
            value={accounts.length}
            color="purple"
            isCount
          />
        </div>

        {/* Account Allocation Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Account Allocation</h2>
            <div className="space-y-4">
              {['checking', 'savings', 'investment', 'credit_card', 'loan'].map((type) => {
                const typeAccounts = accounts.filter(a => a.account_type === type)
                const total = typeAccounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0)
                const totalAll = accounts.reduce((sum, a) => sum + Math.abs(parseFloat(a.balance || 0)), 0)
                const percentage = totalAll > 0 ? (Math.abs(total) / totalAll) * 100 : 0
                
                if (typeAccounts.length === 0) return null
                
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                      <span className="text-white font-semibold">${Math.abs(total).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          type === 'checking' ? 'bg-blue-500' :
                          type === 'savings' ? 'bg-green-500' :
                          type === 'investment' ? 'bg-purple-500' :
                          type === 'credit_card' ? 'bg-red-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{percentage.toFixed(1)}% of total</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Financial Health Score */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Financial Health Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(85 / 100) * 440} 440`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white">85</p>
                    <p className="text-white/80 text-sm">Excellent</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <ScoreItem label="Debt-to-Income Ratio" value="Good" icon="✓" />
              <ScoreItem label="Emergency Fund" value="3 months" icon="✓" />
              <ScoreItem label="Investment Diversification" value="Moderate" icon="⚠" />
              <ScoreItem label="Credit Utilization" value="22%" icon="✓" />
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">💡 Insights & Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightCard
              type="success"
              title="Great savings rate!"
              description="Your savings account has grown by 5.2% this month. Keep it up!"
            />
            <InsightCard
              type="warning"
              title="Consider consolidating"
              description="You have 3 checking accounts. Consolidating could earn you higher interest."
            />
            <InsightCard
              type="info"
              title="Investment opportunity"
              description="With $5,000 in checking, consider moving some to a high-yield savings or investment account."
            />
            <InsightCard
              type="success"
              title="Low credit utilization"
              description="Your credit card usage is at 22%. Maintaining below 30% is excellent for your credit score."
            />
          </div>
        </div>

        {/* Accounts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${accountTypeColors[account.account_type] || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                    <BanknotesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{account.account_name}</h3>
                    <p className="text-gray-400 text-sm capitalize">{account.account_type.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-gray-400 text-sm mb-1">Balance</p>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(account.balance || 0).toLocaleString()}
                </p>
                {account.institution && (
                  <p className="text-gray-500 text-sm mt-2">{account.institution}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
            <BanknotesIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No accounts yet</h3>
            <p className="text-gray-400 mb-6">Get started by adding your first account</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Add Your First Account
            </button>
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={newAccount.account_name}
                  onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="My Checking Account"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Type
                </label>
                <select
                  value={newAccount.account_type}
                  onChange={(e) => setNewAccount({ ...newAccount, account_type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="investment">Investment</option>
                  <option value="loan">Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Balance
                </label>
                <input
                  type="number"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Institution (Optional)
                </label>
                <input
                  type="text"
                  value={newAccount.institution}
                  onChange={(e) => setNewAccount({ ...newAccount, institution: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Bank of America"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function SummaryCard({ title, value, color, isCount = false, trend }: any) {
  const colorClasses: any = {
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {trend && (
          <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} text-transparent bg-clip-text`}>
        {isCount ? value : `$${value.toLocaleString()}`}
      </p>
    </div>
  )
}

function ScoreItem({ label, value, icon }: any) {
  return (
    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3">
      <span className="text-white/90 text-sm">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-white font-semibold text-sm">{value}</span>
        <span className="text-lg">{icon}</span>
      </div>
    </div>
  )
}

function InsightCard({ type, title, description }: any) {
  const colors: any = {
    success: 'border-green-500/30 bg-green-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
  }

  const icons: any = {
    success: '✓',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div className={`border ${colors[type]} rounded-lg p-4`}>
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{icons[type]}</span>
        <div>
          <h4 className="text-white font-semibold mb-1">{title}</h4>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}

