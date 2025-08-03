# Database Models Documentation

This directory contains the database models for the Dagestan Audio Guide application, implementing the requirements from task 2.2.

## Overview

The models are built using Prisma ORM with PostgreSQL and include comprehensive validation using Zod schemas. All models follow the design specifications from the project requirements.

## Models

### 1. User Model (`User.ts`)

Handles device-based user identification for the mobile application.

**Schema:**
- `id`: UUID primary key
- `deviceId`: Unique device identifier
- `platform`: Platform type ('ios', 'android_gplay', 'android_rustore')
- `createdAt`: Creation timestamp

**Key Methods:**
- `findOrCreate()`: Creates new user or returns existing by deviceId
- `findById()`: Find user by ID with purchases
- `findByDeviceId()`: Find user by device ID
- `hasPurchasedTour()`: Check if user purchased specific tour
- `getStats()`: Get user statistics by platform

### 2. Tour Model (`Tour.ts`)

Manages tour information and metadata.

**Schema:**
- `id`: UUID primary key
- `title`: Tour title
- `description`: Short description
- `fullDescription`: Detailed description (optional)
- `bannerUrl`: Banner image URL (optional)
- `audioDescriptionUrl`: Audio description URL (optional)
- `durationMinutes`: Tour duration in minutes (optional)
- `distanceMeters`: Tour distance in meters (optional)
- `priceCents`: Price in cents (default: 0)
- `attributes`: JSON array of attributes (['new', 'popular'])
- `routeData`: JSON route data with coordinates and bounds (optional)
- `createdAt`, `updatedAt`: Timestamps

**Key Methods:**
- `create()`: Create new tour with validation
- `findById()`: Find tour by ID with POIs
- `findMany()`: Get tours with filtering and pagination
- `update()`: Update tour data
- `getPopular()`: Get popular tours by purchase count
- `getStats()`: Get tour statistics

### 3. POI Model (`POI.ts`)

Manages Points of Interest within tours.

**Schema:**
- `id`: UUID primary key
- `tourId`: Foreign key to tour
- `title`: POI title
- `description`: POI description
- `audioUrl`: Audio file URL (optional)
- `latitude`: Decimal coordinate (10,8 precision)
- `longitude`: Decimal coordinate (11,8 precision)
- `isFree`: Boolean flag for free access
- `orderIndex`: Order within tour
- `createdAt`: Creation timestamp

**Key Methods:**
- `create()`: Create new POI with coordinate validation
- `findByTourId()`: Get all POIs for a tour
- `findFreePOIsByTourId()`: Get only free POIs for a tour
- `reorderPOIs()`: Update POI order using transactions
- `findNearby()`: Find POIs within radius of coordinates
- `getNextOrderIndex()`: Get next available order index

### 4. Purchase Model (`Purchase.ts`)

Handles purchase transactions across different platforms.

**Schema:**
- `id`: UUID primary key
- `userId`: Foreign key to user
- `tourId`: Foreign key to tour
- `platform`: Platform type ('ios', 'android_gplay', 'android_rustore')
- `transactionId`: Platform transaction ID (optional)
- `receiptData`: Platform-specific receipt data (optional)
- `purchasedAt`: Purchase timestamp
- `expiresAt`: Expiration timestamp (optional)

**Key Methods:**
- `create()`: Create purchase with duplicate prevention
- `findByUserAndTour()`: Find specific user-tour purchase
- `findMany()`: Get purchases with filtering and pagination
- `hasPurchased()`: Check if user purchased tour
- `isValid()`: Check if purchase is still valid (not expired)
- `findExpiring()`: Find purchases expiring soon
- `getStats()`: Get purchase statistics by platform

### 5. Database Connection (`database.ts`)

Provides database connection utilities and health checks.

**Functions:**
- `connectDatabase()`: Connect to PostgreSQL database
- `disconnectDatabase()`: Disconnect from database
- `checkDatabaseHealth()`: Verify database connectivity
- `prisma`: Global Prisma client instance

## Validation

All models use Zod schemas for comprehensive input validation:

- **Type Safety**: Full TypeScript integration
- **Runtime Validation**: Input validation at runtime
- **Error Handling**: Detailed validation error messages
- **Schema Inference**: Automatic type inference from schemas

## Database Schema

The database schema follows the design document specifications:

```sql
-- Users table for device-based authentication
CREATE TABLE "users" (
    "id" TEXT PRIMARY KEY,
    "deviceId" TEXT UNIQUE NOT NULL,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Tours table with JSON attributes and route data
CREATE TABLE "tours" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fullDescription" TEXT,
    "bannerUrl" TEXT,
    "audioDescriptionUrl" TEXT,
    "durationMinutes" INTEGER,
    "distanceMeters" INTEGER,
    "priceCents" INTEGER DEFAULT 0,
    "attributes" JSONB DEFAULT '[]',
    "routeData" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- POIs table with precise decimal coordinates
CREATE TABLE "pois" (
    "id" TEXT PRIMARY KEY,
    "tourId" TEXT NOT NULL REFERENCES "tours"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audioUrl" TEXT,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "isFree" BOOLEAN DEFAULT false,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Purchases table with platform-specific data
CREATE TABLE "purchases" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"("id"),
    "tourId" TEXT NOT NULL REFERENCES "tours"("id"),
    "platform" TEXT NOT NULL,
    "transactionId" TEXT,
    "receiptData" TEXT,
    "purchasedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3)
);
```

## Testing

Unit tests are provided for all models covering:

- **CRUD Operations**: Create, read, update, delete functionality
- **Validation**: Input validation and error handling
- **Business Logic**: Complex operations like purchase validation
- **Edge Cases**: Error conditions and boundary cases
- **Relationships**: Foreign key constraints and cascading deletes

Test files:
- `__tests__/models/User.test.ts`
- `__tests__/models/Tour.test.ts`
- `__tests__/models/POI.test.ts`
- `__tests__/models/Purchase.test.ts`
- `__tests__/models/database.test.ts`

## Requirements Compliance

This implementation satisfies all requirements from task 2.2:

✅ **SQL Schema Created**: Complete PostgreSQL schema for tours, pois, users, purchases tables
✅ **ORM Models Implemented**: Full Prisma models with TypeScript types
✅ **Data Validation**: Comprehensive Zod validation schemas
✅ **Database Migrations**: Migration files for schema deployment
✅ **Unit Tests**: Complete test coverage for all models

**Referenced Requirements:**
- 1.1: Tour listing and display functionality
- 2.1: Tour detail information management
- 5.2: Admin panel tour management
- 6.2: Route file processing and POI creation

## Usage Examples

```typescript
// Create a new user
const user = await UserModel.findOrCreate({
  deviceId: 'device-123',
  platform: 'ios'
});

// Create a tour with POIs
const tour = await TourModel.create({
  title: 'Dagestan Highlights',
  description: 'Explore the beauty of Dagestan',
  priceCents: 1500,
  attributes: ['new', 'popular']
});

// Add POI to tour
const poi = await POIModel.create({
  tourId: tour.id,
  title: 'Derbent Fortress',
  description: 'Ancient fortress city',
  latitude: 42.0579,
  longitude: 48.2895,
  isFree: true,
  orderIndex: 0
});

// Record a purchase
const purchase = await PurchaseModel.create({
  userId: user.id,
  tourId: tour.id,
  platform: 'ios',
  transactionId: 'tx-123'
});
```

## Next Steps

After completing this task, the models are ready for integration with:
1. API controllers (task 2.3)
2. File processing services (task 3.1-3.2)
3. Authentication middleware (task 4.1-4.2)
4. Payment processing (task 5.1-5.4)