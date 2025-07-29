import React from 'react';

export const CompassTest: React.FC = () => {
  console.log('CompassTest component rendering');
  
  // Force render something visible
  React.useEffect(() => {
    console.log('CompassTest mounted');
    const div = document.createElement('div');
    div.innerHTML = '<h1 style="color: red; font-size: 48px;">COMPASS TEST IS RENDERING</h1>';
    div.style.position = 'fixed';
    div.style.top = '100px';
    div.style.left = '300px';
    div.style.zIndex = '9999';
    document.body.appendChild(div);
    
    return () => {
      document.body.removeChild(div);
    };
  }, []);
  
  return (
    <div style={{ padding: '24px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
        COMPASS - Testing
      </h1>
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px' }}>
        Regulatory Intelligence Engine
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
            Total Frameworks
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>4</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
            Compliance Score
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>87%</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
            Active Gaps
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>25</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
            Pending Changes
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b' }}>3</div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
          Compliance Frameworks
        </h2>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: '600', color: '#1e293b' }}>GDPR</h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Last assessed: 2025-07-15</p>
            </div>
            <span style={{ 
              backgroundColor: '#dcfce7', 
              color: '#166534', 
              padding: '4px 12px', 
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};