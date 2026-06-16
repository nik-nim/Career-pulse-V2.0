import React, { useState } from 'react'

export const InterviewScheduler: React.FC = () => {
  const [date, setDate] = useState('')
  const [company, setCompany] = useState('')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">📅 Schedule Interview</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
        />
        <button className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">
          Schedule
        </button>
      </div>
    </div>
  )
}