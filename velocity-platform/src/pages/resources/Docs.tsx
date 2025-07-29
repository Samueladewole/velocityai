import React from 'react';
import { ComingSoon } from './ComingSoon';

export const Docs: React.FC = () => {
  return (
    <ComingSoon
      title="Documentation"
      description="Comprehensive guides, tutorials, and API documentation to help you get the most out of ERIP's Trust Intelligence Platform."
      expectedDate="Q2 2025"
      features={[
        'Getting started guides',
        'API documentation',
        'Integration tutorials',
        'Best practices',
        'Troubleshooting guides',
        'Video walkthroughs'
      ]}
    />
  );
};