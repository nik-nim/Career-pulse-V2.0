import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:8000/api/v1/auth/register?email=${email}&password=${password}&full_name=${name}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch {
      toast.error('Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-2">🎉 Register</h1>
        <form onSubmit={handleRegister} className="space-y-4 mt-6">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 outline-none" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 outline-none" />
          <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600">
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}