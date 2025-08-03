import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { StrapiError } from '../types';

interface UseErrorHandlerReturn {
  error: string | null;
  isLoading: boolean;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  handleError: (error: any, showAlert?: boolean) => void;
  clearError: () => void;
  executeWithErrorHandling: <T>(
    asyncFn: () => Promise<T>,
    options?: {
      showAlert?: boolean;
      loadingState?: boolean;
      onSuccess?: (result: T) => void;
      onError?: (error: string) => void;
    }
  ) => Promise<T | null>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleError = useCallback((error: any, showAlert = true) => {
    let errorMessage = 'Произошла неизвестная ошибка';

    // Handle Strapi API errors
    if (error?.error) {
      const strapiError = error as StrapiError;
      errorMessage = strapiError.error.message;
    }
    // Handle network errors
    else if (error?.message) {
      if (error.message.includes('Network Error')) {
        errorMessage = 'Ошибка сети. Проверьте подключение к интернету';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Превышено время ожидания. Попробуйте еще раз';
      } else {
        errorMessage = error.message;
      }
    }
    // Handle string errors
    else if (typeof error === 'string') {
      errorMessage = error;
    }

    setError(errorMessage);

    if (showAlert) {
      Alert.alert('Ошибка', errorMessage, [
        {
          text: 'OK',
          onPress: () => setError(null),
        },
      ]);
    }

    if (__DEV__) {
      console.error('Error handled:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeWithErrorHandling = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options: {
        showAlert?: boolean;
        loadingState?: boolean;
        onSuccess?: (result: T) => void;
        onError?: (error: string) => void;
      } = {}
    ): Promise<T | null> => {
      const {
        showAlert = true,
        loadingState = true,
        onSuccess,
        onError,
      } = options;

      try {
        if (loadingState) {
          setLoading(true);
        }
        clearError();

        const result = await asyncFn();

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        handleError(err, showAlert);

        if (onError && error) {
          onError(error);
        }

        return null;
      } finally {
        if (loadingState) {
          setLoading(false);
        }
      }
    },
    [error, handleError, clearError]
  );

  return {
    error,
    isLoading,
    setError,
    setLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
  };
};
