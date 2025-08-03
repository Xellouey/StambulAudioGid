import { Router } from 'express';
import { UsersController } from '../controllers';
import { validateRequest } from '../middleware';
import { z } from 'zod';

const router = Router();

// Схемы валидации
const registerUserSchema = {
  body: z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
    platform: z.enum(['ios', 'android'], { 
      errorMap: () => ({ message: 'Platform must be ios or android' })
    })
  })
};

const deviceIdSchema = {
  params: z.object({
    deviceId: z.string().min(1, 'Device ID is required')
  })
};

const adminLoginSchema = {
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required')
  })
};

// Маршруты
router.post('/register', validateRequest(registerUserSchema), UsersController.registerUser);
router.get('/:deviceId', validateRequest(deviceIdSchema), UsersController.getUserByDeviceId);
router.get('/:deviceId/purchases', validateRequest(deviceIdSchema), UsersController.getUserPurchases);
router.post('/admin/login', validateRequest(adminLoginSchema), UsersController.adminLogin);

export default router;