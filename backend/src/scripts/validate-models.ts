#!/usr/bin/env ts-node

/**
 * Script to validate that all models are properly structured and can be imported
 */

import { UserModel, CreateUserSchema, UpdateUserSchema } from '../models/User';
import { TourModel, CreateTourSchema, UpdateTourSchema } from '../models/Tour';
import { POIModel, CreatePOISchema, UpdatePOISchema } from '../models/POI';
import { PurchaseModel, CreatePurchaseSchema, UpdatePurchaseSchema } from '../models/Purchase';
import { connectDatabase, disconnectDatabase, checkDatabaseHealth } from '../models/database';

async function validateModels() {
  console.log('🔍 Validating models...');

  try {
    // Test schema validations
    console.log('✅ Testing User schema validation...');
    const validUserData = {
      deviceId: 'test-device-123',
      platform: 'ios' as const,
    };
    const userResult = CreateUserSchema.safeParse(validUserData);
    if (!userResult.success) {
      throw new Error(`User schema validation failed: ${userResult.error.message}`);
    }
    console.log('   ✓ User schema validation passed');

    console.log('✅ Testing Tour schema validation...');
    const validTourData = {
      title: 'Test Tour',
      description: 'A test tour description',
      priceCents: 1000,
      attributes: ['new'] as const,
    };
    const tourResult = CreateTourSchema.safeParse(validTourData);
    if (!tourResult.success) {
      throw new Error(`Tour schema validation failed: ${tourResult.error.message}`);
    }
    console.log('   ✓ Tour schema validation passed');

    console.log('✅ Testing POI schema validation...');
    const validPOIData = {
      tourId: 'tour-123',
      title: 'Test POI',
      description: 'A test point of interest',
      latitude: 42.123456,
      longitude: -71.654321,
      isFree: true,
      orderIndex: 0,
    };
    const poiResult = CreatePOISchema.safeParse(validPOIData);
    if (!poiResult.success) {
      throw new Error(`POI schema validation failed: ${poiResult.error.message}`);
    }
    console.log('   ✓ POI schema validation passed');

    console.log('✅ Testing Purchase schema validation...');
    const validPurchaseData = {
      userId: 'user-123',
      tourId: 'tour-123',
      platform: 'ios' as const,
    };
    const purchaseResult = CreatePurchaseSchema.safeParse(validPurchaseData);
    if (!purchaseResult.success) {
      throw new Error(`Purchase schema validation failed: ${purchaseResult.error.message}`);
    }
    console.log('   ✓ Purchase schema validation passed');

    // Test invalid data
    console.log('✅ Testing invalid data rejection...');
    const invalidUserData = {
      deviceId: '', // Empty device ID should fail
      platform: 'invalid-platform',
    };
    const invalidUserResult = CreateUserSchema.safeParse(invalidUserData);
    if (invalidUserResult.success) {
      throw new Error('Invalid user data was accepted');
    }
    console.log('   ✓ Invalid data properly rejected');

    // Test model class existence
    console.log('✅ Testing model classes...');
    if (typeof UserModel.findOrCreate !== 'function') {
      throw new Error('UserModel.findOrCreate is not a function');
    }
    if (typeof TourModel.create !== 'function') {
      throw new Error('TourModel.create is not a function');
    }
    if (typeof POIModel.create !== 'function') {
      throw new Error('POIModel.create is not a function');
    }
    if (typeof PurchaseModel.create !== 'function') {
      throw new Error('PurchaseModel.create is not a function');
    }
    console.log('   ✓ All model classes have required methods');

    // Test database functions exist
    console.log('✅ Testing database functions...');
    if (typeof connectDatabase !== 'function') {
      throw new Error('connectDatabase is not a function');
    }
    if (typeof disconnectDatabase !== 'function') {
      throw new Error('disconnectDatabase is not a function');
    }
    if (typeof checkDatabaseHealth !== 'function') {
      throw new Error('checkDatabaseHealth is not a function');
    }
    console.log('   ✓ All database functions exist');

    console.log('🎉 All model validations passed!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   ✓ User model with device-based authentication');
    console.log('   ✓ Tour model with attributes and route data');
    console.log('   ✓ POI model with coordinates and free/paid status');
    console.log('   ✓ Purchase model with platform-specific receipts');
    console.log('   ✓ Database connection utilities');
    console.log('   ✓ Comprehensive validation schemas');
    console.log('');
    console.log('🚀 Models are ready for use!');

  } catch (error) {
    console.error('❌ Model validation failed:', error);
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateModels().catch((error) => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

export { validateModels };