import React, { useState } from 'react'

export default function ApplicationsPage() {
  const [apps, setApps] = useState([
    { id: 1, company: 'Google', role: 'Software Engineer', status: 'Interview', date: '2026-06-20' },
    { id: 2, company: 'Microsoft', role: 'Data Scientist', status: 'Applied', date: '2026-06-18' },
    { id: 3, company: 'Amazon', role: 'DevOps Engineer', status: 'Phone Screen', date: '2026-06-15' },
  ])

  const statusColors: any = {
    'Applied': 'bg-blue-100 text-blue-700',
    'Phone Screen': 'bg-yellow-100 text-yellow-700',
    'Interview': 'bg-purple-100 text-purple-700',
    'Offer': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📋 Applications</h1>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: apps.length },
          { label: 'Active', value: apps.filter(a => !['Offer','Rejected'].includes(a.status)).length },
          { label: 'Interviews', value: apps.filter(a => a.status === 'Interview').length },
          { label: 'Offers', value: apps.filter(a => a.status === 'Offer').length },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border text-center">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {apps.map(app => (
          <div key={app.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border flex justify-between items-center">
            <div>
              <p className="font-semibold">{app.role}</p>
              <p className="text-sm text-gray-500">{app.company} · {app.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}