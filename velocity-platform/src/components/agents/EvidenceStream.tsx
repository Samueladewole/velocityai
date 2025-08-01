import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Image,
  FileText,
  Database,
  Shield,
  Zap,
  Filter,
  Search
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  agentId: string;
  agentName: string;
  type: 'screenshot' | 'configuration' | 'log' | 'policy' | 'certificate';
  title: string;
  description: string;
  timestamp: Date;
  framework: ('SOC2' | 'ISO27001' | 'GDPR' | 'HIPAA')[];
  controls: string[];
  confidence: number; // AI validation confidence 0-100
  status: 'collecting' | 'validating' | 'approved' | 'flagged';
  thumbnailUrl?: string;
  fullUrl?: string;
  metadata: Record<string, any>;
}

const EVIDENCE_ICONS = {
  screenshot: Image,
  configuration: FileText,
  log: Database,
  policy: Shield,
  certificate: Zap
};

const STATUS_STYLES = {
  collecting: 'border-blue-500 bg-blue-50 text-blue-700',
  validating: 'border-amber-500 bg-amber-50 text-amber-700', 
  approved: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  flagged: 'border-red-500 bg-red-50 text-red-700'
};

const FRAMEWORK_COLORS = {
  SOC2: 'bg-emerald-100 text-emerald-800',
  ISO27001: 'bg-blue-100 text-blue-800',
  GDPR: 'bg-purple-100 text-purple-800',
  HIPAA: 'bg-orange-100 text-orange-800'
};

const SAMPLE_EVIDENCE_STREAM: EvidenceItem[] = [
  {
    id: 'ev-001',
    agentId: 'aws-evidence',
    agentName: 'AWS Evidence Collector',
    type: 'screenshot',
    title: 'CloudTrail Configuration',
    description: 'Management events logging enabled for all regions',
    timestamp: new Date(),
    framework: ['SOC2', 'ISO27001'],
    controls: ['CC6.1', 'CC6.8', 'A.12.4.1'],
    confidence: 98,
    status: 'validating',
    thumbnailUrl: '/evidence/thumbs/cloudtrail-001.png',
    fullUrl: '/evidence/full/cloudtrail-001.png',
    metadata: {
      region: 'us-east-1',
      account: 'prod-account',
      service: 'CloudTrail'
    }
  },
  {
    id: 'ev-002',
    agentId: 'github-analyzer',
    agentName: 'GitHub Security Analyzer',
    type: 'configuration',
    title: 'Branch Protection Rules',
    description: 'Require pull request reviews and status checks',
    timestamp: new Date(Date.now() - 30000),
    framework: ['SOC2'],
    controls: ['CC8.1'],
    confidence: 95,
    status: 'approved',
    metadata: {
      repository: 'main-app',
      branch: 'main',
      protection: 'enabled'
    }
  },
  {
    id: 'ev-003',
    agentId: 'azure-monitor',
    agentName: 'Azure Security Monitor',
    type: 'log',
    title: 'Security Center Alerts',
    description: 'Activity logs for security events and alerts',
    timestamp: new Date(Date.now() - 120000),
    framework: ['SOC2', 'ISO27001'],
    controls: ['CC7.1', 'A.16.1.2'],
    confidence: 92,
    status: 'approved',
    metadata: {
      subscription: 'prod-subscription',
      resourceGroup: 'security-rg',
      alertCount: 0
    }
  },
  {
    id: 'ev-004',
    agentId: 'trust-engine',
    agentName: 'Trust Score Engine',
    type: 'certificate',
    title: 'Cryptographic Verification',
    description: 'Blockchain proof of compliance evidence integrity',
    timestamp: new Date(Date.now() - 180000),
    framework: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA'],
    controls: ['CC1.4', 'A.18.1.4'],
    confidence: 100,
    status: 'approved',
    metadata: {
      blockHash: '0x1234...abcd',
      proofType: 'merkle-tree',
      verified: true
    }
  },
  {
    id: 'ev-005',
    agentId: 'gcp-scanner',
    agentName: 'GCP Security Scanner',
    type: 'policy',
    title: 'IAM Policy Analysis',
    description: 'Identity and access management policies for GCP resources',
    timestamp: new Date(Date.now() - 240000),
    framework: ['SOC2', 'GDPR'],
    controls: ['CC6.1', 'Art.32'],
    confidence: 89,
    status: 'flagged',
    metadata: {
      project: 'prod-project',
      policies: 23,
      issues: 1
    }
  }
];

interface EvidenceStreamProps {
  className?: string;
}

