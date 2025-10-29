// Cesta: src/shared/hooks/useAsync.js
// Hook pro správu asynchronních operací s loading a error stavy

import { useState, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';

/**
 * Hook pro správu asynchronních operací
 * Automaticky zobrazuje error notifikace a řídí loading stavy
 *
 * Použití:
 *   const { execute, loading, error } = useAsync(asyncFunction, {
 *     onSuccess: (data) => console.log('Success!', data),
 *     showSuccessToast: true,
 *     successMessage: 'Operace úspěšná!'
 *   });
 */
export const useAsync = (asyncFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operace byla úspěšně dokončena',
    errorMessage = 'Došlo k chybě',
    immediate = false,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { showSuccess, showError } = useNotification();

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const result = await asyncFunction(...args);
        setData(result);

        if (showSuccessToast) {
          showSuccess('Úspěch', successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMsg = err.message || errorMessage;
        setError(err);

        if (showErrorToast) {
          showError('Chyba', errorMsg);
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage, errorMessage, showSuccess, showError]
  );

  // Immediately execute if requested
  useState(() => {
    if (immediate) {
      execute();
    }
  });

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
