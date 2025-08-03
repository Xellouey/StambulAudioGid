# Mobile App Structure

This directory contains the React Native mobile application for the Dagestan Audio Guide project.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── TourCard.tsx    # Tour display card
│   ├── POIPopup.tsx    # Point of Interest popup
│   ├── PaywallModal.tsx # Freemium paywall modal
│   ├── LoadingSpinner.tsx # Loading indicator
│   ├── ErrorBoundary.tsx # Error handling component
│   └── index.ts        # Component exports
├── screens/            # Application screens
│   ├── HomeScreen.tsx  # Main tour listing screen
│   ├── TourDetailScreen.tsx # Tour details and description
│   ├── MapScreen.tsx   # Interactive map with POIs
│   └── index.ts        # Screen exports
├── services/           # API integration with Strapi
│   ├── strapiApi.ts    # HTTP client for Strapi
│   ├── tourService.ts  # Tour-related API calls
│   ├── paymentService.ts # Payment processing
│   └── index.ts        # Service exports
├── navigation/         # React Navigation setup
│   ├── RootNavigator.tsx # Main navigation stack
│   ├── types.ts        # Navigation type definitions
│   └── index.ts        # Navigation exports
├── hooks/              # Custom React hooks
│   ├── useAudioPlayer.ts # Audio playback management
│   ├── usePurchases.ts # Purchase state management
│   ├── useLocation.ts  # Geolocation handling
│   └── index.ts        # Hook exports
├── utils/              # Utility functions
│   ├── constants.ts    # App constants and configuration
│   ├── helpers.ts      # Helper functions
│   ├── storage.ts      # AsyncStorage utilities
│   └── index.ts        # Utility exports
├── types/              # Mobile-specific TypeScript types
│   └── index.ts        # Type definitions
└── index.ts            # Main src exports
```

## Key Features

### Components

- **TourCard**: Displays tour information with image, title, description, and attributes
- **POIPopup**: Shows point of interest details with audio playback controls
- **PaywallModal**: Freemium paywall for tour purchases
- **LoadingSpinner**: Consistent loading indicator across the app
- **ErrorBoundary**: Catches and handles React errors gracefully

### Screens

- **HomeScreen**: Lists available tours with pull-to-refresh functionality
- **TourDetailScreen**: Shows detailed tour information and start button
- **MapScreen**: Interactive map with route and POI markers (Yandex Maps)

### Services

- **strapiApi**: Centralized HTTP client with interceptors and error handling
- **tourService**: Tour-specific API operations (get tours, details, search)
- **paymentService**: Cross-platform payment processing (iOS, Android, RuStore)

### Navigation

- Stack-based navigation using React Navigation v6
- Type-safe navigation with TypeScript parameter definitions

### Hooks

- **useAudioPlayer**: Manages audio playback state and controls
- **usePurchases**: Handles purchase state and AsyncStorage persistence
- **useLocation**: Manages geolocation permissions and tracking

### Utils

- **constants**: App-wide constants (colors, sizes, API config)
- **helpers**: Utility functions (formatting, calculations, validation)
- **storage**: AsyncStorage wrapper with type safety

## Architecture Principles

1. **Feature-based organization**: Components and logic grouped by functionality
2. **Separation of concerns**: Clear separation between UI, business logic, and data
3. **Type safety**: Full TypeScript coverage with shared types
4. **Reusability**: Modular components and hooks for code reuse
5. **Error handling**: Comprehensive error boundaries and validation
6. **Performance**: Optimized for mobile with lazy loading and caching

## Integration Points

- **Shared Types**: Uses types from `../../../shared/types` for API consistency
- **Strapi Backend**: Direct integration with Strapi REST API
- **Platform Services**: Native integrations for maps, audio, and payments

## Development Notes

- All TODO comments indicate features to be implemented in later phases
- Mock implementations are provided for development and testing
- Platform-specific code is clearly marked and isolated
- Error handling includes user-friendly messages in Russian
