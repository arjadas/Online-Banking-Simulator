import { vi } from 'vitest';

export const createSessionStorage = vi.fn(() => ({
    getSession: vi.fn(),
    commitSession: vi.fn()(() => Promise.resolve('mock-session-cookie')),
    destroySession: vi.fn(),
}));

export const getSessionStorage = vi.fn(() => ({
    getSession: vi.fn(),
    commitSession: vi.fn()(() => Promise.resolve('mock-session-cookie')),
    destroySession: vi.fn(),
}));

export const getUserSession = vi.fn(() => ({
    uid: 'test-user-id'
    //, recipient_uid: 'test-recipient-id'
    // any other user session properties here, if needed
}));

export const createUserSession = vi.fn(async (context, uid, email, redirectTo) => {
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            'Location': redirectTo,
            'Set-Cookie': 'session=mock-session-cookie',
        },
        status: 302
    });
});