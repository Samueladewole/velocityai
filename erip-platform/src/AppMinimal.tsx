/**
 * Minimal App Test
 * Simplest possible React app to test if anything renders
 */
import React from 'react'

function AppMinimal() {
  console.log('AppMinimal rendering...')
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h1 style={{ color: 'black' }}>ERIP App - Minimal Test</h1>
      <p style={{ color: 'black' }}>If you see this, React is working.</p>
    </div>
  )
}

export default AppMinimal