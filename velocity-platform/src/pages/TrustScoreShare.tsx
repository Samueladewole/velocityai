import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Share,
  Link2,
  QrCode,
  Download,
  Eye,
  Shield,
  Award,
  TrendingUp,
  Users,
  Globe,
  Lock,
  Copy,
  CheckCircle,
  Calendar,
  BarChart3,
  Settings,
  ExternalLink,
  Mail,
  MessageSquare,
  Linkedin,
  Twitter,
  FileText,
  Star,
  Building2,
  Zap
} from 'lucide-react';

interface TrustProfile {
  organizationName: string;
  trustScore: number;
  trustTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  industry: string;
  lastUpdated: string;
  certifications: string[];
  keyMetrics: {
    complianceFrameworks: number;
    securityControls: number;
    riskReduction: number;
    automationLevel: number;
  };
  peerComparison: {
    industryPercentile: number;
    sizePercentile: number;
  };
}

export const TrustScoreShare: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharingSettings, setSharingSettings] = useState({
    publicView: true,
    industryComparison: true,
    detailedMetrics: false,
    certificationList: true,
    contactInfo: false
  });

  // Sample trust profile data
  const trustProfile: TrustProfile = {
    organizationName: 'Nordic Tech Solutions',
    trustScore: 94,
    trustTier: 'Platinum',
    industry: 'Technology',
    lastUpdated: '2024-01-20',
    certifications: ['ISO 27001', 'SOC 2 Type II', 'GDPR Compliant', 'TISAX'],
    keyMetrics: {
      complianceFrameworks: 12,
      securityControls: 247,
      riskReduction: 87,
      automationLevel: 93
    },
    peerComparison: {
      industryPercentile: 96,
      sizePercentile: 91
    }
  };

  const generateShareUrl = () => {
    const baseUrl = 'https://trust.erip.ai/profile/';
    const profileId = 'nt-solutions-2024';
    const params = new URLSearchParams();
    
    if (sharingSettings.industryComparison) params.append('compare', 'industry');
    if (sharingSettings.detailedMetrics) params.append('details', 'full');
    if (sharingSettings.certificationList) params.append('certs', 'true');
    if (sharingSettings.contactInfo) params.append('contact', 'true');
    
    const url = `€{baseUrl}€{profileId}?€{params.toString()}`;
    setShareUrl(url);
    return url;
  };

  const copyToClipboard = async () => {
    const url = shareUrl || generateShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTrustTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'from-slate-400 to-slate-600';
      case 'Gold':
        return 'from-yellow-400 to-yellow-600';
      case 'Silver':
        return 'from-gray-300 to-gray-500';
      case 'Bronze':
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const shareToSocial = (platform: string) => {
    const url = shareUrl || generateShareUrl();
    const text = `Check out our Trust Score of €{trustProfile.trustScore}% - €{trustProfile.trustTier} tier! We're committed to security excellence.`;
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=€{encodeURIComponent(url)}&text=€{encodeURIComponent(text)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=€{encodeURIComponent(url)}&text=€{encodeURIComponent(text)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Our Trust Score&body=€{encodeURIComponent(text + '\n\n' + url)}`);
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Trust Score Sharing Center
            </h1>
            <p className="text-slate-600">
              Share your Trust Equity™ score to accelerate sales and build stakeholder confidence
            </p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r €{getTrustTierColor(trustProfile.trustTier)} bg-clip-text text-transparent mb-1`}>
              {trustProfile.trustScore}%
            </div>
            <Badge className={`bg-gradient-to-r €{getTrustTierColor(trustProfile.trustTier)} text-white`}>
              {trustProfile.trustTier} Tier
            </Badge>
          </div>
        </div>

        {/* Value Proposition */}
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            Organizations with public Trust Scores close deals 40% faster and command 25% premium pricing. 
            Your {trustProfile.trustTier} tier score positions you in the top {100 - trustProfile.peerComparison.industryPercentile}% of your industry.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="overview">Trust Profile</TabsTrigger>
          <TabsTrigger value="sharing">Share & Embed</TabsTrigger>
          <TabsTrigger value="analytics">Share Analytics</TabsTrigger>
          <TabsTrigger value="settings">Privacy Settings</TabsTrigger>
        </TabsList>

        {/* Trust Profile Overview */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Trust Score Display */}
            <Card className="card-professional">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r €{getTrustTierColor(trustProfile.trustTier)} mb-4`}>
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900">{trustProfile.trustScore}%</div>
                        <div className="text-sm text-slate-600">Trust Score</div>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {trustProfile.organizationName}
                  </h2>
                  <div className="flex items-center justify-center gap-4 text-slate-600">
                    <span>{trustProfile.industry}</span>
                    <span>•</span>
                    <span>Updated {trustProfile.lastUpdated}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">
                      {trustProfile.keyMetrics.complianceFrameworks}
                    </div>
                    <div className="text-sm text-slate-600">Frameworks</div>
                  </div>

                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">
                      {trustProfile.keyMetrics.securityControls}
                    </div>
                    <div className="text-sm text-slate-600">Controls</div>
                  </div>

                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">
                      {trustProfile.keyMetrics.riskReduction}%
                    </div>
                    <div className="text-sm text-slate-600">Risk Reduction</div>
                  </div>

                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">
                      {trustProfile.keyMetrics.automationLevel}%
                    </div>
                    <div className="text-sm text-slate-600">Automated</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications & Peer Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Active Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {trustProfile.certifications.map((cert) => (
                      <Badge key={cert} className="justify-center py-2 bg-blue-50 text-blue-700 border-blue-200">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Certificates
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Industry Benchmarking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Industry Ranking</span>
                        <span className="font-medium">{trustProfile.peerComparison.industryPercentile}th percentile</span>
                      </div>
                      <Progress value={trustProfile.peerComparison.industryPercentile} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Size Category</span>
                        <span className="font-medium">{trustProfile.peerComparison.sizePercentile}th percentile</span>
                      </div>
                      <Progress value={trustProfile.peerComparison.sizePercentile} className="h-2" />
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-center">
                      <span className="text-sm font-medium text-green-600">
                        Top {100 - Math.min(trustProfile.peerComparison.industryPercentile, trustProfile.peerComparison.sizePercentile)}% performer
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Sharing Options */}
        <TabsContent value="sharing">
          <div className="space-y-6">
            {/* Share URL Generator */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-blue-600" />
                  Generate Shareable URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={shareUrl || 'Click "Generate URL" to create your shareable link'}
                      readOnly
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-600"
                    />
                    <Button onClick={generateShareUrl} className="erip-gradient-primary">
                      <Link2 className="h-4 w-4 mr-2" />
                      Generate URL
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={copyToClipboard}
                      disabled={!shareUrl}
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>

                  <Alert>
                    <Eye className="h-4 w-4" />
                    <AlertDescription>
                      This URL provides a public view of your Trust Score that can be shared with prospects, 
                      partners, and stakeholders to demonstrate your security commitment.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* Social Sharing */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5 text-green-600" />
                  Social Media Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => shareToSocial('linkedin')}
                    className="flex items-center gap-2 p-4 h-auto"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">LinkedIn</div>
                      <div className="text-xs text-slate-600">Professional network</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center gap-2 p-4 h-auto"
                  >
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <div className="text-left">
                      <div className="font-medium">Twitter</div>
                      <div className="text-xs text-slate-600">Public announcement</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => shareToSocial('email')}
                    className="flex items-center gap-2 p-4 h-auto"
                  >
                    <Mail className="h-5 w-5 text-slate-600" />
                    <div className="text-left">
                      <div className="font-medium">Email</div>
                      <div className="text-xs text-slate-600">Direct sharing</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code & Downloads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-slate-600" />
                    QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <QrCode className="h-24 w-24 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      Scan to view Trust Score profile
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    Export Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Trust Certificate (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Badge (PNG)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Compliance Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Metrics Summary (Excel)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Profile Views</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    +23% this month
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Social Shares</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <Share className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Across all platforms
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Certificate Downloads</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                    <Download className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    PDF certificates
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Sales Impact</p>
                      <p className="text-2xl font-bold">+40%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Deal closure rate
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Trust Score Impact on Business</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <h4 className="font-medium mb-2">Sales Acceleration</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">40%</div>
                    <p className="text-sm text-slate-600">Faster deal closure with public Trust Score</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <h4 className="font-medium mb-2">Premium Pricing</h4>
                    <div className="text-2xl font-bold text-green-600 mb-1">25%</div>
                    <p className="text-sm text-slate-600">Higher pricing justified by trust level</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                    <h4 className="font-medium mb-2">RFP Pre-qualification</h4>
                    <div className="text-2xl font-bold text-purple-600 mb-1">78%</div>
                    <p className="text-sm text-slate-600">Success rate in security evaluations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="settings">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-600" />
                Sharing Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-slate-600">Allow public access to your Trust Score</p>
                  </div>
                  <Button 
                    variant={sharingSettings.publicView ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSharingSettings(prev => ({...prev, publicView: !prev.publicView}))}
                  >
                    {sharingSettings.publicView ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Industry Comparison</h4>
                    <p className="text-sm text-slate-600">Show your percentile ranking vs peers</p>
                  </div>
                  <Button 
                    variant={sharingSettings.industryComparison ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSharingSettings(prev => ({...prev, industryComparison: !prev.industryComparison}))}
                  >
                    {sharingSettings.industryComparison ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Detailed Metrics</h4>
                    <p className="text-sm text-slate-600">Include specific security control counts</p>
                  </div>
                  <Button 
                    variant={sharingSettings.detailedMetrics ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSharingSettings(prev => ({...prev, detailedMetrics: !prev.detailedMetrics}))}
                  >
                    {sharingSettings.detailedMetrics ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Certification List</h4>
                    <p className="text-sm text-slate-600">Display active certifications and compliance</p>
                  </div>
                  <Button 
                    variant={sharingSettings.certificationList ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSharingSettings(prev => ({...prev, certificationList: !prev.certificationList}))}
                  >
                    {sharingSettings.certificationList ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Contact Information</h4>
                    <p className="text-sm text-slate-600">Include contact details for inquiries</p>
                  </div>
                  <Button 
                    variant={sharingSettings.contactInfo ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSharingSettings(prev => ({...prev, contactInfo: !prev.contactInfo}))}
                  >
                    {sharingSettings.contactInfo ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your Trust Score URL can be updated anytime. Previous URLs will remain active 
                    for 30 days to prevent broken links.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};