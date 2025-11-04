/**
 * API service for backend communication
 */
import axios, { AxiosInstance, AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async register(userData: {
    email: string
    username: string
    password: string
    full_name?: string
  }) {
    const response = await this.client.post('/api/auth/register', userData)
    return response.data
  }

  async login(username: string, password: string) {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const response = await this.client.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth/me')
    return response.data
  }

  // Account endpoints
  async getAccounts() {
    const response = await this.client.get('/api/accounts/')
    return response.data
  }

  async linkPlaidAccount(publicToken: string) {
    const response = await this.client.post('/api/accounts/plaid/link', {
      public_token: publicToken,
    })
    return response.data
  }

  async syncAccount(accountId: number) {
    const response = await this.client.post(`/api/accounts/${accountId}/sync`)
    return response.data
  }

  async getNetWorth() {
    const response = await this.client.get('/api/accounts/networth/calculate')
    return response.data
  }

  // Transaction endpoints
  async getTransactions(params?: {
    account_id?: number
    category?: string
    start_date?: string
    end_date?: string
    limit?: number
  }) {
    const response = await this.client.get('/api/transactions/', { params })
    return response.data
  }

  async getMonthlySpending(year?: number, month?: number) {
    const response = await this.client.get('/api/transactions/spending/monthly', {
      params: { year, month },
    })
    return response.data
  }

  async getSpendingTrends(months: number = 6) {
    const response = await this.client.get('/api/transactions/spending/trends', {
      params: { months },
    })
    return response.data
  }

  async syncTransactions() {
    const response = await this.client.post('/api/transactions/sync')
    return response.data
  }

  // Simulation endpoints
  async createSimulation(simulationData: {
    name: string
    simulation_type: string
    description?: string
    input_parameters: any
  }) {
    const response = await this.client.post('/api/simulations/', simulationData)
    return response.data
  }

  async getSimulations(limit: number = 50) {
    const response = await this.client.get('/api/simulations/', {
      params: { limit },
    })
    return response.data
  }

  async getSimulation(id: number) {
    const response = await this.client.get(`/api/simulations/${id}`)
    return response.data
  }

  async deleteSimulation(id: number) {
    const response = await this.client.delete(`/api/simulations/${id}`)
    return response.data
  }

  async getSimulationTemplates() {
    const response = await this.client.get('/api/simulations/templates/list')
    return response.data
  }

  // Gamification endpoints
  async getGamificationProfile() {
    const response = await this.client.get('/api/gamification/profile')
    return response.data
  }

  async getAchievements() {
    const response = await this.client.get('/api/gamification/achievements')
    return response.data
  }

  async getMilestones() {
    const response = await this.client.get('/api/gamification/milestones')
    return response.data
  }

  async createMilestone(milestoneData: {
    title: string
    description?: string
    target_amount: number
    target_date?: string
  }) {
    const response = await this.client.post('/api/gamification/milestones', milestoneData)
    return response.data
  }

  async updateMilestone(id: number, current_amount: number) {
    const response = await this.client.put(
      `/api/gamification/milestones/${id}`,
      null,
      { params: { current_amount } }
    )
    return response.data
  }

  // Admin endpoints
  async getSystemStats() {
    const response = await this.client.get('/api/admin/stats')
    return response.data
  }

  async listUsers(skip: number = 0, limit: number = 100) {
    const response = await this.client.get('/api/admin/users', {
      params: { skip, limit },
    })
    return response.data
  }
}

// TEMPORARILY USING MOCK API - Backend not running
// export const api = new ApiService()
// export default api

// Use mock API instead
import { api as mockApi } from './api.mock'
export const api = mockApi
export default mockApi

