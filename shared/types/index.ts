// Shared types for Dagestan Audio Guide

export interface Tour {
  id: number;
  attributes: {
    name: string;
    description: string;
    fullDescription: string;
    durationMinutes: number;
    distanceMeters: number;
    priceCents: number;
    attributes: 'new' | 'popular' | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    main_image: {
      data: {
        id: number;
        attributes: {
          url: string;
          alternativeText?: string;
        };
      } | null;
    };
    main_audio: {
      data: {
        id: number;
        attributes: {
          url: string;
          name: string;
        };
      } | null;
    };
    point_of_interests: {
      data: PointOfInterest[];
    };
  };
}

export interface PointOfInterest {
  id: number;
  attributes: {
    name: string;
    description: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    isFree: boolean;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    audio: {
      data: {
        id: number;
        attributes: {
          url: string;
          name: string;
        };
      } | null;
    };
  };
}

export interface AppUser {
  id: number;
  attributes: {
    deviceId: string;
    platform: 'ios' | 'android';
    createdAt: string;
    updatedAt: string;
    purchasedTours: {
      data: Tour[];
    };
  };
}

// API Response types
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}