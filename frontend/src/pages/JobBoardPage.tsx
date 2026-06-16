import React, { useEffect, useState } from 'react'

const API = 'http://localhost:8000/api/v1'

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/jobs?limit=50`)
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = jobs.filter(j => {
    const matchSearch = j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || j.category === category
    return matchSearch && matchCat
  })

  const categories = [...new Set(jobs.map((j: any) => j.category).filter(Boolean))]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">💼 Job Board</h1>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search jobs or companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Jobs */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No jobs found. Add some via the backend API.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job: any, i: number) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border flex justify-between items-start gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {(job.company || '?')[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-gray-500">{job.company} · {job.location}</p>
                  {job.salary_min && (
                    <p className="text-sm text-green-600 mt-1">₹{job.salary_min}L - ₹{job.salary_max}L</p>
                  )}
                  {job.category && (
                    <span className="inline-block mt-2 px-3 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                      {job.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600">Apply</button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">☆</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}