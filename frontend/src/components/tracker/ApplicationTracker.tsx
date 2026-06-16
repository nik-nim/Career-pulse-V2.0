import React from 'react'

export const ApplicationTracker: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">📋 Application Tracker</h3>
      <div className="space-y-2">
        <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="font-medium">Google - Software Engineer</span>
          <span className="text-green-600 text-sm">Interview</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="font-medium">Microsoft - Data Scientist</span>
          <span className="text-blue-600 text-sm">Applied</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="font-medium">Amazon - DevOps</span>
          <span className="text-yellow-600 text-sm">Phone Screen</span>
        </div>
      </div>
    </div>
  )
}