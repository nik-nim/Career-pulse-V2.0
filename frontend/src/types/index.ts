// frontend/src/types/index.ts
export interface User {
  id: string;
  email: string;
  full_name: string;
  industry?: string;
  experience_level?: string;
  preferred_locations: string[];
  target_roles: string[];
  resume_url?: string;
  linkedin_url?: string;
  skills: UserSkill[];
}

export interface UserSkill {
  id: string;
  skill_name: string;
  proficiency: number;
  endorsements: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category?: string;
  description?: string;
  required_skills: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  source?: string;
  source_url?: string;
  posted_date?: string;
  match_score?: number;
  matched_skills?: MatchedSkill[];
  missing_skills?: string[];
}

export interface MatchedSkill {
  job_skill: string;
  user_skill: string;
  similarity: number;
}

export interface MatchResponse {
  total_jobs: number;
  matched_jobs: Job[];
  user_skills: string[];
  user_id: string;
}

export interface Application {
  id: string;
  job_id: string;
  status: 'applied' | 'phone_screen' | 'interview' | 'offer' | 'rejected';
  applied_date: string;
  notes?: string;
}

export interface CRMContact {
  id: string;
  name: string;
  company: string;
  role?: string;
  notes?: string;
  last_contact?: string;
}

export interface Interview {
  id: string;
  company: string;
  role: string;
  date: string;
  time?: string;
  type: 'phone' | 'technical' | 'behavioral' | 'final';
  notes?: string;
}

export interface Certification {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  exam_date?: string;
}

export interface SkillGap {
  skill: string;
  role: string;
  demand_score: number;
}

export interface SalaryData {
  category: string;
  min: number;
  max: number;
  avg: number;
}