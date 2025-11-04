'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { api } from '@/services/api'
import {
  PlusIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [timeFilter, setTimeFilter] = useState('30')
  const [newTransaction, setNewTransaction] = useState({
    account_id: '',
    amount: 0,
    transaction_type: 'expense',
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [transactionsData, accountsData] = await Promise.all([
        api.getTransactions({ limit: 100 }),
        api.getAccounts(),
      ])
      setTransactions(transactionsData)
      setAccounts(accountsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async () => {
    try {
      await api.createTransaction({
        ...newTransaction,
        account_id: parseInt(newTransaction.account_id),
      })
      setShowAddModal(false)
      setNewTransaction({
        account_id: '',
        amount: 0,
        transaction_type: 'expense',
        category: 'other',
        description: '',
        date: new Date().toISOString().split('T')[0],
      })
      loadData()
    } catch (error) {
      console.error('Failed to add transaction:', error)
      alert('Failed to add transaction')
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'all' && t.transaction_type !== filterType) return false
    if (filterCategory !== 'all' && t.category !== filterCategory) return false
    
    const daysAgo = parseInt(timeFilter)
    const transactionDate = new Date(t.date)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo)
    if (transactionDate < cutoffDate) return false
    
    return true
  })

  const totalIncome = filteredTransactions
    .filter((t) => t.transaction_type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

  const totalExpenses = filteredTransactions
    .filter((t) => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

  const categories = [
    'food', 'transportation', 'utilities', 'entertainment',
    'healthcare', 'shopping', 'housing', 'salary', 'investment', 'other'
  ]

  // Category breakdown
  const categoryBreakdown = categories.map(cat => ({
    category: cat,
    amount: filteredTransactions
      .filter(t => t.category === cat && t.transaction_type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
  })).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount)

  // Monthly comparison
  const thisMonthExpenses = transactions
    .filter(t => {
      const date = new Date(t.date)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && t.transaction_type === 'expense'
    })
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

  const lastMonthExpenses = transactions
    .filter(t => {
      const date = new Date(t.date)
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear() && t.transaction_type === 'expense'
    })
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

  const monthlyChange = lastMonthExpenses > 0 ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0

  // Budget tracking (example budgets)
  const budgets: any = {
    food: 500,
    transportation: 300,
    entertainment: 200,
    shopping: 400,
    utilities: 250,
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
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <p className="text-gray-400 mt-1">Track and analyze your spending patterns</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold">Total Income</h3>
            </div>
            <p className="text-3xl font-bold text-white">${totalIncome.toLocaleString()}</p>
            <p className="text-green-100 text-sm mt-1">Last {timeFilter} days</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold">Total Expenses</h3>
            </div>
            <p className="text-3xl font-bold text-white">${totalExpenses.toLocaleString()}</p>
            <p className="text-red-100 text-sm mt-1">Last {timeFilter} days</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ChartBarIcon className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold">Net Flow</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              ${(totalIncome - totalExpenses).toLocaleString()}
            </p>
            <p className="text-blue-100 text-sm mt-1">
              {totalIncome > totalExpenses ? 'Saving' : 'Overspending'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <CalendarIcon className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold">Avg Daily Spend</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              ${(totalExpenses / parseInt(timeFilter)).toFixed(2)}
            </p>
            <p className={`text-sm mt-1 ${monthlyChange > 0 ? 'text-red-200' : 'text-green-200'}`}>
              {monthlyChange > 0 ? '↑' : '↓'} {Math.abs(monthlyChange).toFixed(1)}% vs last month
            </p>
          </div>
        </div>

        {/* Spending Analysis Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Spending by Category</h2>
            <div className="space-y-4">
              {categoryBreakdown.slice(0, 5).map((item) => {
                const percentage = (item.amount / totalExpenses) * 100
                return (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 capitalize">{item.category}</span>
                      <span className="text-white font-semibold">${item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{percentage.toFixed(1)}% of expenses</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Budget Tracker */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Budget Tracker</h2>
            <div className="space-y-4">
              {Object.entries(budgets).map(([category, budget]: [string, any]) => {
                const spent = filteredTransactions
                  .filter(t => t.category === category && t.transaction_type === 'expense')
                  .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
                const percentage = (spent / budget) * 100
                const isOverBudget = percentage > 100
                
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300 capitalize">{category}</span>
                        {isOverBudget && <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />}
                      </div>
                      <span className="text-gray-400 text-sm">
                        ${spent.toFixed(0)} / ${budget}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          isOverBudget ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${isOverBudget ? 'text-red-400' : 'text-gray-500'}`}>
                      {isOverBudget ? `Over by $${(spent - budget).toFixed(0)}` : `$${(budget - spent).toFixed(0)} remaining`}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Spending Insights */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">💡 Spending Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightBox
              icon="🎯"
              title="Top Category"
              value={categoryBreakdown[0]?.category || 'N/A'}
              subtitle={`$${categoryBreakdown[0]?.amount.toFixed(0) || 0} spent`}
            />
            <InsightBox
              icon="📊"
              title="Avg Transaction"
              value={`$${(totalExpenses / filteredTransactions.filter(t => t.transaction_type === 'expense').length || 0).toFixed(2)}`}
              subtitle={`${filteredTransactions.filter(t => t.transaction_type === 'expense').length} transactions`}
            />
            <InsightBox
              icon="💰"
              title="Savings Rate"
              value={`${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0}%`}
              subtitle={totalIncome > totalExpenses ? 'Great job!' : 'Need improvement'}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 text-sm font-medium">Filters:</span>
            </div>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>

            <div className="flex space-x-2">
              {['all', 'income', 'expense'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg transition capitalize text-sm ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-slate-700 text-gray-300 rounded-lg text-xs capitalize">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {accounts.find(a => a.id === transaction.account_id)?.account_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                      <span className={transaction.transaction_type === 'income' ? 'text-green-400' : 'text-red-400'}>
                        {transaction.transaction_type === 'income' ? '+' : '-'}
                        ${parseFloat(transaction.amount || 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No transactions found for the selected filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Transaction</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account
                </label>
                <select
                  value={newTransaction.account_id}
                  onChange={(e) => setNewTransaction({ ...newTransaction, account_id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.account_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newTransaction.transaction_type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, transaction_type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 capitalize"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Transaction description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
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
                onClick={handleAddTransaction}
                disabled={!newTransaction.account_id}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function InsightBox({ icon, title, value, subtitle }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/70 text-sm">{subtitle}</p>
    </div>
  )
}
