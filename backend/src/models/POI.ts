import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from './database';
import type { POI as PrismaPOI } from '@prisma/client';

// Zod схемы для валидации
export const CreatePOISchema = z.object({
  tourId: z.string().uuid('Invalid tour ID'),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  audioUrl: z.string().url().optional(),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  isFree: z.boolean().default(false),
  orderIndex: z.number().int().min(0, 'Order index must be non-negative'),
});

export const UpdatePOISchema = CreatePOISchema.partial().omit({ tourId: true });

export type CreatePOIInput = z.infer<typeof CreatePOISchema>;
export type UpdatePOIInput = z.infer<typeof UpdatePOISchema>;

export class POIModel {
  /**
   * Создать новую точку интереса
   */
  static async create(data: CreatePOIInput): Promise<PrismaPOI> {
    const validatedData = CreatePOISchema.parse(data);
    
    // Проверяем, существует ли тур
    const tourExists = await prisma.tour.findUnique({
      where: { id: validatedData.tourId },
      select: { id: true },
    });

    if (!tourExists) {
      throw new Error('Tour not found');
    }

    return await prisma.poi.create({
      data: {
        ...validatedData,
        latitude: new Decimal(validatedData.latitude),
        longitude: new Decimal(validatedData.longitude),
      },
    });
  }

  /**
   * Найти POI по ID
   */
  static async findById(id: string): Promise<PrismaPOI | null> {
    return await prisma.poi.findUnique({
      where: { id },
    });
  }

  /**
   * Получить все POI для тура
   */
  static async findByTourId(tourId: string): Promise<PrismaPOI[]> {
    return await prisma.poi.findMany({
      where: { tourId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Получить бесплатные POI для тура
   */
  static async findFreePOIsByTourId(tourId: string): Promise<PrismaPOI[]> {
    return await prisma.poi.findMany({
      where: { 
        tourId,
        isFree: true,
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Обновить POI
   */
  static async update(id: string, data: UpdatePOIInput): Promise<PrismaPOI> {
    const validatedData = UpdatePOISchema.parse(data);
    
    const updateData: any = { ...validatedData };
    
    // Конвертируем координаты в Decimal если они предоставлены
    if (validatedData.latitude !== undefined) {
      updateData.latitude = new Decimal(validatedData.latitude);
    }
    if (validatedData.longitude !== undefined) {
      updateData.longitude = new Decimal(validatedData.longitude);
    }
    
    return await prisma.poi.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Удалить POI
   */
  static async delete(id: string): Promise<PrismaPOI> {
    return await prisma.poi.delete({
      where: { id },
    });
  }

  /**
   * Удалить все POI для тура
   */
  static async deleteByTourId(tourId: string): Promise<{ count: number }> {
    return await prisma.poi.deleteMany({
      where: { tourId },
    });
  }

  /**
   * Обновить порядок POI для тура
   */
  static async reorderPOIs(tourId: string, poiOrders: { id: string; orderIndex: number }[]): Promise<void> {
    // Используем транзакцию для атомарного обновления порядка
    await prisma.$transaction(
      poiOrders.map(({ id, orderIndex }) =>
        prisma.poi.update({
          where: { id, tourId }, // Дополнительная проверка принадлежности к туру
          data: { orderIndex },
        })
      )
    );
  }

  /**
   * Получить следующий доступный orderIndex для тура
   */
  static async getNextOrderIndex(tourId: string): Promise<number> {
    const lastPOI = await prisma.poi.findFirst({
      where: { tourId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    return lastPOI ? lastPOI.orderIndex + 1 : 0;
  }

  /**
   * Проверить существование POI
   */
  static async exists(id: string): Promise<boolean> {
    const poi = await prisma.poi.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!poi;
  }

  /**
   * Получить статистику POI
   */
  static async getStats(): Promise<{
    total: number;
    totalFree: number;
    totalPaid: number;
    averagePerTour: number;
  }> {
    const [total, totalFree, tourCount] = await Promise.all([
      prisma.poi.count(),
      prisma.poi.count({ where: { isFree: true } }),
      prisma.tour.count(),
    ]);

    return {
      total,
      totalFree,
      totalPaid: total - totalFree,
      averagePerTour: tourCount > 0 ? total / tourCount : 0,
    };
  }

  /**
   * Найти POI в радиусе от координат (для геолокационных функций)
   */
  static async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 1
  ): Promise<PrismaPOI[]> {
    // Простая реализация поиска по прямоугольной области
    // В продакшене лучше использовать PostGIS для точного расчета расстояний
    const latDelta = radiusKm / 111; // Примерно 1 градус = 111 км
    const lngDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    return await prisma.poi.findMany({
      where: {
        latitude: {
          gte: new Decimal(latitude - latDelta),
          lte: new Decimal(latitude + latDelta),
        },
        longitude: {
          gte: new Decimal(longitude - lngDelta),
          lte: new Decimal(longitude + lngDelta),
        },
      },
      orderBy: { orderIndex: 'asc' },
    });
  }
}