// API-specific types for requests and responses

import { Tour, POI } from './index';

// API Response types
export interface ToursResponse {
  tours: Tour[];
  total: number;
  page: number;
}

export interface TourDetailResponse {
  tour: TourDetail;
  userAccess: {
    hasPurchased: boolean;
    freeAccessCount: number;
  };
}

export interface TourDetail extends Tour {
  fullDescription: string;
  audioDescription: string; // URL аудиофайла
  previewPOIs: POI[]; // первые несколько бесплатных точек
  route: RouteData;
}

export interface RouteData {
  coordinates: [number, number][];
  bounds: {
    northeast: [number, number];
    southwest: [number, number];
  };
}

// Component Props types
export interface HomeScreenProps {
  tours: Tour[];
  onTourSelect: (tourId: string) => void;
}

export interface MapComponentProps {
  route: RouteData;
  pois: POI[];
  onPOITap: (poi: POI) => void;
  userLocation?: [number, number];
}

// Payment API types
export interface PurchaseRequest {
  tourId: string;
  platform: 'ios' | 'android_gplay' | 'android_rustore';
  receipt: string; // платформо-специфичный receipt
}

export interface PurchaseResponse {
  success: boolean;
  purchaseId: string;
  expiresAt?: Date;
}

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Service interfaces
export interface PaymentService {
  initializePlatformPayments(): Promise<void>;
  purchaseTour(tourId: string): Promise<PurchaseResult>;
  restorePurchases(): Promise<string[]>;
}

// Error handling
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INVALID_RECEIPT = 'INVALID_RECEIPT',
  TOUR_NOT_FOUND = 'TOUR_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
}