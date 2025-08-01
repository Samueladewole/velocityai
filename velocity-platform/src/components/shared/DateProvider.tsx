/**
 * Date Provider Component
 * Centralized date management for consistent date handling across the ERIP platform
 * Uses system date and time with configurable baseline for demos and testing
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DateContextType {
  getCurrentDate: () => Date;
  getRelativeDate: (offsetMinutes?: number) => Date;
  getRecentDate: (minutesAgo: number) => Date;
  formatDate: (date: Date | string, format?: 'iso' | 'locale' | 'short' | 'long') => string;
  getTimestamp: (offsetMinutes?: number) => string;
  getRecentTimestamp: (minutesAgo: number) => string;
  isWithinTimeframe: (date: Date | string, hoursAgo: number) => boolean;
  getRelativeDateString: (date: Date | string) => string;
  baselineDate: Date;
  updateBaseline: (date: Date) => void;
}

const DateContext = createContext<DateContextType | null>(null);

export const useDateProvider = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateProvider must be used within a DateProvider');
  }
  return context;
};

interface DateProviderProps {
  children: React.ReactNode;
  initialBaseline?: Date;
}

export const DateProvider: React.FC<DateProviderProps> = ({ 
  children, 
  initialBaseline 
}) => {
  const [baselineDate, setBaselineDate] = useState<Date>(
    initialBaseline || new Date()
  );

  const getCurrentDate = () => {
    return new Date();
  };

  const getRelativeDate = (offsetMinutes: number = 0) => {
    const now = getCurrentDate();
    return new Date(now.getTime() + offsetMinutes * 60 * 1000);
  };

  const getRecentDate = (minutesAgo: number) => {
    const now = getCurrentDate();
    return new Date(now.getTime() - minutesAgo * 60 * 1000);
  };

  const formatDate = (
    date: Date | string, 
    format: 'iso' | 'locale' | 'short' | 'long' = 'iso'
  ) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'iso':
        return dateObj.toISOString();
      case 'locale':
        return dateObj.toLocaleString();
      case 'short':
        return dateObj.toLocaleDateString();
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return dateObj.toISOString();
    }
  };

  const getTimestamp = (offsetMinutes: number = 0) => {
    return formatDate(getRelativeDate(offsetMinutes));
  };

  const getRecentTimestamp = (minutesAgo: number) => {
    return formatDate(getRecentDate(minutesAgo));
  };

  const isWithinTimeframe = (date: Date | string, hoursAgo: number) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = getCurrentDate();
    const timeframeMs = hoursAgo * 60 * 60 * 1000;
    return (now.getTime() - dateObj.getTime()) <= timeframeMs;
  };

  const getRelativeDateString = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = getCurrentDate();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `€{diffMinutes} minute€{diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `€{diffHours} hour€{diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
      return `€{diffDays} day€{diffDays === 1 ? '' : 's'} ago`;
    } else {
      return formatDate(dateObj, 'short');
    }
  };

  const updateBaseline = (date: Date) => {
    setBaselineDate(date);
  };

  const value: DateContextType = {
    getCurrentDate,
    getRelativeDate,
    getRecentDate,
    formatDate,
    getTimestamp,
    getRecentTimestamp,
    isWithinTimeframe,
    getRelativeDateString,
    baselineDate,
    updateBaseline
  };

  return (
    <DateContext.Provider value={value}>
      {children}
    </DateContext.Provider>
  );
};

// Standalone utility functions for components that don't need the full context
export const dateUtils = {
  getCurrentDate: () => new Date(),
  getRelativeDate: (offsetMinutes: number = 0) => {
    const now = new Date();
    return new Date(now.getTime() + offsetMinutes * 60 * 1000);
  },
  getRecentDate: (minutesAgo: number) => {
    const now = new Date();
    return new Date(now.getTime() - minutesAgo * 60 * 1000);
  },
  formatDate: (date: Date | string, format: 'iso' | 'locale' | 'short' | 'long' = 'iso') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'iso':
        return dateObj.toISOString();
      case 'locale':
        return dateObj.toLocaleString();
      case 'short':
        return dateObj.toLocaleDateString();
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return dateObj.toISOString();
    }
  },
  getTimestamp: (offsetMinutes: number = 0) => {
    return dateUtils.formatDate(dateUtils.getRelativeDate(offsetMinutes));
  },
  getRecentTimestamp: (minutesAgo: number) => {
    return dateUtils.formatDate(dateUtils.getRecentDate(minutesAgo));
  }
};

export default DateProvider;