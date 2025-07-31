/**
 * Export and Sharing System for Component Page Template
 * Supports PDF, CSV, Excel, JSON exports and social sharing with QR codes
 */
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Share2,
  QrCode,
  FileText,
  Table,
  Image,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Users,
  Clock,
  Shield,
  X
} from 'lucide-react';
import { ExportConfig, SharingConfig } from '@/types/componentTemplate';

interface ExportSystemProps {
  title: string;
  data: any;
  exportConfig: ExportConfig;
  sharingConfig: SharingConfig;
  pageElement?: React.RefObject<HTMLElement>;
  onExport?: (format: string, success: boolean) => void;
  onShare?: (platform: string, url: string) => void;
  className?: string;
}

interface ExportProgress {
  isExporting: boolean;
  format: string | null;
  progress: number;
  message: string;
}

interface ShareState {
  isSharing: boolean;
  showQR: boolean;
  shareUrl: string;
  copied: boolean;
  expirationDate: Date | null;
}

const EXPORT_FORMATS = {
  pdf: { icon: FileText, label: 'PDF Report', mime: 'application/pdf' },
  csv: { icon: Table, label: 'CSV Data', mime: 'text/csv' },
  excel: { icon: Table, label: 'Excel Spreadsheet', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  json: { icon: FileText, label: 'JSON Data', mime: 'application/json' },
  png: { icon: Image, label: 'PNG Image', mime: 'image/png' }
};

const SOCIAL_PLATFORMS = {
  linkedin: { 
    icon: ExternalLink, 
    label: 'LinkedIn', 
    color: 'bg-blue-600',
    shareUrl: (url: string, title: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  },
  twitter: { 
    icon: ExternalLink, 
    label: 'Twitter', 
    color: 'bg-sky-500',
    shareUrl: (url: string, title: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  email: { 
    icon: Mail, 
    label: 'Email', 
    color: 'bg-gray-600',
    shareUrl: (url: string, title: string) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this report: ${url}`)}`
  },
  teams: { 
    icon: Users, 
    label: 'Microsoft Teams', 
    color: 'bg-purple-600',
    shareUrl: (url: string, title: string) => 
      `https://teams.microsoft.com/share?href=${encodeURIComponent(url)}&msgText=${encodeURIComponent(title)}`
  }
};

// Enhanced export formats with professional document generation
const ENHANCED_EXPORT_FORMATS = {
  pdf: { 
    icon: FileText, 
    label: 'PDF Report', 
    mime: 'application/pdf',
    description: 'Professional PDF with charts and executive summary',
    features: ['Charts', 'Tables', 'Executive Summary', 'Branding']
  },
  xlsx: { 
    icon: Table, 
    label: 'Excel Workbook', 
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    description: 'Interactive Excel with multiple worksheets',
    features: ['Multiple Sheets', 'Charts', 'Data Analysis', 'Formulas']
  },
  docx: { 
    icon: FileText, 
    label: 'Word Document', 
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Formatted Word document with professional layout',
    features: ['Professional Layout', 'Tables', 'Headers/Footers', 'TOC']
  },
  pptx: { 
    icon: Image, 
    label: 'PowerPoint', 
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    description: 'Executive presentation slides',
    features: ['Slide Layouts', 'Charts', 'Executive Summary', 'Branding']
  },
  csv: { 
    icon: Table, 
    label: 'CSV Data', 
    mime: 'text/csv',
    description: 'Raw data for analysis and import',
    features: ['Raw Data', 'Excel Compatible', 'Database Import']
  },
  json: { 
    icon: FileText, 
    label: 'JSON Data', 
    mime: 'application/json',
    description: 'Structured data for API integration',
    features: ['API Integration', 'Structured Data', 'Programmatic Access']
  },
  html: { 
    icon: Image, 
    label: 'HTML Report', 
    mime: 'text/html',
    description: 'Interactive web-based report',
    features: ['Interactive', 'Web-based', 'Responsive', 'Shareable']
  }
};

export const ExportSystem: React.FC<ExportSystemProps> = ({
  title,
  data,
  exportConfig,
  sharingConfig,
  pageElement,
  onExport,
  onShare,
  className
}) => {
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    isExporting: false,
    format: null,
    progress: 0,
    message: ''
  });

  const [shareState, setShareState] = useState<ShareState>({
    isSharing: false,
    showQR: false,
    shareUrl: sharingConfig.publicUrl || '',
    copied: false,
    expirationDate: sharingConfig.accessControls?.expiration || null
  });

  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  // Export functions
  const exportToPDF = useCallback(async (data: any, filename: string) => {
    try {
      // Mock PDF generation - in real implementation, use jsPDF or similar
      const content = `
        ${title}
        Generated: ${new Date().toLocaleString()}
        
        Data Summary:
        ${JSON.stringify(data, null, 2)}
      `;
      
      const blob = new Blob([content], { type: 'application/pdf' });
      downloadBlob(blob, `${filename}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF export failed:', error);
      return false;
    }
  }, [title]);

  const exportToCSV = useCallback(async (data: any, filename: string) => {
    try {
      let csvContent = '';
      
      if (Array.isArray(data)) {
        if (data.length > 0) {
          // Get headers from first object
          const headers = Object.keys(data[0]);
          csvContent = headers.join(',') + '\n';
          
          // Add data rows
          data.forEach(row => {
            const values = headers.map(header => {
              const value = row[header];
              // Escape quotes and wrap in quotes if contains comma
              return typeof value === 'string' && value.includes(',') 
                ? `"${value.replace(/"/g, '""')}"` 
                : value;
            });
            csvContent += values.join(',') + '\n';
          });
        }
      } else {
        // Convert object to CSV
        csvContent = 'Key,Value\n';
        Object.entries(data).forEach(([key, value]) => {
          csvContent += `${key},${value}\n`;
        });
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      downloadBlob(blob, `${filename}.csv`);
      return true;
    } catch (error) {
      console.error('CSV export failed:', error);
      return false;
    }
  }, []);

  const exportToExcel = useCallback(async (data: any, filename: string) => {
    try {
      // Mock Excel generation - in real implementation, use SheetJS/xlsx
      const csvContent = await exportToCSV(data, filename);
      // For now, just use CSV format with .xlsx extension
      return csvContent;
    } catch (error) {
      console.error('Excel export failed:', error);
      return false;
    }
  }, [exportToCSV]);

  const exportToJSON = useCallback(async (data: any, filename: string) => {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      downloadBlob(blob, `${filename}.json`);
      return true;
    } catch (error) {
      console.error('JSON export failed:', error);
      return false;
    }
  }, []);

  const exportToPNG = useCallback(async (filename: string) => {
    try {
      if (!pageElement?.current) throw new Error('Page element not found');
      
      // Mock PNG generation - in real implementation, use html2canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      
      canvas.width = 800;
      canvas.height = 600;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText(`${title} - Screenshot`, 50, 50);
      ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 50, 80);
      
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, `${filename}.png`);
        }
      }, 'image/png');
      
      return true;
    } catch (error) {
      console.error('PNG export failed:', error);
      return false;
    }
  }, [pageElement, title]);

  const exportToHTML = useCallback(async (data: any, filename: string) => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #007bff; }
            .title { color: #2c3e50; font-size: 2.5em; margin-bottom: 10px; }
            .subtitle { color: #6c757d; font-size: 1.1em; }
            .data-section { margin: 30px 0; }
            .data-title { color: #495057; font-size: 1.5em; margin-bottom: 15px; }
            .data-content { background: #f8f9fa; padding: 20px; border-radius: 5px; }
            pre { background: #343a40; color: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">${title}</h1>
              <p class="subtitle">Generated on ${new Date().toLocaleString()}</p>
            </div>
            <div class="data-section">
              <h2 class="data-title">Report Data</h2>
              <div class="data-content">
                <pre>${JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      downloadBlob(blob, `${filename}.html`);
      return true;
    } catch (error) {
      console.error('HTML export failed:', error);
      return false;
    }
  }, [title]);

  // Enhanced export handler using backend API
  const handleExport = useCallback(async (format: string) => {
    if (!exportConfig.formats.includes(format as any)) return;

    setExportProgress({
      isExporting: true,
      format,
      progress: 0,
      message: 'Preparing export...'
    });

    try {
      const filename = exportConfig.filename || `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;

      // Progress simulation
      const progressInterval = setInterval(() => {
        setExportProgress(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 15, 85)
        }));
      }, 300);

      setExportProgress(prev => ({ ...prev, message: `Generating ${format.toUpperCase()}...` }));

      let success = false;
      let downloadUrl = '';

      if (exportConfig.customExporter) {
        await exportConfig.customExporter(format, data);
        success = true;
      } else {
        // Use backend API for professional document generation
        try {
          const exportRequest = {
            document_type: 'compliance_report',
            format: format,
            title: title,
            data: data,
            include_charts: true,
            include_raw_data: format === 'json' || format === 'csv',
            password_protect: false
          };

          const response = await fetch('/api/v1/documents/export/quick', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(exportRequest)
          });

          if (response.ok) {
            const result = await response.json();
            downloadUrl = result.data.download_url;
            success = true;

            // Trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${filename}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // Fallback to client-side generation
            success = await fallbackExport(format, data, filename);
          }
        } catch (apiError) {
          console.warn('Backend export failed, falling back to client-side:', apiError);
          success = await fallbackExport(format, data, filename);
        }
      }

      clearInterval(progressInterval);
      
      setExportProgress(prev => ({
        ...prev,
        progress: 100,
        message: success ? 'Export completed!' : 'Export failed'
      }));

      setTimeout(() => {
        setExportProgress({
          isExporting: false,
          format: null,
          progress: 0,
          message: ''
        });
      }, 2000);

      onExport?.(format, success);

    } catch (error) {
      console.error('Export failed:', error);
      setExportProgress({
        isExporting: false,
        format: null,
        progress: 0,
        message: ''
      });
      onExport?.(format, false);
    }
  }, [exportConfig, data, title, onExport]);

  // Fallback export function for client-side generation
  const fallbackExport = useCallback(async (format: string, data: any, filename: string): Promise<boolean> => {
    try {
      switch (format) {
        case 'pdf':
          return await exportToPDF(data, filename);
        case 'csv':
          return await exportToCSV(data, filename);
        case 'xlsx':
        case 'excel':
          return await exportToExcel(data, filename);
        case 'json':
          return await exportToJSON(data, filename);
        case 'png':
          return await exportToPNG(filename);
        case 'html':
          return await exportToHTML(data, filename);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error(`Fallback export failed for ${format}:`, error);
      return false;
    }
  }, [exportToPDF, exportToCSV, exportToExcel, exportToJSON, exportToPNG]);

  // Sharing functions
  const generateShareUrl = useCallback(() => {
    const baseUrl = sharingConfig.publicUrl || window.location.href;
    const params = new URLSearchParams();
    
    if (sharingConfig.accessControls?.expiration) {
      params.set('expires', sharingConfig.accessControls.expiration.toISOString());
    }
    
    if (sharingConfig.accessControls?.permissions) {
      params.set('permissions', sharingConfig.accessControls.permissions.join(','));
    }
    
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  }, [sharingConfig]);

  const generateQRCode = useCallback((url: string) => {
    if (!qrCodeRef.current) return;
    
    const canvas = qrCodeRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Mock QR code generation - in real implementation, use qrcode library
    canvas.width = 200;
    canvas.height = 200;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    
    // Draw a simple pattern representing QR code
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * 10, j * 10, 10, 10);
        }
      }
    }
    
    // Add corner markers
    ctx.fillRect(0, 0, 30, 30);
    ctx.fillRect(170, 0, 30, 30);
    ctx.fillRect(0, 170, 30, 30);
    
  }, []);

  const handleShare = useCallback((platform: string) => {
    const shareUrl = generateShareUrl();
    const platformConfig = SOCIAL_PLATFORMS[platform as keyof typeof SOCIAL_PLATFORMS];
    
    if (platformConfig) {
      const url = platformConfig.shareUrl(shareUrl, title);
      window.open(url, '_blank', 'width=600,height=400');
      onShare?.(platform, shareUrl);
    }
  }, [generateShareUrl, title, onShare]);

  const handleCopyUrl = useCallback(() => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setShareState(prev => ({ ...prev, copied: true }));
    setTimeout(() => {
      setShareState(prev => ({ ...prev, copied: false }));
    }, 2000);
  }, [generateShareUrl]);

  const toggleQRCode = useCallback(() => {
    setShareState(prev => {
      const newState = { ...prev, showQR: !prev.showQR };
      if (newState.showQR) {
        setTimeout(() => generateQRCode(generateShareUrl()), 100);
      }
      return newState;
    });
  }, [generateQRCode, generateShareUrl]);

  // Helper function
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`export-system space-y-4 ${className || ''}`}>
      {/* Export Section */}
      {exportConfig.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5" />
              Export Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exportProgress.isExporting ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Exporting {exportProgress.format?.toUpperCase()}...
                  </span>
                  <span className="text-sm text-slate-600">
                    {exportProgress.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress.progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">{exportProgress.message}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exportConfig.formats.map(format => {
                    const formatInfo = ENHANCED_EXPORT_FORMATS[format] || EXPORT_FORMATS[format];
                    const FormatIcon = formatInfo?.icon || FileText;
                    const label = formatInfo?.label || format.toUpperCase();
                    const description = formatInfo?.description || '';
                    const features = formatInfo?.features || [];
                    
                    return (
                      <div
                        key={format}
                        className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => handleExport(format)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <FormatIcon className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 mb-1">{label}</h3>
                            <p className="text-sm text-slate-600 mb-2">{description}</p>
                            {features.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {features.slice(0, 3).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {features.length > 3 && (
                                  <span className="text-xs text-slate-500">
                                    +{features.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExport(format);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export {label}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-700">Quick Actions</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Export all formats
                        exportConfig.formats.forEach(format => {
                          setTimeout(() => handleExport(format), Math.random() * 1000);
                        });
                      }}
                      className="text-slate-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All Formats
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('pdf')}
                      className="text-slate-600"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Quick PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('xlsx')}
                      className="text-slate-600"
                    >
                      <Table className="h-4 w-4 mr-2" />
                      Quick Excel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sharing Section */}
      {sharingConfig.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5" />
              Share & Collaborate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Share URL */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Public URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generateShareUrl()}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="flex items-center gap-2"
                >
                  {shareState.copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {shareState.copied ? 'Copied' : 'Copy'}
                </Button>
                {sharingConfig.qrCode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleQRCode}
                    className="flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </Button>
                )}
              </div>
            </div>

            {/* QR Code */}
            {shareState.showQR && sharingConfig.qrCode && (
              <div className="flex justify-center p-4 bg-slate-50 rounded-lg">
                <canvas
                  ref={qrCodeRef}
                  className="border border-slate-200 rounded"
                />
              </div>
            )}

            {/* Access Controls */}
            {sharingConfig.accessControls && (
              <div className="flex items-center gap-4 text-sm text-slate-600">
                {sharingConfig.accessControls.requireAuth && (
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Authentication required</span>
                  </div>
                )}
                {shareState.expirationDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Expires: {shareState.expirationDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Media Sharing */}
            {sharingConfig.socialMedia && sharingConfig.socialMedia.length > 0 && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Share on Social Media
                </label>
                <div className="flex gap-2">
                  {sharingConfig.socialMedia.map(platform => {
                    const PlatformIcon = SOCIAL_PLATFORMS[platform]?.icon || ExternalLink;
                    const config = SOCIAL_PLATFORMS[platform];
                    
                    return (
                      <Button
                        key={platform}
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(platform)}
                        className={`flex items-center gap-2 ${config?.color || 'bg-gray-600'} text-white hover:opacity-90`}
                      >
                        <PlatformIcon className="h-4 w-4" />
                        {config?.label || platform}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExportSystem;