import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Tour, StrapiResponse, StrapiError } from '../../../shared/types';

// Configuration
const API_BASE_URL = __DEV__
  ? 'http://localhost:8080/api'
  : 'https://your-production-domain.com/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging in development
    this.client.interceptors.request.use(
      config => {
        if (__DEV__) {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
        }
        return config;
      },
      error => {
        if (__DEV__) {
          console.error('❌ API Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (__DEV__) {
          console.log(
            `✅ API Response: ${response.status} ${response.config.url}`
          );
        }
        return response;
      },
      error => {
        if (__DEV__) {
          console.error(
            '❌ API Response Error:',
            error.response?.data || error.message
          );
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): StrapiError {
    if (error.response?.data?.error) {
      return error.response.data;
    }

    return {
      error: {
        status: error.response?.status || 500,
        name: 'NetworkError',
        message: error.message || 'Network request failed',
      },
    };
  }

  /**
   * Get all tours with basic information
   */
  async getTours(): Promise<Tour[]> {
    try {
      const response = await this.client.get<StrapiResponse<Tour[]>>('/tours', {
        params: {
          populate: ['main_image', 'main_audio'],
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      throw error;
    }
  }

  /**
   * Get detailed tour information including all POIs
   */
  async getTourDetails(tourId: number): Promise<Tour> {
    try {
      const response = await this.client.get<StrapiResponse<Tour>>(
        `/tours/${tourId}`,
        {
          params: {
            populate: {
              main_image: true,
              main_audio: true,
              point_of_interests: {
                populate: ['audio'],
                sort: ['orderIndex:asc'],
              },
            },
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch tour details for ID ${tourId}:`, error);
      throw error;
    }
  }

  /**
   * Get POI details by ID
   */
  async getPOIDetails(poiId: number) {
    try {
      const response = await this.client.get(`/point-of-interests/${poiId}`, {
        params: {
          populate: ['audio'],
        },
      });

      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch POI details for ID ${poiId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
