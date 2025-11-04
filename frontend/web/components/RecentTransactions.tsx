'use client'

import { format } from 'date-fns'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

export default function RecentTransactions({ transactions }: { transactions: any[] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
        <p className="text-gray-400 text-center py-10">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.amount > 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {transaction.amount > 0 ? (
                  <ArrowTrendingUpIcon className="w-5 h-5" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-white font-medium">{transaction.description}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-sm text-gray-400">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                    {transaction.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-lg font-bold ${
                  transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
              </p>
              {transaction.pending && (
                <span className="text-xs text-yellow-400">Pending</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

