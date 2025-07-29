import React from 'react';
import { Outlet } from 'react-router-dom';

export const LayoutSimple: React.FC = () => {
  return (
    <div>
      <header style={{ 
        backgroundColor: '#1e293b', 
        color: 'white', 
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>ERIP Dashboard</h1>
      </header>
      
      <nav style={{ 
        backgroundColor: '#f1f5f9', 
        padding: '16px',
        marginBottom: '20px'
      }}>
        <a href="/app" style={{ marginRight: '20px' }}>Dashboard</a>
        <a href="/app/compass" style={{ marginRight: '20px' }}>Compass</a>
        <a href="/app/atlas" style={{ marginRight: '20px' }}>Atlas</a>
        <a href="/app/prism" style={{ marginRight: '20px' }}>Prism</a>
      </nav>
      
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};