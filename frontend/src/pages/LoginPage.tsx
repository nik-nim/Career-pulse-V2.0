import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:8000/api/v1/auth/login?email=${email}&password=${password}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Logged in!')
      navigate('/')
    } catch (e: any) {
      toast.error('Login failed. Check backend.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-2">🔐 Login</h1>
        <p className="text-center text-slate-500 mb-6">Sign in to CareerPulse</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
          <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          No account? <a href="/register" className="text-blue-500 font-semibold">Register</a>
        </p>
      </div>
    </div>
  )
}