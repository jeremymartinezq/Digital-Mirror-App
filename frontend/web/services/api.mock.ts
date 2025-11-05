/**
 * Mock API service for development without backend
 */

// Mock data
const mockUser = {
  id: 1,
  email: 'demo@digitalmirror.com',
  username: 'demo',
  full_name: 'Demo User',
  created_at: new Date().toISOString(),
}

const mockAccounts = [
  {
    id: 1,
    user_id: 1,
    account_name: 'Chase Checking',
    institution_name: 'Chase',
    account_type: 'checking',
    balance: 15420.50,
    currency: 'USD',
    last_synced: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    account_name: 'High-Yield Savings',
    institution_name: 'Marcus by Goldman Sachs',
    account_type: 'savings',
    balance: 45800.00,
    currency: 'USD',
    last_synced: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    account_name: 'Vanguard 401(k)',
    institution_name: 'Vanguard',
    account_type: 'investment',
    balance: 125000.00,
    currency: 'USD',
    last_synced: new Date().toISOString(),
  },
  {
    id: 4,
    user_id: 1,
    account_name: 'Chase Sapphire Reserve',
    institution_name: 'Chase',
    account_type: 'credit_card',
    balance: 2340.75,
    currency: 'USD',
    last_synced: new Date().toISOString(),
  },
  {
    id: 5,
    user_id: 1,
    account_name: 'Robinhood Investment',
    institution_name: 'Robinhood',
    account_type: 'investment',
    balance: 28500.00,
    currency: 'USD',
    last_synced: new Date().toISOString(),
  },
]

