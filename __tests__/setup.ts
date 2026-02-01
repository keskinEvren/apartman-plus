/**
 * Test Setup
 * Runs before all tests
 */
import { TextDecoder, TextEncoder } from "util";

// Polyfill TextEncoder/TextDecoder for JSDOM
// required by pg and superjson
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Set test environment variables
// Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true });
// Object.defineProperty(process.env, 'DB_INTERNAL', { value: 'true', writable: true });
// Object.defineProperty(process.env, 'DATABASE_URL', { value: 'postgresql://test:test@localhost:5432/test_db', writable: true });

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests
  // log: jest.fn(),
  // Keep error and warn
  error: console.error,
  warn: console.warn,
};
