// App constants
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:1337'
    : 'https://your-production-url.com',
  TIMEOUT: 10000,
};

export const COLORS = {
  primary: '#2196f3',
  secondary: '#ff9800',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  light: '#f5f5f5',
  dark: '#333333',
  white: '#ffffff',
  black: '#000000',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  // Padding & Margin
  base: 8,
  small: 12,
  medium: 16,
  large: 20,
  extraLarge: 24,

  // Font sizes
  h1: 24,
  h2: 20,
  h3: 18,
  h4: 16,
  body: 14,
  caption: 12,

  // Border radius
  radius: 8,
  roundedRadius: 12,
  circleRadius: 50,
};

export const FREEMIUM_CONFIG = {
  FREE_POI_LIMIT: 3, // First 3 POIs are free
  TRIAL_DURATION: 7, // Days
};

export const AUDIO_CONFIG = {
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  PRELOAD_DISTANCE: 100, // meters
  FADE_DURATION: 1000, // milliseconds
};

export const MAP_CONFIG = {
  DEFAULT_REGION: {
    latitude: 42.9849, // Makhachkala
    longitude: 47.5047,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  MARKER_SIZE: {
    width: 40,
    height: 40,
  },
};
