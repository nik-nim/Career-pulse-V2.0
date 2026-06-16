// frontend/src/components/dashboard/SalaryChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useUIStore } from '@/store/uiStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const SalaryChart: React.FC = () => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';

  const data = {
    labels: ['Software Eng', 'Data Science', 'DevOps', 'Product Mgmt', 'Frontend', 'Cloud'],
    datasets: [
      {
        label: 'Min (₹ LPA)',
        data: [8, 10, 8, 12, 6, 15],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderRadius: 6,
      },
      {
        label: 'Max (₹ LPA)',
        data: [35, 40, 30, 35, 25, 50],
        backgroundColor: 'rgba(59, 130, 246, 0.9)',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDark ? '#e2e8f0' : '#1e293b',
          padding: 16,
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: '₹ Lakhs Per Annum',
          color: isDark ? '#94a3b8' : '#64748b',
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
        },
        grid: {
          color: isDark ? '#334155' : '#e2e8f0',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        💰 Salary Insights (India)
      </h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};