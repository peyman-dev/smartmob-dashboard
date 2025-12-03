import { useRef, useEffect, useState, useCallback } from "react";

interface UseRetryFetchOptions {
  /**
   * حداکثر تعداد تلاش برای fetch های خالی
   * @default 3
   */
  maxRetries?: number;
  
  /**
   * فعال/غیرفعال بودن infinite scroll
   */
  enabled?: boolean;
  
  /**
   * آیا در حال fetch کردن هستیم
   */
  isFetching?: boolean;
  
  /**
   * آیا صفحه بعدی وجود دارد
   */
  hasMore?: boolean;
  
  /**
   * تعداد کل آیتم‌های فعلی
   */
  currentDataLength: number;

  /**
   * Callback برای وقتی که به حد مجاز رسید
   */
  onMaxRetriesReached?: () => void;
}

interface UseRetryFetchReturn {
  /**
   * آیا به حد مجاز retry رسیدیم
   */
  isExhausted: boolean;
  
  /**
   * تعداد retry های انجام شده
   */
  retryCount: number;
  
  /**
   * Reset کردن counter
   */
  resetRetryCounter: () => void;
  
  /**
   * آیا می‌تونیم fetch کنیم یا نه
   */
  canFetch: boolean;
}

/**
 * Hook برای مدیریت retry های خالی در infinite scroll
 * 
 * @example
 * ```tsx
 * const { isExhausted, canFetch, resetRetryCounter } = useRetryFetch({
 *   maxRetries: 3,
 *   enabled: enableInfiniteScroll,
 *   isFetching: isFetchingNextPage,
 *   hasMore: hasNextPage,
 *   currentDataLength: data.length,
 * });
 * 
 * const loadMore = () => {
 *   if (canFetch) {
 *     fetchNextPage();
 *   }
 * };
 * ```
 */
export function useRetryFetch({
  maxRetries = 3,
  enabled = true,
  isFetching = false,
  hasMore = false,
  currentDataLength,
  onMaxRetriesReached,
}: UseRetryFetchOptions): UseRetryFetchReturn {
  const [isExhausted, setIsExhausted] = useState(false);
  const retryCountRef = useRef(0);
  const previousDataLengthRef = useRef(currentDataLength);
  const wasFetchingRef = useRef(false);

  // Reset counter when data length increases significantly
  useEffect(() => {
    if (currentDataLength > previousDataLengthRef.current) {
      console.log('✅ [useRetryFetch] Data increased, resetting counter', {
        previous: previousDataLengthRef.current,
        current: currentDataLength,
      });
      retryCountRef.current = 0;
      setIsExhausted(false);
    }
    previousDataLengthRef.current = currentDataLength;
  }, [currentDataLength]);

  // Detect empty fetches
  useEffect(() => {
    if (!enabled) return;

    // Track when fetch starts
    if (isFetching && !wasFetchingRef.current) {
      wasFetchingRef.current = true;
      return;
    }

    // Check when fetch completes
    if (!isFetching && wasFetchingRef.current) {
      wasFetchingRef.current = false;

      // If data didn't increase but hasMore is still true
      if (currentDataLength === previousDataLengthRef.current && hasMore) {
        retryCountRef.current += 1;
        
        console.warn(`⚠️ [useRetryFetch] Empty fetch detected (${retryCountRef.current}/${maxRetries})`, {
          currentLength: currentDataLength,
          hasMore,
        });

        if (retryCountRef.current >= maxRetries) {
          console.error('🛑 [useRetryFetch] Max retries reached - stopping fetch');
          setIsExhausted(true);
          onMaxRetriesReached?.();
        }
      }
    }
  }, [isFetching, currentDataLength, hasMore, maxRetries, enabled, onMaxRetriesReached]);

  // Reset when disabled
  useEffect(() => {
    if (!enabled) {
      retryCountRef.current = 0;
      setIsExhausted(false);
      previousDataLengthRef.current = currentDataLength;
    }
  }, [enabled, currentDataLength]);

  const resetRetryCounter = useCallback(() => {
    console.log('🔄 [useRetryFetch] Manual reset triggered');
    retryCountRef.current = 0;
    setIsExhausted(false);
    previousDataLengthRef.current = currentDataLength;
    wasFetchingRef.current = false;
  }, [currentDataLength]);

  const canFetch = enabled && hasMore && !isFetching && !isExhausted;

  return {
    isExhausted,
    retryCount: retryCountRef.current,
    resetRetryCounter,
    canFetch,
  };
}

export default useRetryFetch;