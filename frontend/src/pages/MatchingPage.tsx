import React, { useEffect, useState } from 'react'

const API = 'http://localhost:8000/api/v1'

export default function MatchingPage() {
  const [matched, setMatched] = useState<any[]>([])
  const [skills, setSkills] = useState<string[]>([])

  useEffect(() => {
    fetch(`${API}/match/jobs?limit=10`)
      .then(r => r.json())
      .then(data => {
        setMatched(data.matched_jobs || [])
        setSkills(data.user_skills || [])
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🎯 AI Job Matching</h1>
      <p className="text-gray-500">Jobs matched to your profile using AI</p>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <span key={s} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">{s}</span>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {matched.map((job: any, i: number) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
            </div>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold">
              {job.match_score || 0}%
            </span>
          </div>
        ))}
        {matched.length === 0 && (
          <p className="text-gray-500 text-center py-12">Add skills to your profile to see AI-matched jobs.</p>
        )}
      </div>
    </div>
  )
}