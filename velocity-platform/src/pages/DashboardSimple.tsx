import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardSimple: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Executive Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <Card>
          <CardHeader>
            <CardTitle>Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>73</div>
            <p>-12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>94%</div>
            <p>+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>24</div>
            <p>-3 resolved this week</p>
          </CardContent>
        </Card>
      </div>
      
      <Button>Generate Report</Button>
    </div>
  );
};