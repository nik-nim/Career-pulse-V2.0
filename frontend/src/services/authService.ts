const API = '/api/v1'

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const formData = new URLSearchParams()
    formData.append('username', data.email)
    formData.append('password', data.password)

    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },

  register: async (data: { email: string; password: string; full_name: string }) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Registration failed')
    return res.json()
  },
}