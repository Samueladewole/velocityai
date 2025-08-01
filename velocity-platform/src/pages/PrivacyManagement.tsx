import React, { useState, useEffect } from 'react';
import { ComponentPageTemplate, StatCard, TabConfiguration } from '@/components/templates/ComponentPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Eye,
  Download,
  Upload,
  Settings,
  Zap,
  Activity,
  BarChart3,
  Globe,
  Lock,
  UserX,
  FileCheck,
  Scan,
  RefreshCw,
  Plus,
  Calendar,
  Building2,
  Mail,
  Phone
} from 'lucide-react';

interface ShadowITApp {
  id: string;
  name: string;
  category: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  dataTypes: string[];
  users: number;
  lastSeen: string;
  compliance: {
    gdpr: boolean;
    soc2: boolean;
    iso27001: boolean;
  };
}

interface DSARRequest {
  id: string;
  requesterId: string;
  requesterEmail: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  submitted: string;
  deadline: string;
  trustPoints: number;
}

interface ROPARecord {
  id: string;
  activity: string;
  purpose: string;
  dataCategories: string[];
  dataSubjects: string[];
  recipients: string[];
  retention: string;
  status: 'compliant' | 'review_needed' | 'non_compliant';
  lastReviewed: string;
}

interface DPIAAssessment {
  id: string;
  project: string;
  riskLevel: 'high' | 'medium' | 'low';
  status: 'draft' | 'review' | 'approved' | 'rejected';
  created: string;
  reviewer: string;
  findings: number;
  mitigation: number;
}

