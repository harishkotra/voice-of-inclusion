import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: false, // Don't clear dist
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, 'popup.html')
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name]-[hash].js',
                assetFileNames: '[name].[ext]'
            }
        }
    }
});
