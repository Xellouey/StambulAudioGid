import { z } from 'zod';
import { prisma } from './database';
import type { Purchase as PrismaPurchase, User as PrismaUser, Tour as PrismaTour } from '@prisma/client';

// Zod схемы для валидации
export const CreatePurchaseSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  tourId: z.string().uuid('Invalid tour ID'),
  platform: z.enum(['ios', 'android_gplay', 'android_rustore']),
  transactionId: z.string().optional(),
  receiptData: z.string().optional(),
  expiresAt: z.date().optional(),
});

export const UpdatePurchaseSchema = z.object({
  transactionId: z.string().optional(),
  receiptData: z.string().optional(),
  expiresAt: z.date().optional(),
});

export const PurchaseFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  tourId: z.string().uuid().optional(),
  platform: z.enum(['ios', 'android_gplay', 'android_rustore']).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

export type CreatePurchaseInput = z.infer<typeof CreatePurchaseSchema>;
export type UpdatePurchaseInput = z.infer<typeof UpdatePurchaseSchema>;
export type PurchaseFilters = z.infer<typeof PurchaseFiltersSchema>;

export type PurchaseWithRelations = PrismaPurchase & {
  user: PrismaUser;
  tour: PrismaTour;
};

export class PurchaseModel {
  /**
   * Создать новую покупку
   */
  static async create(data: CreatePurchaseInput): Promise<PurchaseWithRelations> {
    const validatedData = CreatePurchaseSchema.parse(data);
    
    // Проверяем существование пользователя и тура
    const [userExists, tourExists] = await Promise.all([
      prisma.user.findUnique({
        where: { id: validatedData.userId },
        select: { id: true },
      }),
      prisma.tour.findUnique({
        where: { id: validatedData.tourId },
        select: { id: true },
      }),
    ]);

    if (!userExists) {
      throw new Error('User not found');
    }
    if (!tourExists) {
      throw new Error('Tour not found');
    }

    // Проверяем, не существует ли уже покупка этого тура пользователем
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: validatedData.userId,
        tourId: validatedData.tourId,
      },
    });

    if (existingPurchase) {
      throw new Error('User has already purchased this tour');
    }

    return await prisma.purchase.create({
      data: validatedData,
      include: {
        user: true,
        tour: true,
      },
    });
  }

  /**
   * Найти покупку по ID
   */
  static async findById(id: string): Promise<PurchaseWithRelations | null> {
    return await prisma.purchase.findUnique({
      where: { id },
      include: {
        user: true,
        tour: true,
      },
    });
  }

  /**
   * Найти покупку по пользователю и туру
   */
  static async findByUserAndTour(userId: string, tourId: string): Promise<PrismaPurchase | null> {
    return await prisma.purchase.findFirst({
      where: {
        userId,
        tourId,
      },
    });
  }

  /**
   * Получить все покупки пользователя
   */
  static async findByUserId(userId: string): Promise<PurchaseWithRelations[]> {
    return await prisma.purchase.findMany({
      where: { userId },
      include: {
        user: true,
        tour: true,
      },
      orderBy: { purchasedAt: 'desc' },
    });
  }

  /**
   * Получить все покупки тура
   */
  static async findByTourId(tourId: string): Promise<PurchaseWithRelations[]> {
    return await prisma.purchase.findMany({
      where: { tourId },
      include: {
        user: true,
        tour: true,
      },
      orderBy: { purchasedAt: 'desc' },
    });
  }

  /**
   * Получить покупки с фильтрацией и пагинацией
   */
  static async findMany(
    filters: PurchaseFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<{
    purchases: PurchaseWithRelations[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const validatedFilters = PurchaseFiltersSchema.parse(filters);
    const skip = (page - 1) * limit;

    // Строим условия фильтрации
    const where: any = {};

    if (validatedFilters.userId) {
      where.userId = validatedFilters.userId;
    }

    if (validatedFilters.tourId) {
      where.tourId = validatedFilters.tourId;
    }

    if (validatedFilters.platform) {
      where.platform = validatedFilters.platform;
    }

    if (validatedFilters.dateFrom || validatedFilters.dateTo) {
      where.purchasedAt = {};
      if (validatedFilters.dateFrom) {
        where.purchasedAt.gte = validatedFilters.dateFrom;
      }
      if (validatedFilters.dateTo) {
        where.purchasedAt.lte = validatedFilters.dateTo;
      }
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        include: {
          user: true,
          tour: true,
        },
        orderBy: { purchasedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.purchase.count({ where }),
    ]);

    return {
      purchases,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Обновить покупку
   */
  static async update(id: string, data: UpdatePurchaseInput): Promise<PurchaseWithRelations> {
    const validatedData = UpdatePurchaseSchema.parse(data);
    
    return await prisma.purchase.update({
      where: { id },
      data: validatedData,
      include: {
        user: true,
        tour: true,
      },
    });
  }

  /**
   * Удалить покупку
   */
  static async delete(id: string): Promise<PrismaPurchase> {
    return await prisma.purchase.delete({
      where: { id },
    });
  }

  /**
   * Проверить, купил ли пользователь тур
   */
  static async hasPurchased(userId: string, tourId: string): Promise<boolean> {
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        tourId,
      },
      select: { id: true },
    });

    return !!purchase;
  }

  /**
   * Получить статистику покупок
   */
  static async getStats(): Promise<{
    total: number;
    totalRevenue: number;
    byPlatform: Record<string, number>;
    recentPurchases: PurchaseWithRelations[];
    topTours: { tourId: string; tourTitle: string; count: number }[];
  }> {
    const [total, purchases, recentPurchases, topTours] = await Promise.all([
      prisma.purchase.count(),
      prisma.purchase.findMany({
        include: { tour: { select: { priceCents: true } } },
      }),
      prisma.purchase.findMany({
        take: 10,
        orderBy: { purchasedAt: 'desc' },
        include: {
          user: true,
          tour: true,
        },
      }),
      prisma.purchase.groupBy({
        by: ['tourId'],
        _count: true,
        orderBy: { _count: { tourId: 'desc' } },
        take: 5,
      }),
    ]);

    // Подсчитываем общую выручку
    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.tour.priceCents, 0);

    // Группируем по платформам
    const byPlatform = purchases.reduce((acc, purchase) => {
      acc[purchase.platform] = (acc[purchase.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Получаем информацию о топ турах
    const topToursWithInfo = await Promise.all(
      topTours.map(async (item) => {
        const tour = await prisma.tour.findUnique({
          where: { id: item.tourId },
          select: { title: true },
        });
        return {
          tourId: item.tourId,
          tourTitle: tour?.title || 'Unknown',
          count: item._count,
        };
      })
    );

    return {
      total,
      totalRevenue,
      byPlatform,
      recentPurchases,
      topTours: topToursWithInfo,
    };
  }

  /**
   * Получить покупки, срок действия которых истекает
   */
  static async findExpiring(daysFromNow: number = 7): Promise<PurchaseWithRelations[]> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysFromNow);

    return await prisma.purchase.findMany({
      where: {
        expiresAt: {
          lte: expirationDate,
          gte: new Date(),
        },
      },
      include: {
        user: true,
        tour: true,
      },
      orderBy: { expiresAt: 'asc' },
    });
  }

  /**
   * Проверить валидность покупки (не истекла ли)
   */
  static async isValid(id: string): Promise<boolean> {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      select: { expiresAt: true },
    });

    if (!purchase) {
      return false;
    }

    // Если нет срока истечения, покупка действительна навсегда
    if (!purchase.expiresAt) {
      return true;
    }

    return purchase.expiresAt > new Date();
  }
}