import { useState, useCallback } from 'react';

export function useLoading(initialDelay = 800) {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await fn();
      return result;
    } finally {
      setTimeout(() => setIsLoading(false), initialDelay);
    }
  }, [initialDelay]);

  return { isLoading, withLoading };
}
