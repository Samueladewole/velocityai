/**
 * Evidence Export Dialog
 * Reusable component for exporting evidence in various formats
 * Supports PDF, Word, Excel, HTML, and shareable links
 */

import React, { useState } from 'react';
import { 
  Download,
  FileText,
  File,
  Table,
  Globe,
  Link,
  Share2,
  Lock,
  Unlock,
  Calendar,
  Filter,
  CheckCircle,
  X,
  Copy,
  ExternalLink,
  Shield,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EvidenceItem {
  id: string;
  control: string;
  framework: string;
  platform: string;
  type: 'screenshot' | 'api_response' | 'configuration' | 'log_entry';
  status: 'validated' | 'pending' | 'failed';
  confidence: number;
  timestamp: string;
  description: string;
  trustPoints: number;
  agentId: string;
}

interface ExportConfig {
  format: 'pdf' | 'docx' | 'xlsx' | 'html' | 'link';
  includeMetadata: boolean;
  includeScreenshots: boolean;
  includeLowConfidence: boolean;
  dateRange: 'all' | 'last30' | 'last7' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  frameworks: string[];
  platforms: string[];
  minConfidence: number;
  password?: string;
  shareAccess: 'public' | 'private' | 'password';
  expirationDays: number;
}

interface EvidenceExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceItem[];
  title?: string;
  subtitle?: string;
}

