import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Target,
  Brain,
  Zap,
  BarChart3
} from 'lucide-react';

interface RiskAppetiteMetric {
  category: string;
  currentValue: number;
  threshold: number;
  unit: string;
  status: 'within' | 'approaching' | 'exceeded';
  trend: 'increasing' | 'decreasing' | 'stable';
}

const riskAppetiteMetrics: RiskAppetiteMetric[] = [
  {
    category: 'Financial Loss',
    currentValue: 2.3,
    threshold: 5.0,
    unit: '$M',
    status: 'within',
    trend: 'stable'
  },
  {
    category: 'Data Breach Probability',
    currentValue: 0.12,
    threshold: 0.10,
    unit: 'Annual %',
    status: 'exceeded',
    trend: 'increasing'
  },
  {
    category: 'System Downtime',
    currentValue: 4.2,
    threshold: 8.0,
    unit: 'Hours/Month',
    status: 'within',
    trend: 'decreasing'
  },
  {
    category: 'Regulatory Compliance',
    currentValue: 94,
    threshold: 95,
    unit: '%',
    status: 'approaching',
    trend: 'stable'
  }
];

const pendingDecisions = [
  {
    id: 'DEC-001',
    title: 'Cloud Migration Risk Approval',
    requestor: 'Engineering Team',
    financialImpact: 3200000,
    riskScore: 78,
    opportunity: 'Cost savings of $800K annually',
    status: 'pending',
    daysOpen: 3
  },
  {
    id: 'DEC-002',
    title: 'Third-Party Vendor Onboarding',
    requestor: 'Procurement',
    financialImpact: 450000,
    riskScore: 45,
    opportunity: 'Accelerate product delivery by 2 months',
    status: 'pending',
    daysOpen: 1
  },
  {
    id: 'DEC-003',
    title: 'GDPR Compliance Exception',
    requestor: 'Legal Team',
    financialImpact: 120000,
    riskScore: 62,
    opportunity: 'Enable new EU market entry',
    status: 'escalated',
    daysOpen: 5
  }
];

export const Clearance: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">CLEARANCE - Strategic Risk Clearance</h2>
        <p className="text-muted-foreground">
          Transform risk decisions with automated appetite management and intelligent routing
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {['overview', 'appetite', 'decisions', 'automation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                selectedTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'appetite' ? 'Risk Appetite' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Decisions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 escalated</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Decision Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 days</div>
                <p className="text-xs text-green-600">-45% from manual</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Appetite Status</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground">Within thresholds</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly ROI</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$340K</div>
                <p className="text-xs text-green-600">+23% vs target</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Decisions */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Risk Decisions</CardTitle>
              <CardDescription>Automated routing based on risk appetite thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDecisions.map((decision) => (
                  <div key={decision.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{decision.title}</h4>
                        {decision.status === 'escalated' && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                            Escalated
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Requested by {decision.requestor} • {decision.daysOpen} days ago
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span>Impact: ${(decision.financialImpact / 1000000).toFixed(1)}M</span>
                        <span>Risk Score: {decision.riskScore}</span>
                        <span className="text-green-600">{decision.opportunity}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Review</Button>
                      <Button size="sm" variant="outline">Delegate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Appetite Tab */}
      {selectedTab === 'appetite' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Appetite Automation Engine</CardTitle>
              <CardDescription>
                AI-powered appetite definition and real-time threshold monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Automated Features</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      AI-generated loss scenarios from ATLAS findings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Dynamic magnitude thresholds via PRISM Monte Carlo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Real-time probability assessment with PULSE
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Automated crown jewels identification
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Current Thresholds</h3>
                  </div>
                  <div className="space-y-3">
                    {riskAppetiteMetrics.map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{metric.category}</span>
                          <span className={`font-medium ${
                            metric.status === 'exceeded' ? 'text-red-600' :
                            metric.status === 'approaching' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {metric.currentValue}{metric.unit} / {metric.threshold}{metric.unit}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              metric.status === 'exceeded' ? 'bg-red-500' :
                              metric.status === 'approaching' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((metric.currentValue / metric.threshold) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loss Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Loss Scenarios</CardTitle>
              <CardDescription>Automated scenario modeling based on current threat landscape</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Ransomware Attack</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Probability</span>
                      <span>12% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Financial Impact</span>
                      <span>$2.5M - $8.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recovery Time</span>
                      <span>48-96 hours</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Data Breach (PII)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Probability</span>
                      <span>8% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Financial Impact</span>
                      <span>$4.1M - $12.3M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Regulatory Fines</span>
                      <span>Up to 4% revenue</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Decisions Tab */}
      {selectedTab === 'decisions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Decision Intelligence</CardTitle>
              <CardDescription>Historical decisions and outcomes analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3 text-center">
                  <div>
                    <p className="text-2xl font-bold">427</p>
                    <p className="text-sm text-muted-foreground">Total Decisions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-sm text-muted-foreground">Positive Outcomes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$4.2M</p>
                    <p className="text-sm text-muted-foreground">Value Generated</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Automation Tab */}
      {selectedTab === 'automation' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Benefits</CardTitle>
              <CardDescription>Transform 6-month risk appetite projects into 30-day automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-4">Traditional Manual Process</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 6-12 month implementation</li>
                    <li>• $200K-500K consulting fees</li>
                    <li>• Static thresholds updated quarterly</li>
                    <li>• Manual decision routing</li>
                    <li>• Limited visibility and tracking</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-4">ERIP Automated Process</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="text-green-600">• 30-day implementation</li>
                    <li className="text-green-600">• $8K-20K monthly subscription</li>
                    <li className="text-green-600">• Dynamic real-time thresholds</li>
                    <li className="text-green-600">• AI-powered routing</li>
                    <li className="text-green-600">• Complete audit trail</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-center font-medium">
                  First Year ROI: 300-500% • Time Savings: 90% • Accuracy: 95%+
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};