import React from 'react'
import { useLocation } from 'react-router-dom'

const menu = [
  { icon: '📊', label: 'Dashboard', path: '/' },
  { icon: '💼', label: 'Job Board', path: '/jobs' },
  { icon: '🎯', label: 'AI Matching', path: '/matching' },
  { icon: '📋', label: 'Applications', path: '/applications' },
  { icon: '✉️', label: 'Cover Letter', path: '/cover-letter' },
]

export default function Sidebar({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col p-4">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-extrabold">
          <span className="gradient-text">CareerPulse</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">AI-Powered Career Hub</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menu.map(item => (
          <a
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <a href="/login" className="block w-full px-3 py-2 rounded-xl text-sm font-medium text-center bg-blue-500 text-white hover:bg-blue-600 transition-all">
          🔐 Login
        </a>
      </div>
    </aside>
  )
}