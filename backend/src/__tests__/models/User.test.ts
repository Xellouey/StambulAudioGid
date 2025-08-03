import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { UserModel, CreateUserInput, UpdateUserInput } from '../../models/User';
import { prisma } from '../../models/database';

// Mock Prisma client
jest.mock('../../models/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    purchase: {
      findFirst: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('UserModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreate', () => {
    it('should create a new user when deviceId does not exist', async () => {
      const userData: CreateUserInput = {
        deviceId: 'test-device-123',
        platform: 'ios',
      };

      const expectedUser = {
        id: 'user-123',
        deviceId: 'test-device-123',
        platform: 'ios',
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(expectedUser);

      const result = await UserModel.findOrCreate(userData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { deviceId: userData.deviceId },
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: userData,
      });
      expect(result).toEqual(expectedUser);
    });

    it('should return existing user when deviceId exists and platform matches', async () => {
      const userData: CreateUserInput = {
        deviceId: 'test-device-123',
        platform: 'ios',
      };

      const existingUser = {
        id: 'user-123',
        deviceId: 'test-device-123',
        platform: 'ios',
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      const result = await UserModel.findOrCreate(userData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { deviceId: userData.deviceId },
      });
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });

    it('should update existing user when platform changes', async () => {
      const userData: CreateUserInput = {
        deviceId: 'test-device-123',
        platform: 'android_gplay',
      };

      const existingUser = {
        id: 'user-123',
        deviceId: 'test-device-123',
        platform: 'ios',
        createdAt: new Date(),
      };

      const updatedUser = {
        ...existingUser,
        platform: 'android_gplay',
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await UserModel.findOrCreate(userData);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: existingUser.id },
        data: { platform: userData.platform },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error for invalid deviceId', async () => {
      const userData = {
        deviceId: '',
        platform: 'ios' as const,
      };

      await expect(UserModel.findOrCreate(userData)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return user with purchases when found', async () => {
      const userId = 'user-123';
      const expectedUser = {
        id: userId,
        deviceId: 'test-device-123',
        platform: 'ios',
        createdAt: new Date(),
        purchases: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue(expectedUser);

      const result = await UserModel.findById(userId);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          purchases: {
            include: {
              tour: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found', async () => {
      const userId = 'non-existent-user';

      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await UserModel.findById(userId);

      expect(result).toBeNull();
    });
  });

  describe('findByDeviceId', () => {
    it('should return user when found by deviceId', async () => {
      const deviceId = 'test-device-123';
      const expectedUser = {
        id: 'user-123',
        deviceId,
        platform: 'ios',
        createdAt: new Date(),
        purchases: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue(expectedUser);

      const result = await UserModel.findByDeviceId(deviceId);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { deviceId },
        include: {
          purchases: {
            include: {
              tour: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const userId = 'user-123';
      const updateData: UpdateUserInput = {
        platform: 'android_rustore',
      };

      const updatedUser = {
        id: userId,
        deviceId: 'test-device-123',
        platform: 'android_rustore',
        createdAt: new Date(),
      };

      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await UserModel.update(userId, updateData);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('hasPurchasedTour', () => {
    it('should return true when user has purchased the tour', async () => {
      const userId = 'user-123';
      const tourId = 'tour-123';

      mockPrisma.purchase.findFirst.mockResolvedValue({
        id: 'purchase-123',
        userId,
        tourId,
        platform: 'ios',
        transactionId: 'tx-123',
        receiptData: null,
        purchasedAt: new Date(),
        expiresAt: null,
      });

      const result = await UserModel.hasPurchasedTour(userId, tourId);

      expect(mockPrisma.purchase.findFirst).toHaveBeenCalledWith({
        where: { userId, tourId },
      });
      expect(result).toBe(true);
    });

    it('should return false when user has not purchased the tour', async () => {
      const userId = 'user-123';
      const tourId = 'tour-123';

      mockPrisma.purchase.findFirst.mockResolvedValue(null);

      const result = await UserModel.hasPurchasedTour(userId, tourId);

      expect(result).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return user statistics', async () => {
      const mockUsers = [
        { platform: 'ios', _count: 10 },
        { platform: 'android_gplay', _count: 15 },
        { platform: null, _count: 5 },
      ];

      const mockRecentUsers = [
        {
          id: 'user-1',
          deviceId: 'device-1',
          platform: 'ios',
          createdAt: new Date(),
        },
      ];

      mockPrisma.user.count.mockResolvedValue(30);
      mockPrisma.user.groupBy.mockResolvedValue(mockUsers);
      mockPrisma.user.findMany.mockResolvedValue(mockRecentUsers);

      const result = await UserModel.getStats();

      expect(result).toEqual({
        total: 30,
        byPlatform: {
          ios: 10,
          android_gplay: 15,
          unknown: 5,
        },
        recentUsers: mockRecentUsers,
      });
    });
  });
});