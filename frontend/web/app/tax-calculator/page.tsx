'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  CalculatorIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline'

export default function TaxCalculatorPage() {
  const [income, setIncome] = useState({
    wages: 0,
    selfEmployment: 0,
    investments: 0,
    other: 0,
  })

  const [deductions, setDeductions] = useState({
    businessExpenses: 0,
    retirement: 0,
    healthInsurance: 0,
    homeOffice: 0,
  })

  const [taxInfo, setTaxInfo] = useState({
    filingStatus: 'single',
    state: 'CA',
    estimatedPayments: 0,
  })

  const totalIncome = Object.values(income).reduce((sum, val) => sum + val, 0)
  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0)
  const taxableIncome = Math.max(0, totalIncome - totalDeductions)

  // Federal Tax Brackets 2024 (simplified)
  const calculateFederalTax = (income: number, status: string) => {
    const brackets: any = {
      single: [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ],
      married: [
        { limit: 23200, rate: 0.10 },
        { limit: 94300, rate: 0.12 },
        { limit: 201050, rate: 0.22 },
        { limit: 383900, rate: 0.24 },
        { limit: 487450, rate: 0.32 },
        { limit: 731200, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ],
    }

    const applicableBrackets = brackets[status] || brackets.single
    let tax = 0
    let previousLimit = 0

    for (const bracket of applicableBrackets) {
      if (income > previousLimit) {
        const taxableInBracket = Math.min(income - previousLimit, bracket.limit - previousLimit)
        tax += taxableInBracket * bracket.rate
        previousLimit = bracket.limit
      } else {
        break
      }
    }

    return tax
  }

  // Self-Employment Tax (15.3%)
  const selfEmploymentTax = income.selfEmployment > 0 
    ? income.selfEmployment * 0.9235 * 0.153 
    : 0

  // Estimated State Tax (using CA as example, 9.3% for middle income)
  const stateTax = taxableIncome * 0.093

  // Total Estimated Tax
  const federalTax = calculateFederalTax(taxableIncome, taxInfo.filingStatus)
  const totalTax = federalTax + selfEmploymentTax + stateTax
  const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0

  // Quarterly Payments
  const quarterlyPayment = (totalTax - taxInfo.estimatedPayments) / 4
  const remainingPayments = Math.max(0, totalTax - taxInfo.estimatedPayments)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <CalculatorIcon className="w-8 h-8" />
            <span>Quarterly Tax Calculator</span>
          </h1>
          <p className="text-gray-400 mt-1">
            Estimate your quarterly tax payments for self-employment and investment income
          </p>
        </div>

        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6">
            <p className="text-blue-100 text-sm mb-1">Total Income</p>
            <p className="text-3xl font-bold text-white">
              ${totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6">
            <p className="text-green-100 text-sm mb-1">Total Deductions</p>
            <p className="text-3xl font-bold text-white">
              ${totalDeductions.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6">
            <p className="text-purple-100 text-sm mb-1">Taxable Income</p>
            <p className="text-3xl font-bold text-white">
              ${taxableIncome.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6">
            <p className="text-red-100 text-sm mb-1">Estimated Tax</p>
            <p className="text-3xl font-bold text-white">
              ${Math.round(totalTax).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <DocumentTextIcon className="w-6 h-6 text-blue-400" />
              <span>Income Sources</span>
            </h2>

            <div className="space-y-4">
              <InputField
                label="W-2 Wages"
                value={income.wages}
                onChange={(val) => setIncome({ ...income, wages: val })}
              />
              <InputField
                label="Self-Employment Income"
                value={income.selfEmployment}
                onChange={(val) => setIncome({ ...income, selfEmployment: val })}
                helper="1099-NEC, freelance, business income"
              />
              <InputField
                label="Investment Income"
                value={income.investments}
                onChange={(val) => setIncome({ ...income, investments: val })}
                helper="Dividends, capital gains, interest"
              />
              <InputField
                label="Other Income"
                value={income.other}
                onChange={(val) => setIncome({ ...income, other: val })}
                helper="Rental, royalties, etc."
              />
            </div>
          </div>

          {/* Deductions Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <ChartPieIcon className="w-6 h-6 text-green-400" />
              <span>Deductions</span>
            </h2>

            <div className="space-y-4">
              <InputField
                label="Business Expenses"
                value={deductions.businessExpenses}
                onChange={(val) => setDeductions({ ...deductions, businessExpenses: val })}
                helper="Equipment, supplies, travel"
              />
              <InputField
                label="Retirement Contributions"
                value={deductions.retirement}
                onChange={(val) => setDeductions({ ...deductions, retirement: val })}
                helper="SEP-IRA, Solo 401(k)"
              />
              <InputField
                label="Health Insurance"
                value={deductions.healthInsurance}
                onChange={(val) => setDeductions({ ...deductions, healthInsurance: val })}
                helper="Self-employed health insurance"
              />
              <InputField
                label="Home Office"
                value={deductions.homeOffice}
                onChange={(val) => setDeductions({ ...deductions, homeOffice: val })}
                helper="Simplified or actual method"
              />
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Tax Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filing Status
              </label>
              <select
                value={taxInfo.filingStatus}
                onChange={(e) => setTaxInfo({ ...taxInfo, filingStatus: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head">Head of Household</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State
              </label>
              <select
                value={taxInfo.state}
                onChange={(e) => setTaxInfo({ ...taxInfo, state: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Already Paid (Estimated)
              </label>
              <input
                type="number"
                value={taxInfo.estimatedPayments}
                onChange={(e) => setTaxInfo({ ...taxInfo, estimatedPayments: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Tax Breakdown</h2>
          
          <div className="space-y-3">
            <TaxRow label="Federal Income Tax" amount={federalTax} />
            <TaxRow label="Self-Employment Tax" amount={selfEmploymentTax} />
            <TaxRow label="State Income Tax" amount={stateTax} />
            <div className="border-t border-slate-700 pt-3">
              <TaxRow label="Total Estimated Tax" amount={totalTax} highlight />
            </div>
            <TaxRow label="Effective Tax Rate" amount={`${effectiveRate.toFixed(2)}%`} isRate />
          </div>
        </div>

        {/* Quarterly Payment Schedule */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CalendarIcon className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Quarterly Payment Schedule</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-4">
            <p className="text-white/80 text-sm mb-2">Estimated Quarterly Payment</p>
            <p className="text-4xl font-bold text-white">
              ${Math.max(0, Math.round(quarterlyPayment)).toLocaleString()}
            </p>
            <p className="text-white/60 text-sm mt-2">
              Remaining to pay: ${Math.round(remainingPayments).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuarterCard quarter="Q1" deadline="April 15" amount={quarterlyPayment} />
            <QuarterCard quarter="Q2" deadline="June 15" amount={quarterlyPayment} />
            <QuarterCard quarter="Q3" deadline="Sept 15" amount={quarterlyPayment} />
            <QuarterCard quarter="Q4" deadline="Jan 15" amount={quarterlyPayment} />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-200 text-sm">
            <strong>Disclaimer:</strong> This is an estimate only. Actual taxes may vary. 
            Consult with a tax professional or CPA for accurate tax planning and filing. 
            This calculator does not constitute tax advice.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

function InputField({ label, value, onChange, helper }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
          placeholder="0"
        />
      </div>
      {helper && <p className="text-gray-500 text-xs mt-1">{helper}</p>}
    </div>
  )
}

function TaxRow({ label, amount, highlight, isRate }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className={highlight ? 'text-white font-bold' : 'text-gray-300'}>
        {label}
      </span>
      <span className={highlight ? 'text-white font-bold text-lg' : 'text-gray-300'}>
        {isRate ? amount : `$${typeof amount === 'number' ? Math.round(amount).toLocaleString() : amount}`}
      </span>
    </div>
  )
}

function QuarterCard({ quarter, deadline, amount }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
      <p className="text-white font-bold text-lg mb-1">{quarter}</p>
      <p className="text-white/60 text-xs mb-2">{deadline}</p>
      <p className="text-white font-semibold">
        ${Math.max(0, Math.round(amount)).toLocaleString()}
      </p>
    </div>
  )
}

