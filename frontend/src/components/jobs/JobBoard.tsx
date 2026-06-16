import React from 'react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  match_score?: number
  salary_min?: number
  salary_max?: number
}

interface Props {
  jobs: Job[]
  showMatchScore?: boolean
}

export const JobBoard: React.FC<Props> = ({ jobs, showMatchScore = false }) => {
  if (!jobs.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No jobs found. Start backend and add jobs!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border flex justify-between items-center">
          <div>
            <h4 className="font-semibold">{job.title}</h4>
            <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
          </div>
          {showMatchScore && job.match_score && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {job.match_score}% match
            </span>
          )}
        </div>
      ))}
    </div>
  )
}