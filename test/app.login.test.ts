import { action } from '../app/routes/login';
import { createUserSession } from './mocks/auth-server';
import { mockDb, createMockContext } from './mocks/db.server';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Login Action', () => {
    const mockContext = createMockContext();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createMockRequest = (data: { username: string; password: string }) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        return new Request('http://localhost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });
    };

    it('should successfully login with correct credentials', async () => {
        const request = createMockRequest({
            username: 'mock-uid-123',
            password: 'test@example.com'
        });

        const response = await action({
            context: mockContext, request,
            params: {}
        });
        
        expect(response?.status).toBe(200);
        expect(response?.headers.get('Set-Cookie')).toBeDefined();
        
        expect(createUserSession).toHaveBeenCalledWith(
            mockContext,
            'mock-uid-123',
            'test@example.com',
            '/app/accounts'
        );
    });

    it('should handle missing credentials', async () => {
        const request = createMockRequest({
            username: '',
            password: ''
        });

        const response = await action({
            context: mockContext, request,
            params: {}
        });
        const result = await response?.json();

        expect(result.error).toBeDefined();
    });

    it('should handle session creation errors', async () => {
        // Mock createUserSession to throw an error for this test
        createUserSession.mockRejectedValueOnce(new Error('Session creation failed'));

        const request = createMockRequest({
            username: 'mock-username',
            password: 'mock-password'
        });

        const response = await action({
            context: mockContext, request,
            params: {}
        });
        const result = await response?.json();

        expect(result.error).toContain('Session creation failed');
    });
});