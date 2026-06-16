// frontend/src/services/jobService.ts
import { api } from './api';
import { Job, MatchResponse } from '@/types';

export const jobService = {
  getJobs: (params?: { category?: string; location?: string; limit?: number }) =>
    api.get<Job[]>('/jobs', { params }),

  getJob: (id: string) => api.get<Job>(`/jobs/${id}`),

  createJob: (data: Partial<Job>) => api.post<Job>('/jobs', data),

  matchJobs: (limit?: number) =>
    api.get<MatchResponse>('/match/jobs', { params: { limit } }),

  getSkillGaps: () => api.get('/match/skills-gap'),

  bookmarkJob: (jobId: string) => api.post(`/jobs/${jobId}/bookmark`),

  unbookmarkJob: (jobId: string) => api.delete(`/jobs/${jobId}/bookmark`),

  getBookmarks: () => api.get<Job[]>('/jobs/bookmarks'),

  applyToJob: (jobId: string, notes?: string) =>
    api.post(`/jobs/${jobId}/apply`, { notes }),
};