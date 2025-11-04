'use client'

import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import DashboardLayout from '@/components/DashboardLayout'
import { SparklesIcon, PlusIcon } from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function Simulations() {
  const [simulations, setSimulations] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [showNewSimulation, setShowNewSimulation] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [simulationParams, setSimulationParams] = useState<any>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Always set demo templates first for immediate display
    const demoTemplates = [
      {
        type: 'savings_goal',
        name: 'Savings Goal',
        description: 'Calculate how long it will take to reach your savings goal'
      },
      {
        type: 'retirement',
        name: 'Retirement Planning',
        description: 'Project your retirement savings and income needs'
      },
      {
        type: 'debt_payoff',
        name: 'Debt Payoff',
        description: 'Compare strategies to pay off your debts faster'
      },
      {
        type: 'investment_growth',
        name: 'Investment Growth',
        description: 'Simulate long-term investment returns with regular contributions'
      },
      {
        type: 'emergency_fund',
        name: 'Emergency Fund',
        description: 'Calculate how much you need for 3-6 months of expenses'
      },
      {
        type: 'home_affordability',
        name: 'Home Affordability',
        description: 'Determine how much house you can afford'
      }
    ]
    
    const demoSimulations = [
      {
        id: 1,
        name: 'Save for House Down Payment',
        simulation_type: 'savings_goal',
        created_at: '2025-10-04T00:00:00Z',
        results: {
          summary: {
            goal_amount: 50000,
            monthly_savings: 800,
            months_to_goal: 63,
            total_interest: 2340
          }
        }
      },
      {
        id: 2,
        name: 'Retirement Plan - Age 65',
        simulation_type: 'retirement',
        created_at: '2025-09-15T00:00:00Z',
        results: {
          summary: {
            current_age: 35,
            retirement_age: 65,
            monthly_contribution: 1500,
            projected_balance: 1850000,
            years_to_retirement: 30
          }
        }
      },
      {
        id: 3,
        name: 'Pay Off Credit Card Debt',
        simulation_type: 'debt_payoff',
        created_at: '2025-09-01T00:00:00Z',
        results: {
          summary: {
            total_debt: 15000,
            monthly_payment: 500,
            months_to_payoff: 34,
            total_interest_paid: 2100
          }
        }
      },
      {
        id: 4,
        name: 'Build Emergency Fund',
        simulation_type: 'emergency_fund',
        created_at: '2025-08-20T00:00:00Z',
        results: {
          summary: {
            monthly_expenses: 3500,
            target_months: 6,
            target_amount: 21000,
            current_savings: 5000,
            months_to_goal: 16
          }
        }
      },
      {
        id: 5,
        name: 'Long-term Investment Growth',
        simulation_type: 'investment_growth',
        created_at: '2025-08-10T00:00:00Z',
        results: {
          summary: {
            initial_investment: 10000,
            monthly_contribution: 500,
            years: 20,
            expected_return: 7,
            final_balance: 270000
          }
        }
      }
    ]

    setTemplates(demoTemplates)
    setSimulations(demoSimulations)
    
    try {
      const [simulationsData, templatesData] = await Promise.all([
        api.getSimulations(),
        api.getSimulationTemplates()
      ])
      // Only override if API returns valid data
      if (templatesData?.templates?.length > 0) {
        setTemplates(templatesData.templates)
      }
      if (simulationsData?.length > 0) {
        setSimulations(simulationsData)
      }
    } catch (error) {
      console.error('Failed to load simulations from API, using demo data:', error)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Financial Simulations</h1>
            <p className="text-gray-400 mt-1">Run AI-powered what-if scenarios</p>
          </div>
          <button
            onClick={() => setShowNewSimulation(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Simulation</span>
          </button>
        </div>

        {/* Simulation Templates or Form */}
        {showNewSimulation && !selectedTemplate && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Choose a Simulation Type</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.type}
                  onClick={() => {
                    setSelectedTemplate(template)
                    setSimulationParams({})
                  }}
                  className="text-left p-4 bg-slate-900/50 hover:bg-slate-900/70 border border-slate-700 hover:border-blue-500 rounded-lg transition"
                >
                  <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewSimulation(false)}
              className="mt-4 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Simulation Form */}
        {selectedTemplate && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedTemplate.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedTemplate(null)
                  setSimulationParams({})
                }}
                className="text-gray-400 hover:text-white"
              >
                ← Back
              </button>
            </div>

            <SimulationForm
              template={selectedTemplate}
              params={simulationParams}
              setParams={setSimulationParams}
              onRun={() => {
                console.log('Running simulation with params:', simulationParams)
                const results = generateSimulationResults(selectedTemplate.type, simulationParams)
                console.log('Generated results:', results)
                
                // Add new simulation to list
                const newSim = {
                  id: Date.now(), // Use timestamp for unique ID
                  name: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
                  simulation_type: selectedTemplate.type,
                  created_at: new Date().toISOString(),
                  results: results
                }
                setSimulations([newSim, ...simulations])
                setSelectedTemplate(null)
                setShowNewSimulation(false)
                setSimulationParams({})
              }}
              onCancel={() => {
                setSelectedTemplate(null)
                setSimulationParams({})
              }}
            />
          </div>
        )}

        {/* Past Simulations */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Your Simulations</h2>
          
          {simulations.length === 0 ? (
            <div className="text-center py-12">
              <SparklesIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No simulations yet</p>
              <button
                onClick={() => setShowNewSimulation(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                Create your first simulation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {simulations.map((simulation) => (
                <SimulationCard key={simulation.id} simulation={simulation} />
              ))}
            </div>
          )}
        </div>

        {/* Demo Simulation Results */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Example: Investment Growth Simulation</h2>
          <p className="text-gray-400 mb-6">
            Simulating $10,000 initial investment with $500 monthly contributions at 7% annual return
          </p>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateDemoData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Portfolio Value" strokeWidth={2} />
              <Line type="monotone" dataKey="contributed" stroke="#10b981" name="Total Contributed" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Final Value</p>
              <p className="text-xl font-bold text-blue-400">$82,500</p>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Contributed</p>
              <p className="text-xl font-bold text-green-400">$70,000</p>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
              <p className="text-xl font-bold text-purple-400">$12,500</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function SimulationCard({ simulation }: { simulation: any }) {
  const [expanded, setExpanded] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderResults = () => {
    const summary = simulation.results?.summary
    if (!summary) return null

    switch (simulation.simulation_type) {
      case 'savings_goal':
        const progressPercent = ((summary.current_savings / summary.goal_amount) * 100).toFixed(1)
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-300">Progress to Goal</p>
                <p className="text-sm text-blue-400 font-semibold">{progressPercent}%</p>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(100, parseFloat(progressPercent))}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {formatCurrency(summary.current_savings)} of {formatCurrency(summary.goal_amount)}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ResultItem label="Monthly Savings" value={formatCurrency(summary.monthly_contribution)} />
              <ResultItem label="Time to Goal" value={`${summary.years_to_goal} years`} highlight />
              <ResultItem label="Months to Goal" value={`${summary.months_to_goal} months`} highlight />
              <ResultItem label="Total to Contribute" value={formatCurrency(summary.total_contributed)} />
              <ResultItem label="Target Date" value={new Date(Date.now() + summary.months_to_goal * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} />
            </div>
          </div>
        )

      case 'retirement':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Projected Retirement Portfolio</p>
              <p className="text-3xl font-bold text-purple-400">{formatCurrency(summary.projected_balance)}</p>
              <p className="text-sm text-gray-400 mt-2">
                At age {summary.retirement_age} • {summary.years_until_retirement} years away
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ResultItem label="Current Age" value={summary.current_age} />
              <ResultItem label="Retirement Age" value={summary.retirement_age} />
              <ResultItem label="Total Contributed" value={formatCurrency(summary.total_contributed)} />
              <ResultItem label="Investment Gains" value={formatCurrency(summary.investment_gains)} highlight />
              <ResultItem label="Return on Investment" value={`${((summary.investment_gains / summary.total_contributed) * 100).toFixed(1)}%`} highlight />
            </div>
          </div>
        )

      case 'debt_payoff':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ResultItem label="Total Debt" value={formatCurrency(summary.total_debt)} />
            <ResultItem label="Monthly Payment" value={formatCurrency(summary.monthly_payment)} />
            <ResultItem label="Months to Payoff" value={`${summary.months_to_payoff} months`} highlight />
            <ResultItem label="Years to Payoff" value={`${summary.years_to_payoff} years`} highlight />
            <ResultItem label="Interest Paid" value={formatCurrency(summary.total_interest_paid)} />
            <ResultItem label="Total Paid" value={formatCurrency(summary.total_amount_paid)} />
          </div>
        )

      case 'investment_growth':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ResultItem label="Initial Investment" value={formatCurrency(summary.initial_investment)} />
              <ResultItem label="Monthly Contribution" value={formatCurrency(summary.monthly_contribution)} />
              <ResultItem label="Investment Period" value={`${summary.years} years`} />
              <ResultItem label="Expected Return" value={`${summary.expected_return}% annually`} />
              <ResultItem label="Total Contributed" value={formatCurrency(summary.total_contributed)} />
              <ResultItem label="Total Earnings" value={formatCurrency(summary.total_earnings)} highlight />
            </div>
            <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Final Portfolio Value</p>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(summary.final_balance)}</p>
              <p className="text-sm text-gray-400 mt-2">
                {((summary.total_earnings / summary.total_contributed) * 100).toFixed(1)}% total return
              </p>
            </div>
          </div>
        )

      case 'emergency_fund':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ResultItem label="Monthly Expenses" value={formatCurrency(summary.monthly_expenses)} />
            <ResultItem label="Target Months" value={`${summary.target_months} months`} />
            <ResultItem label="Target Amount" value={formatCurrency(summary.target_amount)} highlight />
            <ResultItem label="Current Savings" value={formatCurrency(summary.current_savings)} />
            <ResultItem label="Amount Needed" value={formatCurrency(summary.amount_needed)} />
            <ResultItem label="Months to Goal" value={`${summary.months_to_goal} months`} highlight />
          </div>
        )

      case 'home_affordability':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ResultItem label="Annual Income" value={formatCurrency(summary.annual_income)} />
            <ResultItem label="Max Home Price" value={formatCurrency(summary.max_home_price)} highlight />
            <ResultItem label="Down Payment" value={formatCurrency(summary.down_payment)} />
            <ResultItem label="Loan Amount" value={formatCurrency(summary.loan_amount)} />
            <ResultItem label="Monthly Payment" value={formatCurrency(summary.monthly_payment)} highlight />
            <ResultItem label="Total Interest" value={formatCurrency(summary.total_interest)} />
          </div>
        )

      default:
        return (
          <pre className="text-sm text-gray-300 overflow-auto">
            {JSON.stringify(summary, null, 2)}
          </pre>
        )
    }
  }

  return (
    <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-slate-600 transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{simulation.name}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {simulation.simulation_type.replace('_', ' ')} • {new Date(simulation.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
        >
          {expanded ? '▲ Hide' : '▼ View'} Results
        </button>
      </div>

      {expanded && simulation.results && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          {renderResults()}
        </div>
      )}
    </div>
  )
}

