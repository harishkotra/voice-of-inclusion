import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: false, // Don't clear dist
        lib: {
            entry: path.resolve(__dirname, 'src/content.js'),
            name: 'ContentScript',
            fileName: () => 'content.js',
            formats: ['iife']
        }
    }
});
