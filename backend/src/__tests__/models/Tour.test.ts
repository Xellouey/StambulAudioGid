import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { TourModel, CreateTourInput, UpdateTourInput, TourFilters } from '../../models/Tour';
import { prisma } from '../../models/database';

// Mock Prisma client
jest.mock('../../models/database', () => ({
  prisma: {
    tour: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('TourModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new tour successfully', async () => {
      const tourData: CreateTourInput = {
        title: 'Test Tour',
        description: 'A test tour description',
        fullDescription: 'Full description of the test tour',
        priceCents: 1000,
        attributes: ['new'],
        durationMinutes: 60,
        distanceMeters: 2000,
      };

      const expectedTour = {
        id: 'tour-123',
        ...tourData,
        bannerUrl: null,
        audioDescriptionUrl: null,
        routeData: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        pois: [],
      };

      mockPrisma.tour.create.mockResolvedValue(expectedTour);

      const result = await TourModel.create(tourData);

      expect(mockPrisma.tour.create).toHaveBeenCalledWith({
        data: tourData,
        include: {
          pois: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      });
      expect(result).toEqual(expectedTour);
    });

    it('should throw error for invalid tour data', async () => {
      const invalidTourData = {
        title: '', // Empty title should fail validation
        description: 'Test description',
        priceCents: -100, // Negative price should fail validation
      };

      await expect(TourModel.create(invalidTourData as CreateTourInput)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return tour with POIs when found', async () => {
      const tourId = 'tour-123';
      const expectedTour = {
        id: tourId,
        title: 'Test Tour',
        description: 'Test description',
        fullDescription: null,
        bannerUrl: null,
        audioDescriptionUrl: null,
        durationMinutes: 60,
        distanceMeters: 2000,
        priceCents: 1000,
        attributes: ['new'],
        routeData: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        pois: [],
      };

      mockPrisma.tour.findUnique.mockResolvedValue(expectedTour);

      const result = await TourModel.findById(tourId);

      expect(mockPrisma.tour.findUnique).toHaveBeenCalledWith({
        where: { id: tourId },
        include: {
          pois: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      });
      expect(result).toEqual(expectedTour);
    });

    it('should return null when tour not found', async () => {
      const tourId = 'non-existent-tour';

      mockPrisma.tour.findUnique.mockResolvedValue(null);

      const result = await TourModel.findById(tourId);

      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should return paginated tours with default parameters', async () => {
      const mockTours = [
        {
          id: 'tour-1',
          title: 'Tour 1',
          description: 'Description 1',
          priceCents: 1000,
          attributes: ['new'],
          pois: [],
        },
        {
          id: 'tour-2',
          title: 'Tour 2',
          description: 'Description 2',
          priceCents: 2000,
          attributes: ['popular'],
          pois: [],
        },
      ];

      mockPrisma.tour.findMany.mockResolvedValue(mockTours);
      mockPrisma.tour.count.mockResolvedValue(2);

      const result = await TourModel.findMany();

      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          pois: {
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual({
        tours: mockTours,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter tours by search term', async () => {
      const filters: TourFilters = {
        search: 'test',
      };

      const mockTours = [
        {
          id: 'tour-1',
          title: 'Test Tour',
          description: 'A test tour',
          pois: [],
        },
      ];

      mockPrisma.tour.findMany.mockResolvedValue(mockTours);
      mockPrisma.tour.count.mockResolvedValue(1);

      const result = await TourModel.findMany(filters);

      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        include: {
          pois: {
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter tours by price range', async () => {
      const filters: TourFilters = {
        minPrice: 500,
        maxPrice: 1500,
      };

      mockPrisma.tour.findMany.mockResolvedValue([]);
      mockPrisma.tour.count.mockResolvedValue(0);

      await TourModel.findMany(filters);

      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith({
        where: {
          priceCents: {
            gte: 500,
            lte: 1500,
          },
        },
        include: {
          pois: {
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter tours by attributes', async () => {
      const filters: TourFilters = {
        attributes: ['new', 'popular'],
      };

      mockPrisma.tour.findMany.mockResolvedValue([]);
      mockPrisma.tour.count.mockResolvedValue(0);

      await TourModel.findMany(filters);

      expect(mockPrisma.tour.findMany).toHaveBeenCalledWith({
        where: {
          attributes: {
            array_contains: ['new', 'popular'],
          },
        },
        include: {
          pois: {
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('update', () => {
    it('should update tour successfully', async () => {
      const tourId = 'tour-123';
      const updateData: UpdateTourInput = {
        title: 'Updated Tour Title',
        priceCents: 1500,
      };

      const updatedTour = {
        id: tourId,
        title: 'Updated Tour Title',
        description: 'Original description',
        priceCents: 1500,
        pois: [],
      };

      mockPrisma.tour.update.mockResolvedValue(updatedTour);

      const result = await TourModel.update(tourId, updateData);

      expect(mockPrisma.tour.update).toHaveBeenCalledWith({
        where: { id: tourId },
        data: updateData,
        include: {
          pois: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      });
      expect(result).toEqual(updatedTour);
    });
  });

  describe('delete', () => {
    it('should delete tour successfully', async () => {
      const tourId = 'tour-123';
      const deletedTour = {
        id: tourId,
        title: 'Deleted Tour',
        description: 'This tour was deleted',
      };

      mockPrisma.tour.delete.mockResolvedValue(deletedTour);

      const result = await TourModel.delete(tourId);

      expect(mockPrisma.tour.delete).toHaveBeenCalledWith({
        where: { id: tourId },
      });
      expect(result).toEqual(deletedTour);
    });
  });

  describe('exists', () => {
    it('should return true when tour exists', async () => {
      const tourId = 'tour-123';

      mockPrisma.tour.findUnique.mockResolvedValue({
        id: tourId,
      });

      const result = await TourModel.exists(tourId);

      expect(mockPrisma.tour.findUnique).toHaveBeenCalledWith({
        where: { id: tourId },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it('should return false when tour does not exist', async () => {
      const tourId = 'non-existent-tour';

      mockPrisma.tour.findUnique.mockResolvedValue(null);

      const result = await TourModel.exists(tourId);

      expect(result).toBe(false);
    });
  });
});