export const PrivacyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shadow-it');
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState('2025-01-23 14:30');

  // Sample data
  const shadowITApps: ShadowITApp[] = [
    {
      id: 'app-1',
      name: 'Notion',
      category: 'Productivity',
      riskLevel: 'medium',
      dataTypes: ['Personal Data', 'Business Data', 'IP'],
      users: 23,
      lastSeen: '2025-01-23',
      compliance: { gdpr: true, soc2: true, iso27001: false },
    },
    {
      id: 'app-2',
      name: 'Slack',
      category: 'Communication',
      riskLevel: 'low',
      dataTypes: ['Personal Data', 'Communication Data'],
      users: 156,
      lastSeen: '2025-01-23',
      compliance: { gdpr: true, soc2: true, iso27001: true },
    },
    {
      id: 'app-3',
      name: 'Airtable',
      category: 'Database',
      riskLevel: 'high',
      dataTypes: ['Personal Data', 'Financial Data', 'Customer Data'],
      users: 8,
      lastSeen: '2025-01-22',
      compliance: { gdpr: false, soc2: true, iso27001: false },
    },
    {
      id: 'app-4',
      name: 'Canva',
      category: 'Design',
      riskLevel: 'low',
      dataTypes: ['Business Data'],
      users: 45,
      lastSeen: '2025-01-21',
      compliance: { gdpr: true, soc2: false, iso27001: false },
    }
  ];

  const dsarRequests: DSARRequest[] = [
    {
      id: 'dsar-1',
      requesterId: 'user-123',
      requesterEmail: 'john.doe@example.com',
      type: 'access',
      status: 'pending',
      submitted: '2025-01-20',
      deadline: '2025-02-19',
      trustPoints: 50
    },
    {
      id: 'dsar-2',
      requesterId: 'user-456',
      requesterEmail: 'jane.smith@example.com',
      type: 'erasure',
      status: 'in_progress',
      submitted: '2025-01-18',
      deadline: '2025-02-17',
      trustPoints: 75
    },
    {
      id: 'dsar-3',
      requesterId: 'user-789',
      requesterEmail: 'mike.wilson@example.com',
      type: 'portability',
      status: 'overdue',
      submitted: '2025-01-10',
      deadline: '2025-02-09',
      trustPoints: 100
    }
  ];

  const ropaRecords: ROPARecord[] = [
    {
      id: 'ropa-1',
      activity: 'Customer Relationship Management',
      purpose: 'Managing customer relationships and sales',
      dataCategories: ['Contact Information', 'Financial Data', 'Communication Records'],
      dataSubjects: ['Customers', 'Prospects'],
      recipients: ['Sales Team', 'Customer Support'],
      retention: '7 years',
      status: 'compliant',
      lastReviewed: '2025-01-15'
    },
    {
      id: 'ropa-2',
      activity: 'Employee Management',
      purpose: 'HR processes and payroll',
      dataCategories: ['Personal Data', 'Financial Data', 'Performance Data'],
      dataSubjects: ['Employees', 'Contractors'],
      recipients: ['HR Department', 'Payroll Provider'],
      retention: '10 years',
      status: 'review_needed',
      lastReviewed: '2023-12-01'
    }
  ];

  const dpiaAssessments: DPIAAssessment[] = [
    {
      id: 'dpia-1',
      project: 'Customer Analytics Platform',
      riskLevel: 'high',
      status: 'approved',
      created: '2025-01-15',
      reviewer: 'Privacy Officer',
      findings: 8,
      mitigation: 8
    },
    {
      id: 'dpia-2',
      project: 'Employee Wellness App',
      riskLevel: 'medium',
      status: 'review',
      created: '2025-01-10',
      reviewer: 'Legal Team',
      findings: 3,
      mitigation: 2
    }
  ];

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setLastScan(new Date().toLocaleString());
    }, 3000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'compliant':
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
      case 'review':
      case 'review_needed':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
      case 'draft':
        return 'text-yellow-600 bg-yellow-50';
      case 'overdue':
      case 'non_compliant':
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Quick stats for the header
  const highRiskApps = shadowITApps.filter(app => app.riskLevel === 'critical' || app.riskLevel === 'high').length;
  const overdueRequests = dsarRequests.filter(req => req.status === 'overdue').length;
  const compliantRecords = ropaRecords.filter(record => record.status === 'compliant').length;
  const approvedDPIAs = dpiaAssessments.filter(dpia => dpia.status === 'approved').length;

  const quickStats: StatCard[] = [
    {
      label: 'Shadow IT Apps',
      value: shadowITApps.length,
      change: `+€{highRiskApps}`,
      trend: highRiskApps > 0 ? 'down' : 'up',
      icon: <Search className="h-6 w-6 text-blue-600" />,
      description: `€{highRiskApps} high risk`,
      color: 'text-blue-600'
    },
    {
      label: 'DSAR Requests',
      value: dsarRequests.length,
      change: `€{overdueRequests}`,
      trend: overdueRequests > 0 ? 'down' : 'up',
      icon: <UserX className="h-6 w-6 text-green-600" />,
      description: `€{overdueRequests} overdue`,
      color: 'text-green-600'
    },
    {
      label: 'RoPA Records',
      value: ropaRecords.length,
      change: `+€{compliantRecords}`,
      trend: 'up',
      icon: <Database className="h-6 w-6 text-purple-600" />,
      description: `€{compliantRecords} compliant`,
      color: 'text-purple-600'
    },
    {
      label: 'DPIAs Active',
      value: dpiaAssessments.length,
      change: `+€{approvedDPIAs}`,
      trend: 'up',
      icon: <FileCheck className="h-6 w-6 text-orange-600" />,
      description: `€{approvedDPIAs} approved`,
      color: 'text-orange-600'
    }
  ];

  // Tab configurations
  const tabs: TabConfiguration[] = [
    {
      id: 'shadow-it',
      label: 'Shadow IT Discovery',
      badge: shadowITApps.length,
      content: (
        <div className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Shadow IT Discovery
                </CardTitle>
                <Badge className="bg-blue-100 text-blue-800">
                  Last scan: {lastScan}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {shadowITApps.map((app) => (
                  <Card key={app.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{app.name}</h4>
                          <p className="text-sm text-slate-500">{app.category}</p>
                        </div>
                        <Badge className={getRiskColor(app.riskLevel)}>
                          {app.riskLevel}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span>{app.users} users</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>Last seen: {app.lastSeen}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">Data Types:</p>
                        <div className="flex flex-wrap gap-1">
                          {app.dataTypes.slice(0, 2).map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {app.dataTypes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{app.dataTypes.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex gap-1">
                        <Badge className={app.compliance.gdpr ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          GDPR
                        </Badge>
                        <Badge className={app.compliance.soc2 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          SOC2
                        </Badge>
                        <Badge className={app.compliance.iso27001 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          ISO
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {highRiskApps} applications detected with high privacy risk. 
                  Review data handling practices and implement additional controls.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 mt-6">
                <Button onClick={startScan} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Scan className="h-4 w-4 mr-2" />
                  Run Shadow IT Scan
                </Button>
                <Button variant="outline">
                  View Detailed Report
                </Button>
                <Button variant="ghost" size="sm">
                  Export Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'dsar',
      label: 'DSAR Automation',
      badge: dsarRequests.length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Data Subject Access Requests</h3>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              New DSAR
            </Button>
          </div>

          <div className="grid gap-4">
            {dsarRequests.map((request) => (
              <Card key={request.id} className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserX className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{request.requesterEmail}</h4>
                          <p className="text-sm text-slate-500">Request Type: {request.type}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Submitted:</span>
                          <div className="font-medium">{request.submitted}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Deadline:</span>
                          <div className="font-medium">{request.deadline}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Trust Points:</span>
                          <div className="font-medium">{request.trustPoints}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Status:</span>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              DSAR automation processing {dsarRequests.length} requests with 99.2% accuracy, 
              earning {dsarRequests.reduce((sum, req) => sum + req.trustPoints, 0)} Trust Points.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 mt-6">
            <Button className="bg-gradient-to-r from-green-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create New DSAR
            </Button>
            <Button variant="outline">
              Bulk Process Requests
            </Button>
            <Button variant="ghost" size="sm">
              Download Report
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'ropa',
      label: 'RoPA Management',
      badge: ropaRecords.length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Records of Processing Activities</h3>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>

          <div className="space-y-4">
            {ropaRecords.map((record) => (
              <Card key={record.id} className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{record.activity}</h4>
                      <p className="text-slate-600 mt-1">{record.purpose}</p>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-sm text-slate-600 mb-2">Data Categories</h5>
                      <div className="flex flex-wrap gap-1">
                        {record.dataCategories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm text-slate-600 mb-2">Data Subjects</h5>
                      <div className="flex flex-wrap gap-1">
                        {record.dataSubjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm text-slate-600 mb-2">Recipients</h5>
                      <div className="flex flex-wrap gap-1">
                        {record.recipients.map((recipient) => (
                          <Badge key={recipient} variant="outline" className="text-xs">
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Retention: {record.retention}</span>
                      <span>•</span>
                      <span>Last reviewed: {record.lastReviewed}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button className="bg-gradient-to-r from-green-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add RoPA Record
            </Button>
            <Button variant="outline">
              Review All Records
            </Button>
            <Button variant="ghost" size="sm">
              Export RoPA Register
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'dpia',
      label: 'DPIA Tools',
      badge: dpiaAssessments.length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Data Protection Impact Assessments</h3>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              New DPIA
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dpiaAssessments.map((dpia) => (
              <Card key={dpia.id} className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{dpia.project}</h4>
                      <p className="text-sm text-slate-500">Created: {dpia.created}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getRiskColor(dpia.riskLevel)}>
                        {dpia.riskLevel} risk
                      </Badge>
                      <div className="mt-1">
                        <Badge className={getStatusColor(dpia.status)}>
                          {dpia.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Reviewer:</span>
                      <span className="font-medium">{dpia.reviewer}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Findings:</span>
                      <span className="font-medium">{dpia.findings}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Mitigations:</span>
                      <span className="font-medium">{dpia.mitigation}/{dpia.findings}</span>
                    </div>

                    <div className="mt-3">
                      <Progress 
                        value={(dpia.mitigation / dpia.findings) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Mitigation Progress: {Math.round((dpia.mitigation / dpia.findings) * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              DPIA automation ensures comprehensive privacy risk assessment with 
              proactive privacy protection and regulatory compliance.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 mt-6">
            <Button className="bg-gradient-to-r from-green-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Start New DPIA
            </Button>
            <Button variant="outline">
              Review Pending DPIAs
            </Button>
            <Button variant="ghost" size="sm">
              Generate DPIA Report
            </Button>
          </div>
        </div>
      )
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" onClick={startScan} disabled={scanning}>
        {scanning ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Scan className="h-4 w-4 mr-2" />
            Scan Shadow IT
          </>
        )}
      </Button>
      <Button className="bg-gradient-to-r from-green-600 to-blue-600">
        <Download className="h-4 w-4 mr-2" />
        Export Compliance Report
      </Button>
    </>
  );

  return (
    <ComponentPageTemplate
      title="Privacy Management Suite"
      subtitle="Comprehensive GDPR & Privacy Compliance"
      description="Advanced privacy tools including Shadow IT discovery, DSAR automation, RoPA management, and DPIA assessments for complete regulatory compliance."
      trustScore={96}
      trustPoints={4250}
      quickStats={quickStats}
      tabs={tabs}
      actions={headerActions}
      headerGradient="from-green-50 to-blue-50"
      className="card-professional"
    />
  );
};