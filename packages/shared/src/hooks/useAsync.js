// Cesta: packages/shared/src/hooks/useAsync.js
// Hook pro správu asynchronních operací s loading a error stavy
// Universal version - bez NotificationContext závislosti

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook pro správu asynchronních operací
 * Automaticky řídí loading a error stavy
 *
 * Použití:
 *   const { execute, loading, error } = useAsync(asyncFunction, {
 *     onSuccess: (data) => console.log('Success!', data),
 *     onError: (error) => console.error('Error:', error),
 *     immediate: false
 *   });
 */
export const useAsync = (asyncFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    immediate = false,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const result = await asyncFunction(...args);
        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        setError(err);

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  // Immediately execute if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    execute,
    loading,
    error,
    data,
  };
};

/**
 * Utility funkce pro bezpečné volání async funkcí
 * Automaticky loguje chyby a volitelně zobrazuje notifikace
 */
export const safeAsync = async (fn, options = {}) => {
  const {
    onError,
    logError = true,
    rethrow = false,
  } = options;

  try {
    return await fn();
  } catch (error) {
    if (logError) {
      console.error('Async error:', error);
    }

    if (onError) {
      onError(error);
    }

    if (rethrow) {
      throw error;
    }

    return null;
  }
};

/**
 * Helper funkce pro retry logiku
 */
export const withRetry = async (fn, options = {}) => {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    onRetry,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        if (onRetry) {
          onRetry(attempt, error);
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
};
