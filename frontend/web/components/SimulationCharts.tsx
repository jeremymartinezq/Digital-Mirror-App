'use client'

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ScenarioChartProps {
  data: any[]
  scenarios?: {
    pessimistic?: number
    expected?: number
    optimistic?: number
  }
  title?: string
}

export function ScenarioChart({ data, scenarios, title }: ScenarioChartProps) {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorContributed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
          />
          <YAxis 
            stroke="#9ca3af"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorBalance)"
            name="Portfolio Value"
          />
          <Area 
            type="monotone" 
            dataKey="contributed" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorContributed)"
            name="Total Contributed"
          />
        </AreaChart>
      </ResponsiveContainer>

      {scenarios && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Pessimistic (5th %ile)</p>
            <p className="text-xl font-bold text-red-400">
              ${scenarios.pessimistic?.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Expected (Median)</p>
            <p className="text-xl font-bold text-blue-400">
              ${scenarios.expected?.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Optimistic (95th %ile)</p>
            <p className="text-xl font-bold text-green-400">
              ${scenarios.optimistic?.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface ProbabilityDistributionProps {
  mean: number
  median: number
  percentile5: number
  percentile95: number
  confidenceInterval: [number, number]
}

export function ProbabilityDistribution({ 
  mean, 
  median, 
  percentile5, 
  percentile95,
  confidenceInterval 
}: ProbabilityDistributionProps) {
  // Generate normal distribution data for visualization
  const generateDistribution = () => {
    const data = []
    const std = (percentile95 - percentile5) / 3.29  // Approximate std from percentiles
    const points = 50
    
    for (let i = 0; i < points; i++) {
      const x = percentile5 + (percentile95 - percentile5) * (i / points)
      // Simplified normal distribution
      const z = (x - mean) / std
      const y = Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI))
      data.push({
        value: Math.round(x),
        probability: y * 100000  // Scale for visibility
      })
    }
    return data
  }

  const distributionData = generateDistribution()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Probability Distribution</h3>
      <p className="text-sm text-gray-400">
        This shows the range of possible outcomes based on historical market volatility
      </p>
      
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={distributionData}>
          <defs>
            <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="value" 
            stroke="#9ca3af"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            stroke="#9ca3af"
            label={{ value: 'Likelihood', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            formatter={(value: any, name: string) => {
              if (name === 'probability') return ['', '']
              return [`$${value.toLocaleString()}`, '']
            }}
            labelFormatter={(value) => `Value: $${value.toLocaleString()}`}
          />
          <Area 
            type="monotone" 
            dataKey="probability" 
            stroke="#8b5cf6" 
            fillOpacity={1} 
            fill="url(#colorProb)"
            name="Probability"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">5th Percentile</p>
          <p className="text-sm font-semibold text-white">${percentile5.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Median</p>
          <p className="text-sm font-semibold text-blue-400">${median.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Mean</p>
          <p className="text-sm font-semibold text-white">${mean.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">95th Percentile</p>
          <p className="text-sm font-semibold text-white">${percentile95.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
        <p className="text-sm text-gray-300 mb-2">
          <span className="font-semibold text-purple-400">95% Confidence Interval:</span>
        </p>
        <p className="text-lg font-bold text-white">
          ${confidenceInterval[0].toLocaleString()} - ${confidenceInterval[1].toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          There's a 95% probability your final value will fall within this range
        </p>
      </div>
    </div>
  )
}

interface AmortizationChartProps {
  data: any[]
  title?: string
}

export function AmortizationChart({ data, title }: AmortizationChartProps) {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
          />
          <YAxis 
            stroke="#9ca3af"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="principal_payment" 
            stackId="1"
            stroke="#10b981" 
            fill="url(#colorPrincipal)"
            name="Principal Payment"
          />
          <Area 
            type="monotone" 
            dataKey="interest_payment" 
            stackId="1"
            stroke="#ef4444" 
            fill="url(#colorInterest)"
            name="Interest Payment"
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Remaining Balance"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

interface RiskMetricsProps {
  sharpeRatio: number
  volatility: number
  maxDrawdown?: number
  beta?: number
}

export function RiskMetrics({ sharpeRatio, volatility, maxDrawdown, beta }: RiskMetricsProps) {
  const getRiskRating = (sharpe: number) => {
    if (sharpe > 1.5) return { text: 'Excellent', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/50' }
    if (sharpe > 1.0) return { text: 'Very Good', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700/50' }
    if (sharpe > 0.5) return { text: 'Good', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50' }
    return { text: 'Fair', color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-700/50' }
  }

  const rating = getRiskRating(sharpeRatio)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Risk Analysis</h3>
      
      <div className={`p-4 ${rating.bg} border ${rating.border} rounded-lg`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-300">Risk-Adjusted Return Rating</p>
          <span className={`text-lg font-bold ${rating.color}`}>{rating.text}</span>
        </div>
        <p className="text-xs text-gray-400">
          Based on Sharpe Ratio: {sharpeRatio.toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Sharpe Ratio</p>
          <p className="text-2xl font-bold text-white">{sharpeRatio.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {sharpeRatio > 1 ? 'Excellent returns per unit of risk' : 
             sharpeRatio > 0.5 ? 'Good risk-adjusted returns' : 
             'Consider diversification'}
          </p>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Volatility</p>
          <p className="text-2xl font-bold text-white">{(volatility * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">
            {volatility > 0.20 ? 'High volatility - expect swings' : 
             volatility > 0.10 ? 'Moderate volatility' : 
             'Low volatility - stable returns'}
          </p>
        </div>

        {maxDrawdown !== undefined && (
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Max Drawdown</p>
            <p className="text-2xl font-bold text-red-400">{(maxDrawdown * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">Largest historical decline</p>
          </div>
        )}

        {beta !== undefined && (
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Beta</p>
            <p className="text-2xl font-bold text-white">{beta.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {beta > 1 ? 'More volatile than market' : 
               beta < 1 ? 'Less volatile than market' : 
               'Moves with market'}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-blue-900/10 border border-blue-700/30 rounded-lg">
        <p className="text-sm text-gray-300 mb-2">💡 <span className="font-semibold">Understanding Risk Metrics</span></p>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <span className="text-white">Sharpe Ratio:</span> Higher is better. Measures return per unit of risk.</li>
          <li>• <span className="text-white">Volatility:</span> Standard deviation of returns. Higher = more unpredictable.</li>
          <li>• <span className="text-white">Max Drawdown:</span> Worst peak-to-trough decline. Prepare for this psychologically.</li>
        </ul>
      </div>
    </div>
  )
}

