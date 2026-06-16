const API = '/api/v1'

export const aiService = {
  generateCoverLetter: async (data: {
    job_title: string
    company: string
    job_description: string
  }) => {
    const res = await fetch(`${API}/ai/cover-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  parseResume: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API}/ai/parse-resume`, {
      method: 'POST',
      body: formData,
    })
    return res.json()
  },
}