import { vi } from 'vitest';

export const createSessionStorage = vi.fn(() => ({
    getSession: vi.fn(),
    commitSession: vi.fn(),
    destroySession: vi.fn(),
}));

export const getSessionStorage = vi.fn(() => ({
    getSession: vi.fn(),
    commitSession: vi.fn(),
    destroySession: vi.fn(),
}));

export const getUserSession = vi.fn(() => ({
    uid: 'test-user-id'
    //, recipient_uid: 'test-recipient-id'
    // any other user session properties here, if needed
}));