import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Award, 
  ExternalLink,
  Copy,
  Check,
  Code,
  Image,
  Mail
} from 'lucide-react';

interface TrustBadgeProps {
  companySlug: string;
  trustScore: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  style?: 'compact' | 'detailed' | 'minimal';
  theme?: 'light' | 'dark';
}

const tierConfig = {
  Bronze: { color: '#d97706', gradient: 'from-amber-600 to-amber-700' },
  Silver: { color: '#6b7280', gradient: 'from-gray-400 to-gray-500' },
  Gold: { color: '#fbbf24', gradient: 'from-yellow-400 to-yellow-600' },
  Platinum: { color: '#7c3aed', gradient: 'from-purple-400 to-purple-600' }
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  companySlug,
  trustScore,
  tier,
  style = 'compact',
  theme = 'light'
}) => {
  const tierStyle = tierConfig[tier];
  const trustCenterUrl = `https://trust.erip.io/${companySlug}`;

  if (style === 'minimal') {
    return (
      <a 
        href={trustCenterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 ${
          theme === 'dark' 
            ? 'bg-slate-800 text-white hover:bg-slate-700' 
            : 'bg-white text-slate-900 hover:bg-slate-50 shadow-sm border border-slate-200'
        }`}
      >
        <div className={`p-1 rounded bg-gradient-to-r ${tierStyle.gradient}`}>
          <Shield className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium">Trust Score: {trustScore}</span>
        <ExternalLink className="h-3 w-3 opacity-50" />
      </a>
    );
  }

  if (style === 'compact') {
    return (
      <a 
        href={trustCenterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-xs hover:scale-105 transition-transform"
      >
        <Card className={`${
          theme === 'dark' 
            ? 'bg-slate-800 border-slate-700 text-white' 
            : 'bg-white border-slate-200'
        } shadow-lg hover:shadow-xl transition-shadow`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${tierStyle.gradient}`}>
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{trustScore}</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${tierStyle.gradient} text-white font-medium`}>
                    {tier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">ERIP Verified Trust Score</p>
              </div>
              <ExternalLink className="h-4 w-4 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </a>
    );
  }

  // Detailed style
  return (
    <a 
      href={trustCenterUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-sm hover:scale-105 transition-transform"
    >
      <Card className={`${
        theme === 'dark' 
          ? 'bg-slate-800 border-slate-700 text-white' 
          : 'bg-white border-slate-200'
      } shadow-lg hover:shadow-xl transition-shadow`}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r ${tierStyle.gradient} text-white font-semibold mb-4`}>
              <Shield className="h-4 w-4" />
              ERIP Verified
            </div>
            
            <div className="text-4xl font-bold mb-2">{trustScore}</div>
            <div className={`text-sm font-medium mb-1 bg-gradient-to-r ${tierStyle.gradient} bg-clip-text text-transparent`}>
              {tier} Tier Trust Score
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Independently verified security posture
            </p>
            
            <div className="flex items-center justify-center gap-1 text-xs text-slate-600">
              <span>View Trust Center</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export const TrustBadgeGenerator: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<'minimal' | 'compact' | 'detailed'>('compact');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState<string>('');

  const mockProps = {
    companySlug: 'acme-corp',
    trustScore: 847,
    tier: 'Platinum' as const
  };

  const generateEmbedCode = (style: string, theme: string) => {
    return `<!-- ERIP Trust Badge -->
<script src="https://trust.erip.io/embed.js"></script>
<div 
  data-erip-trust-badge
  data-company="${mockProps.companySlug}"
  data-style="${style}"
  data-theme="${theme}"
></div>`;
  };

  const generateReactCode = (style: string, theme: string) => {
    return `import { TrustBadge } from '@erip/trust-badge';

<TrustBadge
  companySlug="${mockProps.companySlug}"
  trustScore={${mockProps.trustScore}}
  tier="${mockProps.tier}"
  style="${style}"
  theme="${theme}"
/>`;
  };

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Trust Badge Generator</h2>
        <p className="text-slate-600">Embed your Trust Score on your website to build customer confidence</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="space-y-6">
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Badge Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['minimal', 'compact', 'detailed'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(style as any)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          selectedStyle === style
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['light', 'dark'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme as any)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          selectedTheme === theme
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Embed Codes */}
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Embed Code</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">HTML Embed</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(generateEmbedCode(selectedStyle, selectedTheme), 'html')}
                    >
                      {copied === 'html' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <textarea
                    readOnly
                    value={generateEmbedCode(selectedStyle, selectedTheme)}
                    className="w-full h-24 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 resize-none"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">React Component</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(generateReactCode(selectedStyle, selectedTheme), 'react')}
                    >
                      {copied === 'react' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <textarea
                    readOnly
                    value={generateReactCode(selectedStyle, selectedTheme)}
                    className="w-full h-20 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
              
              <div className={`p-6 rounded-lg ${selectedTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} flex items-center justify-center`}>
                <TrustBadge
                  {...mockProps}
                  style={selectedStyle}
                  theme={selectedTheme}
                />
              </div>
              
              <p className="text-xs text-slate-500 mt-3 text-center">
                Badge will link to your Trust Center: trust.erip.io/{mockProps.companySlug}
              </p>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Usage Guidelines</h3>
              
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <p>Place the badge in visible locations like your homepage, pricing page, or footer</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <p>Use the minimal style for space-constrained areas like navigation bars</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <p>The detailed style works best on security or about pages</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <p>Badge automatically updates when your Trust Score changes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};