// Navigation types
export type RootStackParamList = {
  Home: undefined;
  TourDetail: { tourId: number };
  Map: { 
    tour: import('../../../shared/types').Tour;
    startFromPOI?: number;
  };
};
