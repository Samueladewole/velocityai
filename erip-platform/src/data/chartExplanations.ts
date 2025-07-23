interface ChartExplanation {
  id: string;
  title: string;
  purpose: string;
  howToRead: string;
  keyInsights: string[];
  relatedComponents: string[];
  actionableItems: string[];
  dataSource: string;
  updateFrequency: string;
  correlations?: {
    component: string;
    relationship: string;
    impact: string;
  }[];
}

export const chartExplanations: Record<string, ChartExplanation> = {
  'compliance-trend': {
    id: 'compliance-trend',
    title: 'Compliance Trend Analysis',
    purpose: 'Tracks compliance performance over time to identify improvement patterns and predict future compliance states.',
    howToRead: 'The blue line shows actual compliance scores by month, while the green dashed line represents target thresholds. Higher values indicate better compliance.',
    keyInsights: [
      'Steady improvement from 82% to 94% over 6 months demonstrates effective compliance strategy',
      'Target threshold of 90% was exceeded in May, showing accelerated progress',
      'Current trajectory suggests maintaining above-target compliance through Q3'
    ],
    relatedComponents: ['COMPASS', 'CIPHER', 'BEACON'],
    actionableItems: [
      'Continue current compliance initiatives to maintain upward trend',
      'Focus on remaining 6% gap to achieve 100% compliance',
      'Review and optimize compliance processes that drove recent improvements'
    ],
    dataSource: 'COMPASS Regulatory Engine + CIPHER Policy Automation',
    updateFrequency: 'Daily',
    correlations: [
      {
        component: 'COMPASS',
        relationship: 'Provides regulatory framework data that feeds trend calculations',
        impact: 'Framework changes directly affect compliance scores and trend direction'
      },
      {
        component: 'CIPHER',
        relationship: 'Policy automation improvements correlate with compliance score increases',
        impact: 'Automated enforcement reduces manual errors, improving trend stability'
      }
    ]
  },

  'risk-heatmap': {
    id: 'risk-heatmap',
    title: 'Risk Distribution Heatmap',
    purpose: 'Visualizes risk severity distribution across different business categories to prioritize risk management efforts.',
    howToRead: 'Each category shows stacked bars: red (high risk), orange (medium risk), green (low risk). Taller bars indicate more total risks in that category.',
    keyInsights: [
      'Cyber security has the highest concentration of high-risk items (5) requiring immediate attention',
      'Financial risks are well-managed with only 3 high-risk items',
      'Compliance category shows strong control with minimal high-risk exposure'
    ],
    relatedComponents: ['ATLAS', 'PRISM', 'CLEARANCE'],
    actionableItems: [
      'Prioritize cyber security risk mitigation with ATLAS vulnerability management',
      'Investigate root causes of high operational risks',
      'Leverage low-risk compliance posture as a competitive advantage'
    ],
    dataSource: 'ATLAS Security Assessment + PRISM Risk Quantification',
    updateFrequency: 'Real-time',
    correlations: [
      {
        component: 'ATLAS',
        relationship: 'Security assessments populate cyber risk categories',
        impact: 'Vulnerability discoveries increase red bars in cyber category'
      },
      {
        component: 'PRISM',
        relationship: 'Risk quantification determines severity classifications',
        impact: 'Monte Carlo simulations drive high/medium/low risk assignments'
      }
    ]
  },

  'security-score': {
    id: 'security-score',
    title: 'Overall Security Score',
    purpose: 'Provides a single, comprehensive metric representing organizational security posture across all domains.',
    howToRead: 'Radial chart shows current score (73%) with color coding: green (90%+), yellow (70-89%), red (<70%). Compare against industry benchmarks shown below.',
    keyInsights: [
      'Current 73% score is above industry average (68%) but below previous month (85%)',
      'Score decline indicates emerging security challenges requiring attention',
      'Target of 80% is achievable with focused improvement initiatives'
    ],
    relatedComponents: ['ATLAS', 'NEXUS', 'PULSE'],
    actionableItems: [
      'Investigate causes of 12-point decline from previous month',
      'Focus on vulnerability remediation to improve score quickly',
      'Implement continuous monitoring to prevent future score degradation'
    ],
    dataSource: 'ATLAS Security Assessments (weighted composite)',
    updateFrequency: 'Hourly',
    correlations: [
      {
        component: 'ATLAS',
        relationship: 'Primary data source for security metrics and vulnerability counts',
        impact: 'New vulnerabilities immediately lower the overall security score'
      },
      {
        component: 'NEXUS',
        relationship: 'Threat intelligence feeds enhance score accuracy',
        impact: 'External threat landscape changes adjust scoring algorithms'
      }
    ]
  },

  'financial-impact': {
    id: 'financial-impact',
    title: 'Financial Impact Analysis',
    purpose: 'Demonstrates the financial value of risk management by comparing prevented losses against potential exposure.',
    howToRead: 'Green area shows losses prevented through risk controls, red area shows potential losses without controls. Growing green area indicates increasing risk management value.',
    keyInsights: [
      '$420K in losses prevented in June, showing strong ROI on risk investments',
      'Prevented losses have increased 250% over 6 months (from $120K to $420K)',
      'Potential losses decreased from $450K to $200K, indicating improved risk posture'
    ],
    relatedComponents: ['PRISM', 'BEACON', 'CLEARANCE'],
    actionableItems: [
      'Document and communicate the $420K monthly value to stakeholders',
      'Scale successful risk prevention strategies to other business areas',
      'Use financial impact data to justify additional risk management investments'
    ],
    dataSource: 'PRISM Financial Modeling + BEACON Value Tracking',
    updateFrequency: 'Monthly',
    correlations: [
      {
        component: 'PRISM',
        relationship: 'Quantifies financial risk exposure and potential losses',
        impact: 'Risk scenarios drive potential loss calculations shown in red'
      },
      {
        component: 'BEACON',
        relationship: 'Tracks realized value and prevented losses',
        impact: 'Value demonstration metrics populate the prevented losses (green area)'
      }
    ]
  },

  'framework-coverage': {
    id: 'framework-coverage',
    title: 'Regulatory Framework Coverage',
    purpose: 'Shows compliance performance across different regulatory frameworks to identify strengths and gaps.',
    howToRead: 'Pie chart segments represent different frameworks, with percentages showing compliance scores. Larger segments indicate frameworks with higher compliance rates.',
    keyInsights: [
      'GDPR leads with 95% compliance, demonstrating strong privacy controls',
      'SOX compliance at 78% requires improvement for financial reporting accuracy',
      'ISO 27001 at 88% shows solid security management system implementation'
    ],
    relatedComponents: ['COMPASS', 'CIPHER', 'ATLAS'],
    actionableItems: [
      'Focus on SOX compliance improvement to reach 90%+ threshold',
      'Leverage GDPR success patterns for other framework improvements',
      'Conduct gap analysis for frameworks below 85% compliance'
    ],
    dataSource: 'COMPASS Regulatory Database',
    updateFrequency: 'Weekly',
    correlations: [
      {
        component: 'COMPASS',
        relationship: 'Primary source for regulatory framework mapping and compliance scoring',
        impact: 'Framework updates directly affect compliance percentages shown'
      },
      {
        component: 'CIPHER',
        relationship: 'Policy automation improves compliance scores across frameworks',
        impact: 'Automated controls increase framework compliance percentages over time'
      }
    ]
  },

  'vulnerability-timeline': {
    id: 'vulnerability-timeline',
    title: 'Vulnerability Management Timeline',
    purpose: 'Tracks vulnerability discovery and remediation patterns to optimize security response processes.',
    howToRead: 'Red bars show vulnerabilities found, green bars show vulnerabilities fixed, blue line tracks total open vulnerabilities. Lower open count indicates better security hygiene.',
    keyInsights: [
      'Remediation rate improved significantly - fixing more than discovering since April',
      'Open vulnerability count reduced from 11 to 5, showing effective security operations',
      'June showed optimal performance with 28 found and 30 fixed'
    ],
    relatedComponents: ['ATLAS', 'PULSE', 'NEXUS'],
    actionableItems: [
      'Maintain current remediation velocity to keep open count below 10',
      'Investigate February spike in vulnerabilities to prevent recurrence',
      'Document successful remediation processes for knowledge sharing'
    ],
    dataSource: 'ATLAS Vulnerability Scanner + Security Operations',
    updateFrequency: 'Daily',
    correlations: [
      {
        component: 'ATLAS',
        relationship: 'Primary vulnerability discovery and tracking system',
        impact: 'Scanning frequency and coverage directly affect found vulnerability counts'
      },
      {
        component: 'PULSE',
        relationship: 'Monitors remediation activities and tracks progress',
        impact: 'Real-time monitoring accelerates the fix cycle, improving green bar performance'
      }
    ]
  },

  'risk-radar': {
    id: 'risk-radar',
    title: 'Multi-Dimensional Risk Coverage',
    purpose: 'Provides a comprehensive view of risk management effectiveness across all major risk categories.',
    howToRead: 'Radar chart with 6 risk dimensions. Blue area shows current performance, green outline shows targets. Larger blue area indicates better overall risk coverage.',
    keyInsights: [
      'Compliance risk management exceeds targets at 94%, showing regulatory strength',
      'Cyber risk at 58% significantly underperforms target of 85%, requiring urgent attention',
      'Financial and reputational risks are well-managed and close to target thresholds'
    ],
    relatedComponents: ['All Components'],
    actionableItems: [
      'Launch cyber risk improvement initiative to close 27-point gap',
      'Maintain compliance excellence as a competitive differentiator',
      'Develop strategic risk improvement roadmap for underperforming areas'
    ],
    dataSource: 'Integrated ERIP Platform (All Components)',
    updateFrequency: 'Real-time',
    correlations: [
      {
        component: 'COMPASS',
        relationship: 'Drives compliance and regulatory risk dimensions',
        impact: 'Regulatory changes affect compliance and strategic risk scores'
      },
      {
        component: 'ATLAS',
        relationship: 'Primary input for cyber and operational risk assessment',
        impact: 'Security findings directly impact cyber risk radar dimension'
      }
    ]
  },

  'activity-stream': {
    id: 'activity-stream',
    title: 'Platform Activity Stream',
    purpose: 'Monitors real-time system activity to identify usage patterns and peak operational periods.',
    howToRead: 'Area chart showing event volume over 24-hour periods. Higher peaks indicate more platform activity. Pattern analysis helps with resource planning.',
    keyInsights: [
      'Peak activity occurs during business hours (12:00-16:00) with 45 events',
      'Minimal overnight activity (8 events) suggests automated processes are working',
      'Consistent activity pattern indicates stable platform adoption'
    ],
    relatedComponents: ['PULSE', 'All Components'],
    actionableItems: [
      'Scale platform resources to handle peak business hour demands',
      'Investigate overnight activity spikes for potential security concerns',
      'Use activity patterns for planned maintenance scheduling'
    ],
    dataSource: 'PULSE Activity Monitoring',
    updateFrequency: 'Real-time',
    correlations: [
      {
        component: 'PULSE',
        relationship: 'Primary activity monitoring and event aggregation system',
        impact: 'All platform interactions are captured and visualized in activity stream'
      }
    ]
  }
};

