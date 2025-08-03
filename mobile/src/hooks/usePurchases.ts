import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentService } from '../services';

const PURCHASED_TOURS_KEY = 'purchased_tours';

const usePurchases = () => {
  const [purchasedTours, setPurchasedTours] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchasedTours();
    initializePayments();
  }, []);

  const loadPurchasedTours = async () => {
    try {
      const stored = await AsyncStorage.getItem(PURCHASED_TOURS_KEY);
      if (stored) {
        setPurchasedTours(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading purchased tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializePayments = async () => {
    try {
      await paymentService.initializePlatformPayments();

      // Restore previous purchases
      const restoredTours = await paymentService.restorePurchases();
      if (restoredTours.length > 0) {
        await savePurchasedTours(restoredTours);
      }
    } catch (error) {
      console.error('Error initializing payments:', error);
    }
  };

  const savePurchasedTours = async (tours: string[]) => {
    try {
      const uniqueTours = Array.from(new Set([...purchasedTours, ...tours]));
      await AsyncStorage.setItem(
        PURCHASED_TOURS_KEY,
        JSON.stringify(uniqueTours)
      );
      setPurchasedTours(uniqueTours);
    } catch (error) {
      console.error('Error saving purchased tours:', error);
    }
  };

  const purchaseTour = async (tourId: string): Promise<boolean> => {
    try {
      const result = await paymentService.purchaseTour(tourId);

      if (result.success) {
        await savePurchasedTours([tourId]);
        return true;
      } else {
        console.error('Purchase failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error purchasing tour:', error);
      return false;
    }
  };

  const isPurchased = (tourId: string): boolean => {
    return purchasedTours.includes(tourId);
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      const restoredTours = await paymentService.restorePurchases();
      await savePurchasedTours(restoredTours);
      return true;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  };

  return {
    purchasedTours,
    loading,
    purchaseTour,
    isPurchased,
    restorePurchases,
  };
};

export default usePurchases;
