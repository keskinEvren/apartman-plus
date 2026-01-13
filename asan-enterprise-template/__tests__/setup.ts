/**
 * Test Setup
 * Runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests
  // log: jest.fn(),
  // Keep error and warn
  error: console.error,
  warn: console.warn,
};
