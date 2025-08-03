// Mobile-specific types
export * from '../../../shared/types';
export * from '../navigation/types';

// Screen props types
export type HomeScreenProps = {
  navigation: any;
};

export type TourDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      tourId: number;
    };
  };
};

export type MapScreenProps = {
  navigation: any;
  route: {
    params: {
      tour: import('../../../shared/types').Tour;
      startFromPOI?: number;
    };
  };
};

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// App state types
export interface AppState {
  tours: import('../../../shared/types').Tour[];
  currentTour: import('../../../shared/types').Tour | null;
  purchasedTours: number[];
  isLoading: boolean;
  error: string | null;
}
