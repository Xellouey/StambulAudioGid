import request from 'supertest';
import express from 'express';
import toursRoutes from '../../routes/tours.routes';
import { errorHandler } from '../../middleware/errorHandler';
import { TourModel } from '../../models/Tour';
import { prisma } from '../../models/database';

const app = express();
app.use(express.json());
app.use('/tours', toursRoutes);
app.use(errorHandler);

describe('Tours Routes Integration Tests', () => {
  let createdTourId: string;

  // Очистка базы данных перед каждым тестом
  beforeEach(async () => {
    await prisma.purchase.deleteMany();
    await prisma.poi.deleteMany();
    await prisma.tour.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /tours', () => {
    beforeEach(async () => {
      // Создаем тестовые туры
      await TourModel.create({
        title: 'Исторический центр Махачкалы',
        description: 'Познакомьтесь с историей столицы Дагестана',
        priceCents: 29900,
        attributes: ['popular']
      });

      await TourModel.create({
        title: 'Горы Дагестана',
        description: 'Путешествие по горным вершинам',
        priceCents: 49900,
        attributes: ['new']
      });
    });

    it('should return list of tours with pagination', async () => {
      const response = await request(app)
        .get('/tours')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          tours: expect.any(Array),
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });

      expect(response.body.data.tours).toHaveLength(2);
      expect(response.body.data.tours[0]).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        priceCents: expect.any(Number),
        attributes: expect.any(Array),
        pois: expect.any(Array)
      });
    });

    it('should filter tours by search query', async () => {
      const response = await request(app)
        .get('/tours?search=Махачкала')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(1);
      expect(response.body.data.tours[0].title).toContain('Махачкалы');
    });

    it('should filter tours by attributes', async () => {
      const response = await request(app)
        .get('/tours?attributes=popular')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(1);
      expect(response.body.data.tours[0].attributes).toContain('popular');
    });

    it('should filter tours by price range', async () => {
      const response = await request(app)
        .get('/tours?minPrice=30000&maxPrice=50000')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(1);
      expect(response.body.data.tours[0].priceCents).toBe(49900);
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/tours?page=1&limit=1')
        .expect(200);

      expect(response.body.data.tours).toHaveLength(1);
      expect(response.body.data.totalPages).toBe(2);
    });
  });

  describe('GET /tours/:id', () => {
    beforeEach(async () => {
      const tour = await TourModel.create({
        title: 'Тестовый тур',
        description: 'Описание тестового тура',
        priceCents: 19900
      });
      createdTourId = tour.id;
    });

    it('should return tour details for valid ID', async () => {
      const response = await request(app)
        .get(`/tours/${createdTourId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          tour: expect.objectContaining({
            id: createdTourId,
            title: 'Тестовый тур',
            description: 'Описание тестового тура',
            priceCents: 19900,
            pois: expect.any(Array)
          }),
          userAccess: expect.objectContaining({
            hasPurchased: false,
            freeAccessCount: 3
          })
        }
      });
    });

    it('should return 404 for non-existent tour', async () => {
      const response = await request(app)
        .get('/tours/non-existent-id')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: 'Tour not found'
        })
      });
    });

    it('should return 400 for empty tour ID', async () => {
      const response = await request(app)
        .get('/tours/ ')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('Validation error')
        })
      });
    });
  });

  describe('POST /tours', () => {
    it('should create tour with valid minimal data', async () => {
      const tourData = {
        title: 'Новый тур',
        description: 'Описание нового тура',
        priceCents: 29900
      };

      const response = await request(app)
        .post('/tours')
        .send(tourData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: expect.any(String),
          title: 'Новый тур',
          description: 'Описание нового тура',
          priceCents: 29900,
          attributes: [],
          pois: []
        }),
        message: 'Tour created successfully'
      });

      // Проверяем, что тур действительно создался в базе
      const createdTour = await TourModel.findById(response.body.data.id);
      expect(createdTour).toBeTruthy();
    });

    it('should create tour with full data', async () => {
      const tourData = {
        title: 'Полный тур',
        description: 'Краткое описание',
        fullDescription: 'Полное описание тура',
        bannerUrl: 'https://example.com/banner.jpg',
        audioDescriptionUrl: 'https://example.com/audio.mp3',
        durationMinutes: 120,
        distanceMeters: 5000,
        priceCents: 39900,
        attributes: ['new', 'popular'],
        routeData: {
          coordinates: [[42.9849, 47.5047], [42.9850, 47.5048]],
          bounds: {
            northeast: [42.9850, 47.5048],
            southwest: [42.9849, 47.5047]
          }
        }
      };

      const response = await request(app)
        .post('/tours')
        .send(tourData)
        .expect(201);

      expect(response.body.data).toMatchObject(tourData);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        title: 'Тур без описания'
        // отсутствует description
      };

      const response = await request(app)
        .post('/tours')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('Validation error')
        })
      });
    });

    it('should return 400 for invalid data types', async () => {
      const invalidData = {
        title: 'Тестовый тур',
        description: 'Описание',
        priceCents: 'invalid-price' // должно быть числом
      };

      const response = await request(app)
        .post('/tours')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('Validation error')
        })
      });
    });

    it('should return 400 for invalid URL formats', async () => {
      const invalidData = {
        title: 'Тестовый тур',
        description: 'Описание',
        priceCents: 29900,
        bannerUrl: 'invalid-url'
      };

      const response = await request(app)
        .post('/tours')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('Validation error')
        })
      });
    });

    it('should return 400 for invalid attributes', async () => {
      const invalidData = {
        title: 'Тестовый тур',
        description: 'Описание',
        priceCents: 29900,
        attributes: ['invalid-attribute']
      };

      const response = await request(app)
        .post('/tours')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('Validation error')
        })
      });
    });
  });

  describe('PUT /tours/:id', () => {
    beforeEach(async () => {
      const tour = await TourModel.create({
        title: 'Исходный тур',
        description: 'Исходное описание',
        priceCents: 19900
      });
      createdTourId = tour.id;
    });

    it('should update tour with valid data', async () => {
      const updateData = {
        title: 'Обновленный тур',
        description: 'Обновленное описание',
        priceCents: 39900
      };

      const response = await request(app)
        .put(`/tours/${createdTourId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.objectContaining({
          id: createdTourId,
          title: 'Обновленный тур',
          description: 'Обновленное описание',
          priceCents: 39900
        }),
        message: 'Tour updated successfully'
      });

      // Проверяем, что изменения сохранились в базе
      const updatedTour = await TourModel.findById(createdTourId);
      expect(updatedTour?.title).toBe('Обновленный тур');
    });

    it('should update only provided fields', async () => {
      const updateData = {
        title: 'Только новое название'
      };

      const response = await request(app)
        .put(`/tours/${createdTourId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe('Только новое название');
      expect(response.body.data.description).toBe('Исходное описание');
      expect(response.body.data.priceCents).toBe(19900);
    });

    it('should return 404 for non-existent tour', async () => {
      const updateData = {
        title: 'Обновление несуществующего тура'
      };

      const response = await request(app)
        .put('/tours/non-existent-id')
        .send(updateData)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: 'Tour not found'
        })
      });
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        priceCents: -100 // отрицательная цена
      };

      const response = await request(app)
        .put(`/tours/${createdTourId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('Validation error')
        })
      });
    });
  });

  describe('DELETE /tours/:id', () => {
    beforeEach(async () => {
      const tour = await TourModel.create({
        title: 'Тур для удаления',
        description: 'Этот тур будет удален',
        priceCents: 19900
      });
      createdTourId = tour.id;
    });

    it('should delete existing tour', async () => {
      const response = await request(app)
        .delete(`/tours/${createdTourId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Tour deleted successfully'
      });

      // Проверяем, что тур действительно удален
      const deletedTour = await TourModel.findById(createdTourId);
      expect(deletedTour).toBeNull();
    });

    it('should return 404 for non-existent tour', async () => {
      const response = await request(app)
        .delete('/tours/non-existent-id')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: 'Tour not found'
        })
      });
    });

    it('should return 400 for invalid tour ID format', async () => {
      const response = await request(app)
        .delete('/tours/ ')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('Validation error')
        })
      });
    });
  });

  describe('Error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Мокаем ошибку базы данных
      jest.spyOn(TourModel, 'findMany').mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .get('/tours')
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          message: expect.any(String)
        })
      });

      // Восстанавливаем оригинальную реализацию
      jest.restoreAllMocks();
    });
  });
});