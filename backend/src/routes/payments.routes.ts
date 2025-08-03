import { Router } from 'express';
import { PaymentsController } from '../controllers';
import { validateRequest } from '../middleware';
import { z } from 'zod';

const router = Router();

// Схемы валидации
const purchaseSchema = {
  body: z.object({
    tourId: z.string().min(1, 'Tour ID is required'),
    platform: z.enum(['ios', 'android_gplay', 'android_rustore'], {
      errorMap: () => ({ message: 'Platform must be ios, android_gplay, or android_rustore' })
    }),
    receipt: z.string().min(1, 'Receipt is required'),
    deviceId: z.string().min(1, 'Device ID is required')
  })
};

const transactionIdSchema = {
  params: z.object({
    transactionId: z.string().min(1, 'Transaction ID is required')
  })
};

const restorePurchasesSchema = {
  body: z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
    platform: z.enum(['ios', 'android_gplay', 'android_rustore'], {
      errorMap: () => ({ message: 'Platform must be ios, android_gplay, or android_rustore' })
    })
  })
};

// Маршруты
router.post('/purchase', validateRequest(purchaseSchema), PaymentsController.processPurchase);
router.get('/status/:transactionId', validateRequest(transactionIdSchema), PaymentsController.getPaymentStatus);
router.post('/restore', validateRequest(restorePurchasesSchema), PaymentsController.restorePurchases);

export default router;