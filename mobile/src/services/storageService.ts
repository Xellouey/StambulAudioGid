import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  PURCHASED_TOURS: 'purchased_tours',
  USER_DEVICE_ID: 'user_device_id',
  USER_PREFERENCES: 'user_preferences',
} as const;

export const storageService = {
  // Purchased tours management
  async getPurchasedTours(): Promise<string[]> {
    try {
      const tours = await AsyncStorage.getItem(STORAGE_KEYS.PURCHASED_TOURS);
      return tours ? JSON.parse(tours) : [];
    } catch (error) {
      console.error('Error getting purchased tours:', error);
      return [];
    }
  },

  async addPurchasedTour(tourId: string): Promise<void> {
    try {
      const currentTours = await this.getPurchasedTours();
      if (!currentTours.includes(tourId)) {
        const updatedTours = [...currentTours, tourId];
        await AsyncStorage.setItem(
          STORAGE_KEYS.PURCHASED_TOURS,
          JSON.stringify(updatedTours)
        );
      }
    } catch (error) {
      console.error('Error adding purchased tour:', error);
    }
  },

  async isPurchased(tourId: string): Promise<boolean> {
    try {
      const purchasedTours = await this.getPurchasedTours();
      return purchasedTours.includes(tourId);
    } catch (error) {
      console.error('Error checking if tour is purchased:', error);
      return false;
    }
  },

  // Device ID management
  async getDeviceId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_DEVICE_ID);
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  },

  async setDeviceId(deviceId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DEVICE_ID, deviceId);
    } catch (error) {
      console.error('Error setting device ID:', error);
    }
  },

  // General storage utilities
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