function ResultItem({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-lg ${highlight ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-slate-800/50'}`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-blue-400 text-lg' : 'text-white'}`}>
        {value}
      </p>
    </div>
  )
}

function SimulationForm({ template, params, setParams, onRun, onCancel }: any) {
  const fields: any = {
    savings_goal: [
      { key: 'goal_amount', label: 'Goal Amount ($)', type: 'number', default: 50000 },
      { key: 'current_savings', label: 'Current Savings ($)', type: 'number', default: 5000 },
      { key: 'monthly_contribution', label: 'Monthly Contribution ($)', type: 'number', default: 800 },
      { key: 'annual_return', label: 'Expected Annual Return (%)', type: 'number', default: 5 },
    ],
    retirement: [
      { key: 'current_age', label: 'Current Age', type: 'number', default: 30 },
      { key: 'retirement_age', label: 'Retirement Age', type: 'number', default: 65 },
      { key: 'current_savings', label: 'Current Savings ($)', type: 'number', default: 50000 },
      { key: 'monthly_contribution', label: 'Monthly Contribution ($)', type: 'number', default: 1000 },
      { key: 'annual_return', label: 'Expected Return (%)', type: 'number', default: 7 },
    ],
    debt_payoff: [
      { key: 'total_debt', label: 'Total Debt ($)', type: 'number', default: 25000 },
      { key: 'interest_rate', label: 'Interest Rate (%)', type: 'number', default: 18 },
      { key: 'monthly_payment', label: 'Monthly Payment ($)', type: 'number', default: 500 },
    ],
    investment_growth: [
      { key: 'initial_investment', label: 'Initial Investment ($)', type: 'number', default: 10000 },
      { key: 'monthly_contribution', label: 'Monthly Contribution ($)', type: 'number', default: 500 },
      { key: 'years', label: 'Investment Period (years)', type: 'number', default: 10 },
      { key: 'annual_return', label: 'Expected Return (%)', type: 'number', default: 7 },
    ],
    emergency_fund: [
      { key: 'monthly_expenses', label: 'Monthly Expenses ($)', type: 'number', default: 3000 },
      { key: 'target_months', label: 'Target Months Coverage', type: 'number', default: 6 },
      { key: 'current_savings', label: 'Current Savings ($)', type: 'number', default: 2000 },
      { key: 'monthly_contribution', label: 'Monthly Savings ($)', type: 'number', default: 400 },
    ],
    home_affordability: [
      { key: 'annual_income', label: 'Annual Income ($)', type: 'number', default: 80000 },
      { key: 'down_payment', label: 'Down Payment ($)', type: 'number', default: 40000 },
      { key: 'interest_rate', label: 'Interest Rate (%)', type: 'number', default: 6.5 },
      { key: 'loan_term', label: 'Loan Term (years)', type: 'number', default: 30 },
    ],
  }

  const templateFields = fields[template.type] || []

  // Set defaults only once when template changes
  useEffect(() => {
    const defaults: any = {}
    templateFields.forEach((field: any) => {
      defaults[field.key] = field.default
    })
    setParams(defaults)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.type])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templateFields.map((field: any) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              value={params[field.key] || field.default}
              onChange={(e) => setParams({ ...params, [field.key]: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={onRun}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Run Simulation
        </button>
      </div>
    </div>
  )
}

function generateSimulationResults(type: string, params: any) {
  // Add validation to ensure params exist
  if (!params || Object.keys(params).length === 0) {
    return { summary: { error: 'No parameters provided' } }
  }

  console.log(`Calculating ${type} with params:`, params)

  switch (type) {
    case 'savings_goal':
      // Formula: Calculate months needed to reach savings goal with compound interest
      // FV = PV(1+r)^n + PMT * [(1+r)^n - 1] / r
      // Solving for n (months)
      const monthlyRate = (params.annual_return / 100) / 12
      let months = 0
      
      // Simple calculation if no interest
      if (monthlyRate === 0) {
        months = (params.goal_amount - params.current_savings) / params.monthly_contribution
      } else {
        const numerator = params.goal_amount * monthlyRate + params.monthly_contribution
        const denominator = params.current_savings * monthlyRate + params.monthly_contribution
        if (denominator > 0 && numerator > 0) {
          months = Math.log(numerator / denominator) / Math.log(1 + monthlyRate)
        } else {
          months = (params.goal_amount - params.current_savings) / params.monthly_contribution
        }
      }
      
      // Ensure months is valid
      if (!isFinite(months) || months < 0) {
        months = (params.goal_amount - params.current_savings) / params.monthly_contribution
      }
      
      return {
        summary: {
          goal_amount: params.goal_amount,
          current_savings: params.current_savings,
          monthly_contribution: params.monthly_contribution,
          months_to_goal: Math.ceil(months),
          years_to_goal: (months / 12).toFixed(1),
          total_contributed: params.current_savings + (params.monthly_contribution * Math.ceil(months)),
          final_amount: params.goal_amount
        }
      }

    case 'retirement':
      // Formula: Compound interest with regular contributions over time
      // FV = PV(1+r)^n + PMT * [(1+r)^n - 1] / r
      const years = params.retirement_age - params.current_age
      const retMonthlyRate = (params.annual_return / 100) / 12
      const totalMonths = years * 12
      let retBalance = params.current_savings
      for (let i = 0; i < totalMonths; i++) {
        retBalance = retBalance * (1 + retMonthlyRate) + params.monthly_contribution
      }
      return {
        summary: {
          current_age: params.current_age,
          retirement_age: params.retirement_age,
          years_until_retirement: years,
          projected_balance: Math.round(retBalance),
          total_contributed: params.current_savings + (params.monthly_contribution * totalMonths),
          investment_gains: Math.round(retBalance - params.current_savings - (params.monthly_contribution * totalMonths))
        }
      }

    case 'debt_payoff':
      // Formula: Loan amortization - months to pay off debt
      // n = -log(1 - r*P/A) / log(1+r)
      // where P = principal, A = payment, r = monthly interest rate
      const monthlyInterestRate = (params.interest_rate / 100) / 12
      let payoffMonths = 0
      
      if (monthlyInterestRate === 0) {
        // No interest
        payoffMonths = params.total_debt / params.monthly_payment
      } else {
        const denominator = params.monthly_payment - params.total_debt * monthlyInterestRate
        if (denominator > 0) {
          payoffMonths = Math.log(params.monthly_payment / denominator) / Math.log(1 + monthlyInterestRate)
        } else {
          // Payment is too low, simple calculation
          payoffMonths = params.total_debt / params.monthly_payment
        }
      }
      
      // Ensure valid result
      if (!isFinite(payoffMonths) || payoffMonths < 0) {
        payoffMonths = params.total_debt / params.monthly_payment
      }
      
      const totalPaid = params.monthly_payment * payoffMonths
      return {
        summary: {
          total_debt: params.total_debt,
          monthly_payment: params.monthly_payment,
          months_to_payoff: Math.ceil(payoffMonths),
          years_to_payoff: (payoffMonths / 12).toFixed(1),
          total_interest_paid: Math.round(totalPaid - params.total_debt),
          total_amount_paid: Math.round(totalPaid)
        }
      }

    case 'investment_growth':
      const invMonthlyRate = (params.annual_return / 100) / 12
      const invMonths = params.years * 12
      let invBalance = params.initial_investment || 0
      
      // Compound interest with monthly contributions
      for (let i = 0; i < invMonths; i++) {
        invBalance = (invBalance * (1 + invMonthlyRate)) + (params.monthly_contribution || 0)
      }
      
      const totalContributed = (params.initial_investment || 0) + ((params.monthly_contribution || 0) * invMonths)
      
      return {
        summary: {
          initial_investment: params.initial_investment || 0,
          monthly_contribution: params.monthly_contribution || 0,
          years: params.years || 0,
          expected_return: params.annual_return || 0,
          final_balance: Math.round(invBalance),
          total_contributed: Math.round(totalContributed),
          total_earnings: Math.round(invBalance - totalContributed)
        }
      }

    case 'emergency_fund':
      const targetAmount = params.monthly_expenses * params.target_months
      const neededAmount = Math.max(0, targetAmount - params.current_savings)
      const monthsNeeded = neededAmount > 0 ? Math.ceil(neededAmount / params.monthly_contribution) : 0
      return {
        summary: {
          monthly_expenses: params.monthly_expenses,
          target_months: params.target_months,
          target_amount: targetAmount,
          current_savings: params.current_savings,
          amount_needed: neededAmount,
          monthly_contribution: params.monthly_contribution,
          months_to_goal: monthsNeeded,
          completion_date: monthsNeeded > 0 ? new Date(Date.now() + monthsNeeded * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'Already funded!'
        }
      }

    case 'home_affordability':
      const maxHomePrice = params.annual_income * 3
      const loanAmount = Math.max(0, maxHomePrice - params.down_payment)
      const monthlyInterest = (params.interest_rate / 100) / 12
      const numPayments = params.loan_term * 12
      let monthlyPayment = 0
      
      if (loanAmount > 0 && monthlyInterest > 0) {
        monthlyPayment = loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, numPayments)) / (Math.pow(1 + monthlyInterest, numPayments) - 1)
      } else if (loanAmount > 0) {
        monthlyPayment = loanAmount / numPayments
      }
      
      // Validate result
      if (!isFinite(monthlyPayment) || monthlyPayment < 0) {
        monthlyPayment = 0
      }
      
      return {
        summary: {
          annual_income: params.annual_income,
          max_home_price: Math.round(maxHomePrice),
          down_payment: params.down_payment,
          loan_amount: Math.round(loanAmount),
          monthly_payment: Math.round(monthlyPayment),
          total_interest: Math.round((monthlyPayment * numPayments) - loanAmount),
          total_cost: Math.round(monthlyPayment * numPayments + params.down_payment)
        }
      }

    default:
      return { summary: { message: 'Simulation completed' } }
  }
}

function generateDemoData() {
  const data = []
  let balance = 10000
  let contributed = 10000
  const monthlyContribution = 500
  const monthlyReturn = 0.07 / 12

  for (let month = 0; month <= 120; month++) {
    data.push({
      month,
      balance: Math.round(balance),
      contributed: Math.round(contributed),
    })

    if (month < 120) {
      balance = balance * (1 + monthlyReturn) + monthlyContribution
      contributed += monthlyContribution
    }
  }

  return data
}

