import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  PURCHASED_TOURS: 'purchased_tours',
  USER_DEVICE_ID: 'user_device_id',
  AUDIO_CACHE: 'audio_cache',
  USER_PREFERENCES: 'user_preferences',
  LAST_LOCATION: 'last_location',
} as const;

// Generic storage functions
export const storeData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
    throw error;
  }
};

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

// Specific storage functions
export const storePurchasedTours = async (tourIds: string[]): Promise<void> => {
  await storeData(STORAGE_KEYS.PURCHASED_TOURS, tourIds);
};

export const getPurchasedTours = async (): Promise<string[]> => {
  const tours = await getData<string[]>(STORAGE_KEYS.PURCHASED_TOURS);
  return tours || [];
};

export const storeDeviceId = async (deviceId: string): Promise<void> => {
  await storeData(STORAGE_KEYS.USER_DEVICE_ID, deviceId);
};

export const getDeviceId = async (): Promise<string | null> => {
  return await getData<string>(STORAGE_KEYS.USER_DEVICE_ID);
};

export interface UserPreferences {
  language: string;
  audioQuality: 'low' | 'medium' | 'high';
  autoPlay: boolean;
  downloadOverWifi: boolean;
  notificationsEnabled: boolean;
}

export const storeUserPreferences = async (
  preferences: UserPreferences
): Promise<void> => {
  await storeData(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

export const getUserPreferences = async (): Promise<UserPreferences> => {
  const preferences = await getData<UserPreferences>(
    STORAGE_KEYS.USER_PREFERENCES
  );
  return (
    preferences || {
      language: 'ru',
      audioQuality: 'medium',
      autoPlay: true,
      downloadOverWifi: true,
      notificationsEnabled: true,
    }
  );
};

export interface CachedAudio {
  url: string;
  localPath: string;
  size: number;
  lastAccessed: number;
}

export const storeAudioCache = async (cache: CachedAudio[]): Promise<void> => {
  await storeData(STORAGE_KEYS.AUDIO_CACHE, cache);
};

export const getAudioCache = async (): Promise<CachedAudio[]> => {
  const cache = await getData<CachedAudio[]>(STORAGE_KEYS.AUDIO_CACHE);
  return cache || [];
};
