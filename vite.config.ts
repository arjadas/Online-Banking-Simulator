import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    nodePolyfills(),
    tsconfigPaths(),
  ], resolve: {
    alias: {
      // Provide any necessary aliases to resolve Node.js core modules
      'path': 'path-browserify',
      'fs': 'browserify-fs', // Example for 'fs' polyfill, adjust as necessary
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext', // Ensure modern build targets for better polyfill support
  },
});
