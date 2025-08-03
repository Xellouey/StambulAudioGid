import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { connectDatabase, disconnectDatabase, checkDatabaseHealth, prisma } from '../../models/database';

// Mock Prisma client
jest.mock('../../models/database', () => {
  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $queryRaw: jest.fn(),
  };

  return {
    prisma: mockPrisma,
    connectDatabase: jest.fn(),
    disconnectDatabase: jest.fn(),
    checkDatabaseHealth: jest.fn(),
  };
});

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockConnectDatabase = connectDatabase as jest.MockedFunction<typeof connectDatabase>;
const mockDisconnectDatabase = disconnectDatabase as jest.MockedFunction<typeof disconnectDatabase>;
const mockCheckDatabaseHealth = checkDatabaseHealth as jest.MockedFunction<typeof checkDatabaseHealth>;

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console mocks
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('connectDatabase', () => {
    it('should connect to database successfully', async () => {
      mockPrisma.$connect.mockResolvedValue(undefined);
      mockConnectDatabase.mockImplementation(async () => {
        await mockPrisma.$connect();
        console.log('✅ Database connected successfully');
      });

      await connectDatabase();

      expect(mockPrisma.$connect).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('✅ Database connected successfully');
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockPrisma.$connect.mockRejectedValue(error);
      mockConnectDatabase.mockImplementation(async () => {
        try {
          await mockPrisma.$connect();
        } catch (err) {
          console.error('❌ Database connection failed:', err);
          throw err;
        }
      });

      await expect(connectDatabase()).rejects.toThrow('Connection failed');
      expect(console.error).toHaveBeenCalledWith('❌ Database connection failed:', error);
    });
  });

  describe('disconnectDatabase', () => {
    it('should disconnect from database successfully', async () => {
      mockPrisma.$disconnect.mockResolvedValue(undefined);
      mockDisconnectDatabase.mockImplementation(async () => {
        await mockPrisma.$disconnect();
        console.log('✅ Database disconnected successfully');
      });

      await disconnectDatabase();

      expect(mockPrisma.$disconnect).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('✅ Database disconnected successfully');
    });

    it('should handle disconnection errors', async () => {
      const error = new Error('Disconnection failed');
      mockPrisma.$disconnect.mockRejectedValue(error);
      mockDisconnectDatabase.mockImplementation(async () => {
        try {
          await mockPrisma.$disconnect();
        } catch (err) {
          console.error('❌ Database disconnection failed:', err);
          throw err;
        }
      });

      await expect(disconnectDatabase()).rejects.toThrow('Disconnection failed');
      expect(console.error).toHaveBeenCalledWith('❌ Database disconnection failed:', error);
    });
  });

  describe('checkDatabaseHealth', () => {
    it('should return true when database is healthy', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
      mockCheckDatabaseHealth.mockImplementation(async () => {
        try {
          await mockPrisma.$queryRaw`SELECT 1`;
          return true;
        } catch (error) {
          console.error('❌ Database health check failed:', error);
          return false;
        }
      });

      const result = await checkDatabaseHealth();

      expect(mockPrisma.$queryRaw).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when database is unhealthy', async () => {
      const error = new Error('Health check failed');
      mockPrisma.$queryRaw.mockRejectedValue(error);
      mockCheckDatabaseHealth.mockImplementation(async () => {
        try {
          await mockPrisma.$queryRaw`SELECT 1`;
          return true;
        } catch (err) {
          console.error('❌ Database health check failed:', err);
          return false;
        }
      });

      const result = await checkDatabaseHealth();

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('❌ Database health check failed:', error);
    });
  });
});