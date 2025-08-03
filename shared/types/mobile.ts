// Mobile app specific types

// Location and Map types
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Audio Player types
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrack?: string;
}

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  description?: string;
  duration?: number;
}

// App Configuration
export interface AppConfig {
  apiBaseUrl: string;
  mapApiKey: string;
  paymentConfig: {
    publicKey: string;
    currency: string;
  };
  audioConfig: {
    maxCacheSize: number;
    preloadDistance: number; // в метрах
  };
}

// Navigation types
export interface NavigationParams {
  Home: undefined;
  TourDetail: {
    tourId: string;
  };
  Map: {
    tourId: string;
    route: RouteData;
    pois: POI[];
  };
}

// Import types from other files
import { RouteData } from './api';
import { POI } from './index';

// Platform specific types
export type Platform = 'ios' | 'android_gplay' | 'android_rustore';

export interface DeviceInfo {
  platform: Platform;
  deviceId: string;
  version: string;
  model?: string;
}

// Cache types
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

export interface AudioCache {
  [key: string]: {
    localPath: string;
    downloadedAt: number;
    size: number;
  };
}

// Permissions
export interface PermissionStatus {
  location: 'granted' | 'denied' | 'never_ask_again';
  storage: 'granted' | 'denied' | 'never_ask_again';
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}