const mockTransactions = [
  // This month - Week 1
  {
    id: 1,
    account_id: 1,
    amount: 5240.00,
    description: 'Direct Deposit - Tech Corp Salary',
    category: 'salary',
    transaction_type: 'income',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    account_id: 1,
    amount: -125.43,
    description: 'Whole Foods Market',
    category: 'food',
    transaction_type: 'expense',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    account_id: 4,
    amount: -89.50,
    description: 'Uber Eats - Dinner',
    category: 'food',
    transaction_type: 'expense',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    account_id: 1,
    amount: -62.00,
    description: 'Shell Gas Station',
    category: 'transportation',
    transaction_type: 'expense',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    account_id: 4,
    amount: -18.99,
    description: 'Netflix Subscription',
    category: 'entertainment',
    transaction_type: 'expense',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    account_id: 4,
    amount: -12.99,
    description: 'Spotify Premium',
    category: 'entertainment',
    transaction_type: 'expense',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    account_id: 1,
    amount: -1850.00,
    description: 'Rent Payment',
    category: 'housing',
    transaction_type: 'expense',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    account_id: 4,
    amount: -340.28,
    description: 'Whole Foods Weekly Groceries',
    category: 'food',
    transaction_type: 'expense',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    account_id: 1,
    amount: -145.00,
    description: 'Pacific Gas & Electric',
    category: 'utilities',
    transaction_type: 'expense',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    account_id: 4,
    amount: -215.60,
    description: 'Target - Household Items',
    category: 'shopping',
    transaction_type: 'expense',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Week 2
  {
    id: 11,
    account_id: 1,
    amount: -89.99,
    description: 'Comcast Internet',
    category: 'utilities',
    transaction_type: 'expense',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    account_id: 4,
    amount: -42.50,
    description: 'Starbucks',
    category: 'food',
    transaction_type: 'expense',
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 13,
    account_id: 1,
    amount: -125.00,
    description: 'LA Fitness Membership',
    category: 'healthcare',
    transaction_type: 'expense',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 14,
    account_id: 4,
    amount: -280.00,
    description: 'Amazon - Various Items',
    category: 'shopping',
    transaction_type: 'expense',
    date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 15,
    account_id: 5,
    amount: 1500.00,
    description: 'Stock Dividend - AAPL',
    category: 'investment',
    transaction_type: 'income',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 16,
    account_id: 1,
    amount: 5240.00,
    description: 'Direct Deposit - Tech Corp Salary',
    category: 'salary',
    transaction_type: 'income',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 17,
    account_id: 4,
    amount: -165.00,
    description: 'Costco Groceries',
    category: 'food',
    transaction_type: 'expense',
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 18,
    account_id: 1,
    amount: -55.00,
    description: 'T-Mobile Bill',
    category: 'utilities',
    transaction_type: 'expense',
    date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 19,
    account_id: 4,
    amount: -95.00,
    description: 'Olive Garden Dinner',
    category: 'food',
    transaction_type: 'expense',
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 20,
    account_id: 1,
    amount: -800.00,
    description: 'Transfer to Savings',
    category: 'other',
    transaction_type: 'expense',
    date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Week 3
  {
    id: 21,
    account_id: 4,
    amount: -45.00,
    description: 'Chipotle',
    category: 'food',
    transaction_type: 'expense',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 22,
    account_id: 1,
    amount: -185.00,
    description: 'Car Insurance',
    category: 'transportation',
    transaction_type: 'expense',
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 23,
    account_id: 4,
    amount: -1250.00,
    description: 'Apple - MacBook Pro',
    category: 'shopping',
    transaction_type: 'expense',
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 24,
    account_id: 1,
    amount: 200.00,
    description: 'Freelance Project Payment',
    category: 'other',
    transaction_type: 'income',
    date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 25,
    account_id: 4,
    amount: -78.50,
    description: 'CVS Pharmacy',
    category: 'healthcare',
    transaction_type: 'expense',
    date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 26,
    account_id: 1,
    amount: -420.00,
    description: 'United Airlines - Flight Ticket',
    category: 'transportation',
    transaction_type: 'expense',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 27,
    account_id: 4,
    amount: -32.00,
    description: 'AMC Theaters',
    category: 'entertainment',
    transaction_type: 'expense',
    date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 28,
    account_id: 1,
    amount: -156.00,
    description: 'Trader Joes Groceries',
    category: 'food',
    transaction_type: 'expense',
    date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 29,
    account_id: 1,
    amount: 5240.00,
    description: 'Direct Deposit - Tech Corp Salary',
    category: 'salary',
    transaction_type: 'income',
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 30,
    account_id: 4,
    amount: -15.99,
    description: 'Disney+ Subscription',
    category: 'entertainment',
    transaction_type: 'expense',
    date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockSimulations = [
  {
    id: 1,
    name: 'Save for House Down Payment',
    simulation_type: 'savings_goal',
    description: 'Simulate saving $50k in 2 years',
    status: 'completed',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    result_summary: {
      feasibility: 'high',
      projected_completion: '2027-10-28',
      monthly_savings_required: 2083.33,
    },
  },
]

const mockAchievements = [
  {
    id: 1,
    title: 'First Simulation',
    description: 'Created your first financial simulation',
    icon: '🎯',
    unlocked_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    points: 50,
  },
  {
    id: 2,
    title: 'Budget Master',
    description: 'Stayed under budget for 3 months',
    icon: '💰',
    unlocked_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    points: 100,
  },
  {
    id: 3,
    title: 'Savings Superstar',
    description: 'Saved $10,000 or more',
    icon: '⭐',
    unlocked_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    points: 150,
  },
  {
    id: 4,
    title: 'Transaction Tracker',
    description: 'Logged 100 transactions',
    icon: '📊',
    unlocked_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    points: 75,
  },
  {
    id: 5,
    title: 'Investment Guru',
    description: 'Maintained investment portfolio for 6 months',
    icon: '📈',
    unlocked_at: null,
    points: 200,
  },
  {
    id: 6,
    title: 'Debt Destroyer',
    description: 'Paid off a debt account',
    icon: '🔥',
    unlocked_at: null,
    points: 250,
  },
  {
    id: 7,
    title: 'Consistency King',
    description: 'Logged in for 30 consecutive days',
    icon: '👑',
    unlocked_at: null,
    points: 300,
  },
  {
    id: 8,
    title: 'Net Worth $100K',
    description: 'Reached $100,000 in net worth',
    icon: '💎',
    unlocked_at: null,
    points: 500,
  },
]

const mockGamificationProfile = {
  level: 5,
  points: 475,
  streak: 14,
  total_achievements: 4,
  rank: 'Silver',
  next_level_points: 500,
}

// Mock API Service
class MockApiService {
  private delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Auth endpoints
  async register(userData: any) {
    await this.delay()
    return { 
      ...mockUser, 
      token: 'mock-token-' + Math.random().toString(36).substring(7) 
    }
  }

  async login(username: string, password: string) {
    await this.delay()
    return { 
      access_token: 'mock-token-' + Math.random().toString(36).substring(7),
      token_type: 'bearer',
      user: mockUser,
    }
  }

  async getCurrentUser() {
    await this.delay()
    return mockUser
  }

  // Account endpoints
  async getAccounts() {
    await this.delay()
    return mockAccounts
  }

  async linkPlaidAccount(publicToken: string) {
    await this.delay()
    return { success: true, message: 'Account linked successfully' }
  }

  async syncAccount(accountId: number) {
    await this.delay()
    return { success: true, message: 'Account synced' }
  }

  async getNetWorth() {
    await this.delay()
    const assets = mockAccounts
      .filter(acc => acc.account_type !== 'credit_card')
      .reduce((sum, acc) => sum + acc.balance, 0)
    const liabilities = mockAccounts
      .filter(acc => acc.account_type === 'credit_card')
      .reduce((sum, acc) => sum + acc.balance, 0)
    return { 
      net_worth: assets - liabilities,
      total_assets: assets,
      total_liabilities: liabilities,
      accounts: mockAccounts,
    }
  }

  async createAccount(accountData: any) {
    await this.delay()
    const newAccount = {
      id: Math.max(...mockAccounts.map(a => a.id), 0) + 1,
      user_id: 1,
      account_name: accountData.account_name,
      institution_name: accountData.institution || 'Unknown',
      account_type: accountData.account_type,
      balance: accountData.balance || 0,
      currency: 'USD',
      last_synced: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    mockAccounts.push(newAccount)
    return newAccount
  }

  async deleteAccount(accountId: number) {
    await this.delay()
    const index = mockAccounts.findIndex(acc => acc.id === accountId)
    if (index !== -1) {
      mockAccounts.splice(index, 1)
      return { success: true, message: 'Account deleted successfully' }
    }
    throw new Error('Account not found')
  }

  // Transaction endpoints
  async getTransactions(params?: any) {
    await this.delay()
    return mockTransactions
  }

  async getMonthlySpending(year?: number, month?: number) {
    await this.delay()
    
    // Calculate spending from transactions
    const expenses = mockTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    // Calculate income from transactions
    const income = mockTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    
    // Group by category
    const byCategory: any = {}
    mockTransactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        if (!byCategory[t.category]) {
          byCategory[t.category] = 0
        }
        byCategory[t.category] += Math.abs(t.amount)
      })
    
    return {
      total_spending: expenses,
      total_income: income,
      net: income - expenses,
      breakdown: Object.entries(byCategory).map(([category, amount]) => ({
        category,
        amount
      })),
    }
  }

  async getSpendingTrends(months: number = 6) {
    await this.delay()
    return {
      trends: Array.from({ length: months }, (_, i) => ({
        month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        total: Math.random() * 3000 + 2000,
      })).reverse(),
    }
  }

  async syncTransactions() {
    await this.delay()
    return { success: true, count: 5 }
  }

  // Simulation endpoints
  async createSimulation(simulationData: any) {
    await this.delay()
    return {
      id: Math.floor(Math.random() * 1000),
      ...simulationData,
      status: 'completed',
      created_at: new Date().toISOString(),
    }
  }

  async getSimulations(limit: number = 50) {
    await this.delay()
    return mockSimulations
  }

  async getSimulation(id: number) {
    await this.delay()
    return mockSimulations[0]
  }

  async deleteSimulation(id: number) {
    await this.delay()
    return { success: true }
  }

  async getSimulationTemplates() {
    await this.delay()
    return [
      { id: 'savings', name: 'Savings Goal', description: 'Plan for a savings goal' },
      { id: 'investment', name: 'Investment Strategy', description: 'Simulate investment returns' },
      { id: 'debt', name: 'Debt Payoff', description: 'Plan to pay off debt' },
    ]
  }

  // Gamification endpoints
  async getGamificationProfile() {
    await this.delay()
    return mockGamificationProfile
  }

  async getAchievements() {
    await this.delay()
    return mockAchievements
  }

  async getMilestones() {
    await this.delay()
    return [
      {
        id: 1,
        title: 'Emergency Fund',
        description: 'Save $10,000 for emergencies',
        target_amount: 10000,
        current_amount: 6500,
        target_date: '2026-12-31',
      },
      {
        id: 2,
        title: 'Pay Off Credit Card',
        description: 'Eliminate credit card debt',
        target_amount: 2340.75,
        current_amount: 0,
        target_date: '2026-06-30',
      },
      {
        id: 3,
        title: 'Retirement Savings',
        description: 'Reach $150,000 in retirement accounts',
        target_amount: 150000,
        current_amount: 125000,
        target_date: '2027-12-31',
      },
    ]
  }

  async createMilestone(milestoneData: any) {
    await this.delay()
    return { id: Math.floor(Math.random() * 1000), ...milestoneData, current_amount: 0 }
  }

  async updateMilestone(id: number, current_amount: number) {
    await this.delay()
    return { success: true }
  }

  // Admin endpoints
  async getSystemStats() {
    await this.delay()
    return {
      total_users: 1234,
      active_simulations: 567,
      total_transactions: 89012,
    }
  }

  async listUsers(skip: number = 0, limit: number = 100) {
    await this.delay()
    return [mockUser]
  }
}

export const api = new MockApiService()
export default api

