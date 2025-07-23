import { useEffect, useRef, useState } from 'react';

interface AccessibilityOptions {
  announceNavigation?: boolean;
  trapFocus?: boolean;
  skipLinks?: boolean;
  keyboardNavigation?: boolean;
  highContrast?: boolean;
}

interface UseAccessibilityReturn {
  announceToScreenReader: (message: string) => void;
  focusTrap: {
    ref: React.RefObject<HTMLElement>;
    isActive: boolean;
    activate: () => void;
    deactivate: () => void;
  };
  keyboardNavigation: {
    handleKeyDown: (event: React.KeyboardEvent) => void;
    currentIndex: number;
    setItems: (items: HTMLElement[]) => void;
  };
  skipToContent: () => void;
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'larger';
  setFontSize: (size: 'normal' | 'large' | 'larger') => void;
}

export const useAccessibility = (options: AccessibilityOptions = {}): UseAccessibilityReturn => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(options.highContrast || false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [navItems, setNavItems] = useState<HTMLElement[]>([]);
  const [isFocusTrapped, setIsFocusTrapped] = useState(false);
  
  const announcementRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<HTMLElement>(null);
  const originalFocusRef = useRef<HTMLElement | null>(null);

  // Detect user preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Create screen reader announcement element
  useEffect(() => {
    if (!announcementRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
      announcementRef.current = announcer;
    }
    
    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  // Focus trap functionality
  const activateFocusTrap = () => {
    if (!focusTrapRef.current || isFocusTrapped) return;
    
    originalFocusRef.current = document.activeElement as HTMLElement;
    setIsFocusTrapped(true);
    
    const focusableElements = focusTrapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        deactivateFocusTrap();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Store cleanup function
    (focusTrapRef.current as any)._cleanupFocusTrap = () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  };

  const deactivateFocusTrap = () => {
    if (!isFocusTrapped) return;
    
    setIsFocusTrapped(false);
    
    if (focusTrapRef.current && (focusTrapRef.current as any)._cleanupFocusTrap) {
      (focusTrapRef.current as any)._cleanupFocusTrap();
    }
    
    if (originalFocusRef.current) {
      originalFocusRef.current.focus();
      originalFocusRef.current = null;
    }
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!options.keyboardNavigation || navItems.length === 0) return;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        setCurrentIndex(prev => {
          const newIndex = prev + 1 >= navItems.length ? 0 : prev + 1;
          navItems[newIndex]?.focus();
          return newIndex;
        });
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        setCurrentIndex(prev => {
          const newIndex = prev - 1 < 0 ? navItems.length - 1 : prev - 1;
          navItems[newIndex]?.focus();
          return newIndex;
        });
        break;
        
      case 'Home':
        event.preventDefault();
        setCurrentIndex(0);
        navItems[0]?.focus();
        break;
        
      case 'End':
        event.preventDefault();
        const lastIndex = navItems.length - 1;
        setCurrentIndex(lastIndex);
        navItems[lastIndex]?.focus();
        break;
        
      case 'Enter':
      case ' ':
        if (document.activeElement && navItems.includes(document.activeElement as HTMLElement)) {
          event.preventDefault();
          (document.activeElement as HTMLElement).click();
        }
        break;
    }
  };

  // Skip to main content
  const skipToContent = () => {
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      (mainContent as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Apply font size changes
  useEffect(() => {
    const root = document.documentElement;
    switch (fontSize) {
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'larger':
        root.style.fontSize = '20px';
        break;
      default:
        root.style.fontSize = '16px';
        break;
    }
  }, [fontSize]);

  // Apply high contrast mode
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.setAttribute('data-theme', 'high-contrast');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [highContrast]);

  return {
    announceToScreenReader,
    focusTrap: {
      ref: focusTrapRef,
      isActive: isFocusTrapped,
      activate: activateFocusTrap,
      deactivate: deactivateFocusTrap,
    },
    keyboardNavigation: {
      handleKeyDown,
      currentIndex,
      setItems: setNavItems,
    },
    skipToContent,
    reduceMotion,
    highContrast,
    fontSize,
    setFontSize,
  };
};