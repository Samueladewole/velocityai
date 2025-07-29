/**
 * Date utility functions for consistent date handling across the platform
 * Uses system date as the baseline for all calculations
 */

export const getCurrentDate = () => new Date();

export const getRelativeDate = (offsetMinutes: number = 0) => {
  const now = new Date();
  return new Date(now.getTime() + offsetMinutes * 60 * 1000);
};

export const getRecentDate = (minutesAgo: number) => {
  const now = new Date();
  return new Date(now.getTime() - minutesAgo * 60 * 1000);
};

export const getFormattedDate = (date: Date, format: 'iso' | 'locale' = 'iso') => {
  return format === 'iso' ? date.toISOString() : date.toLocaleString();
};

export const getDemoTimestamp = (minutesOffset: number = 0) => {
  return getFormattedDate(getRelativeDate(minutesOffset));
};

export const getRecentTimestamp = (minutesAgo: number) => {
  return getFormattedDate(getRecentDate(minutesAgo));
};