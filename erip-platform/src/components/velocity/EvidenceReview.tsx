import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { dateUtils } from '@/components/shared/DateProvider';
import { 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Download, 
  Filter, 
  Search, 
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Image,
  Video,
  Shield,
  Target,
  Clock,
  Zap,
  Award,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  type: 'screenshot' | 'config' | 'log' | 'policy' | 'report';
  title: string;
  description: string;
  framework: string;
  control: string;
  status: 'verified' | 'pending_review' | 'failed' | 'auto_approved';
  confidence: number;
  collectedAt: string;
  platform: 'aws' | 'gcp' | 'azure' | 'github' | 'manual';
  size: string;
  automationApplied: boolean;
  trustPointsContribution: number;
  validationResults?: {
    imageQuality?: number;
    ocrAccuracy?: number;
    configCompliance?: number;
  };
}

interface FilterState {
  framework: string;
  platform: string;
  status: string;
  type: string;
}

export const EvidenceReview: React.FC = () => {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    framework: 'all',
    platform: 'all', 
    status: 'all',
    type: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock evidence data - in production, this would come from the backend
  useEffect(() => {
    setEvidenceItems([
      {
        id: '1',
        type: 'screenshot',
        title: 'AWS IAM Policies Dashboard',
        description: 'Screenshot of IAM console showing admin privilege restrictions',
        framework: 'CIS Controls',
        control: 'CIS Control 4: Admin Privileges',
        status: 'auto_approved',
        confidence: 96,
        collectedAt: dateUtils.getRecentTimestamp(30),
        platform: 'aws',
        size: '2.3 MB',
        automationApplied: true,
        trustPointsContribution: 15,
        validationResults: {
          imageQuality: 94,
          ocrAccuracy: 92
        }
      },
      {
        id: '2',
        type: 'config',
        title: 'S3 Bucket Encryption Settings',
        description: 'JSON configuration showing encryption at rest enabled',
        framework: 'CIS Controls',
        control: 'CIS Control 5: Secure Configuration',
        status: 'verified',
        confidence: 98,
        collectedAt: dateUtils.getRecentTimestamp(35),
        platform: 'aws',
        size: '0.8 KB',
        automationApplied: true,
        trustPointsContribution: 18,
        validationResults: {
          configCompliance: 100
        }
      },
      {
        id: '3',
        type: 'log',
        title: 'CloudTrail Activity Logs',
        description: 'Last 30 days of API calls and admin activities',
        framework: 'CIS Controls',
        control: 'CIS Control 6: Audit Logs',
        status: 'pending_review',
        confidence: 87,
        collectedAt: dateUtils.getRecentTimestamp(40),
        platform: 'aws',
        size: '45.2 MB',
        automationApplied: true,
        trustPointsContribution: 22,
      },
      {
        id: '4',
        type: 'report',
        title: 'Vulnerability Scan Results',
        description: 'AWS Inspector findings for EC2 instances',
        framework: 'CIS Controls',
        control: 'CIS Control 3: Vulnerability Management',
        status: 'failed',
        confidence: 45,
        collectedAt: dateUtils.getRecentTimestamp(45),
        platform: 'aws',
        size: '1.2 MB',
        automationApplied: true,
        trustPointsContribution: 0,
      },
      {
        id: '5',
        type: 'policy',
        title: 'Security Group Configurations',
        description: 'Network access control policies and rules',
        framework: 'SOC 2',
        control: 'CC6.1: Logical Access Controls',
        status: 'verified',
        confidence: 94,
        collectedAt: dateUtils.getRecentTimestamp(50),
        platform: 'aws',
        size: '3.4 KB',
        automationApplied: true,
        trustPointsContribution: 20,
        validationResults: {
          configCompliance: 88
        }
      }
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'auto_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending_review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'screenshot':
        return <Image className="w-4 h-4" />;
      case 'config':
        return <FileText className="w-4 h-4" />;
      case 'log':
        return <Eye className="w-4 h-4" />;
      case 'policy':
        return <Shield className="w-4 h-4" />;
      case 'report':
        return <Target className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'aws':
        return '🌐';
      case 'gcp':
        return '☁️';
      case 'azure':
        return '🔷';
      case 'github':
        return '🐙';
      default:
        return '📄';
    }
  };

  const filteredItems = evidenceItems.filter(item => {
    if (filters.framework !== 'all' && item.framework !== filters.framework) return false;
    if (filters.platform !== 'all' && item.platform !== filters.platform) return false;
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalTrustPoints = filteredItems.reduce((sum, item) => sum + item.trustPointsContribution, 0);
  const avgConfidence = filteredItems.length > 0 
    ? Math.round(filteredItems.reduce((sum, item) => sum + item.confidence, 0) / filteredItems.length)
    : 0;

  const statusCounts = {
    verified: filteredItems.filter(item => item.status === 'verified' || item.status === 'auto_approved').length,
    pending: filteredItems.filter(item => item.status === 'pending_review').length,
    failed: filteredItems.filter(item => item.status === 'failed').length
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on items:`, Array.from(selectedItems));
    // Implement bulk actions here
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evidence Review</h1>
          <p className="text-gray-600">Review and validate AI-collected compliance evidence</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export Evidence
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredItems.length}</div>
                <div className="text-sm text-gray-600">Evidence Items</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalTrustPoints}</div>
                <div className="text-sm text-gray-600">Trust Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{avgConfidence}%</div>
                <div className="text-sm text-gray-600">Avg Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">94%</div>
                <div className="text-sm text-gray-600">Automated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search evidence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={filters.framework}
              onChange={(e) => setFilters(prev => ({ ...prev, framework: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Frameworks</option>
              <option value="CIS Controls">CIS Controls</option>
              <option value="SOC 2">SOC 2</option>
              <option value="ISO 27001">ISO 27001</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="auto_approved">Auto Approved</option>
              <option value="pending_review">Pending Review</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Platforms</option>
              <option value="aws">AWS</option>
              <option value="gcp">GCP</option>
              <option value="azure">Azure</option>
              <option value="github">GitHub</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-green-800">{statusCounts.verified}</div>
                <div className="text-sm text-green-600">Verified Evidence</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-yellow-800">{statusCounts.pending}</div>
                <div className="text-sm text-yellow-600">Pending Review</div>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-red-800">{statusCounts.failed}</div>
                <div className="text-sm text-red-600">Failed Validation</div>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Items List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Evidence Items ({filteredItems.length})</CardTitle>
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedItems.size} selected</span>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
                  Approve Selected
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('download')}>
                  Download Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredItems.map((item) => (
              <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedItems);
                        if (e.target.checked) {
                          newSelected.add(item.id);
                        } else {
                          newSelected.delete(item.id);
                        }
                        setSelectedItems(newSelected);
                      }}
                      className="mt-1"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getTypeIcon(item.type)}
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <span className="text-xl">{getPlatformIcon(item.platform)}</span>
                            {item.automationApplied && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                <Zap className="w-3 h-3 mr-1" />
                                AI Collected
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500">{item.framework} • {item.control}</span>
                            <span className="text-gray-500">Size: {item.size}</span>
                            <span className="text-gray-500">
                              Collected: {new Date(item.collectedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <span className="text-sm font-medium capitalize">
                                {item.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.confidence}% confidence
                            </div>
                            <div className="text-sm font-medium text-purple-600">
                              +{item.trustPointsContribution} Trust Points
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                          >
                            {expandedItem === item.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedItem === item.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Validation Results</h4>
                              {item.validationResults && (
                                <div className="space-y-2">
                                  {item.validationResults.imageQuality && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">Image Quality</span>
                                      <span className="text-sm font-medium">{item.validationResults.imageQuality}%</span>
                                    </div>
                                  )}
                                  {item.validationResults.ocrAccuracy && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">OCR Accuracy</span>
                                      <span className="text-sm font-medium">{item.validationResults.ocrAccuracy}%</span>
                                    </div>
                                  )}
                                  {item.validationResults.configCompliance && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">Config Compliance</span>
                                      <span className="text-sm font-medium">{item.validationResults.configCompliance}%</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Preview
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View Source
                                </Button>
                                {item.status === 'pending_review' && (
                                  <>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                      Approve
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidenceReview;