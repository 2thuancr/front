import { useEffect } from 'react';
import { viewTracker } from '@/lib/viewTracker';

/**
 * Hook to handle view tracking cache management
 * Automatically clears cache when a new day starts
 */
export const useViewTrackingCache = () => {
  useEffect(() => {
    // Check if we need to clear cache for new day
    const checkCacheExpiry = () => {
      const lastCacheDate = localStorage.getItem('view_tracking_last_date');
      const today = new Date().toISOString().split('T')[0];
      
      if (lastCacheDate !== today) {
        viewTracker.clearCacheForNewDay();
        if (today) {
          localStorage.setItem('view_tracking_last_date', today);
        }
      }
    };

    // Check on mount
    checkCacheExpiry();

    // Set up interval to check every hour
    const interval = setInterval(checkCacheExpiry, 60 * 60 * 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);
};
