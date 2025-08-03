import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  StrapiResponse,
  StrapiCollectionResponse,
  StrapiError,
} from '../../../shared/types';

class StrapiApi {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: __DEV__
        ? 'http://localhost:1337/api'
        : 'https://your-production-url.com/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      config => {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      error => {
        console.error(
          'API Response Error:',
          error.response?.data || error.message
        );

        if (error.response?.status === 404) {
          throw new Error('Ресурс не найден');
        } else if (error.response?.status >= 500) {
          throw new Error('Ошибка сервера');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Превышено время ожидания');
        } else if (!error.response) {
          throw new Error('Нет соединения с сервером');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  async get<T>(
    endpoint: string,
    params?: any
  ): Promise<StrapiResponse<T> | StrapiCollectionResponse<T>> {
    const response = await this.api.get(endpoint, { params });
    return response.data;
  }

  // Generic POST method
  async post<T>(endpoint: string, data?: any): Promise<StrapiResponse<T>> {
    const response = await this.api.post(endpoint, data);
    return response.data;
  }

  // Generic PUT method
  async put<T>(endpoint: string, data?: any): Promise<StrapiResponse<T>> {
    const response = await this.api.put(endpoint, data);
    return response.data;
  }

  // Generic DELETE method
  async delete<T>(endpoint: string): Promise<StrapiResponse<T>> {
    const response = await this.api.delete(endpoint);
    return response.data;
  }

  // Set authorization token
  setAuthToken(token: string) {
    this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  // Remove authorization token
  removeAuthToken() {
    delete this.api.defaults.headers.common.Authorization;
  }
}

export default new StrapiApi();
