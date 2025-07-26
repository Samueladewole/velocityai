import React from 'react';
import { Heart, Shield, FileCheck, Users, Lock, AlertCircle, Database, Award } from 'lucide-react';
import { SolutionPageTemplate } from '@/components/templates/SolutionPageTemplate';

export const Healthcare: React.FC = () => {
  return (
    <SolutionPageTemplate
      badge={{
        text: 'Healthcare Solution',
        icon: Heart
      }}
      title="Healthcare Compliance"
      subtitle="Made Simple"
      description="Navigate HIPAA, HITRUST, and healthcare regulations with automated compliance management designed for providers, payers, and health tech companies."
      metrics={[
        { value: '98%', label: 'HIPAA compliance rate' },
        { value: '45%', label: 'Reduced audit time' },
        { value: '€2.8M', label: 'Average fine avoidance' },
        { value: '24/7', label: 'PHI monitoring' }
      ]}
      features={[
        {
          title: 'HIPAA Compliance Automation',
          description: 'Automated security rule assessments, privacy safeguards, and breach notification workflows',
          icon: Shield,
          metric: '100% coverage'
        },
        {
          title: 'HITRUST Certification',
          description: 'Streamlined path to HITRUST CSF certification with pre-built controls and evidence collection',
          icon: Award,
          metric: '6 months faster'
        },
        {
          title: 'PHI Data Mapping',
          description: 'Automated discovery and classification of protected health information across all systems',
          icon: Database,
          metric: 'Real-time tracking'
        },
        {
          title: 'Vendor Risk Management',
          description: 'BAA management and continuous monitoring of third-party healthcare vendors',
          icon: Users,
          metric: '85% risk reduction'
        }
      ]}
      benefits={[
        {
          title: 'Avoid Costly Breaches',
          description: 'Prevent HIPAA violations with continuous monitoring and automated safeguards',
          icon: AlertCircle
        },
        {
          title: 'Accelerate Partnerships',
          description: 'Share compliance status to quickly establish trust with healthcare partners',
          icon: Users
        },
        {
          title: 'Patient Trust',
          description: 'Demonstrate commitment to patient privacy with transparent security practices',
          icon: Lock
        }
      ]}
      ctaTitle="Protect Patient Data with Confidence"
      ctaDescription="Join healthcare leaders using ERIP to automate HIPAA compliance"
    />
  );
};