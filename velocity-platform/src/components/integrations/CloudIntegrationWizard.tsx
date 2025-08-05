/**
 * Cloud Integration Wizard
 * One-click integration with AWS, Azure, GCP for immediate security value
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  ExternalLink,
  Zap,
  DollarSign,
  TrendingUp,
  Lock,
  Eye,
  Settings
} from 'lucide-react';

interface SecurityFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  resource: string;
  impact: string;
  remediation: string;
  estimatedCost: number;
  autoFixAvailable: boolean;
}

interface CloudProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  setupSteps: string[];
  permissions: string[];
  roi: {
    timeSaved: string;
    costReduction: string;
    riskReduction: string;
  };
}

export const CloudIntegrationWizard: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('aws');
  const [integrationStep, setIntegrationStep] = useState<'select' | 'configure' | 'validate' | 'results'>('select');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [securityFindings, setSecurityFindings] = useState<SecurityFinding[]>([]);
  const [showIAMPolicy, setShowIAMPolicy] = useState(false);

  const cloudProviders: CloudProvider[] = [
    {
      id: 'aws',
      name: 'Amazon Web Services',
      icon: '🟠',
      description: 'Connect your AWS account for comprehensive security monitoring',
      setupSteps: [
        'Create IAM role with read-only permissions',
        'Add Velocity as trusted entity',
        'Verify connection and start scanning'
      ],
      permissions: [
        'ec2:Describe*',
        's3:GetBucketPolicy',
        's3:GetBucketAcl',
        'iam:List*',
        'iam:Get*',
        'cloudtrail:Describe*',
        'config:Describe*'
      ],
      roi: {
        timeSaved: '40 hours/month',
        costReduction: '$50,000/year',
        riskReduction: '85%'
      }
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      icon: '🔵',
      description: 'Integrate with Azure for unified security across your cloud',
      setupSteps: [
        'Register Velocity application in Azure AD',
        'Grant Security Reader permissions',
        'Configure API access and validate'
      ],
      permissions: [
        'Microsoft.Authorization/*/read',
        'Microsoft.Security/*/read',
        'Microsoft.Compute/*/read',
        'Microsoft.Storage/*/read',
        'Microsoft.Network/*/read'
      ],
      roi: {
        timeSaved: '35 hours/month',
        costReduction: '$45,000/year',
        riskReduction: '80%'
      }
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      icon: '🟡',
      description: 'Secure your GCP environment with intelligent monitoring',
      setupSteps: [
        'Create service account with Viewer role',
        'Download service account key',
        'Upload key and verify permissions'
      ],
      permissions: [
        'compute.instances.list',
        'storage.buckets.list',
        'iam.serviceAccounts.list',
        'resourcemanager.projects.get',
        'securitycenter.findings.list'
      ],
      roi: {
        timeSaved: '30 hours/month',
        costReduction: '$40,000/year',
        riskReduction: '75%'
      }
    }
  ];

  const awsIAMPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'ec2:Describe*',
          's3:GetBucketPolicy',
          's3:GetBucketAcl',
          's3:GetBucketLocation',
          's3:GetBucketVersioning',
          's3:GetBucketEncryption',
          's3:ListAllMyBuckets',
          'iam:List*',
          'iam:Get*',
          'cloudtrail:Describe*',
          'cloudtrail:GetTrailStatus',
          'config:Describe*',
          'rds:Describe*',
          'lambda:List*',
          'logs:Describe*',
          'kms:List*',
          'kms:Describe*'
        ],
        Resource: '*'
      }
    ]
  };

  const mockSecurityFindings: SecurityFinding[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'S3 Bucket Publicly Accessible',
      description: 'S3 bucket "user-uploads" allows public read access',
      resource: 's3://user-uploads',
      impact: 'Data breach risk - sensitive customer data exposed',
      remediation: 'Remove public read permissions and implement proper IAM policies',
      estimatedCost: 250000,
      autoFixAvailable: true
    },
    {
      id: '2',
      severity: 'high',
      title: 'RDS Instance Not Encrypted',
      description: 'Production database instance lacks encryption at rest',
      resource: 'rds-prod-db-1',
      impact: 'Compliance violation and data exposure risk',
      remediation: 'Enable encryption at rest for RDS instance',
      estimatedCost: 50000,
      autoFixAvailable: false
    },
    {
      id: '3',
      severity: 'high',
      title: 'EC2 Security Group Too Permissive',
      description: 'Security group allows SSH access from 0.0.0.0/0',
      resource: 'sg-0123456789abcdef0',
      impact: 'Unauthorized access potential',
      remediation: 'Restrict SSH access to specific IP ranges',
      estimatedCost: 15000,
      autoFixAvailable: true
    },
    {
      id: '4',
      severity: 'medium',
      title: 'CloudTrail Not Enabled',
      description: 'Audit logging is not configured in us-west-2',
      resource: 'us-west-2 region',
      impact: 'Limited forensic capabilities',
      remediation: 'Enable CloudTrail with log file validation',
      estimatedCost: 5000,
      autoFixAvailable: true
    }
  ];

  useEffect(() => {
    if (isConnecting) {
      const interval = setInterval(() => {
        setConnectionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsConnecting(false);
            setIntegrationStep('results');
            setSecurityFindings(mockSecurityFindings);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  const selectedProviderData = cloudProviders.find(p => p.id === selectedProvider)!;

  const handleConnect = () => {
    setIsConnecting(true);
    setConnectionProgress(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderProviderSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Connect Your Cloud Environment</h2>
        <p className="text-gray-600 text-lg">
          Get instant security insights across all your cloud resources
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cloudProviders.map((provider) => (
          <Card 
            key={provider.id}
            className={`cursor-pointer transition-all ${
              selectedProvider === provider.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedProvider(provider.id)}
          >
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{provider.icon}</div>
              <CardTitle className="text-lg">{provider.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time Saved:</span>
                  <span className="font-medium text-green-600">{provider.roi.timeSaved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cost Reduction:</span>
                  <span className="font-medium text-green-600">{provider.roi.costReduction}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Risk Reduction:</span>
                  <span className="font-medium text-green-600">{provider.roi.riskReduction}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Why Connect Your Cloud?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Eye className="w-4 h-4" />
                    <span>Discover all resources and shadow IT</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Identify critical security misconfigurations</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Lock className="w-4 h-4" />
                    <span>Automate compliance monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Zap className="w-4 h-4" />
                    <span>Real-time threat detection and response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={() => setIntegrationStep('configure')}
          className="px-8"
        >
          Configure {selectedProviderData.name} Integration
        </Button>
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configure {selectedProviderData.name} Integration</h2>
        <p className="text-gray-600">
          Follow these steps to securely connect your cloud environment
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup Steps</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="policy">IAM Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Step-by-Step Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProviderData.setupSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{step}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedProvider === 'aws' && (
            <Card>
              <CardHeader>
                <CardTitle>AWS CloudFormation Template</CardTitle>
                <p className="text-sm text-gray-600">
                  Deploy this template to automatically create the required IAM role
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">velocity-iam-role.yaml</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard('https://velocity.com/cloudformation/iam-role.yaml')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    One-click deployment creates IAM role with least-privilege permissions
                  </p>
                </div>
                
                <Button className="w-full mt-4" onClick={handleConnect}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Deploy CloudFormation Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Permissions</CardTitle>
              <p className="text-sm text-gray-600">
                Velocity requires these read-only permissions to analyze your security posture
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedProviderData.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {permission}
                    </code>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-800">Security Notice</h4>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  All permissions are read-only. Velocity cannot make changes to your cloud resources.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IAM Policy Document</CardTitle>
              <p className="text-sm text-gray-600">
                Copy this policy to create the IAM role manually
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <pre>{JSON.stringify(awsIAMPolicy, null, 2)}</pre>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(JSON.stringify(awsIAMPolicy, null, 2))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Policy
                </Button>
                <Button onClick={handleConnect}>
                  I've Created the Role - Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderConnection = () => (
    <div className="space-y-6 text-center">
      <div>
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cloud className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connecting to {selectedProviderData.name}</h2>
        <p className="text-gray-600">
          Scanning your cloud environment for security insights...
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${connectionProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">Progress: {Math.round(connectionProgress)}%</p>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>✓ Validating IAM permissions</p>
        <p>✓ Discovering cloud resources</p>
        <p>✓ Analyzing security configurations</p>
        <p>• Generating security report...</p>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Integration Complete!</h2>
        <p className="text-gray-600">
          We've discovered {securityFindings.length} security findings across your cloud environment
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-red-600">
            {securityFindings.filter(f => f.severity === 'critical').length}
          </div>
          <div className="text-sm text-gray-600">Critical Issues</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">
            {securityFindings.filter(f => f.severity === 'high').length}
          </div>
          <div className="text-sm text-gray-600">High Risk</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">
            ${securityFindings.reduce((sum, f) => sum + f.estimatedCost, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Potential Loss</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">
            {securityFindings.filter(f => f.autoFixAvailable).length}
          </div>
          <div className="text-sm text-gray-600">Auto-Fixable</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Top Security Findings
            <Button size="sm">
              Fix All Auto-Fixable Issues
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityFindings.map((finding) => (
            <div key={finding.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getSeverityColor(finding.severity)}>
                      {finding.severity.toUpperCase()}
                    </Badge>
                    <h3 className="font-semibold">{finding.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{finding.description}</p>
                  <div className="text-xs text-gray-500">
                    Resource: <code>{finding.resource}</code>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">
                    ${finding.estimatedCost.toLocaleString()} risk
                  </div>
                  {finding.autoFixAvailable && (
                    <Button size="sm" className="mt-2">
                      Auto-Fix
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                <strong>Remediation:</strong> {finding.remediation}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" className="px-8">
          Go to Security Dashboard
          <TrendingUp className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {integrationStep === 'select' && renderProviderSelection()}
        {integrationStep === 'configure' && renderConfiguration()}
        {integrationStep === 'validate' && renderConnection()}
        {integrationStep === 'results' && renderResults()}
        
        {isConnecting && integrationStep !== 'results' && (
          <>
            {integrationStep !== 'validate' && setIntegrationStep('validate')}
            {renderConnection()}
          </>
        )}
      </div>
    </div>
  );
};