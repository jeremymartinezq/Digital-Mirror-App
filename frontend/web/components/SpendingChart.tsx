'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import recharts to avoid SSR issues
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false })

export default function SpendingChart({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!data || !data.breakdown) {
    return null
  }

  const chartData = data.breakdown.slice(0, 10).map((item: any) => ({
    category: item.category,
    amount: item.total_amount,
    percentage: item.percentage,
  }))

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Monthly Spending</h2>
          <p className="text-gray-400 text-sm mt-1">Breakdown by category</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Spending</p>
          <p className="text-2xl font-bold text-red-400">
            ${data.total_spending?.toLocaleString()}
          </p>
        </div>
      </div>

      {mounted ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="category" 
              stroke="#9ca3af"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
            />
            <Legend />
            <Bar dataKey="amount" fill="#3b82f6" name="Spending" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Income</p>
          <p className="text-lg font-bold text-green-400">
            ${data.total_income?.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Spending</p>
          <p className="text-lg font-bold text-red-400">
            ${data.total_spending?.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Net</p>
          <p className={`text-lg font-bold ${data.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${data.net?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

