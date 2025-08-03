import { Router } from 'express';
import { ToursController } from '../controllers';
import { validateRequest } from '../middleware';
import { CreateTourSchema, UpdateTourSchema } from '../models/Tour';
import { z } from 'zod';

const router = Router();

// Схемы валидации для маршрутов
const createTourRequestSchema = {
  body: CreateTourSchema
};

const updateTourRequestSchema = {
  body: UpdateTourSchema
};

const tourIdSchema = {
  params: z.object({
    id: z.string().min(1, 'Tour ID is required')
  })
};

const toursQuerySchema = {
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    attributes: z.string().optional(),
    minPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxPrice: z.string().regex(/^\d+$/).transform(Number).optional()
  }).optional()
};

// Маршруты
router.get('/', validateRequest(toursQuerySchema), ToursController.getAllTours);
router.get('/:id', validateRequest(tourIdSchema), ToursController.getTourById);
router.post('/', validateRequest(createTourRequestSchema), ToursController.createTour);
router.put('/:id', validateRequest({ ...tourIdSchema, ...updateTourRequestSchema }), ToursController.updateTour);
router.delete('/:id', validateRequest(tourIdSchema), ToursController.deleteTour);

export default router;