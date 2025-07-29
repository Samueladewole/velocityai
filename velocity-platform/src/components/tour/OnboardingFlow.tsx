import React, { useEffect } from 'react';
import { useTour } from './TourProvider';
import { useAuthStore } from '@/store';

const dashboardTour = [
  {
    id: 'welcome',
    target: '[data-tour="dashboard-header"]',
    title: 'Welcome to ERIP!',
    content: 'This is your Enterprise Command Center where you can monitor your trust score, manage compliance, and accelerate sales.',
    placement: 'bottom' as const
  },
  {
    id: 'trust-score',
    target: '[data-tour="trust-score"]',
    title: 'Your Trust Score',
    content: 'This shows your current trust level and tier. Higher scores unlock better benefits and accelerate deal closure.',
    placement: 'left' as const
  },
  {
    id: 'quick-actions',
    target: '[data-tour="quick-actions"]',
    title: 'Quick Actions',
    content: 'Access common tasks quickly. Use Cmd+K to open the command palette for even faster navigation.',
    placement: 'top' as const
  },
  {
    id: 'components',
    target: '[data-tour="component-grid"]',
    title: 'Platform Components',
    content: 'Monitor the status of all ERIP components. Each shows real-time health and Trust Points earned.',
    placement: 'top' as const
  },
  {
    id: 'insights',
    target: '[data-tour="insights-panel"]',
    title: 'AI Insights',
    content: 'Get personalized recommendations to improve your trust score and unlock business value.',
    placement: 'right' as const
  },
  {
    id: 'sidebar',
    target: '[data-tour="sidebar"]',
    title: 'Navigation',
    content: 'Use the sidebar to navigate between dashboard, trust score, components, and reports. You can collapse it for more space.',
    placement: 'right' as const,
    action: () => {
      // Highlight the sidebar
      const sidebar = document.querySelector('[data-tour="sidebar"]');
      if (sidebar) {
        sidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
];

const trustScoreTour = [
  {
    id: 'radial-chart',
    target: '[data-tour="trust-radial"]',
    title: 'Trust Score Visualization',
    content: 'Your trust score is displayed as a radial chart with your current tier. Progress toward the next tier to unlock more benefits.',
    placement: 'right' as const
  },
  {
    id: 'score-breakdown',
    target: '[data-tour="score-breakdown"]',
    title: 'Score Components',
    content: 'See how different areas contribute to your overall trust score. Focus on lower scores for maximum impact.',
    placement: 'left' as const
  },
  {
    id: 'share-button',
    target: '[data-tour="share-trust"]',
    title: 'Share Your Score',
    content: 'Generate public URLs, QR codes, and social media posts to showcase your trust credentials to prospects.',
    placement: 'bottom' as const
  },
  {
    id: 'trust-drivers',
    target: '[data-tour="trust-drivers"]',
    title: 'Trust Drivers',
    content: 'Understand what activities increase or decrease your trust score. Focus on positive drivers for growth.',
    placement: 'top' as const
  }
];

interface OnboardingFlowProps {
  page: 'dashboard' | 'trust-score' | 'components';
  autoStart?: boolean;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ page, autoStart = true }) => {
  const { startTour } = useTour();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!autoStart || !user) return;

    // Check if user has seen this tour before
    const hasSeenTour = localStorage.getItem(`erip-tour-${page}`);
    if (hasSeenTour) return;

    // Start tour after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      switch (page) {
        case 'dashboard':
          startTour(dashboardTour);
          break;
        case 'trust-score':
          startTour(trustScoreTour);
          break;
        default:
          break;
      }
      
      // Mark tour as seen
      localStorage.setItem(`erip-tour-${page}`, 'true');
    }, 1000);

    return () => clearTimeout(timer);
  }, [page, autoStart, startTour, user]);

  return null;
};

// Hook to manually trigger tours
export const useOnboarding = () => {
  const { startTour } = useTour();

  const startDashboardTour = () => {
    startTour(dashboardTour);
  };

  const startTrustScoreTour = () => {
    startTour(trustScoreTour);
  };

  const resetTours = () => {
    localStorage.removeItem('erip-tour-dashboard');
    localStorage.removeItem('erip-tour-trust-score');
    localStorage.removeItem('erip-tour-components');
  };

  return {
    startDashboardTour,
    startTrustScoreTour,
    resetTours
  };
};