// Page-level correlation insights
export const pageCorrelations = {
  dashboard: {
    primary: [
      'Compliance trend drives overall risk score improvements',
      'Security score directly correlates with vulnerability timeline performance',
      'Financial impact increases as risk heatmap severity decreases'
    ],
    secondary: [
      'Activity stream patterns indicate user engagement with risk findings',
      'Framework coverage improvements support compliance trend growth',
      'Risk radar dimensions reflect individual chart performance metrics'
    ],
    insights: [
      'Strong compliance performance (94%) offsets moderate security challenges (73%)',
      'Vulnerability remediation velocity directly impacts financial impact prevention',
      'Cross-functional risk management creates synergistic performance improvements'
    ]
  },
  
  compass: {
    primary: [
      'Framework coverage percentages drive compliance trend calculations',
      'Regulatory changes immediately impact compliance scores',
      'Policy automation success correlates with coverage improvements'
    ],
    secondary: [
      'Framework compliance affects overall platform risk radar',
      'Regulatory intelligence feeds into financial impact modeling',
      'Compliance trends predict future framework coverage gaps'
    ],
    insights: [
      'GDPR excellence (95%) demonstrates achievable compliance targets',
      'SOX underperformance (78%) represents highest improvement opportunity',
      'Automated policy enforcement shows direct compliance score correlation'
    ]
  }
};