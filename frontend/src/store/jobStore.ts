import { create } from 'zustand'

interface Job {
  id: string
  title: string
  company: string
  location: string
  category?: string
  match_score?: number
  salary_min?: number
  salary_max?: number
}

interface JobState {
  jobs: Job[]
  matchedJobs: Job[]
  bookmarkedJobs: Job[]
  isLoading: boolean
  error: string | null
  fetchJobs: () => Promise<void>
  fetchMatchedJobs: () => Promise<void>
  fetchSkillGaps: () => Promise<void>
  toggleBookmark: (jobId: string) => void
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  matchedJobs: [],
  bookmarkedJobs: [],
  isLoading: false,
  error: null,

  fetchJobs: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/v1/jobs')
      const data = await res.json()
      set({ jobs: data, isLoading: false })
    } catch (e: any) {
      set({ error: e.message, isLoading: false })
    }
  },

  fetchMatchedJobs: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/v1/match/jobs?limit=10')
      const data = await res.json()
      set({ matchedJobs: data.matched_jobs || [], isLoading: false })
    } catch (e: any) {
      set({ error: e.message, isLoading: false })
    }
  },

  fetchSkillGaps: async () => {
    try {
      const res = await fetch('/api/v1/match/skills-gap')
      const data = await res.json()
      console.log('Skill gaps:', data)
    } catch (e) {
      console.error('Failed to fetch skill gaps')
    }
  },

  toggleBookmark: (jobId: string) => {
    const { bookmarkedJobs, jobs } = get()
    const isBookmarked = bookmarkedJobs.some((j) => j.id === jobId)
    if (isBookmarked) {
      set({ bookmarkedJobs: bookmarkedJobs.filter((j) => j.id !== jobId) })
    } else {
      const job = jobs.find((j) => j.id === jobId)
      if (job) set({ bookmarkedJobs: [...bookmarkedJobs, job] })
    }
  },
}))