'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']

export default function NetWorthCard({ data }: { data: any }) {
  if (!data || !data.accounts_breakdown) {
    return null
  }

  const assetData = data.accounts_breakdown
    .filter((acc: any) => acc.category === 'asset')
    .map((acc: any) => ({
      name: acc.name,
      value: acc.balance,
    }))

  const liabilityData = data.accounts_breakdown
    .filter((acc: any) => acc.category === 'liability')
    .map((acc: any) => ({
      name: acc.name,
      value: Math.abs(acc.balance),
    }))

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Net Worth Overview</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Assets */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">Assets</h3>
          {assetData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `$${entry.value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">No asset accounts linked</p>
          )}
        </div>

        {/* Liabilities */}
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-4">Liabilities</h3>
          {liabilityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={liabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `$${entry.value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {liabilityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">No liability accounts</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Assets</p>
          <p className="text-xl font-bold text-green-400">
            ${data.total_assets?.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Liabilities</p>
          <p className="text-xl font-bold text-red-400">
            ${data.total_liabilities?.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Net Worth</p>
          <p className="text-xl font-bold text-blue-400">
            ${data.net_worth?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

