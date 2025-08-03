// Admin panel specific types

// Admin Tour Management
export interface AdminTour {
  id?: string;
  title: string;
  description: string;
  fullDescription: string;
  banner: File | string;
  audioDescription: File | string;
  attributes: string[];
  price: number;
  routeFile?: File; // KML/GPX файл
  pois: AdminPOI[];
}

export interface AdminPOI {
  id?: string;
  title: string;
  description: string;
  audioFile: File | string;
  coordinates: [number, number];
  isFree: boolean;
  order: number;
}

// Route Processing
export interface RouteProcessor {
  parseKMLFile(file: File): Promise<ParsedRoute>;
  parseGPXFile(file: File): Promise<ParsedRoute>;
  validateRoute(route: ParsedRoute): ValidationResult;
}

export interface ParsedRoute {
  coordinates: [number, number][];
  waypoints: Waypoint[];
  metadata: RouteMetadata;
}

export interface Waypoint {
  name: string;
  description?: string;
  coordinates: [number, number];
}

export interface RouteMetadata {
  name?: string;
  description?: string;
  totalDistance?: number;
  estimatedDuration?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Admin API requests
export interface CreateTourRequest {
  tourData: AdminTour;
  routeFile?: File;
}

export interface UpdateTourRequest {
  id: string;
  tourData: Partial<AdminTour>;
  routeFile?: File;
}

// Admin Authentication
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

// Dashboard Statistics
export interface DashboardStats {
  totalTours: number;
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  recentPurchases: any[]; // Will be typed properly when Purchase type is imported
  popularTours: any[]; // Will be typed properly when Tour type is imported
}