export const EvidenceStream: React.FC<EvidenceStreamProps> = ({ className = '' }) => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>(SAMPLE_EVIDENCE_STREAM);
  const [filter, setFilter] = useState<'all' | 'collecting' | 'validating' | 'approved' | 'flagged'>('all');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all');

  // Simulate real-time evidence collection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new evidence being collected
      if (Math.random() > 0.7) {
        const agents = ['aws-evidence', 'gcp-scanner', 'azure-monitor', 'github-analyzer', 'continuous-monitor'];
        const types = ['screenshot', 'configuration', 'log', 'policy'] as const;
        const frameworks = [['SOC2'], ['ISO27001'], ['GDPR'], ['HIPAA'], ['SOC2', 'ISO27001']] as const;
        
        const newEvidence: EvidenceItem = {
          id: `ev-€{Date.now()}-€{Math.random().toString(36).substr(2, 9)}`,
          agentId: agents[Math.floor(Math.random() * agents.length)],
          agentName: 'Live Agent',
          type: types[Math.floor(Math.random() * types.length)],
          title: `New Evidence €{Date.now()}`,
          description: 'Real-time evidence collection',
          timestamp: new Date(),
          framework: frameworks[Math.floor(Math.random() * frameworks.length)],
          controls: ['CC1.1'],
          confidence: Math.floor(Math.random() * 20) + 80,
          status: 'collecting',
          metadata: {}
        };

        setEvidence(prev => [newEvidence, ...prev].slice(0, 20)); // Keep last 20 items
      }

      // Simulate status updates
      setEvidence(prev => prev.map(item => {
        if (item.status === 'collecting' && Math.random() > 0.8) {
          return { ...item, status: 'validating' };
        }
        if (item.status === 'validating' && Math.random() > 0.6) {
          return { ...item, status: Math.random() > 0.1 ? 'approved' : 'flagged' };
        }
        return item;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvidence = evidence.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (frameworkFilter !== 'all' && !item.framework.includes(frameworkFilter as any)) return false;
    return true;
  });

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `€{seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `€{minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `€{hours}h ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'collecting': return <Clock className="h-4 w-4 animate-pulse" />;
      case 'validating': return <Eye className="h-4 w-4 animate-bounce" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'flagged': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-emerald-600';
    if (confidence >= 85) return 'text-blue-600';
    if (confidence >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const totalEvidence = evidence.length;
  const approvedEvidence = evidence.filter(e => e.status === 'approved').length;
  const avgConfidence = evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length;
  const activeCollecting = evidence.filter(e => e.status === 'collecting').length;

  return (
    <div className={`space-y-6 €{className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Total Evidence</p>
                <p className="text-2xl font-bold text-emerald-900">{totalEvidence}</p>
              </div>
              <Database className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Collecting Now</p>
                <p className="text-2xl font-bold text-blue-900">{activeCollecting}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-purple-900">{approvedEvidence}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Avg Confidence</p>
                <p className="text-2xl font-bold text-amber-900">{avgConfidence.toFixed(1)}%</p>
              </div>
              <Shield className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-slate-900">Live Evidence Stream</h2>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Real-time
          </div>
        </div>

        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1.5 text-sm border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="collecting">Collecting</option>
            <option value="validating">Validating</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
          </select>

          <select 
            value={frameworkFilter} 
            onChange={(e) => setFrameworkFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border rounded-lg"
          >
            <option value="all">All Frameworks</option>
            <option value="SOC2">SOC 2</option>
            <option value="ISO27001">ISO 27001</option>
            <option value="GDPR">GDPR</option>
            <option value="HIPAA">HIPAA</option>
          </select>
        </div>
      </div>

      {/* Evidence Stream */}
      <div className="space-y-4">
        {filteredEvidence.map((item) => {
          const IconComponent = EVIDENCE_ICONS[item.type];
          
          return (
            <Card 
              key={item.id}
              className={`transition-all duration-200 hover:shadow-md €{STATUS_STYLES[item.status]}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Left side - Evidence info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5" />
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-500">
                        from {item.agentName}
                      </span>
                      <span className="text-sm text-slate-400">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>

                    {/* Framework and Controls */}
                    <div className="flex flex-wrap gap-2">
                      {item.framework.map(fw => (
                        <Badge 
                          key={fw} 
                          className={`text-xs €{FRAMEWORK_COLORS[fw]}`}
                          variant="secondary"
                        >
                          {fw}
                        </Badge>
                      ))}
                      {item.controls.slice(0, 3).map(control => (
                        <Badge key={control} variant="outline" className="text-xs">
                          {control}
                        </Badge>
                      ))}
                      {item.controls.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.controls.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Metadata preview */}
                    {Object.keys(item.metadata).length > 0 && (
                      <div className="text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded">
                        {Object.entries(item.metadata).slice(0, 2).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right side - Confidence and actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-center">
                      <div className={`text-2xl font-bold €{getConfidenceColor(item.confidence)}`}>
                        {item.confidence}%
                      </div>
                      <div className="text-xs text-slate-500">Confidence</div>
                    </div>

                    <div className="flex gap-2">
                      {item.thumbnailUrl && (
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.status === 'validating' && (
                      <div className="flex gap-1">
                        <Button size="sm" className="px-2 py-1 text-xs">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="px-2 py-1 text-xs">
                          Flag
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEvidence.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No evidence found
            </h3>
            <p className="text-slate-500">
              Try adjusting your filters or wait for agents to collect new evidence.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};