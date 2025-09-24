/**
 * View Tracking Utility
 * Handles product view tracking with frontend caching to avoid duplicate API calls
 */

interface TrackingResult {
  tracked: boolean;
  message: string;
}

interface TrackingCache {
  [key: string]: boolean;
}

class ViewTracker {
  private cache: TrackingCache = {};
  private readonly CACHE_KEY = 'product_view_cache';
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private apiCallCount: number = 0; // Debug counter
  private pendingCalls: Set<number> = new Set(); // Prevent concurrent calls

  constructor() {
    this.loadCache();
  }

  /**
   * Load cache from sessionStorage
   */
  private loadCache(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cached = sessionStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid (within 24 hours)
        if (now - timestamp < this.CACHE_EXPIRY) {
          this.cache = data;
        } else {
          // Cache expired, clear it
          this.clearCache();
        }
      }
    } catch (error) {
      console.warn('Failed to load view tracking cache:', error);
      this.clearCache();
    }
  }

  /**
   * Save cache to sessionStorage
   */
  private saveCache(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = {
        data: this.cache,
        timestamp: Date.now()
      };
      sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save view tracking cache:', error);
    }
  }

  /**
   * Clear cache
   */
  private clearCache(): void {
    this.cache = {};
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.CACHE_KEY);
    }
  }

  /**
   * Generate cache key for a product
   */
  private getCacheKey(productId: number): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${productId}-${today}`;
  }

  /**
   * Check if product view is already tracked today
   */
  private isAlreadyTracked(productId: number): boolean {
    const key = this.getCacheKey(productId);
    return this.cache[key] === true;
  }

  /**
   * Mark product as tracked in cache
   */
  private markAsTracked(productId: number): void {
    const key = this.getCacheKey(productId);
    this.cache[key] = true;
    this.saveCache();
  }

  /**
   * Track product view with caching
   */
  async trackView(productId: number, apiCall: (productId: number) => Promise<TrackingResult>): Promise<TrackingResult> {
    // Check cache first
    if (this.isAlreadyTracked(productId)) {
      console.log(`📊 Product ${productId} already tracked today (cached)`);
      return {
        tracked: false,
        message: 'View already tracked today (cached)'
      };
    }

    // Check if already pending
    if (this.pendingCalls.has(productId)) {
      console.log(`📊 Product ${productId} tracking already in progress`);
      return {
        tracked: false,
        message: 'Tracking already in progress'
      };
    }

    // Mark as pending
    this.pendingCalls.add(productId);

    try {
      // Call API
      this.apiCallCount++;
      console.log(`📊 Tracking view for product ${productId}... (API call #${this.apiCallCount})`);
      const result = await apiCall(productId);
      
      // If successfully tracked, update cache
      if (result.tracked) {
        this.markAsTracked(productId);
        console.log(`✅ Product ${productId} view tracked successfully`);
      } else {
        console.log(`ℹ️ Product ${productId} view not tracked: ${result.message}`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to track view for product ${productId}:`, error);
      return {
        tracked: false,
        message: 'Failed to track view'
      };
    } finally {
      // Remove from pending
      this.pendingCalls.delete(productId);
    }
  }

  /**
   * Clear cache for new day (can be called at midnight or page load)
   */
  clearCacheForNewDay(): void {
    this.clearCache();
    console.log('🔄 View tracking cache cleared for new day');
  }
}

// Export singleton instance
export const viewTracker = new ViewTracker();

// Export types
export type { TrackingResult };
