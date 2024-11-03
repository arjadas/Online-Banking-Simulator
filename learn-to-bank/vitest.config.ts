import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./setupTests.ts'],
        include: ['**/*.test.{js,jsx,ts,tsx}'],
        exclude: ['node_modules', 'build', '.cache'],
        deps: {
            interopDefault: true,
            inline: [
                '@remix-run/cloudflare',
                'cloudflare:test'
            ]
        }
    },
    plugins: [tsconfigPaths()],
    resolve: {
        alias: {
            '~': resolve(__dirname, './app'),
            'cloudflare:test': resolve(__dirname, './test/cloudflare-mock.ts'),
            '~/service/db.server': resolve(__dirname, './test/mocks/db.server.ts')
        }
    }
});