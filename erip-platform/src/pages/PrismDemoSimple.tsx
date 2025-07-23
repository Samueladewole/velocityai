/**
 * Simple PRISM Demo Test
 * Basic component to test if React rendering works
 */
import React from 'react'

export function PrismDemoSimple() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">PRISM Demo - Simple Test</h1>
      <p>If you can see this, React is working correctly.</p>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  )
}