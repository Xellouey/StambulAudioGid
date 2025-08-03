import {
  Tour,
  StrapiCollectionResponse,
  StrapiResponse,
} from '../../../shared/types';
import strapiApi from './strapiApi';

class TourService {
  // Get all tours
  async getTours(): Promise<StrapiCollectionResponse<Tour>> {
    return strapiApi.get<Tour>('/tours', {
      populate: ['main_image', 'main_audio'],
      sort: 'createdAt:desc',
    }) as Promise<StrapiCollectionResponse<Tour>>;
  }

  // Get tour details with POIs
  async getTourDetails(tourId: number): Promise<StrapiResponse<Tour>> {
    return strapiApi.get<Tour>(`/tours/${tourId}`, {
      populate: {
        main_image: true,
        main_audio: true,
        point_of_interests: {
          populate: ['audio'],
          sort: 'orderIndex:asc',
        },
      },
    }) as Promise<StrapiResponse<Tour>>;
  }

  // Search tours
  async searchTours(query: string): Promise<StrapiCollectionResponse<Tour>> {
    return strapiApi.get<Tour>('/tours', {
      filters: {
        $or: [
          { name: { $containsi: query } },
          { description: { $containsi: query } },
        ],
      },
      populate: ['main_image', 'main_audio'],
    }) as Promise<StrapiCollectionResponse<Tour>>;
  }

  // Get tours by attributes
  async getToursByAttributes(
    attributes: string[]
  ): Promise<StrapiCollectionResponse<Tour>> {
    return strapiApi.get<Tour>('/tours', {
      filters: {
        attributes_tags: {
          $in: attributes,
        },
      },
      populate: ['main_image', 'main_audio'],
    }) as Promise<StrapiCollectionResponse<Tour>>;
  }

  // Get tours in price range
  async getToursByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<StrapiCollectionResponse<Tour>> {
    return strapiApi.get<Tour>('/tours', {
      filters: {
        priceCents: {
          $gte: minPrice * 100,
          $lte: maxPrice * 100,
        },
      },
      populate: ['main_image', 'main_audio'],
    }) as Promise<StrapiCollectionResponse<Tour>>;
  }
}

export default new TourService();
