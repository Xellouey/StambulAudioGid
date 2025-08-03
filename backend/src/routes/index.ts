import { Router } from 'express';
import toursRoutes from './tours.routes';
import usersRoutes from './users.routes';
import paymentsRoutes from './payments.routes';

const router = Router();

// Подключение маршрутов
router.use('/tours', toursRoutes);
router.use('/users', usersRoutes);
router.use('/payments', paymentsRoutes);

// Базовый маршрут API
router.get('/', (req, res) => {
  res.json({
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

export default router;