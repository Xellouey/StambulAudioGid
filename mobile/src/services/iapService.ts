import {
  initConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  requestPurchase,
  finishTransaction,
  getProducts,
  Product,
  Purchase,
  PurchaseError,
} from 'react-native-iap';

import { storageService } from './storageService';

export class IAPService {
  private purchaseUpdateSubscription: any;
  private purchaseErrorSubscription: any;

  async initialize() {
    try {
      await initConnection();

      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          console.log('Purchase successful:', purchase);
          await this.handlePurchaseSuccess(purchase);
        }
      );

      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.error('Purchase error:', error);
          this.handlePurchaseError(error);
        }
      );
    } catch (error) {
      console.error('Error initializing IAP:', error);
    }
  }

  async getAvailableProducts(productIds: string[]): Promise<Product[]> {
    try {
      const products = await getProducts({ skus: productIds });
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async purchaseTour(tourId: string): Promise<void> {
    try {
      await requestPurchase({ sku: `tour_${tourId}` });
    } catch (error) {
      console.error('Error requesting purchase:', error);
      throw error;
    }
  }

  private async handlePurchaseSuccess(purchase: Purchase) {
    try {
      // Extract tour ID from product ID (assuming format: tour_123)
      const tourId = purchase.productId.replace('tour_', '');

      // Save purchase to local storage
      await storageService.addPurchasedTour(tourId);

      // Finish the transaction
      await finishTransaction({ purchase });

      console.log(`Tour ${tourId} purchased successfully`);
    } catch (error) {
      console.error('Error handling purchase success:', error);
    }
  }

  private handlePurchaseError(error: PurchaseError) {
    // Handle different error types
    switch (error.code) {
      case 'E_USER_CANCELLED':
        console.log('User cancelled the purchase');
        break;
      case 'E_ITEM_UNAVAILABLE':
        console.log('Item is not available for purchase');
        break;
      default:
        console.error('Purchase error:', error.message);
    }
  }

  destroy() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
  }
}

export const iapService = new IAPService();
