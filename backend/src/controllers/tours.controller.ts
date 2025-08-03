import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/errorHandler';
import { TourModel, TourFilters } from '../models/Tour';
import { z } from 'zod';

export class ToursController {
  // GET /api/tours - Получить список всех туров
  static async getAllTours(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Парсим фильтры из query параметров
      const filters: TourFilters = {};
      
      if (req.query.search) {
        filters.search = req.query.search as string;
      }
      
      if (req.query.attributes) {
        const attributesStr = req.query.attributes as string;
        filters.attributes = attributesStr.split(',').filter(attr => 
          ['new', 'popular'].includes(attr)
        ) as ('new' | 'popular')[];
      }
      
      if (req.query.minPrice) {
        filters.minPrice = parseInt(req.query.minPrice as string);
      }
      
      if (req.query.maxPrice) {
        filters.maxPrice = parseInt(req.query.maxPrice as string);
      }

      const result = await TourModel.findMany(filters, page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/tours/:id - Получить детальную информацию о туре
  static async getTourById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const tour = await TourModel.findById(id);
      
      if (!tour) {
        throw new ApiError('Tour not found', 404);
      }

      // TODO: Реализовать проверку покупок пользователя
      // Пока возвращаем базовую информацию о доступе
      const userAccess = {
        hasPurchased: false,
        freeAccessCount: 3
      };

      res.json({
        success: true,
        data: {
          tour,
          userAccess
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/tours - Создать новый тур (только для администраторов)
  static async createTour(req: Request, res: Response, next: NextFunction) {
    try {
      const tourData = req.body;

      const newTour = await TourModel.create(tourData);

      res.status(201).json({
        success: true,
        data: newTour,
        message: 'Tour created successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        next(new ApiError(`Validation error: ${errorMessage}`, 400));
      } else {
        next(error);
      }
    }
  }

  // PUT /api/tours/:id - Обновить тур (только для администраторов)
  static async updateTour(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Проверяем существование тура
      const exists = await TourModel.exists(id);
      if (!exists) {
        throw new ApiError('Tour not found', 404);
      }

      const updatedTour = await TourModel.update(id, updateData);

      res.json({
        success: true,
        data: updatedTour,
        message: 'Tour updated successfully'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        next(new ApiError(`Validation error: ${errorMessage}`, 400));
      } else {
        next(error);
      }
    }
  }

  // DELETE /api/tours/:id - Удалить тур (только для администраторов)
  static async deleteTour(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Проверяем существование тура
      const exists = await TourModel.exists(id);
      if (!exists) {
        throw new ApiError('Tour not found', 404);
      }

      await TourModel.delete(id);

      res.json({
        success: true,
        message: 'Tour deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}