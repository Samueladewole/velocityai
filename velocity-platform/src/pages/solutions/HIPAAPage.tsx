import React from 'react';
import { SolutionPageTemplate } from '../../components/templates/SolutionPageTemplate';
import { Shield, Clock, TrendingUp, Heart, Activity, Eye } from 'lucide-react';

const HIPAAPage: React.FC = () => {

  const framework = {
    name: "HIPAA",
    description: "Health Insurance Portability and Accountability Act",
    color: "bg-gradient-to-br from-slate-900 via-slate-800 to-red-900",
    iconColor: "bg-red-500"
  };

  const hero = {
    title: "HIPAA Ready in 60 Days",
    subtitle: "AI agents protect patient data across your healthcare organization",
    description: "Automate PHI discovery, access controls, and breach detection with 96% accuracy and continuous monitoring."
  };

  const aiAgents = [
    {
      title: "PHI Data Scanner",
      description: "Discovers and classifies protected health information across systems",
      capabilities: [
        "Automated PHI discovery and classification",
        "Healthcare data flow mapping",
        "Medical record analysis",
        "Device data monitoring"
      ]
    },
    {
      title: "Access Control Manager",
      description: "Manages minimum necessary access controls and audit logs",
      capabilities: [
        "Role-based access enforcement",
        "Minimum necessary controls",
        "Audit log automation",
        "Access review workflows"
      ]
    },
    {
      title: "Breach Detection Engine",
      description: "Monitors for unauthorized PHI access and automates incident response",
      capabilities: [
        "Real-time breach detection",
        "Incident response automation",
        "Regulatory notification",
        "Forensic evidence collection"
      ]
    }
  ];

  const benefits = [
    {
      title: "60-Day Compliance",
      description: "Achieve HIPAA readiness faster than traditional healthcare implementations",
      icon: <Clock className="w-8 h-8 text-white" />
    },
    {
      title: "96% PHI Protection",
      description: "Industry-leading patient data protection with automated controls",
      icon: <Shield className="w-8 h-8 text-white" />
    },
    {
      title: "Real-time Monitoring",
      description: "Continuous surveillance of healthcare data access and usage",
      icon: <Activity className="w-8 h-8 text-white" />
    }
  ];

  const industries = [
    {
      name: "Hospitals & Health Systems",
      painPoints: [
        "Complex multi-system PHI tracking",
        "Large-scale access control management",
        "Breach detection across facilities"
      ],
      solutions: [
        "Enterprise PHI discovery",
        "Multi-facility access controls",
        "Hospital-wide breach monitoring",
        "Clinical workflow integration"
      ]
    },
    {
      name: "Medical Device Companies",
      painPoints: [
        "Device data privacy compliance",
        "IoT healthcare data flows",
        "Remote patient monitoring"
      ],
      solutions: [
        "Medical IoT data protection",
        "Device compliance automation",
        "Remote monitoring security",
        "FDA submission support"
      ]
    }
  ];

  return (
    <SolutionPageTemplate
      framework={framework}
      hero={hero}
      aiAgents={aiAgents}
      benefits={benefits}
      industries={industries}
    />
  );
};

export default HIPAAPage;