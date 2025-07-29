import React from 'react';
import { ComingSoon } from './ComingSoon';

export const Academy: React.FC = () => {
  return (
    <ComingSoon
      title="Trust Academy"
      description="Learn from security experts and compliance professionals through our comprehensive training platform designed for trust and risk management."
      expectedDate="Q2 2025"
      features={[
        'Expert-led courses',
        'Certification programs',
        'Live workshops',
        'Industry best practices',
        'Compliance training',
        'Risk management fundamentals'
      ]}
    />
  );
};