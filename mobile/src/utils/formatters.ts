/**
 * Utility functions for formatting data
 */

/**
 * Format duration from minutes to human readable string
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}ч ${mins}мин`;
  }
  return `${mins}мин`;
};

/**
 * Format distance from meters to human readable string
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} км`;
  }
  return `${meters} м`;
};

/**
 * Format price from cents to rubles
 */
export const formatPrice = (cents: number): string => {
  return `${(cents / 100).toFixed(0)} ₽`;
};

/**
 * Get full image URL from Strapi media
 */
export const getImageUrl = (imageUrl?: string): string | null => {
  if (!imageUrl) return null;

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Otherwise, prepend the base URL
  const baseUrl = __DEV__
    ? 'http://localhost:8080'
    : 'https://your-production-domain.com';

  return `${baseUrl}${imageUrl}`;
};

/**
 * Get audio URL from Strapi media
 */
export const getAudioUrl = (audioUrl?: string): string | null => {
  return getImageUrl(audioUrl); // Same logic as images
};
