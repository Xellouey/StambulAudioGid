# Dagestan Audio Guide Backend

## Task 2.1 Implementation: Создание основного API сервера и middleware

### ✅ Completed Features

#### 1. Express.js Server with Basic Route Structure
- Main server setup in `src/index.ts`
- Graceful shutdown handling
- Health check endpoint at `/health`
- API base endpoint at `/api`

#### 2. Middleware Implementation

**CORS Middleware (`src/middleware/cors.ts`)**
- Environment-specific origin configuration
- Credentials support
- Proper headers and methods configuration

**Logger Middleware (`src/middleware/logger.ts`)**
- Morgan-based logging with custom format
- Sensitive data redaction (passwords, tokens, receipts)
- Different formats for development and production

**Error Handler Middleware (`src/middleware/errorHandler.ts`)**
- Custom `ApiError` class for operational errors
- Comprehensive error response formatting
- Stack trace inclusion in development mode
- 404 handler for non-existent routes

**Validation Middleware (`src/middleware/validation.ts`)**
- Zod-based request validation
- Support for body, query, and params validation
- Detailed error messages for validation failures

#### 3. Controllers Implementation

**Tours Controller (`src/controllers/tours.controller.ts`)**
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour by ID
- `POST /api/tours` - Create new tour (admin)
- `PUT /api/tours/:id` - Update tour (admin)
- `DELETE /api/tours/:id` - Delete tour (admin)

**Users Controller (`src/controllers/users.controller.ts`)**
- `POST /api/users/register` - Register user/device
- `GET /api/users/:deviceId` - Get user by device ID
- `GET /api/users/:deviceId/purchases` - Get user purchases
- `POST /api/users/admin/login` - Admin authentication

**Payments Controller (`src/controllers/payments.controller.ts`)**
- `POST /api/payments/purchase` - Process purchase
- `GET /api/payments/status/:transactionId` - Get payment status
- `POST /api/payments/restore` - Restore purchases
- Platform-specific receipt validation (iOS, Android, RuStore)

#### 4. Routes with Validation

**Tours Routes (`src/routes/tours.routes.ts`)**
- Zod schemas for tour creation and updates
- Parameter validation for tour IDs
- Comprehensive input validation

**Users Routes (`src/routes/users.routes.ts`)**
- Device registration validation
- Admin login validation
- Platform enum validation

**Payments Routes (`src/routes/payments.routes.ts`)**
- Purchase request validation
- Platform-specific validation
- Transaction ID validation

#### 5. Unit Tests

**Middleware Tests**
- Error handler testing with different error types
- Validation middleware testing with valid/invalid data
- Environment-specific behavior testing

**Controller Tests**
- Tours controller CRUD operations testing
- Error handling and edge cases
- Response format validation

**Route Tests**
- Integration testing with supertest
- Request/response validation
- Error handling at route level

### 🏗️ Architecture

```
backend/src/
├── index.ts                 # Main server entry point
├── middleware/              # Custom middleware
│   ├── cors.ts             # CORS configuration
│   ├── logger.ts           # Request logging
│   ├── errorHandler.ts     # Error handling
│   ├── validation.ts       # Request validation
│   └── index.ts            # Middleware exports
├── controllers/             # Business logic
│   ├── tours.controller.ts # Tours CRUD operations
│   ├── users.controller.ts # User management
│   ├── payments.controller.ts # Payment processing
│   └── index.ts            # Controller exports
├── routes/                  # API routes
│   ├── tours.routes.ts     # Tours endpoints
│   ├── users.routes.ts     # Users endpoints
│   ├── payments.routes.ts  # Payments endpoints
│   └── index.ts            # Route aggregation
└── __tests__/              # Test files
    ├── middleware/         # Middleware tests
    ├── controllers/        # Controller tests
    └── routes/             # Route tests
```

### 🔧 Requirements Fulfilled

- ✅ **5.1**: Web admin panel API endpoints implemented
- ✅ **5.2**: Tour management and user authentication endpoints

### 🚀 Next Steps

This implementation provides the foundation for:
1. Database integration (Task 2.2)
2. Tour management service (Task 2.3)
3. File processing for KML/GPX routes
4. Payment system integration
5. Authentication and authorization

### 🧪 Testing

Run the structure validation:
```bash
node validate-structure.js
```

The implementation includes comprehensive unit tests for all middleware and controllers, ensuring reliability and maintainability.