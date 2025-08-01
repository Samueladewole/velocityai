import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Heart,
  Laptop,
  ShoppingCart,
  Factory,
  GraduationCap,
  Shield,
  Landmark,
  Car,
  Plane,
  Truck,
  Hotel,
  ArrowRight,
  Globe,
  MapPin,
  Scale,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface IndustryOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  keyRegulations: string[];
  primaryRegions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  complexityLevel: 'simple' | 'moderate' | 'complex';
}

interface RegionalLandscape {
  region: string;
  icon: React.ReactNode;
  description: string;
  keyFrameworks: string[];
  recentChanges: string[];
  complianceComplexity: 'low' | 'medium' | 'high';
}

const industries: IndustryOption[] = [
  {
    id: 'financial',
    name: 'Financial Services',
    icon: <Landmark className="h-8 w-8" />,
    description: 'Banking, insurance, investment services, and fintech',
    keyRegulations: ['MiFID II', 'Basel III', 'GDPR', 'eIDAS', 'PSD2', 'PCI DSS', 'SOX', 'DORA'],
    primaryRegions: ['EU', 'US', 'UK', 'APAC'],
    riskLevel: 'high',
    complexityLevel: 'complex'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Life Sciences',
    icon: <Heart className="h-8 w-8" />,
    description: 'Hospitals, pharmaceuticals, medical devices, and health tech',
    keyRegulations: ['GDPR', 'HIPAA', 'FDA 21 CFR Part 11', 'MDR', 'GxP'],
    primaryRegions: ['EU', 'US', 'Global'],
    riskLevel: 'high',
    complexityLevel: 'complex'
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: <Laptop className="h-8 w-8" />,
    description: 'Software, cloud services, AI/ML, and digital platforms',
    keyRegulations: ['GDPR', 'AI Act', 'CCPA', 'SOC 2', 'ISO 27001', 'NIS2'],
    primaryRegions: ['EU', 'US', 'Global'],
    riskLevel: 'medium',
    complexityLevel: 'moderate'
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    icon: <ShoppingCart className="h-8 w-8" />,
    description: 'Online retail, marketplaces, and consumer goods',
    keyRegulations: ['GDPR', 'CCPA', 'PCI DSS', 'Consumer Rights', 'Product Safety'],
    primaryRegions: ['EU', 'US', 'Global'],
    riskLevel: 'medium',
    complexityLevel: 'moderate'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: <Factory className="h-8 w-8" />,
    description: 'Industrial manufacturing, automotive, and supply chain',
    keyRegulations: ['ISO 27001', 'GDPR', 'REACH', 'Product Liability', 'Environmental'],
    primaryRegions: ['EU', 'US', 'APAC'],
    riskLevel: 'medium',
    complexityLevel: 'moderate'
  },
  {
    id: 'education',
    name: 'Education',
    icon: <GraduationCap className="h-8 w-8" />,
    description: 'Universities, schools, and educational technology',
    keyRegulations: ['GDPR', 'FERPA', 'COPPA', 'Data Protection'],
    primaryRegions: ['EU', 'US', 'Global'],
    riskLevel: 'low',
    complexityLevel: 'simple'
  },
  {
    id: 'government',
    name: 'Government & Public Sector',
    icon: <Shield className="h-8 w-8" />,
    description: 'Government agencies, public services, and contractors',
    keyRegulations: ['GDPR', 'FedRAMP', 'FISMA', 'NIST SP 800-53', 'NIS2'],
    primaryRegions: ['EU', 'US', 'National'],
    riskLevel: 'high',
    complexityLevel: 'complex'
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    icon: <Car className="h-8 w-8" />,
    description: 'Power generation, utilities, and renewable energy',
    keyRegulations: ['NIS2', 'GDPR', 'Critical Infrastructure', 'Environmental'],
    primaryRegions: ['EU', 'US', 'Global'],
    riskLevel: 'high',
    complexityLevel: 'complex'
  }
];

const regionalLandscapes: RegionalLandscape[] = [
  {
    region: 'European Union',
    icon: <Globe className="h-6 w-6" />,
    description: 'Comprehensive regulatory framework with strict privacy and AI governance',
    keyFrameworks: ['GDPR', 'eIDAS', 'PSD2', 'AI Act', 'NIS2', 'DORA', 'DMA', 'DSA'],
    recentChanges: [
      'AI Act implementation (2025-2025)',
      'NIS2 Directive enforcement',
      'DORA operational resilience requirements'
    ],
    complianceComplexity: 'high'
  },
  {
    region: 'United States',
    icon: <MapPin className="h-6 w-6" />,
    description: 'Sector-specific regulations with growing state-level privacy laws',
    keyFrameworks: ['CCPA', 'SOX', 'HIPAA', 'NIST CSF', 'FedRAMP'],
    recentChanges: [
      'State privacy law expansion',
      'AI executive orders',
      'Cybersecurity regulations'
    ],
    complianceComplexity: 'medium'
  },
  {
    region: 'United Kingdom',
    icon: <Scale className="h-6 w-6" />,
    description: 'Post-Brexit regulatory divergence with innovation-friendly approach',
    keyFrameworks: ['UK GDPR', 'Data Protection Act', 'AI White Paper'],
    recentChanges: [
      'Data adequacy decisions',
      'AI regulation consultation',
      'Digital markets regulation'
    ],
    complianceComplexity: 'medium'
  },
  {
    region: 'Canada',
    icon: <MapPin className="h-6 w-6" />,
    description: 'Federal and provincial privacy laws with emerging AI governance',
    keyFrameworks: ['PIPEDA', 'CPPA', 'SOX (TSX)', 'Provincial Privacy Acts'],
    recentChanges: [
      'CPPA implementation',
      'AI and Data Commissioner Bill',
      'Provincial privacy law updates'
    ],
    complianceComplexity: 'medium'
  },
  {
    region: 'Asia-Pacific',
    icon: <Globe className="h-6 w-6" />,
    description: 'Diverse regulatory landscape with increasing data protection focus',
    keyFrameworks: ['Australia Privacy Act', 'Singapore PDPA', 'Japan APPI', 'India DPDP'],
    recentChanges: [
      'Australia Privacy Act reform',
      'Singapore cybersecurity regulations',
      'India DPDP Act implementation'
    ],
    complianceComplexity: 'medium'
  },
  {
    region: 'Global/Multi-jurisdictional',
    icon: <Globe className="h-6 w-6" />,
    description: 'International standards and cross-border compliance requirements',
    keyFrameworks: ['ISO 27001', 'SOC 2', 'PCI DSS', 'Cross-border data transfers'],
    recentChanges: [
      'ISO/IEC 27001:2022 updates',
      'SOC 2 Type II evolution',
      'Cross-border transfer mechanisms'
    ],
    complianceComplexity: 'high'
  }
];

