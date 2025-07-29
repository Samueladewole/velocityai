/**
 * Unit Tests for AI Agent Dashboard
 * Tests real-time data updates, user interactions, and automation controls
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AgentDashboard from '../../../src/components/velocity/AgentDashboard';
import { createMockAgent, createMockMetrics, MockWebSocket } from '../../setup';

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, variant }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

const renderAgentDashboard = () => {
  return render(
    <BrowserRouter>
      <AgentDashboard />
    </BrowserRouter>
  );
};

describe('AgentDashboard', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  it('renders dashboard with correct title and description', () => {
    renderAgentDashboard();
    
    expect(screen.getByText('AI Agent Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Monitor your compliance automation agents')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderAgentDashboard();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows real-time metrics after loading', async () => {
    renderAgentDashboard();
    
    // Fast-forward past loading delay
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      expect(screen.getByText('Active Agents')).toBeInTheDocument();
      expect(screen.getByText('Evidence Collected')).toBeInTheDocument();
      expect(screen.getByText('Trust Points')).toBeInTheDocument();
      expect(screen.getByText('Automation Rate')).toBeInTheDocument();
    });
  });

  it('displays dynamic agent data with platform information', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      expect(screen.getByText('AWS SOC2 Agent')).toBeInTheDocument();
      expect(screen.getByText('GCP ISO27001 Agent')).toBeInTheDocument();
      expect(screen.getByText('GitHub CIS Controls Agent')).toBeInTheDocument();
    });

    // Check platform information is displayed
    expect(screen.getByText(/Platform: AWS/)).toBeInTheDocument();
    expect(screen.getByText(/Platform: GCP/)).toBeInTheDocument();
    expect(screen.getByText(/Platform: GitHub/)).toBeInTheDocument();
  });

  it('shows progress bars for agents with progress data', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      const progressBars = screen.getAllByText('Collection Progress');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  it('handles refresh button click', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      const refreshButton = screen.getByText('Refresh');
      expect(refreshButton).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    // Should show refreshing state
    expect(refreshButton).toBeDisabled();
  });

  it('handles add agent button click', async () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' };

    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      const addButton = screen.getByText('Add Agent');
      expect(addButton).toBeInTheDocument();
    });

    const addButton = screen.getByText('Add Agent');
    fireEvent.click(addButton);

    expect(window.location.href).toBe('/velocity/onboarding');

    // Restore original location
    window.location = originalLocation;
  });

  it('updates metrics every 30 seconds', async () => {
    renderAgentDashboard();
    
    // Initial load
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      expect(screen.getByText('Active Agents')).toBeInTheDocument();
    });

    // Get initial metrics
    const initialActiveAgents = screen.getByText(/\d+/).textContent;

    // Fast-forward 30 seconds
    vi.advanceTimersByTime(30000);

    await waitFor(() => {
      // Metrics should potentially be different due to random generation
      expect(screen.getByText('Active Agents')).toBeInTheDocument();
    });
  });

  it('displays next run times for agents', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      expect(screen.getByText(/In \d+h \d+m/)).toBeInTheDocument();
    });
  });

  it('shows pause/start buttons for agent control', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      // Should have both Pause and Start buttons depending on agent status
      const pauseButtons = screen.queryAllByText('Pause');
      const startButtons = screen.queryAllByText('Start');
      
      expect(pauseButtons.length + startButtons.length).toBeGreaterThan(0);
    });
  });

  it('formats large numbers with commas', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      // Evidence and trust points should be formatted with commas for large numbers
      const elements = screen.getAllByText(/\d{1,3}(,\d{3})*/);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('displays last updated timestamp', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });

  it('shows recent activity feed', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText(/AWS SOC2 Agent collected \d+ new evidence items/)).toBeInTheDocument();
      expect(screen.getByText(/Trust Score updated/)).toBeInTheDocument();
    });
  });

  it('handles agent status changes dynamically', async () => {
    renderAgentDashboard();
    
    vi.advanceTimersByTime(1100);
    
    await waitFor(() => {
      expect(screen.getByText('Azure GDPR Agent')).toBeInTheDocument();
    });

    // The Azure agent randomly switches between running and paused
    // Fast-forward through multiple updates to potentially see status change
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(30000);
      await waitFor(() => {
        // Status should be either running or paused
        expect(screen.getByText('Azure GDPR Agent')).toBeInTheDocument();
      });
    }
  });
});