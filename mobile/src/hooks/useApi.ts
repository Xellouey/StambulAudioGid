import { useState, useEffect, useCallback } from 'react';
import { Tour } from '../types';
import { apiService } from '../services/api';
import { useErrorHandler } from './useErrorHandler';

interface UseToursReturn {
  tours: Tour[];
  isLoading: boolean;
  error: string | null;
  refreshTours: () => Promise<void>;
}

interface UseTourDetailsReturn {
  tour: Tour | null;
  isLoading: boolean;
  error: string | null;
  refreshTour: () => Promise<void>;
}

/**
 * Hook for managing tours list
 */
export const useTours = (): UseToursReturn => {
  const [tours, setTours] = useState<Tour[]>([]);
  const { error, isLoading, executeWithErrorHandling } = useErrorHandler();

  const loadTours = useCallback(async () => {
    await executeWithErrorHandling(() => apiService.getTours(), {
      onSuccess: toursData => {
        setTours(toursData);
      },
    });
  }, [executeWithErrorHandling]);

  const refreshTours = useCallback(async () => {
    await loadTours();
  }, [loadTours]);

  useEffect(() => {
    loadTours();
  }, [loadTours]);

  return {
    tours,
    isLoading,
    error,
    refreshTours,
  };
};

/**
 * Hook for managing single tour details
 */
export const useTourDetails = (tourId: number): UseTourDetailsReturn => {
  const [tour, setTour] = useState<Tour | null>(null);
  const { error, isLoading, executeWithErrorHandling } = useErrorHandler();

  const loadTourDetails = useCallback(async () => {
    if (!tourId) return;

    await executeWithErrorHandling(() => apiService.getTourDetails(tourId), {
      onSuccess: tourData => {
        setTour(tourData);
      },
    });
  }, [tourId, executeWithErrorHandling]);

  const refreshTour = useCallback(async () => {
    await loadTourDetails();
  }, [loadTourDetails]);

  useEffect(() => {
    loadTourDetails();
  }, [loadTourDetails]);

  return {
    tour,
    isLoading,
    error,
    refreshTour,
  };
};
