import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = vi.fn();

// Mock FormData
global.FormData = vi.fn(() => ({
    append: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    delete: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    set: vi.fn(),
    [Symbol.iterator]: vi.fn(),
}));

// Mock environment variables
process.env = {
    VITE_FIREBASE_API_KEY: 'test-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
    VITE_FIREBASE_PROJECT_ID: 'test-project-id',
    VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
    VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-sender-id',
    VITE_FIREBASE_APP_ID: 'test-app-id',
    VITE_FIREBASE_MEASUREMENT_ID: 'test-measurement-id',
    VITE_SESSION_SECRET: 'test-session-secret',
    VITE_DIRECT_URL: 'test-direct-url',
    VITE_LOCAL_DATABASE_URL: 'test-local-db-url',
    VITE_DATABASE_URL: 'test-db-url',
} as any;

// Mock Cloudflare specific globals
global.caches = {
    default: {
        match: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
} as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Clear all mocks after each test
afterEach(() => {
    vi.clearAllMocks();
});