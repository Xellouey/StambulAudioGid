# Project Structure

## Root Level Organization
```
dagestan-audio-guide/
├── backend/          # Node.js API server
├── mobile/           # React Native mobile app
├── admin-panel/      # React web admin interface
├── shared/           # Shared TypeScript types and interfaces
├── .kiro/            # Kiro AI assistant configuration
├── docker-compose.yml # Database services configuration
└── package.json      # Workspace configuration and scripts
```

## Backend Structure (`/backend`)
```
backend/
├── src/
│   ├── controllers/  # Route handlers and business logic
│   ├── middleware/   # Express middleware (auth, CORS, error handling)
│   ├── models/       # Data models and database interactions
│   ├── routes/       # API route definitions
│   ├── services/     # Business logic services
│   ├── utils/        # Utility functions and helpers
│   ├── scripts/      # Database seeding and maintenance scripts
│   └── __tests__/    # Jest test files
├── prisma/           # Database schema and migrations
├── .env              # Environment variables (not in git)
└── package.json      # Backend dependencies and scripts
```

## Mobile App Structure (`/mobile`)
```
mobile/
├── src/
│   ├── components/   # Reusable UI components
│   ├── screens/      # Screen components for navigation
│   ├── navigation/   # React Navigation configuration
│   ├── services/     # API calls and external services
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── stores/       # Zustand state management
│   └── types/        # Mobile-specific TypeScript types
├── android/          # Android-specific configuration
├── ios/              # iOS-specific configuration
└── package.json      # Mobile dependencies and scripts
```

## Admin Panel Structure (`/admin-panel`)
```
admin-panel/
├── src/
│   ├── components/   # Reusable React components
│   ├── pages/        # Page components for routing
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API integration services
│   ├── stores/       # Zustand state management
│   ├── utils/        # Utility functions and helpers
│   └── types/        # Admin-specific TypeScript types
├── public/           # Static assets
└── package.json      # Admin panel dependencies and scripts
```

## Shared Types (`/shared`)
```
shared/
└── types/
    └── index.ts      # All shared TypeScript interfaces and types
```

## Key Architectural Patterns

### Data Flow
- **API-First**: Backend provides RESTful API consumed by both mobile and admin clients
- **Shared Types**: Single source of truth for data structures across all components
- **State Management**: Zustand + React Query for client-side state and server synchronization

### File Naming Conventions
- **Components**: PascalCase (e.g., `TourCard.tsx`)
- **Files/Folders**: camelCase (e.g., `tourService.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Interfaces**: PascalCase with descriptive names (e.g., `CreateTourRequest`)

### Import Organization
1. External libraries (React, Express, etc.)
2. Internal modules (services, components)
3. Shared types from `/shared/types`
4. Relative imports (./components, ../utils)

### Testing Structure
- **Backend**: Jest + Supertest for API testing
- **Admin Panel**: Vitest + Testing Library for component testing
- **Mobile**: Jest for unit testing
- Test files co-located with source files using `.test.ts` suffix

### Environment Configuration
- **Development**: `.env` files for local configuration
- **Production**: Environment variables for deployment
- **Shared Config**: Docker Compose for consistent database setup