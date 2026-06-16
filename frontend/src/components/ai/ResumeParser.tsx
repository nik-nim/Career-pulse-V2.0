import React from 'react'

export const ResumeParser: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">📄 Resume Parser</h3>
      <div className="border-2 border-dashed rounded-xl p-8 text-center">
        <p className="text-gray-500">Drag & drop your resume here</p>
      </div>
    </div>
  )
}