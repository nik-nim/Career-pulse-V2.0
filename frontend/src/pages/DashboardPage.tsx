import React, { useEffect, useState } from 'react'

const API = 'http://localhost:8000/api/v1'

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/jobs?limit=5`)
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stats = [
    { icon: '📨', label: 'Applications', value: 15, color: 'from-blue-500 to-blue-600' },
    { icon: '🎤', label: 'Interviews', value: 4, color: 'from-purple-500 to-purple-600' },
    { icon: '🏆', label: 'Offers', value: 2, color: 'from-green-500 to-green-600' },
    { icon: '⭐', label: 'Saved Jobs', value: jobs.length, color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Good morning 👋</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your career overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card-hover bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`bg-gradient-to-r ${s.color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>+12%</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Jobs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">📌 Recent Opportunities</h2>
          <a href="/jobs" className="text-blue-500 text-sm font-semibold hover:underline">View all →</a>
        </div>
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-2">No jobs in database</p>
            <p className="text-xs text-slate-400">Run: python seed_data.py</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job: any, i: number) => (
              <div key={i} className="card-hover flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {(job.company || '?')[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{job.title}</p>
                    <p className="text-sm text-slate-500">{job.company} · {job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.salary_min && (
                    <span className="text-sm font-semibold text-green-600">₹{job.salary_min}L-{job.salary_max}L</span>
                  )}
                  <button className="btn-pulse px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-all">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '🔍', label: 'Search Jobs', path: '/jobs', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
          { icon: '🎯', label: 'AI Matching', path: '/matching', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
          { icon: '✉️', label: 'Cover Letter', path: '/cover-letter', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
          { icon: '📋', label: 'Track Apps', path: '/applications', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
        ].map(a => (
          <a key={a.label} href={a.path} className={`card-hover ${a.color} rounded-2xl p-5 text-center font-semibold`}>
            <span className="text-3xl block mb-2">{a.icon}</span>
            {a.label}
          </a>
        ))}
      </div>
    </div>
  )
}