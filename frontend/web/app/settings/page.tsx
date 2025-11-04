'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { api } from '@/services/api'
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: false,
    weekly_summary: true,
    theme: 'dark',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    loadUser()
  }, [router])

  const loadUser = async () => {
    try {
      setLoading(true)
      const userData = await api.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to load user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Settings saved successfully!')
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
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <UserIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Profile Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user?.username || ''}
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Type
              </label>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 rounded-lg font-semibold ${
                  user?.role === 'premium'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'bg-slate-700 text-gray-300'
                }`}>
                  {user?.role === 'premium' ? '⭐ Premium' : '🆓 Basic'}
                </span>
                {user?.role !== 'premium' && (
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Upgrade to Premium →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BellIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <ToggleSetting
              label="Email Notifications"
              description="Receive email updates about your account"
              enabled={settings.email_notifications}
              onChange={(val) => setSettings({ ...settings, email_notifications: val })}
            />
            
            <ToggleSetting
              label="Push Notifications"
              description="Get push notifications on your device"
              enabled={settings.push_notifications}
              onChange={(val) => setSettings({ ...settings, push_notifications: val })}
            />
            
            <ToggleSetting
              label="Weekly Summary"
              description="Receive a weekly summary of your finances"
              enabled={settings.weekly_summary}
              onChange={(val) => setSettings({ ...settings, weekly_summary: val })}
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheckIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg px-4 py-3 text-left transition group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium group-hover:text-blue-400 transition">
                    Change Password
                  </p>
                  <p className="text-gray-400 text-sm">Update your password regularly</p>
                </div>
                <span className="text-gray-400 group-hover:text-blue-400">→</span>
              </div>
            </button>

            <button className="w-full bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg px-4 py-3 text-left transition group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium group-hover:text-blue-400 transition">
                    Two-Factor Authentication
                  </p>
                  <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                </div>
                <span className="text-gray-400 group-hover:text-blue-400">→</span>
              </div>
            </button>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <PaintBrushIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Appearance</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
                className={`p-4 rounded-lg border-2 transition ${
                  settings.theme === 'dark'
                    ? 'border-blue-500 bg-slate-900'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="bg-slate-800 rounded p-2 mb-2">
                  <div className="bg-slate-900 h-8 rounded"></div>
                </div>
                <p className="text-white font-medium">Dark</p>
              </button>

              <button
                onClick={() => setSettings({ ...settings, theme: 'light' })}
                className={`p-4 rounded-lg border-2 transition ${
                  settings.theme === 'light'
                    ? 'border-blue-500 bg-slate-900'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="bg-gray-200 rounded p-2 mb-2">
                  <div className="bg-white h-8 rounded"></div>
                </div>
                <p className="text-white font-medium">Light</p>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 rounded-lg font-semibold transition"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

function ToggleSetting({ label, description, enabled, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
      <div>
        <p className="text-white font-medium">{label}</p>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition ${
          enabled ? 'bg-blue-600' : 'bg-slate-700'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

