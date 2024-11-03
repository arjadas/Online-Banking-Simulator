import { vi } from "vitest";

export const createExecutionContext = () => ({
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn()
});

export const caches = {
    default: {
        match: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
};

export const Response = globalThis.Response;
export const Request = globalThis.Request;
export const Headers = globalThis.Headers;