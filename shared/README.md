# Shared Types

This package contains shared TypeScript interfaces and types used across the Dagestan Audio Guide project.

## Structure

- `types/index.ts` - Core data models and Strapi API types
- `types/api.ts` - API-specific request/response types and service interfaces
- `types/admin.ts` - Admin panel specific types for content management
- `types/mobile.ts` - Mobile app specific types for React Native

## Usage

### In Backend (Strapi)

```typescript
import { Tour, POI, User, StrapiResponse } from '@dagestan-audio-guide/shared';

// Use in API controllers
const tour: StrapiResponse<Tour> = await strapi.entityService.findOne('api::tour.tour', id);
```

### In Mobile App (React Native)

```typescript
import { Tour, POI, UserLocation, AudioPlayerState } from '@dagestan-audio-guide/shared';

// Use in components and services
const [tours, setTours] = useState<Tour[]>([]);
const [location, setLocation] = useState<UserLocation | null>(null);
```

### In Admin Panel

```typescript
import { AdminTour, AdminPOI, RouteProcessor } from '@dagestan-audio-guide/shared';

// Use in admin components
const [tour, setTour] = useState<AdminTour>({
  title: '',
  description: '',
  // ...
});
```

## Core Types

### Data Models
- `User` - User entity with device tracking
- `Tour` - Tour entity with all metadata
- `POI` - Point of Interest entity
- `Purchase` - Purchase transaction entity

### API Types
- `StrapiResponse<T>` - Standard Strapi API response wrapper
- `StrapiCollectionResponse<T>` - Strapi collection response with pagination
- `StrapiError` - Strapi error response format

### Request/Response Types
- `ToursResponse` - Tours listing API response
- `TourDetailResponse` - Single tour detail API response
- `PurchaseRequest/Response` - Payment processing types

### Mobile Types
- `UserLocation` - GPS location data
- `AudioPlayerState` - Audio playback state
- `MapRegion` - Map viewport configuration
- `AppConfig` - Application configuration

### Admin Types
- `AdminTour/AdminPOI` - Admin panel data models
- `RouteProcessor` - KML/GPX file processing
- `DashboardStats` - Admin dashboard statistics

## Development

```bash
# Type checking
npm run type-check

# Install dependencies
npm install
```

## Integration

This package is automatically included in the workspace and can be imported by both backend and mobile projects using the package name `@dagestan-audio-guide/shared`.