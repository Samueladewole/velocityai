import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

// Custom hook for managing URL state that persists across navigation
export const useUrlState = <T extends string>(
  key: string,
  defaultValue: T,
  options?: {
    replace?: boolean; // Replace history instead of pushing
    storageKey?: string; // localStorage key for fallback
  }
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const storageKey = options?.storageKey || `velocity_${key}_state`;
  
  // Get initial value from URL params, localStorage, or default
  const getInitialValue = useCallback((): T => {
    // First try URL params
    const urlValue = searchParams.get(key);
    if (urlValue) {
      return urlValue as T;
    }
    
    // Then try localStorage
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return stored as T;
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
    }
    
    return defaultValue;
  }, [searchParams, key, storageKey, defaultValue]);
  
  const [value, setValue] = useState<T>(getInitialValue);
  
  // Update URL and localStorage when value changes
  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (newValue !== defaultValue) {
      newSearchParams.set(key, newValue);
    } else {
      newSearchParams.delete(key);
    }
    
    // Update localStorage
    try {
      localStorage.setItem(storageKey, newValue);
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
    
    // Update URL
    const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
    if (options?.replace) {
      navigate(newUrl, { replace: true });
    } else {
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, navigate, location.pathname, key, defaultValue, storageKey, options?.replace]);
  
  // Update state when URL changes (back/forward navigation)
  useEffect(() => {
    const urlValue = searchParams.get(key);
    if (urlValue && urlValue !== value) {
      setValue(urlValue as T);
      // Also update localStorage
      try {
        localStorage.setItem(storageKey, urlValue);
      } catch (error) {
        console.warn('Failed to write to localStorage:', error);
      }
    }
  }, [searchParams, key, value, storageKey]);
  
  return [value, updateValue] as const;
};

// Specialized hook for tab state management
export const useTabState = <T extends string>(
  defaultTab: T,
  options?: {
    paramName?: string;
    storageKey?: string;
  }
) => {
  return useUrlState(
    options?.paramName || 'tab',
    defaultTab,
    {
      replace: true,
      storageKey: options?.storageKey
    }
  );
};

// Specialized hook for section state management  
export const useSectionState = <T extends string>(
  defaultSection: T,
  options?: {
    paramName?: string;
    storageKey?: string;
  }
) => {
  return useUrlState(
    options?.paramName || 'section',
    defaultSection,
    {
      replace: true,
      storageKey: options?.storageKey
    }
  );
};

// Hook for managing multiple state values
export const useMultipleUrlState = <T extends Record<string, string>>(
  defaultValues: T,
  options?: {
    storagePrefix?: string;
  }
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const storagePrefix = options?.storagePrefix || 'velocity_state';
  
  // Get initial values
  const getInitialValues = useCallback((): T => {
    const result = { ...defaultValues };
    
    Object.keys(defaultValues).forEach((key) => {
      // First try URL params
      const urlValue = searchParams.get(key);
      if (urlValue) {
        (result as any)[key] = urlValue;
        return;
      }
      
      // Then try localStorage
      try {
        const stored = localStorage.getItem(`${storagePrefix}_${key}`);
        if (stored) {
          (result as any)[key] = stored;
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    });
    
    return result;
  }, [searchParams, defaultValues, storagePrefix]);
  
  const [values, setValues] = useState<T>(getInitialValues);
  
  // Update function
  const updateValues = useCallback((newValues: Partial<T>) => {
    const updatedValues = { ...values, ...newValues };
    setValues(updatedValues);
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(newValues).forEach(([key, value]) => {
      if (value !== defaultValues[key as keyof T]) {
        newSearchParams.set(key, value as string);
      } else {
        newSearchParams.delete(key);
      }
      
      // Update localStorage
      try {
        localStorage.setItem(`${storagePrefix}_${key}`, value as string);
      } catch (error) {
        console.warn('Failed to write to localStorage:', error);
      }
    });
    
    // Update URL
    setSearchParams(newSearchParams, { replace: true });
  }, [values, searchParams, setSearchParams, defaultValues, storagePrefix]);
  
  // Update single value
  const updateValue = useCallback((key: keyof T, value: T[keyof T]) => {
    updateValues({ [key]: value } as Partial<T>);
  }, [updateValues]);
  
  // Listen for URL changes
  useEffect(() => {
    const newValues = { ...values };
    let hasChanges = false;
    
    Object.keys(defaultValues).forEach((key) => {
      const urlValue = searchParams.get(key);
      if (urlValue && urlValue !== values[key as keyof T]) {
        (newValues as any)[key] = urlValue;
        hasChanges = true;
        
        // Update localStorage
        try {
          localStorage.setItem(`${storagePrefix}_${key}`, urlValue);
        } catch (error) {
          console.warn('Failed to write to localStorage:', error);
        }
      }
    });
    
    if (hasChanges) {
      setValues(newValues);
    }
  }, [searchParams, values, defaultValues, storagePrefix]);
  
  return [values, updateValues, updateValue] as const;
};