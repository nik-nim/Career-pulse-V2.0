import React, { useState } from 'react'

const API = 'http://localhost:8000/api/v1'

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jd, setJd] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/ai/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_title: jobTitle, company, job_description: jd }),
      })
      const data = await res.json()
      setResult(data.cover_letter || 'Generated! Check backend logs.')
    } catch {
      setResult('Error connecting to backend. Is it running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">✉️ AI Cover Letter Generator</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border space-y-4">
        <input placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600" />
        <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600" />
        <textarea placeholder="Job Description (paste here)" value={jd} onChange={e => setJd(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600" />
        <button onClick={handleGenerate} disabled={loading} className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 disabled:opacity-50">
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </button>
        {result && <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl whitespace-pre-wrap text-sm">{result}</div>}
      </div>
    </div>
  )
}