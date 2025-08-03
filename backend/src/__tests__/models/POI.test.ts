import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { POIModel, CreatePOIInput, UpdatePOIInput } from '../../models/POI';
import { prisma } from '../../models/database';
import { Decimal } from '@prisma/client/runtime/library';

// Mock Prisma client
jest.mock('../../models/database', () => ({
  prisma: {
    poi: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    tour: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('POIModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new POI successfully', async () => {
      const poiData: CreatePOIInput = {
        tourId: 'tour-123',
        title: 'Test POI',
        description: 'A test point of interest',
        latitude: 42.123456,
        longitude: -71.654321,
        isFree: true,
        orderIndex: 0,
        audioUrl: 'https://example.com/audio.mp3',
      };

      const expectedPOI = {
        id: 'poi-123',
        ...poiData,
        latitude: new Decimal(42.123456),
        longitude: new Decimal(-71.654321),
        createdAt: new Date(),
      };

      // Mock tour exists
      mockPrisma.tour.findUnique.mockResolvedValue({
        id: 'tour-123',
        title: 'Test Tour',
      });

      mockPrisma.poi.create.mockResolvedValue(expectedPOI);

      const result = await POIModel.create(poiData);

      expect(mockPrisma.tour.findUnique).toHaveBeenCalledWith({
        where: { id: poiData.tourId },
        select: { id: true },
      });

      expect(mockPrisma.poi.create).toHaveBeenCalledWith({
        data: {
          ...poiData,
          latitude: new Decimal(poiData.latitude),
          longitude: new Decimal(poiData.longitude),
        },
      });

      expect(result).toEqual(expectedPOI);
    });

    it('should throw error when tour does not exist', async () => {
      const poiData: CreatePOIInput = {
        tourId: 'non-existent-tour',
        title: 'Test POI',
        description: 'A test point of interest',
        latitude: 42.123456,
        longitude: -71.654321,
        isFree: true,
        orderIndex: 0,
      };

      mockPrisma.tour.findUnique.mockResolvedValue(null);

      await expect(POIModel.create(poiData)).rejects.toThrow('Tour not found');
    });

    it('should throw error for invalid coordinates', async () => {
      const invalidPOIData = {
        tourId: 'tour-123',
        title: 'Test POI',
        description: 'A test point of interest',
        latitude: 91, // Invalid latitude (> 90)
        longitude: -71.654321,
        isFree: true,
        orderIndex: 0,
      };

      await expect(POIModel.create(invalidPOIData as CreatePOIInput)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return POI when found', async () => {
      const poiId = 'poi-123';
      const expectedPOI = {
        id: poiId,
        tourId: 'tour-123',
        title: 'Test POI',
        description: 'A test point of interest',
        latitude: new Decimal(42.123456),
        longitude: new Decimal(-71.654321),
        isFree: true,
        orderIndex: 0,
        audioUrl: null,
        createdAt: new Date(),
      };

      mockPrisma.poi.findUnique.mockResolvedValue(expectedPOI);

      const result = await POIModel.findById(poiId);

      expect(mockPrisma.poi.findUnique).toHaveBeenCalledWith({
        where: { id: poiId },
      });
      expect(result).toEqual(expectedPOI);
    });

    it('should return null when POI not found', async () => {
      const poiId = 'non-existent-poi';

      mockPrisma.poi.findUnique.mockResolvedValue(null);

      const result = await POIModel.findById(poiId);

      expect(result).toBeNull();
    });
  });

  describe('findByTourId', () => {
    it('should return POIs ordered by orderIndex', async () => {
      const tourId = 'tour-123';
      const mockPOIs = [
        {
          id: 'poi-1',
          tourId,
          title: 'POI 1',
          orderIndex: 0,
        },
        {
          id: 'poi-2',
          tourId,
          title: 'POI 2',
          orderIndex: 1,
        },
      ];

      mockPrisma.poi.findMany.mockResolvedValue(mockPOIs);

      const result = await POIModel.findByTourId(tourId);

      expect(mockPrisma.poi.findMany).toHaveBeenCalledWith({
        where: { tourId },
        orderBy: { orderIndex: 'asc' },
      });
      expect(result).toEqual(mockPOIs);
    });
  });

  describe('findFreePOIsByTourId', () => {
    it('should return only free POIs for a tour', async () => {
      const tourId = 'tour-123';
      const mockFreePOIs = [
        {
          id: 'poi-1',
          tourId,
          title: 'Free POI 1',
          isFree: true,
          orderIndex: 0,
        },
        {
          id: 'poi-2',
          tourId,
          title: 'Free POI 2',
          isFree: true,
          orderIndex: 2,
        },
      ];

      mockPrisma.poi.findMany.mockResolvedValue(mockFreePOIs);

      const result = await POIModel.findFreePOIsByTourId(tourId);

      expect(mockPrisma.poi.findMany).toHaveBeenCalledWith({
        where: { 
          tourId,
          isFree: true,
        },
        orderBy: { orderIndex: 'asc' },
      });
      expect(result).toEqual(mockFreePOIs);
    });
  });

  describe('update', () => {
    it('should update POI successfully', async () => {
      const poiId = 'poi-123';
      const updateData: UpdatePOIInput = {
        title: 'Updated POI Title',
        latitude: 43.123456,
        longitude: -72.654321,
      };

      const updatedPOI = {
        id: poiId,
        title: 'Updated POI Title',
        latitude: new Decimal(43.123456),
        longitude: new Decimal(-72.654321),
      };

      mockPrisma.poi.update.mockResolvedValue(updatedPOI);

      const result = await POIModel.update(poiId, updateData);

      expect(mockPrisma.poi.update).toHaveBeenCalledWith({
        where: { id: poiId },
        data: {
          ...updateData,
          latitude: new Decimal(updateData.latitude!),
          longitude: new Decimal(updateData.longitude!),
        },
      });
      expect(result).toEqual(updatedPOI);
    });
  });

  describe('reorderPOIs', () => {
    it('should reorder POIs using transaction', async () => {
      const tourId = 'tour-123';
      const poiOrders = [
        { id: 'poi-1', orderIndex: 2 },
        { id: 'poi-2', orderIndex: 0 },
        { id: 'poi-3', orderIndex: 1 },
      ];

      mockPrisma.$transaction.mockResolvedValue([]);

      await POIModel.reorderPOIs(tourId, poiOrders);

      expect(mockPrisma.$transaction).toHaveBeenCalledWith([
        expect.objectContaining({
          where: { id: 'poi-1', tourId },
          data: { orderIndex: 2 },
        }),
        expect.objectContaining({
          where: { id: 'poi-2', tourId },
          data: { orderIndex: 0 },
        }),
        expect.objectContaining({
          where: { id: 'poi-3', tourId },
          data: { orderIndex: 1 },
        }),
      ]);
    });
  });

  describe('getNextOrderIndex', () => {
    it('should return 0 when no POIs exist for tour', async () => {
      const tourId = 'tour-123';

      mockPrisma.poi.findFirst.mockResolvedValue(null);

      const result = await POIModel.getNextOrderIndex(tourId);

      expect(mockPrisma.poi.findFirst).toHaveBeenCalledWith({
        where: { tourId },
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
      });
      expect(result).toBe(0);
    });

    it('should return next index when POIs exist', async () => {
      const tourId = 'tour-123';

      mockPrisma.poi.findFirst.mockResolvedValue({
        orderIndex: 2,
      });

      const result = await POIModel.getNextOrderIndex(tourId);

      expect(result).toBe(3);
    });
  });

  describe('findNearby', () => {
    it('should find POIs within radius', async () => {
      const latitude = 42.123456;
      const longitude = -71.654321;
      const radiusKm = 1;

      const mockNearbyPOIs = [
        {
          id: 'poi-1',
          title: 'Nearby POI 1',
          latitude: new Decimal(42.123),
          longitude: new Decimal(-71.654),
        },
      ];

      mockPrisma.poi.findMany.mockResolvedValue(mockNearbyPOIs);

      const result = await POIModel.findNearby(latitude, longitude, radiusKm);

      expect(mockPrisma.poi.findMany).toHaveBeenCalledWith({
        where: {
          latitude: {
            gte: expect.any(Decimal),
            lte: expect.any(Decimal),
          },
          longitude: {
            gte: expect.any(Decimal),
            lte: expect.any(Decimal),
          },
        },
        orderBy: { orderIndex: 'asc' },
      });
      expect(result).toEqual(mockNearbyPOIs);
    });
  });

  describe('deleteByTourId', () => {
    it('should delete all POIs for a tour', async () => {
      const tourId = 'tour-123';

      mockPrisma.poi.deleteMany.mockResolvedValue({ count: 3 });

      const result = await POIModel.deleteByTourId(tourId);

      expect(mockPrisma.poi.deleteMany).toHaveBeenCalledWith({
        where: { tourId },
      });
      expect(result).toEqual({ count: 3 });
    });
  });
});