// frontend/src/components/dashboard/StatsCards.tsx
import React from 'react';
import { 
  Briefcase, 
  Target, 
  Star, 
  TrendingUp,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight 
} from 'lucide-react';
import { useJobStore } from '@/store/jobStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  trend,
  color = 'primary',
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={cn('p-3 rounded-lg', `bg-${color}-100 dark:bg-${color}-900/20`)}>
          <Icon className={cn('h-5 w-5', `text-${color}-600 dark:text-${color}-400`)} />
        </div>
        {trend && (
          <span className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {change}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
};

export const StatsCards: React.FC = () => {
  const { matchedJobs, bookmarkedJobs } = useJobStore();
  const { user } = useAuthStore();

  const stats = [
    {
      icon: Target,
      label: 'Matched Jobs',
      value: matchedJobs.length,
      change: '+12%',
      trend: 'up' as const,
      color: 'primary',
    },
    {
      icon: Star,
      label: 'Bookmarked',
      value: bookmarkedJobs.length,
      color: 'yellow',
    },
    {
      icon: Briefcase,
      label: 'Applications',
      value: 15,
      change: '+5 this week',
      trend: 'up' as const,
      color: 'green',
    },
    {
      icon: Users,
      label: 'Network Contacts',
      value: 28,
      change: '+3',
      trend: 'up' as const,
      color: 'purple',
    },
    {
      icon: TrendingUp,
      label: 'Profile Views',
      value: 234,
      change: '+18%',
      trend: 'up' as const,
      color: 'orange',
    },
    {
      icon: Award,
      label: 'Skill Score',
      value: `${user?.skills?.length || 0}/20`,
      color: 'pink',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};