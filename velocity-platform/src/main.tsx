import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx loaded');

// Wait for DOM to be ready
function waitForDOM() {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve(null);
    }
  });
}

waitForDOM().then(() => {
  const rootElement = document.getElementById('root');
  console.log('Root element found:', !!rootElement);
  
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('App rendered successfully');
  } else {
    console.error('Root element not found!');
  }
});
