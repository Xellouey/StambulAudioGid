import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/errorHandler';

export class UsersController {
  // POST /api/users/register - Регистрация нового пользователя/устройства
  static async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId, platform } = req.body;

      if (!deviceId || !platform) {
        throw new ApiError('Device ID and platform are required', 400);
      }

      // TODO: Реализовать создание пользователя в базе данных
      const user = {
        id: Date.now().toString(),
        deviceId,
        platform,
        createdAt: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        data: user,
        message: 'User registered successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:deviceId - Получить информацию о пользователе
  static async getUserByDeviceId(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;

      // TODO: Реализовать получение пользователя из базы данных
      const user = {
        id: '1',
        deviceId,
        platform: 'ios',
        createdAt: new Date().toISOString(),
        purchases: []
      };

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:deviceId/purchases - Получить покупки пользователя
  static async getUserPurchases(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;

      // TODO: Реализовать получение покупок из базы данных
      const purchases = [
        {
          id: '1',
          tourId: '1',
          platform: 'ios',
          transactionId: 'txn_123',
          purchasedAt: new Date().toISOString(),
          expiresAt: null
        }
      ];

      res.json({
        success: true,
        data: purchases
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users/admin/login - Вход администратора
  static async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError('Email and password are required', 400);
      }

      // TODO: Реализовать аутентификацию администратора
      // Временная заглушка
      if (email === 'admin@example.com' && password === 'admin123') {
        const token = 'mock_jwt_token';
        
        res.json({
          success: true,
          data: {
            token,
            user: {
              id: 'admin_1',
              email,
              role: 'admin'
            }
          },
          message: 'Login successful'
        });
      } else {
        throw new ApiError('Invalid credentials', 401);
      }
    } catch (error) {
      next(error);
    }
  }
}