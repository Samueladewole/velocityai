import React from 'react';
import { Button } from '@/components/ui/button';

export const LandingSimple: React.FC = () => {
  console.log('LandingSimple rendering with Button import');
  
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>ERIP Platform</h1>
      <p style={{ fontSize: '20px', marginBottom: '40px' }}>Enterprise Risk Intelligence Platform</p>
      <Button>Test Button Component</Button>
    </div>
  );
};