export const IndustrySelection: React.FC = () => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleIndustry = (industryId: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industryId) 
        ? prev.filter(id => id !== industryId)
        : [...prev, industryId]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[level as keyof typeof colors];
  };

  const getComplexityIcon = (level: string) => {
    if (level === 'simple') return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (level === 'moderate') return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  const handleProceed = () => {
    if (selectedIndustries.length > 0 && selectedRegions.length > 0) {
      // Store selections in localStorage or context for use across the platform
      localStorage.setItem('selectedIndustries', JSON.stringify(selectedIndustries));
      localStorage.setItem('selectedRegions', JSON.stringify(selectedRegions));
      
      // Navigate to primary regulatory landscape or main platform
      if (selectedRegions.includes('European Union')) {
        navigate('/regulatory/eu');
      } else {
        navigate('/app');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Configure Your Organization</h1>
              <p className="text-xl text-slate-600">Select all applicable industries and regulatory landscapes</p>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Select all industries and regulatory landscapes that apply to your organization to access comprehensive risk intelligence, 
            compliance frameworks, and automated guidance across your entire business context.
          </p>
        </div>

        {/* Industry Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              Industry Sector
            </CardTitle>
            <CardDescription>
              Select all business sectors that apply to your organization for comprehensive compliance guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {industries.map((industry) => (
                <Card
                  key={industry.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 €{
                    selectedIndustries.includes(industry.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50/50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleIndustry(industry.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600">{industry.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {industry.name}
                          {selectedIndustries.includes(industry.id) && (
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border €{getRiskBadge(industry.riskLevel)}`}>
                            {industry.riskLevel} risk
                          </span>
                          <div className="flex items-center gap-1">
                            {getComplexityIcon(industry.complexityLevel)}
                            <span className="text-xs text-slate-500">{industry.complexityLevel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-sm text-slate-600">{industry.description}</p>
                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">Key Regulations:</p>
                      <div className="flex flex-wrap gap-1">
                        {industry.keyRegulations.slice(0, 3).map((reg) => (
                          <span key={reg} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded">
                            {reg}
                          </span>
                        ))}
                        {industry.keyRegulations.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded">
                            +{industry.keyRegulations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Landscape Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Globe className="h-6 w-6 text-green-600" />
              Regulatory Landscape
            </CardTitle>
            <CardDescription>
              Select all regulatory environments that apply to your organization for comprehensive compliance coverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regionalLandscapes.map((landscape) => (
                <Card
                  key={landscape.region}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 €{
                    selectedRegions.includes(landscape.region)
                      ? 'ring-2 ring-green-500 bg-green-50/50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleRegion(landscape.region)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-green-600">{landscape.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {landscape.region}
                          {selectedRegions.includes(landscape.region) && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </CardTitle>
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border mt-1 €{getRiskBadge(landscape.complianceComplexity)}`}>
                          {landscape.complianceComplexity} complexity
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">{landscape.description}</p>
                    
                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-2">Key Frameworks:</p>
                      <div className="flex flex-wrap gap-1">
                        {landscape.keyFrameworks.map((framework) => (
                          <span key={framework} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                            {framework}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-2">Recent Changes:</p>
                      <ul className="space-y-1">
                        {landscape.recentChanges.slice(0, 2).map((change, index) => (
                          <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                            <div className="h-1 w-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selection Summary & Proceed */}
        {selectedIndustries.length > 0 && selectedRegions.length > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">Selection Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <strong className="text-sm">Industries ({selectedIndustries.length}):</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedIndustries.map(industryId => {
                            const industry = industries.find(i => i.id === industryId);
                            return (
                              <span key={industryId} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                {industry?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <strong className="text-sm">Regulatory Landscapes ({selectedRegions.length}):</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRegions.map(region => (
                            <span key={region} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                              {region}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    You'll get comprehensive compliance guidance, risk assessments, and regulatory updates 
                    tailored to all your selected industries and regulatory landscapes.
                  </p>
                </div>
                <Button
                  onClick={handleProceed}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  Access Platform
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue to General Platform */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/app')}
            className="text-slate-600"
          >
            Or continue to general platform
          </Button>
        </div>
      </div>
    </div>
  );
};