const EvidenceExportDialog: React.FC<EvidenceExportDialogProps> = ({
  isOpen,
  onClose,
  evidence,
  title = "Export Evidence",
  subtitle = "Choose format and configure export settings"
}) => {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    includeMetadata: true,
    includeScreenshots: true,
    includeLowConfidence: false,
    dateRange: 'all',
    frameworks: [],
    platforms: [],
    minConfidence: 85,
    shareAccess: 'private',
    expirationDays: 30
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResult, setExportResult] = useState<{
    success: boolean;
    downloadUrl?: string;
    shareUrl?: string;
    message: string;
  } | null>(null);

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Professional audit-ready document',
      icon: <FileText className="w-5 h-5 text-red-500" />,
      fileSize: '~2-5 MB',
      features: ['Formatted layout', 'Charts & graphs', 'Digital signatures', 'Print-ready']
    },
    {
      id: 'docx',
      name: 'Word Document',
      description: 'Editable document for collaboration',
      icon: <File className="w-5 h-5 text-blue-500" />,
      fileSize: '~1-3 MB',
      features: ['Editable content', 'Comments support', 'Version tracking', 'Template-based']
    },
    {
      id: 'xlsx',
      name: 'Excel Spreadsheet',
      description: 'Data analysis and filtering',
      icon: <Table className="w-5 h-5 text-green-500" />,
      fileSize: '~500 KB-2 MB',
      features: ['Sortable data', 'Pivot tables', 'Formulas', 'Charts']
    },
    {
      id: 'html',
      name: 'Interactive HTML',
      description: 'Self-contained web report',
      icon: <Globe className="w-5 h-5 text-purple-500" />,
      fileSize: '~1-4 MB',
      features: ['Interactive filters', 'Search functionality', 'Responsive design', 'Offline access']
    },
    {
      id: 'link',
      name: 'Shareable Link',
      description: 'Secure online access',
      icon: <Link className="w-5 h-5 text-orange-500" />,
      fileSize: 'No download',
      features: ['Access control', 'Real-time updates', 'Audit trail', 'Expiration settings']
    }
  ];

  const filteredEvidence = evidence.filter(item => {
    // Date range filter
    const itemDate = new Date(item.timestamp);
    const now = new Date();
    
    if (exportConfig.dateRange === 'last7') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (itemDate < weekAgo) return false;
    } else if (exportConfig.dateRange === 'last30') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (itemDate < monthAgo) return false;
    } else if (exportConfig.dateRange === 'custom') {
      if (exportConfig.customStartDate && itemDate < new Date(exportConfig.customStartDate)) return false;
      if (exportConfig.customEndDate && itemDate > new Date(exportConfig.customEndDate)) return false;
    }

    // Confidence filter
    if (item.confidence < exportConfig.minConfidence) return false;

    // Framework filter
    if (exportConfig.frameworks.length > 0 && !exportConfig.frameworks.includes(item.framework)) return false;

    // Platform filter
    if (exportConfig.platforms.length > 0 && !exportConfig.platforms.includes(item.platform)) return false;

    // Low confidence filter
    if (!exportConfig.includeLowConfidence && item.confidence < 85) return false;

    return true;
  });

  const availableFrameworks = [...new Set(evidence.map(e => e.framework))];
  const availablePlatforms = [...new Set(evidence.map(e => e.platform))];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportResult(null);

    try {
      // Simulate export process
      const steps = [
        'Filtering evidence...',
        'Validating data integrity...',
        'Generating report structure...',
        'Processing images and attachments...',
        'Formatting document...',
        'Applying security measures...',
        'Finalizing export...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setExportProgress(((i + 1) / steps.length) * 100);
      }

      // Generate mock URLs
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `velocity-evidence-€{timestamp}`;
      
      let result;
      if (exportConfig.format === 'link') {
        const shareId = Math.random().toString(36).substr(2, 9);
        result = {
          success: true,
          shareUrl: `https://app.erip.ai/shared/evidence/€{shareId}`,
          message: 'Shareable link generated successfully'
        };
      } else {
        result = {
          success: true,
          downloadUrl: `https://exports.erip.ai/€{filename}.€{exportConfig.format}`,
          message: `€{exportConfig.format.toUpperCase()} export completed successfully`
        };
      }

      setExportResult(result);
    } catch (error) {
      setExportResult({
        success: false,
        message: 'Export failed. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const selectedFormat = exportFormats.find(f => f.id === exportConfig.format);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
              <p className="text-gray-600 mt-1">{subtitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exportFormats.map(format => (
                <div
                  key={format.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all €{
                    exportConfig.format === format.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setExportConfig(prev => ({ ...prev, format: format.id as any }))}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {format.icon}
                    <div>
                      <h4 className="font-semibold text-gray-900">{format.name}</h4>
                      <p className="text-sm text-gray-600">{format.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{format.fileSize}</div>
                  <div className="flex flex-wrap gap-1">
                    {format.features.map((feature, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Filters */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Filters</h3>
              <div className="space-y-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={exportConfig.dateRange}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {/* Minimum Confidence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Confidence ({exportConfig.minConfidence}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={exportConfig.minConfidence}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, minConfidence: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Frameworks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frameworks</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableFrameworks.map(framework => (
                      <label key={framework} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportConfig.frameworks.includes(framework)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExportConfig(prev => ({ 
                                ...prev, 
                                frameworks: [...prev.frameworks, framework] 
                              }));
                            } else {
                              setExportConfig(prev => ({ 
                                ...prev, 
                                frameworks: prev.frameworks.filter(f => f !== framework) 
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{framework}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availablePlatforms.map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportConfig.platforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExportConfig(prev => ({ 
                                ...prev, 
                                platforms: [...prev.platforms, platform] 
                              }));
                            } else {
                              setExportConfig(prev => ({ 
                                ...prev, 
                                platforms: prev.platforms.filter(p => p !== platform) 
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{platform.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
              <div className="space-y-4">
                {/* Include Options */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeMetadata}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Include metadata and timestamps</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeScreenshots}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, includeScreenshots: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Include screenshots and images</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeLowConfidence}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, includeLowConfidence: e.target.checked }))}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Include low-confidence evidence</span>
                  </label>
                </div>

                {/* Shareable Link Options */}
                {exportConfig.format === 'link' && (
                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900">Share Settings</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">Access Level</label>
                      <select
                        value={exportConfig.shareAccess}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, shareAccess: e.target.value as any }))}
                        className="w-full border border-blue-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="private">Private (login required)</option>
                        <option value="password">Password protected</option>
                        <option value="public">Public (anyone with link)</option>
                      </select>
                    </div>

                    {exportConfig.shareAccess === 'password' && (
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Password</label>
                        <input
                          type="password"
                          value={exportConfig.password || ''}
                          onChange={(e) => setExportConfig(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                          className="w-full border border-blue-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Expires in {exportConfig.expirationDays} days
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="365"
                        value={exportConfig.expirationDays}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, expirationDays: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-blue-600 mt-1">
                        <span>1 day</span>
                        <span>6 months</span>
                        <span>1 year</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Export Preview</h3>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {filteredEvidence.length} of {evidence.length} items
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Format:</span>
                <div className="font-medium">{selectedFormat?.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Estimated Size:</span>
                <div className="font-medium">{selectedFormat?.fileSize}</div>
              </div>
              <div>
                <span className="text-gray-600">Evidence Items:</span>
                <div className="font-medium">{filteredEvidence.length}</div>
              </div>
              <div>
                <span className="text-gray-600">Confidence Range:</span>
                <div className="font-medium">
                  {Math.min(...filteredEvidence.map(e => e.confidence))}% - 
                  {Math.max(...filteredEvidence.map(e => e.confidence))}%
                </div>
              </div>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Download className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="font-medium text-blue-900">Generating Export...</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `€{exportProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-blue-700 mt-2">{Math.round(exportProgress)}% complete</div>
            </div>
          )}

          {/* Export Result */}
          {exportResult && (
            <div className={`border rounded-lg p-4 €{
              exportResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                {exportResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium €{
                  exportResult.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {exportResult.message}
                </span>
              </div>
              
              {exportResult.success && (
                <div className="space-y-2">
                  {exportResult.downloadUrl && (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => window.open(exportResult.downloadUrl, '_blank')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download File
                      </Button>
                    </div>
                  )}
                  
                  {exportResult.shareUrl && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={exportResult.shareUrl}
                          readOnly
                          className="flex-1 px-3 py-2 border border-green-300 rounded-md bg-white"
                        />
                        <Button
                          onClick={() => copyToClipboard(exportResult.shareUrl!)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => window.open(exportResult.shareUrl, '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-green-700">
                        {exportConfig.shareAccess === 'private' && <Lock className="w-3 h-3" />}
                        {exportConfig.shareAccess === 'password' && <Shield className="w-3 h-3" />}
                        {exportConfig.shareAccess === 'public' && <Eye className="w-3 h-3" />}
                        <span>
                          {exportConfig.shareAccess === 'private' && 'Login required'}
                          {exportConfig.shareAccess === 'password' && 'Password protected'}
                          {exportConfig.shareAccess === 'public' && 'Public access'}
                        </span>
                        <span>•</span>
                        <span>Expires in {exportConfig.expirationDays} days</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-500">
              {filteredEvidence.length} evidence items selected
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || filteredEvidence.length === 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {isExporting ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-pulse" />
                    Exporting...
                  </>
                ) : (
                  <>
                    {exportConfig.format === 'link' ? (
                      <Share2 className="w-4 h-4 mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {exportConfig.format === 'link' ? 'Generate Link' : 'Export'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceExportDialog;