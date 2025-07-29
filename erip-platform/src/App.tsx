import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ScrollToTop } from '@/components/ScrollToTop';
import PlatformRouter from '@/components/platform/PlatformRouter';
import { TourProvider } from '@/components/tour/TourProvider';
import { TourOverlay } from '@/components/tour/TourOverlay';
import { Tooltip } from '@/components/tour/Tooltip';
import { useAppStore, useAuthStore, mockUser } from '@/store';
import { DateProvider } from '@/components/shared/DateProvider';

function App() {
  const { setTheme } = useAppStore();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log('App mounting with store');
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Auto-login for demo
    if (!isAuthenticated) {
      login(mockUser);
    }
  }, [setTheme, login, isAuthenticated]);

  console.log('App rendering with platform router');
  
  return (
    <DateProvider>
      <TourProvider>
        <Router>
          <ScrollToTop />
          <PlatformRouter />
          <TourOverlay />
          <Tooltip />
        </Router>
      </TourProvider>
    </DateProvider>
  );
}

export default App;