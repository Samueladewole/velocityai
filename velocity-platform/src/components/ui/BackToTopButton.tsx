import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface BackToTopButtonProps {
  threshold?: number;
  className?: string;
  variant?: 'default' | 'emerald' | 'blue' | 'purple';
  alwaysVisible?: boolean;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ 
  threshold = 150, 
  className = '',
  variant = 'default',
  alwaysVisible = false
}) => {
  const [isVisible, setIsVisible] = useState(alwaysVisible);

  useEffect(() => {
    if (alwaysVisible) {
      setIsVisible(true);
      return;
    }

    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold, alwaysVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/25 border-emerald-400/20';
      case 'blue':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/25 border-blue-400/20';
      case 'purple':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25 border-purple-400/20';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 hover:shadow-slate-500/25 border-slate-400/20';
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50 p-3 rounded-full text-white shadow-lg hover:shadow-xl
        transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border
        €{getVariantStyles()}
        €{isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}
        €{className}
      `}
      aria-label="Back to top"
      title="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTopButton;