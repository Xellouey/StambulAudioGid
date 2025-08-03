import { z } from 'zod';
import { prisma } from './database';
import type { User as PrismaUser } from '@prisma/client';

// Zod схемы для валидации
export const CreateUserSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  platform: z.enum(['ios', 'android_gplay', 'android_rustore']).optional(),
});

export const UpdateUserSchema = z.object({
  platform: z.enum(['ios', 'android_gplay', 'android_rustore']).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export class UserModel {
  /**
   * Создать нового пользователя или получить существующего по deviceId
   */
  static async findOrCreate(data: CreateUserInput): Promise<PrismaUser> {
    const validatedData = CreateUserSchema.parse(data);
    
    // Сначала пытаемся найти существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { deviceId: validatedData.deviceId },
    });

    if (existingUser) {
      // Если пользователь существует, обновляем платформу если она изменилась
      if (validatedData.platform && existingUser.platform !== validatedData.platform) {
        return await prisma.user.update({
          where: { id: existingUser.id },
          data: { platform: validatedData.platform },
        });
      }
      return existingUser;
    }

    // Создаем нового пользователя
    return await prisma.user.create({
      data: validatedData,
    });
  }

  /**
   * Найти пользователя по ID
   */
  static async findById(id: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            tour: true,
          },
        },
      },
    });
  }

  /**
   * Найти пользователя по deviceId
   */
  static async findByDeviceId(deviceId: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { deviceId },
      include: {
        purchases: {
          include: {
            tour: true,
          },
        },
      },
    });
  }

  /**
   * Обновить пользователя
   */
  static async update(id: string, data: UpdateUserInput): Promise<PrismaUser> {
    const validatedData = UpdateUserSchema.parse(data);
    
    return await prisma.user.update({
      where: { id },
      data: validatedData,
    });
  }

  /**
   * Удалить пользователя
   */
  static async delete(id: string): Promise<PrismaUser> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Получить статистику пользователей
   */
  static async getStats(): Promise<{
    total: number;
    byPlatform: Record<string, number>;
    recentUsers: PrismaUser[];
  }> {
    const [total, users, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['platform'],
        _count: true,
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const byPlatform = users.reduce((acc, user) => {
      const platform = user.platform || 'unknown';
      acc[platform] = user._count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byPlatform,
      recentUsers,
    };
  }

  /**
   * Проверить, купил ли пользователь тур
   */
  static async hasPurchasedTour(userId: string, tourId: string): Promise<boolean> {
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        tourId,
      },
    });

    return !!purchase;
  }
}