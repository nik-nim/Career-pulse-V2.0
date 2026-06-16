import React from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'

const API = 'http://localhost:8000/api/v1'

// ─── HELPERS ───
const getToken = () => localStorage.getItem('token') || ''
const getUser = () => { try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null } }
const apiCall = async (url: string, method = 'GET', body?: any) => {
  const headers: any = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const options: any = { method, headers }
  if (body) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }
  const res = await fetch(`${API}${url}`, options)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Request failed')
  }
  return res.json()
}

// ─── EXPORT UTILITIES ───
function exportToCSV(data: any[], filename: string) {
  if (!data.length) return toast.error('No data to export')
  const headers = Object.keys(data[0])
  const csv = [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${filename}.csv`; a.click()
  URL.revokeObjectURL(url)
  toast.success('CSV exported!')
}

function exportToJSON(data: any[], filename: string) {
  if (!data.length) return toast.error('No data to export')
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${filename}.json`; a.click()
  URL.revokeObjectURL(url)
  toast.success('JSON exported!')
}

function printSection(elementId: string) {
  const el = document.getElementById(elementId)
  if (!el) return
  const win = window.open('', '', 'width=900,height=700')
  win?.document.write('<html><head><title>CareerPulse Report</title><script src="https://cdn.tailwindcss.com"><\/script></head><body>' + el.innerHTML + '</body></html>')
  win?.document.close()
  setTimeout(() => win?.print(), 500)
}

// ─── LOGIN PAGE ───
function LoginPage() {
  const [form, setForm] = React.useState({ email: '', password: '' })
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await (await fetch(`${API}/auth/login?email=${form.email}&password=${form.password}`, { method: 'POST' })).json()
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success('Logged in!')
        navigate('/')
      } else { toast.error('Invalid credentials') }
    } catch { toast.error('Login failed. Is backend running?') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">🚀 CareerPulse</h1>
        <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 border rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 outline-none" />
        <input type="password" required placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none" />
        <button type="submit" disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          No account? <a href="/register" className="text-blue-600 font-semibold hover:underline">Create one</a>
        </p>
      </form>
    </div>
  )
}

// ─── REGISTER PAGE ───
function RegisterPage() {
  const [form, setForm] = React.useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await (await fetch(`${API}/auth/register?email=${form.email}&password=${form.password}&full_name=${form.name}`, { method: 'POST' })).json()
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success('Account created!')
        navigate('/')
      }
    } catch { toast.error('Registration failed') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">🎉 Create Account</h1>
        <input required placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 border rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 outline-none" />
        <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 border rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 outline-none" />
        <input type="password" required placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none" />
        <button type="submit" disabled={loading}
          className="w-full p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</a>
        </p>
      </form>
    </div>
  )
}

