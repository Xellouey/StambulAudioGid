import { z } from 'zod';
import { prisma } from './database';
import type { Tour as PrismaTour, POI as PrismaPOI } from '@prisma/client';

// Zod схемы для валидации
const RouteDataSchema = z.object({
  coordinates: z.array(z.tuple([z.number(), z.number()])),
  bounds: z.object({
    northeast: z.tuple([z.number(), z.number()]),
    southwest: z.tuple([z.number(), z.number()]),
  }),
});

export const CreateTourSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  fullDescription: z.string().optional(),
  bannerUrl: z.string().url().optional(),
  audioDescriptionUrl: z.string().url().optional(),
  durationMinutes: z.number().int().positive().optional(),
  distanceMeters: z.number().int().positive().optional(),
  priceCents: z.number().int().min(0, 'Price cannot be negative').default(0),
  attributes: z.array(z.enum(['new', 'popular'])).default([]),
  routeData: RouteDataSchema.optional(),
});

export const UpdateTourSchema = CreateTourSchema.partial();

export const TourFiltersSchema = z.object({
  attributes: z.array(z.enum(['new', 'popular'])).optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  search: z.string().optional(),
});

export type CreateTourInput = z.infer<typeof CreateTourSchema>;
export type UpdateTourInput = z.infer<typeof UpdateTourSchema>;
export type TourFilters = z.infer<typeof TourFiltersSchema>;

export type TourWithPOIs = PrismaTour & {
  pois: PrismaPOI[];
};

export class TourModel {
  /**
   * Создать новый тур
   */
  static async create(data: CreateTourInput): Promise<TourWithPOIs> {
    const validatedData = CreateTourSchema.parse(data);
    
    return await prisma.tour.create({
      data: validatedData,
      include: {
        pois: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  /**
   * Найти тур по ID
   */
  static async findById(id: string): Promise<TourWithPOIs | null> {
    return await prisma.tour.findUnique({
      where: { id },
      include: {
        pois: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  /**
   * Получить все туры с фильтрацией
   */
  static async findMany(
    filters: TourFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{
    tours: TourWithPOIs[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedFilters = TourFiltersSchema.parse(filters);
    const skip = (page - 1) * limit;

    // Строим условия фильтрации
    const where: any = {};

    if (validatedFilters.search) {
      where.OR = [
        { title: { contains: validatedFilters.search, mode: 'insensitive' } },
        { description: { contains: validatedFilters.search, mode: 'insensitive' } },
      ];
    }

    if (validatedFilters.attributes && validatedFilters.attributes.length > 0) {
      where.attributes = {
        array_contains: validatedFilters.attributes,
      };
    }

    if (validatedFilters.minPrice !== undefined || validatedFilters.maxPrice !== undefined) {
      where.priceCents = {};
      if (validatedFilters.minPrice !== undefined) {
        where.priceCents.gte = validatedFilters.minPrice;
      }
      if (validatedFilters.maxPrice !== undefined) {
        where.priceCents.lte = validatedFilters.maxPrice;
      }
    }

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where,
        include: {
          pois: {
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tour.count({ where }),
    ]);

    return {
      tours,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Обновить тур
   */
  static async update(id: string, data: UpdateTourInput): Promise<TourWithPOIs> {
    const validatedData = UpdateTourSchema.parse(data);
    
    return await prisma.tour.update({
      where: { id },
      data: validatedData,
      include: {
        pois: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  /**
   * Удалить тур
   */
  static async delete(id: string): Promise<PrismaTour> {
    return await prisma.tour.delete({
      where: { id },
    });
  }

  /**
   * Получить популярные туры (по количеству покупок)
   */
  static async getPopular(limit: number = 5): Promise<(TourWithPOIs & { purchaseCount: number })[]> {
    const tours = await prisma.tour.findMany({
      include: {
        pois: {
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: { purchases: true },
        },
      },
      orderBy: {
        purchases: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return tours.map(tour => ({
      ...tour,
      purchaseCount: tour._count.purchases,
    }));
  }

  /**
   * Получить статистику туров
   */
  static async getStats(): Promise<{
    total: number;
    totalRevenue: number;
    averagePrice: number;
    byAttributes: Record<string, number>;
  }> {
    const [total, tours, purchases] = await Promise.all([
      prisma.tour.count(),
      prisma.tour.findMany({
        select: { priceCents: true, attributes: true },
      }),
      prisma.purchase.findMany({
        include: { tour: { select: { priceCents: true } } },
      }),
    ]);

    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.tour.priceCents, 0);
    const averagePrice = tours.length > 0 ? tours.reduce((sum, tour) => sum + tour.priceCents, 0) / tours.length : 0;

    const byAttributes: Record<string, number> = {};
    tours.forEach(tour => {
      const attributes = Array.isArray(tour.attributes) ? tour.attributes : [];
      attributes.forEach((attr: string) => {
        byAttributes[attr] = (byAttributes[attr] || 0) + 1;
      });
    });

    return {
      total,
      totalRevenue,
      averagePrice,
      byAttributes,
    };
  }

  /**
   * Проверить существование тура
   */
  static async exists(id: string): Promise<boolean> {
    const tour = await prisma.tour.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!tour;
  }
}