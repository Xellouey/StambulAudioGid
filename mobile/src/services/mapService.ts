import { YaMap } from 'react-native-yamap';

export interface MapPoint {
  latitude: number;
  longitude: number;
}

export interface POIMarker extends MapPoint {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  orderIndex: number;
}

export const mapService = {
  // Initialize Yandex MapKit
  init(apiKey: string) {
    try {
      YaMap.init(apiKey);
      console.log('Yandex MapKit initialized successfully');
    } catch (error) {
      console.error('Error initializing Yandex MapKit:', error);
    }
  },

  // Calculate distance between two points
  calculateDistance(point1: MapPoint, point2: MapPoint): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) *
        Math.cos(this.toRadians(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Convert to meters

    return Math.round(distance);
  },

  // Convert degrees to radians
  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  // Get map bounds for a set of points
  getMapBounds(points: MapPoint[]): {
    northEast: MapPoint;
    southWest: MapPoint;
  } {
    if (points.length === 0) {
      return {
        northEast: { latitude: 0, longitude: 0 },
        southWest: { latitude: 0, longitude: 0 },
      };
    }

    let minLat = points[0].latitude;
    let maxLat = points[0].latitude;
    let minLon = points[0].longitude;
    let maxLon = points[0].longitude;

    points.forEach(point => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLon = Math.min(minLon, point.longitude);
      maxLon = Math.max(maxLon, point.longitude);
    });

    // Add some padding
    const latPadding = (maxLat - minLat) * 0.1;
    const lonPadding = (maxLon - minLon) * 0.1;

    return {
      northEast: {
        latitude: maxLat + latPadding,
        longitude: maxLon + lonPadding,
      },
      southWest: {
        latitude: minLat - latPadding,
        longitude: minLon - lonPadding,
      },
    };
  },

  // Check if user is near a POI (within 50 meters)
  isNearPOI(
    userLocation: MapPoint,
    poi: POIMarker,
    threshold: number = 50
  ): boolean {
    const distance = this.calculateDistance(userLocation, poi);
    return distance <= threshold;
  },
};
