// Основные интерфейсы для всех компонентов приложения

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number; // в минутах
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  imageUrl?: string;
  audioUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  pois: POI[];
}

export interface POI {
  id: string;
  tourId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  audioUrl?: string;
  imageUrls: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  tourId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  tour?: Tour;
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
  price: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> {
  isActive?: boolean;
}

export interface CreatePOIRequest {
  tourId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  audioUrl?: string;
  imageUrls?: string[];
  order: number;
}

export interface UpdatePOIRequest extends Partial<CreatePOIRequest> {}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}

// Аутентификация
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Фильтры и поиск
export interface TourFilters {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  search?: string;
}

export interface PurchaseFilters {
  userId?: string;
  tourId?: string;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  dateFrom?: Date;
  dateTo?: Date;
}

// Статистика для админ панели
export interface DashboardStats {
  totalTours: number;
  activeTours: number;
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