// ─── DASHBOARD PAGE ───
function DashboardPage() {
  const [jobs, setJobs] = React.useState<any[]>([])
  const [apps, setApps] = React.useState<any[]>([])
  const [interviews, setInterviews] = React.useState<any[]>([])
  const [logs, setLogs] = React.useState<any[]>([])

  React.useEffect(() => {
    apiCall('/jobs?limit=5').then(setJobs).catch(() => {})
    apiCall('/profile/applications').then(setApps).catch(() => {})
    apiCall('/profile/interviews').then(setInterviews).catch(() => {})
    apiCall('/profile/daily-logs').then(setLogs).catch(() => {})
  }, [])

  const applyToJob = async (job: any) => {
    try {
      await apiCall('/profile/applications', 'POST', { job_title: job.title, company: job.company, location: job.location, status: 'Applied', notes: '', applied_date: new Date().toISOString().split('T')[0] })
      toast.success('Applied successfully!')
      const updated = await apiCall('/profile/applications')
      setApps(updated)
    } catch { toast.error('Login required to apply') }
  }

  const statusCount: any = { Applied: 0, 'Phone Screen': 0, Interview: 0, Offer: 0, Rejected: 0 }
  apps.forEach(a => { if (statusCount[a.status] !== undefined) statusCount[a.status]++ })
  const funnelData = Object.entries(statusCount).map(([name, value]) => ({ name, value: value as number }))
  const maxFunnel = Math.max(...funnelData.map(f => f.value), 1)
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500']

  const dailyData = logs.slice(0, 7).reverse().map(l => ({ date: l.date, apps: l.applications_count, interviews: l.interviews_count, hours: l.practice_hours }))

  return (
    <div className="p-6 lg:p-8 space-y-6" id="printable-area">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">👋 Dashboard</h1>
        <button onClick={async () => {
          try {
            await apiCall('/profile/notify/daily-summary', 'POST')
            toast.success('Daily summary sent! Check server logs')
          } catch { toast.error('Failed') }
        }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm">
          📧 Send Daily Summary
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: apps.length, icon: '📨', color: 'from-blue-500 to-blue-600' },
          { label: 'Interviews', value: interviews.length, icon: '🎤', color: 'from-purple-500 to-purple-600' },
          { label: 'Jobs', value: jobs.length, icon: '💼', color: 'from-green-500 to-green-600' },
          { label: 'Practice', value: logs.reduce((s, l) => s + l.practice_hours, 0).toFixed(1) + 'h', icon: '⏱️', color: 'from-orange-500 to-orange-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
              <span className={`bg-gradient-to-r ${s.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>Active</span>
            </div>
            <p className="text-3xl font-extrabold mt-2">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold mb-4">📊 Application Funnel</h2>
          {funnelData.map((d, i) => (
            <div key={d.name} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">{d.name}</span><span className="font-bold">{d.value}</span></div>
              <div className="w-full bg-gray-100 rounded-full h-5">
                <div className={`${colors[i]} h-5 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all duration-700`} style={{ width: `${(d.value / maxFunnel) * 100}%` }}>
                  {d.value > 0 && `${Math.round((d.value / maxFunnel) * 100)}%`}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold mb-4">📅 Last 7 Days Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Date</th><th className="text-center">Apps</th><th className="text-center">Intv</th><th className="text-center">Hours</th></tr></thead>
              <tbody>
                {dailyData.map((d, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{d.date}</td>
                    <td className="text-center"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{d.apps}</span></td>
                    <td className="text-center"><span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{d.interviews}</span></td>
                    <td className="text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">{d.hours}h</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-bold mb-4">📌 Job Listings</h2>
        {jobs.map((j, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl mb-2">
            <div><p className="font-semibold">{j.title}</p><p className="text-sm text-gray-500">{j.company} · {j.location}</p></div>
            <button onClick={() => applyToJob(j)} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all">Apply</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── JOBS PAGE ───
function JobsPage() {
  const [jobs, setJobs] = React.useState<any[]>([])
  const [search, setSearch] = React.useState('')
  const [scraping, setScraping] = React.useState(false)
  const [scrapeRole, setScrapeRole] = React.useState('software engineer')
  const [scrapeLocation, setScrapeLocation] = React.useState('india')

  React.useEffect(() => { apiCall('/jobs?limit=50').then(setJobs).catch(() => {}) }, [])

  const filtered = jobs.filter(j => j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase()))

  const applyToJob = async (job: any) => {
    try {
      await apiCall('/profile/applications', 'POST', { job_title: job.title, company: job.company, location: job.location, status: 'Applied', notes: '', applied_date: new Date().toISOString().split('T')[0] })
      toast.success('Applied successfully!')
    } catch { toast.error('Login required') }
  }

  return (
    <div className="p-6 space-y-6" id="printable-area">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-extrabold text-gray-900">💼 Job Board</h1>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(jobs, 'jobs')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">📥 CSV</button>
          <button onClick={() => exportToJSON(jobs, 'jobs')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">📥 JSON</button>
          <button onClick={() => printSection('printable-area')} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">🖨️ Print</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border space-y-2">
        <h3 className="font-bold">🔍 Scrape Live Jobs</h3>
        <div className="flex gap-2 flex-wrap">
          <input value={scrapeRole} onChange={e => setScrapeRole(e.target.value)} placeholder="Role" className="flex-1 p-2 border rounded-lg text-sm min-w-[150px]" />
          <input value={scrapeLocation} onChange={e => setScrapeLocation(e.target.value)} placeholder="Location" className="flex-1 p-2 border rounded-lg text-sm min-w-[150px]" />
          <button onClick={async () => {
            setScraping(true)
            try {
              const res = await fetch(`${API}/jobs/scrape?role=${scrapeRole}&location=${scrapeLocation}`, { method: 'POST' })
              const data = await res.json()
              toast.success(`Found ${data.jobs?.length || 0} jobs!`)
              const updated = await apiCall('/jobs?limit=50')
              setJobs(updated)
            } catch { toast.error('Scraping failed') }
            setScraping(false)
          }} disabled={scraping} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-50">
            {scraping ? 'Scraping...' : '🔍 Scrape Jobs'}
          </button>
        </div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or companies..."
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />

      <div className="space-y-3">
        {filtered.map((j, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border flex justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-lg">{j.title}</h3>
              <p className="text-gray-500">{j.company} · {j.location}</p>
              {j.salary_min && <p className="text-green-600 font-semibold mt-1">₹{j.salary_min}L - ₹{j.salary_max}L</p>}
              <div className="flex gap-1 mt-2 flex-wrap">{(j.required_skills || []).slice(0, 4).map((s: string) => <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{s}</span>)}</div>
            </div>
            <button onClick={() => applyToJob(j)} className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all flex-shrink-0">Apply</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PROFILE PAGE ───
function ProfilePage() {
  const [profile, setProfile] = React.useState<any>({})
  const [skill, setSkill] = React.useState('')
  const [uploading, setUploading] = React.useState(false)

  React.useEffect(() => { apiCall('/profile').then(setProfile).catch(() => {}) }, [])

  const addSkill = async () => {
    if (!skill.trim()) return
    try {
      await apiCall(`/profile/skills?skill_name=${skill}`, 'POST')
      toast.success('Skill added!')
      setSkill('')
      const updated = await apiCall('/profile')
      setProfile(updated)
    } catch { toast.error('Failed to add skill') }
  }

  const updateField = async (field: string, value: any) => {
    try {
      await apiCall(`/profile?${field}=${encodeURIComponent(value)}`, 'PUT')
      const updated = await apiCall('/profile')
      setProfile(updated)
      toast.success('Updated!')
    } catch { toast.error('Update failed') }
  }

  const uploadResume = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const token = getToken()
      const res = await fetch(`${API}/profile/resume`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      toast.success(`Resume parsed! Found ${data.skills_count} skills`)
      const updated = await apiCall('/profile')
      setProfile(updated)
    } catch { toast.error('Upload failed') }
    setUploading(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl" id="printable-area">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">👤 My Profile</h1>
        <button onClick={() => printSection('printable-area')} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">🖨️ Print</button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        {[
          ['Full Name', 'full_name', profile.full_name],
          ['Headline', 'headline', profile.headline],
          ['Bio', 'bio', profile.bio],
          ['Phone', 'phone', profile.phone],
          ['Location', 'location', profile.location],
          ['Target Role', 'target_role', profile.target_role],
          ['Education', 'education', profile.education],
          ['LinkedIn URL', 'linkedin_url', profile.linkedin_url],
          ['GitHub URL', 'github_url', profile.github_url],
        ].map(([label, key, value]) => (
          <div key={key} className="flex gap-2 items-center">
            <span className="w-32 text-sm font-medium text-gray-600">{label}:</span>
            <input defaultValue={value || ''} onBlur={e => updateField(key, e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">Skills:</label>
          <div className="flex flex-wrap gap-2 mb-2">{(profile.skills || []).map((s: any) =>
            <span key={s.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{s.skill_name}</span>
          )}</div>
          <div className="flex gap-2">
            <input value={skill} onChange={e => setSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Add skill..." className="flex-1 p-2 border rounded-lg outline-none" />
            <button onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Add</button>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-bold mb-3">📄 Upload Resume (PDF/DOC/TXT)</h3>
          <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-blue-400 transition-all cursor-pointer"
            onClick={() => document.getElementById('resumeInput')?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={async e => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) await uploadResume(file) }}>
            <input id="resumeInput" type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
              onChange={async e => { const file = e.target.files?.[0]; if (file) await uploadResume(file) }} />
            <p className="text-4xl mb-2">📄</p>
            <p className="font-medium text-gray-600">Drag & drop your resume here</p>
            <p className="text-sm text-gray-400">PDF, DOC, DOCX, TXT (max 5MB)</p>
            {uploading && <p className="text-blue-500 mt-2 animate-pulse">Uploading & parsing...</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── APPLICATIONS PAGE ───
function ApplicationsPage() {
  const [apps, setApps] = React.useState<any[]>([])
  React.useEffect(() => { apiCall('/profile/applications').then(setApps).catch(() => {}) }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiCall(`/profile/applications/${id}?status=${status}`, 'PUT')
      const updated = await apiCall('/profile/applications')
      setApps(updated)
      toast.success('Status updated!')
    } catch { toast.error('Update failed') }
  }

  const addNew = async () => {
    const title = prompt('Job Title:')
    const company = prompt('Company:')
    if (!title || !company) return
    try {
      await apiCall('/profile/applications', 'POST', { job_title: title, company, location: '', status: 'Applied', notes: '', applied_date: new Date().toISOString().split('T')[0] })
      const updated = await apiCall('/profile/applications')
      setApps(updated)
      toast.success('Application added!')
    } catch { toast.error('Failed') }
  }

  const statuses = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected']
  return (
    <div className="p-6 space-y-6" id="printable-area">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-extrabold text-gray-900">📋 Applications</h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportToCSV(apps, 'applications')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">📥 CSV</button>
          <button onClick={() => exportToJSON(apps, 'applications')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">📥 JSON</button>
          <button onClick={() => printSection('printable-area')} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">🖨️ Print</button>
          <button onClick={addNew} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-sm">+ Add New</button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {statuses.map(s => <div key={s} className="bg-white rounded-2xl p-4 shadow-sm border text-center">
          <div className="text-2xl font-bold">{apps.filter(a => a.status === s).length}</div>
          <div className="text-xs text-gray-500">{s}</div>
        </div>)}
      </div>
      <div className="space-y-3">
        {apps.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border flex justify-between items-center">
            <div><p className="font-bold">{a.job_title}</p><p className="text-sm text-gray-500">{a.company} · {a.applied_date}</p></div>
            <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)} className="p-2 border rounded-lg cursor-pointer">
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {apps.length === 0 && <p className="text-center text-gray-400 py-8">No applications yet. Use "Add New" or apply from Job Board!</p>}
      </div>
    </div>
  )
}

// ─── INTERVIEWS PAGE ───
function InterviewsPage() {
  const [interviews, setInterviews] = React.useState<any[]>([])
  const [form, setForm] = React.useState({ company: '', role: '', date: '', time: '', type: 'Technical' })

  React.useEffect(() => { apiCall('/profile/interviews').then(setInterviews).catch(() => {}) }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company || !form.role || !form.date) return toast.error('Fill all required fields')
    try {
      await apiCall(`/profile/interviews?company=${form.company}&role=${form.role}&date=${form.date}&time=${form.time}&type=${form.type}`, 'POST')
      toast.success('Interview scheduled!')
      const updated = await apiCall('/profile/interviews')
      setInterviews(updated)
      setForm({ company: '', role: '', date: '', time: '', type: 'Technical' })
    } catch { toast.error('Failed to schedule') }
  }

  return (
    <div className="p-6 space-y-6" id="printable-area">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-extrabold text-gray-900">📅 Interviews</h1>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(interviews, 'interviews')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">📥 CSV</button>
          <button onClick={() => exportToJSON(interviews, 'interviews')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">📥 JSON</button>
          <button onClick={() => printSection('printable-area')} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">🖨️ Print</button>
        </div>
      </div>
      <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-sm border space-y-3">
        <h3 className="font-bold text-lg">Schedule New Interview</h3>
        <div className="grid grid-cols-2 gap-3">
          <input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company *" className="p-3 border rounded-xl outline-none" />
          <input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Role *" className="p-3 border rounded-xl outline-none" />
          <input required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} type="date" className="p-3 border rounded-xl outline-none" />
          <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} type="time" className="p-3 border rounded-xl outline-none" />
        </div>
        <button type="submit" className="w-full p-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all">📅 Schedule Interview</button>
      </form>
      <div className="space-y-3">
        {interviews.map(i => (
          <div key={i.id} className="bg-white rounded-2xl p-4 shadow-sm border flex justify-between items-center">
            <div><p className="font-bold">{i.company} - {i.role}</p><p className="text-sm text-gray-500">{i.date} {i.time} · {i.type}</p></div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">{i.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DAILY TRACKER PAGE ───
function DailyPage() {
  const [logs, setLogs] = React.useState<any[]>([])
  const [form, setForm] = React.useState({ apps: 0, interviews: 0, hours: 0, mood: '😊 Great', notes: '' })

  React.useEffect(() => { apiCall('/profile/daily-logs').then(setLogs).catch(() => {}) }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiCall(`/profile/daily-logs?applications_count=${form.apps}&interviews_count=${form.interviews}&practice_hours=${form.hours}&mood=${encodeURIComponent(form.mood)}&notes=${encodeURIComponent(form.notes)}`, 'POST')
      toast.success('Daily log saved!')
      const updated = await apiCall('/profile/daily-logs')
      setLogs(updated)
      setForm({ apps: 0, interviews: 0, hours: 0, mood: '😊 Great', notes: '' })
    } catch { toast.error('Failed to save') }
  }

  return (
    <div className="p-6 space-y-6" id="printable-area">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-extrabold text-gray-900">📊 Daily Tracker</h1>
        <div className="flex gap-2">
          <button onClick={() => exportToCSV(logs, 'daily-logs')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">📥 CSV</button>
          <button onClick={() => exportToJSON(logs, 'daily-logs')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">📥 JSON</button>
          <button onClick={() => printSection('printable-area')} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">🖨️ Print</button>
        </div>
      </div>
      <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-sm border space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm font-medium">Applications</label><input type="number" value={form.apps} onChange={e => setForm({ ...form, apps: +e.target.value })} className="w-full p-3 border rounded-xl outline-none" /></div>
          <div><label className="text-sm font-medium">Interviews</label><input type="number" value={form.interviews} onChange={e => setForm({ ...form, interviews: +e.target.value })} className="w-full p-3 border rounded-xl outline-none" /></div>
        </div>
        <div><label className="text-sm font-medium">Practice Hours</label><input type="number" step="0.5" value={form.hours} onChange={e => setForm({ ...form, hours: +e.target.value })} className="w-full p-3 border rounded-xl outline-none" /></div>
        <div><label className="text-sm font-medium">Mood</label>
          <select value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })} className="w-full p-3 border rounded-xl outline-none">
            {['😊 Great', '💪 Motivated', '😐 Okay', '😞 Stressed', '🔥 Productive'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div><label className="text-sm font-medium">Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full p-3 border rounded-xl outline-none" rows={2} /></div>
        <button type="submit" className="w-full p-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">💾 Save Today's Log</button>
      </form>
      <div className="space-y-2">
        <h3 className="font-bold">📅 Recent Logs</h3>
        {logs.slice(0, 7).map((l, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border flex justify-between flex-wrap gap-2">
            <span className="font-semibold">{l.date}</span><span>{l.mood}</span>
            <span className="text-blue-600 font-semibold">{l.applications_count} apps</span>
            <span className="text-purple-600 font-semibold">{l.interviews_count} intv</span>
            <span className="text-green-600 font-semibold">{l.practice_hours}h</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── AI TOOLS PAGE ───
function AIPage() {
  const [role, setRole] = React.useState('Software Engineer')
  const [company, setCompany] = React.useState('Google')
  const [coverLetter, setCoverLetter] = React.useState('')
  const [questions, setQuestions] = React.useState<string[]>([])
  const [qType, setQType] = React.useState('Technical')
  const [mockData, setMockData] = React.useState<any>(null)
  const [resumeTips, setResumeTips] = React.useState<string[]>([])

  return (
    <div className="p-6 space-y-6" id="printable-area">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">🤖 AI Career Tools</h1>
        <button onClick={() => printSection('printable-area')} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">🖨️ Print</button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-3">
        <h2 className="text-xl font-bold">✉️ Cover Letter Generator</h2>
        <input value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 border rounded-xl outline-none" placeholder="Job Role" />
        <input value={company} onChange={e => setCompany(e.target.value)} className="w-full p-3 border rounded-xl outline-none" placeholder="Company" />
        <button onClick={async () => { const d = await (await fetch(`${API}/ai/cover-letter?role=${role}&company=${company}`, { method: 'POST' })).json(); setCoverLetter(d.cover_letter) }}
          className="w-full p-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all">Generate Cover Letter</button>
        {coverLetter && <div className="p-4 bg-gray-50 rounded-xl whitespace-pre-wrap text-sm">{coverLetter}</div>}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-3">
        <h2 className="text-xl font-bold">🎤 Interview Prep Questions</h2>
        <select value={qType} onChange={e => setQType(e.target.value)} className="w-full p-3 border rounded-xl outline-none">
          <option>Technical</option><option>Behavioral</option><option>HR</option>
        </select>
        <button onClick={async () => { const d = await (await fetch(`${API}/ai/interview-questions?type=${qType}&count=5`)).json(); setQuestions(d.questions) }}
          className="w-full p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Get Questions</button>
        {questions.map((q, i) => <div key={i} className="p-3 bg-gray-50 rounded-xl text-sm">❓ {q}</div>)}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-3">
        <h2 className="text-xl font-bold">🎯 Mock Interview</h2>
        <button onClick={async () => { const d = await (await fetch(`${API}/ai/mock-interview?role=${role}`)).json(); setMockData(d) }}
          className="w-full p-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all">Start Mock Interview</button>
        {mockData && (
          <div className="space-y-2">
            <p className="font-bold">{mockData.role}</p>
            {mockData.technical?.map((q: string, i: number) => <p key={i} className="text-sm">🔹 {q}</p>)}
            {mockData.behavioral?.map((q: string, i: number) => <p key={i} className="text-sm">🔸 {q}</p>)}
            <div className="p-3 bg-green-50 rounded-xl">{mockData.tips?.map((t: string, i: number) => <p key={i} className="text-sm text-green-700">✓ {t}</p>)}</div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-3">
        <h2 className="text-xl font-bold">📄 Resume Tips</h2>
        <button onClick={async () => { const d = await (await fetch(`${API}/ai/resume-tips`)).json(); setResumeTips(d.tips) }}
          className="w-full p-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">Get Resume Tips</button>
        {resumeTips.map((t, i) => <p key={i} className="text-green-600 font-medium">✓ {t}</p>)}
      </div>
    </div>
  )
}

// ─── LAYOUT ───
function Layout() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'light')
  const location = useLocation()
  const user = getUser()

  React.useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('theme', theme) }, [theme])

  const nav = [
    { icon: '📊', label: 'Dashboard', path: '/' },
    { icon: '💼', label: 'Jobs', path: '/jobs' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '📋', label: 'Apps', path: '/apps' },
    { icon: '📅', label: 'Interviews', path: '/interviews' },
    { icon: '📊', label: 'Daily Log', path: '/daily' },
    { icon: '🤖', label: 'AI Tools', path: '/ai' },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col p-4">
        <div className="mb-6"><h1 className="text-2xl font-extrabold text-blue-600">🚀 CareerPulse</h1></div>
        <nav className="flex-1 space-y-1">
          {nav.map(item => (
            <a key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t dark:border-gray-700 pt-4 space-y-2">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          {user ? (
            <button onClick={() => { localStorage.clear(); window.location.href = '/login' }} className="w-full p-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">🚪 Logout</button>
          ) : (
            <a href="/login" className="block w-full p-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold text-center hover:bg-blue-700">🔐 Login</a>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/apps" element={<ApplicationsPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/ai" element={<AIPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  )
}