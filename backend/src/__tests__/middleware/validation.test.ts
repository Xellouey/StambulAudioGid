import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../middleware/validation';
import { ApiError } from '../../middleware/errorHandler';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {}
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should validate request body successfully', () => {
    const schema = {
      body: z.object({
        name: z.string(),
        age: z.number()
      })
    };

    mockRequest.body = { name: 'John', age: 25 };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRequest.body).toEqual({ name: 'John', age: 25 });
  });

  it('should validate request query successfully', () => {
    const schema = {
      query: z.object({
        page: z.string().transform(val => parseInt(val)),
        limit: z.string().transform(val => parseInt(val))
      })
    };

    mockRequest.query = { page: '1', limit: '10' };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRequest.query).toEqual({ page: 1, limit: 10 });
  });

  it('should validate request params successfully', () => {
    const schema = {
      params: z.object({
        id: z.string().uuid()
      })
    };

    mockRequest.params = { id: '123e4567-e89b-12d3-a456-426614174000' };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should handle validation errors', () => {
    const schema = {
      body: z.object({
        name: z.string(),
        age: z.number()
      })
    };

    mockRequest.body = { name: 'John', age: 'invalid' };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Validation error'),
        statusCode: 400
      })
    );
  });

  it('should handle missing required fields', () => {
    const schema = {
      body: z.object({
        name: z.string(),
        age: z.number()
      })
    };

    mockRequest.body = { name: 'John' }; // missing age

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('age'),
        statusCode: 400
      })
    );
  });
});