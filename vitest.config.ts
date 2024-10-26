import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
    test: {
        poolOptions: {
            workers: {
                wrangler: { configPath: "./wrangler.toml" },
            },
        },
        environment: "node",
        globals: true,
        deps: {
            interopDefault: true,
            moduleDirectories: ['node_modules']
        },
    },
    resolve: {
        conditions: ['import', 'module', 'browser', 'default']
    }
});