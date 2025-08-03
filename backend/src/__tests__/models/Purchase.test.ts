import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PurchaseModel, CreatePurchaseInput, PurchaseFilters } from '../../models/Purchase';
import { prisma } from '../../models/database';

// Mock Prisma client
jest.mock('../../models/database', () => ({
  prisma: {
    purchase: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    tour: {
      findUnique: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('PurchaseModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new purchase successfully', async () => {
      const purchaseData: CreatePurchaseInput = {
        userId: 'user-123',
        tourId: 'tour-123',
        platform: 'ios',
        transactionId: 'tx-123',
        receiptData: 'receipt-data',
      };

      const expectedPurchase = {
        id: 'purchase-123',
        ...purchaseData,
        purchasedAt: new Date(),
        expiresAt: null,
        user: {
          id: 'user-123',
          deviceId: 'device-123',
          platform: 'ios',
          createdAt: new Date(),
        },
        tour: {
          id: 'tour-123',
          title: 'Test Tour',
          description: 'Test description',
          priceCents: 1000,
        },
      };

      // Mock user and tour exist
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        deviceId: 'device-123',
        platform: 'ios',
        createdAt: new Date(),
      });

      mockPrisma.tour.findUnique.mockResolvedValue({
        id: 'tour-123',
        title: 'Test Tour',
      });

      // Mock no existing purchase
      mockPrisma.purchase.findFirst.mockResolvedValue(null);

      mockPrisma.purchase.create.mockResolvedValue(expectedPurchase);

      const result = await PurchaseModel.create(purchaseData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: purchaseData.userId },
        select: { id: true },
      });

      expect(mockPrisma.tour.findUnique).toHaveBeenCalledWith({
        where: { id: purchaseData.tourId },
        select: { id: true },
      });

      expect(mockPrisma.purchase.findFirst).toHaveBeenCalledWith({
        where: {
          userId: purchaseData.userId,
          tourId: purchaseData.tourId,
        },
      });

      expect(mockPrisma.purchase.create).toHaveBeenCalledWith({
        data: purchaseData,
        include: {
          user: true,
          tour: true,
        },
      });

      expect(result).toEqual(expectedPurchase);
    });

    it('should throw error when user does not exist', async () => {
      const purchaseData: CreatePurchaseInput = {
        userId: 'non-existent-user',
        tourId: 'tour-123',
        platform: 'ios',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.tour.findUnique.mockResolvedValue({ id: 'tour-123' });

      await expect(PurchaseModel.create(purchaseData)).rejects.toThrow('User not found');
    });

    it('should throw error when tour does not exist', async () => {
      const purchaseData: CreatePurchaseInput = {
        userId: 'user-123',
        tourId: 'non-existent-tour',
        platform: 'ios',
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-123' });
      mockPrisma.tour.findUnique.mockResolvedValue(null);

      await expect(PurchaseModel.create(purchaseData)).rejects.toThrow('Tour not found');
    });

    it('should throw error when user already purchased the tour', async () => {
      const purchaseData: CreatePurchaseInput = {
        userId: 'user-123',
        tourId: 'tour-123',
        platform: 'ios',
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-123' });
      mockPrisma.tour.findUnique.mockResolvedValue({ id: 'tour-123' });
      mockPrisma.purchase.findFirst.mockResolvedValue({
        id: 'existing-purchase',
        userId: 'user-123',
        tourId: 'tour-123',
        platform: 'ios',
        transactionId: null,
        receiptData: null,
        purchasedAt: new Date(),
        expiresAt: null,
      });

      await expect(PurchaseModel.create(purchaseData)).rejects.toThrow('User has already purchased this tour');
    });
  });

  describe('findById', () => {
    it('should return purchase with relations when found', async () => {
      const purchaseId = 'purchase-123';
      const expectedPurchase = {
        id: purchaseId,
        userId: 'user-123',
        tourId: 'tour-123',
        platform: 'ios',
        transactionId: 'tx-123',
        receiptData: null,
        purchasedAt: new Date(),
        expiresAt: null,
        user: {
          id: 'user-123',
          deviceId: 'device-123',
          platform: 'ios',
          createdAt: new Date(),
        },
        tour: {
          id: 'tour-123',
          title: 'Test Tour',
          description: 'Test description',
        },
      };

      mockPrisma.purchase.findUnique.mockResolvedValue(expectedPurchase);

      const result = await PurchaseModel.findById(purchaseId);

      expect(mockPrisma.purchase.findUnique).toHaveBeenCalledWith({
        where: { id: purchaseId },
        include: {
          user: true,
          tour: true,
        },
      });
      expect(result).toEqual(expectedPurchase);
    });

    it('should return null when purchase not found', async () => {
      const purchaseId = 'non-existent-purchase';

      mockPrisma.purchase.findUnique.mockResolvedValue(null);

      const result = await PurchaseModel.findById(purchaseId);

      expect(result).toBeNull();
    });
  });

  describe('findByUserAndTour', () => {
    it('should return purchase when found', async () => {
      const userId = 'user-123';
      const tourId = 'tour-123';
      const expectedPurchase = {
        id: 'purchase-123',
        userId,
        tourId,
        platform: 'ios',
        transactionId: 'tx-123',
        receiptData: null,
        purchasedAt: new Date(),
        expiresAt: null,
      };

      mockPrisma.purchase.findFirst.mockResolvedValue(expectedPurchase);

      const result = await PurchaseModel.findByUserAndTour(userId, tourId);

      expect(mockPrisma.purchase.findFirst).toHaveBeenCalledWith({
        where: { userId, tourId },
      });
      expect(result).toEqual(expectedPurchase);
    });
  });

  describe('findMany', () => {
    it('should return paginated purchases with default parameters', async () => {
      const mockPurchases = [
        {
          id: 'purchase-1',
          userId: 'user-1',
          tourId: 'tour-1',
          platform: 'ios',
          user: { id: 'user-1' },
          tour: { id: 'tour-1' },
        },
        {
          id: 'purchase-2',
          userId: 'user-2',
          tourId: 'tour-2',
          platform: 'android_gplay',
          user: { id: 'user-2' },
          tour: { id: 'tour-2' },
        },
      ];

      mockPrisma.purchase.findMany.mockResolvedValue(mockPurchases);
      mockPrisma.purchase.count.mockResolvedValue(2);

      const result = await PurchaseModel.findMany();

      expect(mockPrisma.purchase.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          user: true,
          tour: true,
        },
        orderBy: { purchasedAt: 'desc' },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        purchases: mockPurchases,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter purchases by platform', async () => {
      const filters: PurchaseFilters = {
        platform: 'ios',
      };

      mockPrisma.purchase.findMany.mockResolvedValue([]);
      mockPrisma.purchase.count.mockResolvedValue(0);

      await PurchaseModel.findMany(filters);

      expect(mockPrisma.purchase.findMany).toHaveBeenCalledWith({
        where: { platform: 'ios' },
        include: {
          user: true,
          tour: true,
        },
        orderBy: { purchasedAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter purchases by date range', async () => {
      const dateFrom = new Date('2024-01-01');
      const dateTo = new Date('2024-12-31');
      const filters: PurchaseFilters = {
        dateFrom,
        dateTo,
      };

      mockPrisma.purchase.findMany.mockResolvedValue([]);
      mockPrisma.purchase.count.mockResolvedValue(0);

      await PurchaseModel.findMany(filters);

      expect(mockPrisma.purchase.findMany).toHaveBeenCalledWith({
        where: {
          purchasedAt: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
        include: {
          user: true,
          tour: true,
        },
        orderBy: { purchasedAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('hasPurchased', () => {
    it('should return true when user has purchased the tour', async () => {
      const userId = 'user-123';
      const tourId = 'tour-123';

      mockPrisma.purchase.findFirst.mockResolvedValue({
        id: 'purchase-123',
      });

      const result = await PurchaseModel.hasPurchased(userId, tourId);

      expect(mockPrisma.purchase.findFirst).toHaveBeenCalledWith({
        where: { userId, tourId },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it('should return false when user has not purchased the tour', async () => {
      const userId = 'user-123';
      const tourId = 'tour-123';

      mockPrisma.purchase.findFirst.mockResolvedValue(null);

      const result = await PurchaseModel.hasPurchased(userId, tourId);

      expect(result).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should return true for purchase without expiration', async () => {
      const purchaseId = 'purchase-123';

      mockPrisma.purchase.findUnique.mockResolvedValue({
        expiresAt: null,
      });

      const result = await PurchaseModel.isValid(purchaseId);

      expect(result).toBe(true);
    });

    it('should return true for purchase not yet expired', async () => {
      const purchaseId = 'purchase-123';
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      mockPrisma.purchase.findUnique.mockResolvedValue({
        expiresAt: futureDate,
      });

      const result = await PurchaseModel.isValid(purchaseId);

      expect(result).toBe(true);
    });

    it('should return false for expired purchase', async () => {
      const purchaseId = 'purchase-123';
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      mockPrisma.purchase.findUnique.mockResolvedValue({
        expiresAt: pastDate,
      });

      const result = await PurchaseModel.isValid(purchaseId);

      expect(result).toBe(false);
    });

    it('should return false for non-existent purchase', async () => {
      const purchaseId = 'non-existent-purchase';

      mockPrisma.purchase.findUnique.mockResolvedValue(null);

      const result = await PurchaseModel.isValid(purchaseId);

      expect(result).toBe(false);
    });
  });

  describe('findExpiring', () => {
    it('should return purchases expiring within specified days', async () => {
      const daysFromNow = 7;
      const mockExpiringPurchases = [
        {
          id: 'purchase-1',
          expiresAt: new Date(),
          user: { id: 'user-1' },
          tour: { id: 'tour-1' },
        },
      ];

      mockPrisma.purchase.findMany.mockResolvedValue(mockExpiringPurchases);

      const result = await PurchaseModel.findExpiring(daysFromNow);

      expect(mockPrisma.purchase.findMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lte: expect.any(Date),
            gte: expect.any(Date),
          },
        },
        include: {
          user: true,
          tour: true,
        },
        orderBy: { expiresAt: 'asc' },
      });
      expect(result).toEqual(mockExpiringPurchases);
    });
  });
});