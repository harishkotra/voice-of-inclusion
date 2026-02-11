import { defineConfig } from 'vite';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        nodePolyfills({
            include: ['path', 'fs', 'stream', 'util', 'url', 'buffer', 'process'],
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
        }),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true, // First build clears dist
        lib: {
            entry: path.resolve(__dirname, 'src/background.js'),
            name: 'BackgroundService',
            fileName: () => 'background.js',
            formats: ['iife']
        },
        rollupOptions: {
            output: {
                extend: true,
            }
        }
    }
});
