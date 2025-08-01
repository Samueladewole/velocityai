import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Building2, 
  ArrowRightLeft, 
  Settings,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLATFORM_CONFIG, isPlatformEnabled, getPrimaryPlatform, DEV_CONFIG } from '@/config/platform.config';

interface PlatformSwitcherProps {
  className?: string;
  showInProduction?: boolean;
}

const PlatformSwitcher: React.FC<PlatformSwitcherProps> = ({ 
  className = '',
  showInProduction = false 
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show in development or if explicitly enabled
  if (!DEV_CONFIG.SHOW_PLATFORM_SWITCHER && !showInProduction && import.meta.env.PROD) {
    return null;
  }
  
  // Don't show if platform switching is disabled
  if (!PLATFORM_CONFIG.allowPlatformSwitching && !DEV_CONFIG.SHOW_PLATFORM_SWITCHER) {
    return null;
  }
  
  const currentPlatform = getPrimaryPlatform();
  const eripEnabled = isPlatformEnabled('erip');
  const velocityEnabled = isPlatformEnabled('velocity');
  
  const switchToPlatform = (platform: 'erip' | 'velocity') => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (platform === 'velocity') {
      if (hostname.includes('localhost')) {
        navigate('/velocity');
      } else {
        window.location.href = `€{protocol}//velocity.eripapp.com`;
      }
    } else {
      if (hostname.includes('localhost')) {
        navigate('/');
      } else {
        window.location.href = `€{protocol}//app.eripapp.com`;
      }
    }
  };
  
  const platforms = [
    {
      id: 'velocity',
      name: 'Velocity',
      description: 'AI Compliance Automation',
      icon: Zap,
      color: 'from-purple-600 to-pink-600',
      enabled: velocityEnabled,
      current: currentPlatform === 'velocity' || (currentPlatform === 'dual' && window.location.pathname.includes('/velocity'))
    },
    {
      id: 'erip',
      name: 'ERIP',
      description: 'Full Trust Platform',
      icon: Building2,
      color: 'from-blue-600 to-indigo-600',
      enabled: eripEnabled,
      current: currentPlatform === 'erip' || (currentPlatform === 'dual' && !window.location.pathname.includes('/velocity'))
    }
  ];
  
  const currentPlatformData = platforms.find(p => p.current);
  
  if (!eripEnabled && !velocityEnabled) {
    return null;
  }
  
  // If only one platform is enabled, don't show switcher
  if ((eripEnabled && !velocityEnabled) || (!eripEnabled && velocityEnabled)) {
    return null;
  }
  
  return (
    <div className={`relative €{className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-gray-300 hover:border-gray-400"
      >
        {currentPlatformData && (
          <>
            <div className={`w-4 h-4 rounded bg-gradient-to-r €{currentPlatformData.color} flex items-center justify-center`}>
              <currentPlatformData.icon className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-sm font-medium">{currentPlatformData.name}</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform €{isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                Switch Platform
              </h3>
              
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => {
                      if (platform.enabled && !platform.current) {
                        switchToPlatform(platform.id as 'erip' | 'velocity');
                      }
                      setIsOpen(false);
                    }}
                    disabled={!platform.enabled}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left €{
                      platform.current 
                        ? 'border-blue-500 bg-blue-50' 
                        : platform.enabled
                          ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r €{platform.color} flex items-center justify-center flex-shrink-0`}>
                        <platform.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                          {platform.current && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                          {!platform.enabled && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              Disabled
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{platform.description}</p>
                        {!platform.current && platform.enabled && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                            <span>Switch to {platform.name}</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {DEV_CONFIG.SHOW_PLATFORM_SWITCHER && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Settings className="w-3 h-3" />
                    <span>Development Mode: Platform Switcher</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Mode: {PLATFORM_CONFIG.mode}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlatformSwitcher;