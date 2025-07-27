import React, { useState } from 'react';
import { ComponentPageTemplate, StatCard, TabConfiguration } from '@/components/templates/ComponentPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TrustPointsDisplay } from '@/components/shared/TrustPointsDisplay';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Network,
  Zap,
  FileText,
  Users,
  Settings,
  Award,
  Brain,
  Globe,
  Building2,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface Framework {
  id: string;
  name: string;
  fullName: string;
  category: 'security' | 'privacy' | 'financial' | 'operational' | 'industry';
  status: 'active' | 'planning' | 'completed' | 'on-hold';
  progress: number;
  controls: number;
  implementedControls: number;
  overlapControls: number;
  trustPoints: number;
  complianceDate?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  icon: any;
  color: string;
}

interface ControlMapping {
  id: string;
  primaryFramework: string;
  mappedFrameworks: string[];
  controlNumber: string;
  title: string;
  description: string;
  status: 'implemented' | 'in-progress' | 'not-started' | 'not-applicable';
  overlapPercentage: number;
  trustPoints: number;
  evidence: string[];
  lastUpdated: string;
}

export const FrameworkManagement: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const frameworks: Framework[] = [
    {
      id: 'iso27001',
      name: 'ISO 27001',
      fullName: 'ISO/IEC 27001:2022 Information Security Management',
      category: 'security',
      status: 'active',
      progress: 78,
      controls: 93,
      implementedControls: 73,
      overlapControls: 65,
      trustPoints: 1250,
      complianceDate: '2024-06-30',
      priority: 'critical',
      description: 'International standard for information security management systems',
      icon: Shield,
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'soc2',
      name: 'SOC 2',
      fullName: 'SOC 2 Type II Security & Availability',
      category: 'security',
      status: 'active',
      progress: 85,
      controls: 64,
      implementedControls: 54,
      overlapControls: 58,
      trustPoints: 980,
      complianceDate: '2024-03-15',
      priority: 'critical',
      description: 'Audit standard for service organizations handling customer data',
      icon: Award,
      color: 'from-green-600 to-green-700'
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      category: 'privacy',
      status: 'completed',
      progress: 100,
      controls: 47,
      implementedControls: 47,
      overlapControls: 32,
      trustPoints: 850,
      complianceDate: '2023-12-01',
      priority: 'critical',
      description: 'EU regulation for data protection and privacy',
      icon: Globe,
      color: 'from-purple-600 to-purple-700'
    },
    {
      id: 'nis2',
      name: 'NIS2',
      fullName: 'Network and Information Security Directive 2',
      category: 'security',
      status: 'planning',
      progress: 15,
      controls: 156,
      implementedControls: 23,
      overlapControls: 89,
      trustPoints: 180,
      complianceDate: '2024-10-17',
      priority: 'high',
      description: 'EU directive on security of network and information systems',
      icon: Network,
      color: 'from-orange-600 to-orange-700'
    },
    {
      id: 'dora',
      name: 'DORA',
      fullName: 'Digital Operational Resilience Act',
      category: 'financial',
      status: 'planning',
      progress: 8,
      controls: 89,
      implementedControls: 7,
      overlapControls: 67,
      trustPoints: 75,
      complianceDate: '2025-01-17',
      priority: 'high',
      description: 'EU regulation for financial services digital resilience',
      icon: Building2,
      color: 'from-red-600 to-red-700'
    },
    {
      id: 'aiact',
      name: 'AI Act',
      fullName: 'EU Artificial Intelligence Act',
      category: 'operational',
      status: 'planning',
      progress: 3,
      controls: 124,
      implementedControls: 4,
      overlapControls: 45,
      trustPoints: 35,
      complianceDate: '2025-08-02',
      priority: 'medium',
      description: 'EU regulation for artificial intelligence systems',
      icon: Brain,
      color: 'from-indigo-600 to-indigo-700'
    }
  ];

  const controlMappings: ControlMapping[] = [
    {
      id: 'cm-001',
      primaryFramework: 'ISO 27001',
      mappedFrameworks: ['SOC 2', 'NIS2'],
      controlNumber: 'A.5.1.1',
      title: 'Information Security Policy',
      description: 'Policies for information security shall be defined, approved by management, published and communicated',
      status: 'implemented',
      overlapPercentage: 95,
      trustPoints: 45,
      evidence: ['Policy Document', 'Board Approval', 'Training Records'],
      lastUpdated: '2024-01-15'
    },
    {
      id: 'cm-002',
      primaryFramework: 'SOC 2',
      mappedFrameworks: ['ISO 27001', 'GDPR'],
      controlNumber: 'CC6.1',
      title: 'Logical and Physical Access Controls',
      description: 'Access to data and systems is restricted to authorized users',
      status: 'in-progress',
      overlapPercentage: 88,
      trustPoints: 55,
      evidence: ['Access Control Matrix', 'User Reviews'],
      lastUpdated: '2024-01-20'
    },
    {
      id: 'cm-003',
      primaryFramework: 'GDPR',
      mappedFrameworks: ['ISO 27001'],
      controlNumber: 'Art. 32',
      title: 'Security of Processing',
      description: 'Appropriate technical and organizational measures to ensure security',
      status: 'implemented',
      overlapPercentage: 75,
      trustPoints: 40,
      evidence: ['Security Assessment', 'Encryption Standards'],
      lastUpdated: '2024-01-10'
    }
  ];

  const totalTrustPoints = frameworks.reduce((sum, f) => sum + f.trustPoints, 0);
  const avgProgress = Math.round(frameworks.reduce((sum, f) => sum + f.progress, 0) / frameworks.length);
  const totalControls = frameworks.reduce((sum, f) => sum + f.controls, 0);
  const implementedControls = frameworks.reduce((sum, f) => sum + f.implementedControls, 0);
  const overlapOptimization = Math.round(
    (frameworks.reduce((sum, f) => sum + f.overlapControls, 0) / totalControls) * 100
  );

  const filteredFrameworks = frameworks.filter(framework =>
    framework.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    framework.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quick stats for the header
  const quickStats: StatCard[] = [
    {
      label: 'Average Progress',
      value: `${avgProgress}%`,
      change: '+12%',
      trend: 'up',
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      description: 'Cross-framework completion',
      color: 'text-blue-600'
    },
    {
      label: 'Overlap Optimization',
      value: `${overlapOptimization}%`,
      change: '+8%',
      trend: 'up',
      icon: <Network className="h-6 w-6 text-green-600" />,
      description: 'Control reuse efficiency',
      color: 'text-green-600'
    },
    {
      label: 'Total Controls',
      value: `${implementedControls}/${totalControls}`,
      change: '+15%',
      trend: 'up',
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      description: 'Controls implemented',
      color: 'text-purple-600'
    },
    {
      label: 'Trust Points',
      value: totalTrustPoints.toLocaleString(),
      change: '+25%',
      trend: 'up',
      icon: <Award className="h-6 w-6 text-orange-600" />,
      description: 'Total earned points',
      color: 'text-orange-600'
    }
  ];

  // Tab configurations
  const tabs: TabConfiguration[] = [
    {
      id: 'overview',
      label: 'Framework Overview',
      badge: frameworks.length,
      content: (

        <div className="space-y-6">
          {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search frameworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Framework Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFrameworks.map((framework) => {
                const IconComponent = framework.icon;
                return (
                  <Card 
                    key={framework.id}
                    className="card-professional cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105"
                    onClick={() => setSelectedFramework(framework.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${framework.color} flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <RiskBadge riskLevel={framework.priority} />
                          <StatusBadge status={framework.status} />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{framework.name}</CardTitle>
                      <p className="text-sm text-slate-600">{framework.fullName}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{framework.progress}%</span>
                          </div>
                          <Progress value={framework.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Controls</span>
                            <div className="font-medium">{framework.implementedControls}/{framework.controls}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Overlap</span>
                            <div className="font-medium text-green-600">{Math.round((framework.overlapControls / framework.controls) * 100)}%</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <TrustPointsDisplay points={framework.trustPoints} size="sm" />
                          {framework.complianceDate && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Due {new Date(framework.complianceDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
        </div>
      )
    },
    {
      id: 'mappings',
      label: 'Control Mappings',
      badge: `${overlapOptimization}%`,
      content: (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Cross-Framework Control Mappings</h3>
              <Badge className="bg-green-100 text-green-800">
                <Network className="h-3 w-3 mr-1" />
                {overlapOptimization}% Overlap Optimization
              </Badge>
            </div>

            <div className="space-y-4">
              {controlMappings.map((mapping) => (
                <Card key={mapping.id} className="card-professional border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{mapping.controlNumber}</Badge>
                          <h4 className="font-semibold">{mapping.title}</h4>
                          <StatusBadge status={mapping.status} />
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{mapping.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Primary: </span>
                            <span className="font-medium">{mapping.primaryFramework}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Mapped to: </span>
                            <span className="font-medium">{mapping.mappedFrameworks.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Overlap: </span>
                            <span className="font-medium text-green-600">{mapping.overlapPercentage}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <TrustPointsDisplay points={mapping.trustPoints} size="sm" />
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Evidence
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div>Evidence: {mapping.evidence.join(', ')}</div>
                      <div>Updated: {new Date(mapping.lastUpdated).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
      )
    },
    {
      id: 'optimization',
      label: 'Overlap Analysis',
      content: (
        <div className="space-y-6">
            <Card className="card-professional border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Framework Overlap Optimization Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Control Overlap Matrix</h4>
                    <div className="space-y-3">
                      {frameworks.slice(0, 4).map((framework) => (
                        <div key={framework.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="font-medium">{framework.name}</span>
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={(framework.overlapControls / framework.controls) * 100} 
                              className="w-24 h-2" 
                            />
                            <span className="text-sm font-medium text-green-600">
                              {Math.round((framework.overlapControls / framework.controls) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Optimization Benefits</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Reduced Implementation Time</div>
                          <div className="text-sm text-slate-600">70% faster compliance rollout</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Cost Savings</div>
                          <div className="text-sm text-slate-600">€450K saved in duplicate efforts</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Award className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Trust Points Multiplier</div>
                          <div className="text-sm text-slate-600">1.5x bonus for cross-framework controls</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      )
    },
    {
      id: 'roadmap',
      label: 'Implementation Roadmap',
      content: (
        <div className="space-y-6">
            <Card className="card-professional border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Strategic Implementation Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {frameworks
                    .filter(f => f.status !== 'completed')
                    .sort((a, b) => {
                      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    })
                    .map((framework, index) => {
                      const IconComponent = framework.icon;
                      return (
                        <div key={framework.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${framework.color} flex items-center justify-center`}>
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <h4 className="font-semibold">{framework.name}</h4>
                              <RiskBadge riskLevel={framework.priority} />
                              {framework.complianceDate && (
                                <Badge variant="outline" className="text-xs">
                                  Due {new Date(framework.complianceDate).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{framework.description}</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-slate-500">Progress: </span>
                                <span className="font-medium">{framework.progress}%</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Controls: </span>
                                <span className="font-medium">{framework.implementedControls}/{framework.controls}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Trust Points: </span>
                                <span className="font-medium text-green-600">+{framework.trustPoints}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
        </div>
      )
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
        <Download className="h-4 w-4 mr-2" />
        Export Report
      </Button>
    </>
  );

  return (
    <ComponentPageTemplate
      title="Framework Management"
      subtitle="Intelligent Compliance Orchestration"
      description="Optimize compliance across multiple frameworks with 70% overlap reduction and intelligent control mapping for maximum efficiency."
      trustScore={avgProgress}
      trustPoints={totalTrustPoints}
      quickStats={quickStats}
      tabs={tabs}
      actions={headerActions}
      headerGradient="from-blue-50 to-purple-50"
      className="card-professional"
    />
  );
};