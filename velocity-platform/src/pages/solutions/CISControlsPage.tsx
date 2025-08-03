import React from 'react';
import { SolutionPageTemplate } from '../../components/templates/SolutionPageTemplate';
import { Shield, Lock, TrendingUp, Users, Monitor, Eye } from 'lucide-react';

const CISControlsPage: React.FC = () => {
  const framework = {
    name: "CIS Controls",
    description: "Center for Internet Security Critical Security Controls",
    color: "bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900",
    iconColor: "bg-cyan-500"
  };

  const hero = {
    title: "CIS Controls Implementation in 60 Days",
    subtitle: "12 AI agents automate all 18 CIS Critical Security Controls",
    description: "Achieve comprehensive cybersecurity posture with automated control implementation, monitoring, and validation."
  };

  const aiAgents = [
    {
      title: "Asset Inventory Manager",
      description: "Automatically discovers and inventories all hardware and software assets",
      capabilities: [
        "Real-time asset discovery across networks",
        "Software inventory and version tracking",
        "Hardware configuration monitoring",
        "Asset lifecycle management automation"
      ]
    },
    {
      title: "Vulnerability Scan Orchestrator",
      description: "Manages continuous vulnerability assessments and remediation",
      capabilities: [
        "Automated vulnerability scanning",
        "Risk-based prioritization",
        "Patch management coordination",
        "Remediation tracking and validation"
      ]
    },
    {
      title: "Access Control Guardian",
      description: "Monitors and enforces access control policies across all systems",
      capabilities: [
        "Privileged account monitoring",
        "Access control policy enforcement",
        "Identity lifecycle management",
        "Multi-factor authentication monitoring"
      ]
    }
  ];

  const benefits = [
    {
      title: "60-Day Implementation",
      description: "Deploy all 18 CIS Controls 3x faster than manual implementation",
      icon: <Monitor className="w-8 h-8 text-white" />
    },
    {
      title: "Continuous Monitoring",
      description: "24/7 automated monitoring and validation of security controls",
      icon: <Eye className="w-8 h-8 text-white" />
    },
    {
      title: "90% Risk Reduction",
      description: "Eliminate 90% of cyber attack vectors through comprehensive control coverage",
      icon: <Shield className="w-8 h-8 text-white" />
    }
  ];

  const industries = [
    {
      name: "Critical Infrastructure",
      painPoints: [
        "Complex OT/IT convergence security requirements",
        "Regulatory compliance across multiple frameworks",
        "24/7 operational availability requirements"
      ],
      solutions: [
        "Industrial control system monitoring",
        "Critical infrastructure protection",
        "Operational technology security",
        "Real-time threat detection"
      ],
      pricing: "$350K-700K annually"
    },
    {
      name: "Financial Services",
      painPoints: [
        "High-value target for cyber attacks",
        "Stringent regulatory requirements",
        "Customer data protection obligations"
      ],
      solutions: [
        "Banking infrastructure protection",
        "Payment system security",
        "Customer data encryption",
        "Fraud detection integration"
      ],
      pricing: "$300K-600K annually"
    },
    {
      name: "Healthcare Organizations",
      painPoints: [
        "Medical device security concerns",
        "Patient data privacy requirements",
        "Life-critical system protection"
      ],
      solutions: [
        "Medical IoT device monitoring",
        "Patient data protection",
        "Healthcare network segmentation",
        "Clinical system security"
      ],
      pricing: "$250K-500K annually"
    },
    {
      name: "Government Agencies",
      painPoints: [
        "Nation-state threat protection",
        "Classified information security",
        "Public service continuity"
      ],
      solutions: [
        "Government network protection",
        "Classified data handling",
        "Public service resilience",
        "Threat intelligence integration"
      ],
      pricing: "$400K-800K annually"
    }
  ];

  const pricingTiers = [
    {
      name: "Foundation",
      price: "$200K/year",
      description: "Essential CIS Controls automation",
      features: [
        "Basic 18 Controls implementation",
        "Asset inventory automation",
        "Vulnerability management",
        "Standard reporting"
      ],
      targetAudience: "Small to medium enterprises"
    },
    {
      name: "Professional",
      price: "$400K/year",
      description: "Advanced threat protection and monitoring",
      features: [
        "All Foundation features",
        "Advanced threat detection",
        "Incident response automation",
        "Compliance reporting"
      ],
      targetAudience: "Large enterprises with complex infrastructure"
    },
    {
      name: "Enterprise",
      price: "$700K/year",
      description: "Complete security orchestration platform",
      features: [
        "All Professional features",
        "Multi-site management",
        "Custom integration APIs",
        "Dedicated security advisor"
      ],
      targetAudience: "Multi-national corporations"
    },
    {
      name: "Critical",
      price: "$1.2M/year",
      description: "Mission-critical infrastructure protection",
      features: [
        "All Enterprise features",
        "Nation-state threat protection",
        "Real-time threat intelligence",
        "24/7 SOC integration"
      ],
      targetAudience: "Critical infrastructure and government"
    }
  ];

  return (
    <SolutionPageTemplate
      framework={framework}
      hero={hero}
      aiAgents={aiAgents}
      benefits={benefits}
      industries={industries}
      pricingTiers={pricingTiers}
    />
  );
};

export default CISControlsPage;