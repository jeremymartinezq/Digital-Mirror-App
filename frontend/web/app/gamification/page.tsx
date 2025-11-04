'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { api } from '@/services/api'
import {
  TrophyIcon,
  FireIcon,
  StarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function GamificationPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
      const [profileData, achievementsData] = await Promise.all([
        api.getGamificationProfile(),
        api.getAchievements(),
      ])
      setProfile(profileData)
      setAchievements(achievementsData)
    } catch (error) {
      console.error('Failed to load gamification data:', error)
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

  const levelProgress = profile ? ((profile.points % 100) / 100) * 100 : 0
  const nextLevelPoints = profile ? (Math.floor(profile.points / 100) + 1) * 100 : 100

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Goals & Achievements</h1>
          <p className="text-gray-400 mt-1">Track your financial journey and earn rewards</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <TrophyIcon className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Level {profile?.level || 1}
                </h2>
                <p className="text-white/80 mb-3">
                  {profile?.points || 0} points • {profile?.streak || 0} day streak 🔥
                </p>
                <div className="w-64 bg-white/20 rounded-full h-3">
                  <div
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <p className="text-white/70 text-sm mt-2">
                  {nextLevelPoints - (profile?.points || 0)} points to next level
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-3">
                <FireIcon className="w-8 h-8 text-orange-300" />
                <span className="text-4xl font-bold text-white">{profile?.streak || 0}</span>
              </div>
              <p className="text-white/80">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<TrophyIcon className="w-6 h-6" />}
            label="Total Achievements"
            value={achievements.filter(a => a.earned).length}
            color="yellow"
          />
          <StatCard
            icon={<StarIcon className="w-6 h-6" />}
            label="Total Points"
            value={profile?.points || 0}
            color="blue"
          />
          <StatCard
            icon={<FireIcon className="w-6 h-6" />}
            label="Current Streak"
            value={`${profile?.streak || 0} days`}
            color="orange"
          />
          <StatCard
            icon={<ChartBarIcon className="w-6 h-6" />}
            label="Current Level"
            value={profile?.level || 1}
            color="purple"
          />
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 transition ${
                  achievement.earned
                    ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                    : 'border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                        : 'bg-slate-700'
                    }`}
                  >
                    <TrophyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">
                      {achievement.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400 text-sm font-semibold">
                          ✓ Unlocked
                        </span>
                        {achievement.earned_date && (
                          <span className="text-gray-500 text-xs">
                            {new Date(achievement.earned_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">🔒 Locked</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {achievements.length === 0 && (
            <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
              <TrophyIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No achievements yet</h3>
              <p className="text-gray-400">
                Start using the app to unlock achievements and earn rewards!
              </p>
            </div>
          )}
        </div>

        {/* Daily Goals */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Daily Goals</h2>
          <div className="space-y-3">
            <GoalItem
              title="Log a transaction"
              completed={profile?.daily_transaction_logged || false}
              points={10}
            />
            <GoalItem
              title="Check your dashboard"
              completed={profile?.daily_dashboard_check || false}
              points={5}
            />
            <GoalItem
              title="Run a simulation"
              completed={profile?.daily_simulation_run || false}
              points={15}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ icon, label, value, color }: any) {
  const colorClasses: any = {
    yellow: 'from-yellow-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500',
    orange: 'from-orange-500 to-red-500',
    purple: 'from-purple-500 to-pink-500',
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function GoalItem({ title, completed, points }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            completed ? 'bg-green-500' : 'bg-slate-700'
          }`}
        >
          {completed && <span className="text-white text-sm">✓</span>}
        </div>
        <span className={completed ? 'text-white' : 'text-gray-400'}>{title}</span>
      </div>
      <span className="text-yellow-400 font-semibold">+{points} pts</span>
    </div>
  )
}

