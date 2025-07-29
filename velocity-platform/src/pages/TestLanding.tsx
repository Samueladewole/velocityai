/**
 * Simple Landing Test
 * Basic landing page to test if React is working
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'

export function TestLanding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">ERIP Platform</h1>
        <p className="text-xl text-gray-700 mb-8">
          Enterprise Risk Intelligence Platform - Simple Test Page
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
          
          <button 
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => navigate('/dashboard/prism-test')}
          >
            Test PRISM Simple
          </button>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">System Status</h2>
          <p className="text-green-600">✓ React is working</p>
          <p className="text-green-600">✓ Router is working</p>
          <p className="text-green-600">✓ Tailwind CSS is working</p>
        </div>
      </div>
    </div>
  )
}