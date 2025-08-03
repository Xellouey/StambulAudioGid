# Technology Stack

## Architecture
- **Monorepo**: Workspace-based project structure with shared types
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for session management and API caching
- **Infrastructure**: Docker Compose for local development

## Backend (Node.js/Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT tokens with bcryptjs
- **Security**: Helmet, CORS, input validation with Zod
- **File Uploads**: Multer for media handling
- **Testing**: Jest with Supertest

## Mobile App (React Native)
- **Framework**: React Native 0.72+
- **Navigation**: React Navigation v6
- **Maps**: Yandex MapKit
- **Audio**: react-native-sound
- **Payments**: react-native-iap
- **State**: Zustand + React Query
- **Storage**: AsyncStorage

## Admin Panel (React)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand + React Query
- **Testing**: Vitest + Testing Library

## Shared
- **Language**: TypeScript throughout
- **Types**: Centralized in `/shared/types`
- **HTTP Client**: Axios
- **Linting**: ESLint + Prettier
- **Package Manager**: npm with workspaces

## Common Commands

### Development Setup
```bash
# Install all dependencies
npm run install:all

# Start databases
docker-compose up -d

# Setup backend database
cd backend && npm run db:generate && npm run db:migrate
```

### Development
```bash
# Start backend (port 3000)
npm run dev:backend

# Start admin panel (port 3001)  
npm run dev:admin

# Start mobile app
cd mobile && npm run android
```

### Building
```bash
# Build all projects
npm run build:all

# Build specific components
npm run build:backend
npm run build:admin
```

### Testing
```bash
# Run all tests
npm run test

# Run specific tests
npm run test:backend
npm run test:admin
```

### Code Quality
```bash
# Lint all projects
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Development Requirements
- Node.js 18+
- Docker & Docker Compose
- React Native CLI (for mobile development)
- Android Studio/Xcode (for mobile builds)