// Основные интерфейсы для всех компонентов приложения

export interface User {
  id: string;
  deviceId: string;
  platform?: string; // 'ios' | 'android_gplay' | 'android_rustore'
  createdAt: Date;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  bannerUrl?: string;
  audioDescriptionUrl?: string;
  durationMinutes?: number;
  distanceMeters?: number;
  priceCents: number;
  attributes: ('new' | 'popular')[];
  routeData?: RouteData;
  createdAt: Date;
  updatedAt: Date;
  pois: POI[];
}

export interface POI {
  id: string;
  tourId: string;
  title: string;
  description: string;
  audioUrl?: string;
  latitude: number;
  longitude: number;
  isFree: boolean;
  orderIndex: number;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  tourId: string;
  platform: string; // 'ios' | 'android_gplay' | 'android_rustore'
  transactionId?: string;
  receiptData?: string;
  purchasedAt: Date;
  expiresAt?: Date;
  user?: User;
  tour?: Tour;
}

export interface RouteData {
  coordinates: [number, number][];
  bounds: {
    northeast: [number, number];
    southwest: [number, number];
  };
}

// API Response типы
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Запросы для создания/обновления
export interface CreateTourRequest {
  title: string;
  description: string;
  fullDescription?: string;
  bannerUrl?: string;
  audioDescriptionUrl?: string;
  durationMinutes?: number;
  distanceMeters?: number;
  priceCents: number;
  attributes?: ('new' | 'popular')[];
  routeData?: RouteData;
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> {}

export interface CreatePOIRequest {
  tourId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  audioUrl?: string;
  isFree?: boolean;
  orderIndex: number;
}

export interface UpdatePOIRequest extends Partial<CreatePOIRequest> {}

export interface CreateUserRequest {
  deviceId: string;
  platform?: string;
}

export interface UpdateUserRequest {
  platform?: string;
}

// Аутентификация (для админ панели)
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: AdminUser;
  token: string;
  refreshToken: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Фильтры и поиск
export interface TourFilters {
  attributes?: ('new' | 'popular')[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PurchaseFilters {
  userId?: string;
  tourId?: string;
  platform?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Статистика для админ панели
export interface DashboardStats {
  totalTours: number;
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  recentPurchases: Purchase[];
  popularTours: (Tour & { purchaseCount: number })[];
}

// Мобильное приложение специфичные типы
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrack?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Платежи
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

// Конфигурация приложения
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