'use client';

import { useViewTrackingCache } from '@/hooks/useViewTrackingCache';

interface ViewTrackingProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages view tracking cache
 * Automatically clears cache when a new day starts
 */
export const ViewTrackingProvider: React.FC<ViewTrackingProviderProps> = ({ children }) => {
  // This hook will automatically manage the cache
  useViewTrackingCache();

  return <>{children}</>;
};
