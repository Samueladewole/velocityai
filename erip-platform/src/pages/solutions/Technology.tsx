import React from 'react';
import { Code, Cloud, Shield, Zap, Lock, GitBranch, Database, Rocket } from 'lucide-react';
import { SolutionPageTemplate } from '@/components/templates/SolutionPageTemplate';

export const Technology: React.FC = () => {
  return (
    <SolutionPageTemplate
      badge={{
        text: 'Technology & SaaS Solution',
        icon: Code
      }}
      title="Built for Tech Companies"
      subtitle="Scale with Trust"
      description="Accelerate sales and reduce security questionnaire overhead with automated compliance designed for SaaS, cloud, and technology companies."
      metrics={[
        { value: '95%', label: 'Faster RFP responses' },
        { value: '60%', label: 'Higher win rates' },
        { value: '€180K', label: 'Average sales acceleration' },
        { value: '8 hrs', label: 'Saved per questionnaire' }
      ]}
      features={[
        {
          title: 'SOC 2 Automation',
          description: 'Streamlined SOC 2 Type II reporting with continuous control monitoring and evidence collection',
          icon: Shield,
          metric: '3x faster certification'
        },
        {
          title: 'Cloud Security Posture',
          description: 'Real-time AWS, Azure, and GCP security scanning with automated remediation workflows',
          icon: Cloud,
          metric: '99.9% uptime monitoring'
        },
        {
          title: 'DevSecOps Integration',
          description: 'Security controls embedded into CI/CD pipelines with shift-left security practices',
          icon: GitBranch,
          metric: 'Zero deployment delays'
        },
        {
          title: 'Customer Trust Portal',
          description: 'Public security pages that prospects can access during evaluation cycles',
          icon: Lock,
          metric: '40% faster deals'
        }
      ]}
      benefits={[
        {
          title: 'Sales Enablement',
          description: 'Turn security from a blocker into a competitive advantage with trust transparency',
          icon: Rocket
        },
        {
          title: 'Scale Efficiently',
          description: 'Handle 10x more security questionnaires without growing your team',
          icon: Zap
        },
        {
          title: 'Focus on Product',
          description: 'Automate compliance so engineers can focus on building great products',
          icon: Code
        }
      ]}
      ctaTitle="Ready to Scale with Security?"
      ctaDescription="Join 500+ tech companies using ERIP to accelerate growth through trust"
    />
  );
};