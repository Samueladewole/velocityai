import React from 'react';
import { SolutionPageTemplate } from '../../components/templates/SolutionPageTemplate';
import { Shield, Clock, TrendingUp, Users, Cpu, CheckCircle } from 'lucide-react';

const SOC2Page: React.FC = () => {

  const framework = {
    name: "SOC 2",
    description: "Service Organization Control 2 Type II Compliance",
    color: "bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900",
    iconColor: "bg-emerald-500"
  };

  const hero = {
    title: "SOC 2 Audit Ready in 45 Days",
    subtitle: "10 AI agents automate your entire SOC 2 compliance process",
    description: "From evidence collection to audit readiness, get certified faster than ever with 98.2% first-attempt pass rate."
  };

  const aiAgents = [
    {
      title: "AWS Evidence Collector",
      description: "Automatically collects CloudTrail, Config, and Security Hub evidence",
      capabilities: [
        "Real-time AWS infrastructure monitoring",
        "Automated security configuration scanning",
        "CloudTrail log analysis and correlation",
        "Security Hub finding aggregation"
      ]
    },
    {
      title: "Trust Score Engine",
      description: "Calculates real-time SOC 2 compliance score with cryptographic proofs",
      capabilities: [
        "Real-time compliance scoring",
        "Control effectiveness measurement",
        "Risk assessment automation",
        "Audit readiness prediction"
      ]
    },
    {
      title: "Continuous Monitor",
      description: "Monitors security configuration changes and control drift",
      capabilities: [
        "24/7 infrastructure monitoring",
        "Configuration drift detection",
        "Automated remediation triggers",
        "Change impact assessment"
      ]
    }
  ];

  const benefits = [
    {
      title: "45-Day Audit Readiness",
      description: "Achieve SOC 2 certification 4x faster than traditional methods",
      icon: <Clock className="w-8 h-8 text-white" />
    },
    {
      title: "98.2% Pass Rate",
      description: "Industry-leading first-attempt audit success with cryptographic verification",
      icon: <Shield className="w-8 h-8 text-white" />
    },
    {
      title: "95% Cost Reduction",
      description: "Reduce compliance team workload and external consulting costs",
      icon: <TrendingUp className="w-8 h-8 text-white" />
    }
  ];

  const industries = [
    {
      name: "Banking & Financial Services",
      painPoints: [
        "Manual evidence collection costs $2-8M annually",
        "6-month audit preparation cycles",
        "Regulatory examiner requirements for real-time compliance"
      ],
      solutions: [
        "Automated Transfer Impact Assessments",
        "Real-time financial data monitoring",
        "Regulatory reporting automation",
        "Cross-border compliance orchestration"
      ]
    },
    {
      name: "Healthcare & Life Sciences",
      painPoints: [
        "HIPAA + SOC 2 dual compliance complexity",
        "Patient data protection across vendors",
        "Clinical trial data security requirements"
      ],
      solutions: [
        "Medical device compliance automation",
        "Patient consent management",
        "Clinical data sovereignty",
        "Research partner monitoring"
      ]
    },
    {
      name: "Technology & SaaS",
      painPoints: [
        "Customer data processed in global infrastructure",
        "Rapid scaling compliance requirements",
        "Enterprise customer security demands"
      ],
      solutions: [
        "Multi-tenant security monitoring",
        "Customer data residency management",
        "API security compliance",
        "Enterprise trust score reporting"
      ]
    },
    {
      name: "Manufacturing & IoT",
      painPoints: [
        "IoT sensor data security",
        "Supply chain compliance coordination",
        "Industrial control system protection"
      ],
      solutions: [
        "Industrial IoT monitoring",
        "Supply chain risk assessment",
        "OT/IT convergence security",
        "Manufacturing partner compliance"
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

export default SOC2Page;