import React, { useState } from 'react'

export const CoverLetterGenerator: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    try {
      const res = await fetch('/api/v1/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_title: jobTitle, company, job_description: '' }),
      })
      const data = await res.json()
      setResult(data.cover_letter || 'Generated!')
    } catch (e) {
      setResult('Error generating. Make sure backend is running.')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">✉️ AI Cover Letter</h3>
      <input
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border mb-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border mb-3 dark:bg-gray-700 dark:border-gray-600"
      />
      <button
        onClick={handleGenerate}
        className="w-full py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
      >
        Generate
      </button>
      {result && <p className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">{result}</p>}
    </div>
  )
}