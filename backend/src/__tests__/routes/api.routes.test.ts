import request from 'supertest';
import express from 'express';
import apiRoutes from '../../routes';
import { errorHandler, notFoundHandler } from '../../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

describe('API Routes', () => {
  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Dagestan Audio Guide API',
        version: '1.0.0',
        endpoints: {
          tours: '/api/tours',
          users: '/api/users',
          payments: '/api/payments'
        }
      });
    });
  });

  describe('Tours endpoints', () => {
    it('should handle tours routes', async () => {
      const response = await request(app)
        .get('/api/tours')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Users endpoints', () => {
    it('should handle user registration', async () => {
      const userData = {
        deviceId: 'test-device-123',
        platform: 'ios'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          deviceId: userData.deviceId,
          platform: userData.platform
        })
      });
    });
  });

  describe('Payments endpoints', () => {
    it('should handle payment processing', async () => {
      const paymentData = {
        tourId: '1',
        platform: 'ios',
        receipt: 'test-receipt-data',
        deviceId: 'test-device-123'
      };

      const response = await request(app)
        .post('/api/payments/purchase')
        .send(paymentData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          purchaseId: expect.any(String),
          transactionId: expect.any(String)
        })
      });
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('not found')
        }
      });
    });
  });
});