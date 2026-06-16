// frontend/src/components/jobs/JobCard.tsx
import React from 'react';
import { Job } from '@/types';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { JobMatchBadge } from './JobMatchBadge';
import { useJobStore } from '@/store/jobStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { formatDate, formatSalary } from '@/utils/formatters';

interface JobCardProps {
  job: Job;
  showMatchScore?: boolean;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, showMatchScore = false, compact = false }) => {
  const { bookmarkedJobs, toggleBookmark } = useJobStore();
  const isBookmarked = bookmarkedJobs.some((b) => b.id === job.id);
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all',
        showMatchScore && job.match_score && job.match_score >= 80 && 'ring-2 ring-green-500/20'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3 flex-1">
          {/* Company Logo Placeholder */}
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {job.company.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {job.title}
              </h4>
              {showMatchScore && job.match_score && (
                <JobMatchBadge score={job.match_score} />
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {job.company}
            </p>

            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              {(job.salary_min || job.salary_max) && (
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
              )}
              {job.posted_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(job.posted_date)}
                </span>
              )}
            </div>

            {/* Matched Skills */}
            {showMatchScore && job.matched_skills && job.matched_skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {job.matched_skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill.job_skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    {skill.job_skill}
                  </span>
                ))}
                {job.missing_skills && job.missing_skills.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    +{job.missing_skills.length} skills needed
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleBookmark(job.id)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-yellow-500" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
          {job.source_url && (
            <Button variant="ghost" size="icon" asChild>
              <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Expand Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {job.description?.slice(0, 300)}...
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
              Apply Now
            </Button>
            <Button size="sm" variant="outline">
              Generate Cover Letter
            </Button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 text-xs text-primary-500 hover:text-primary-600 font-medium"
      >
        {showDetails ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
};