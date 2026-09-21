import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            // Consume the shared Zod contract straight from source so schema edits
            // hot-reload without a separate build step.
            '@drdivya/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: process.env.VITE_API_URL ?? 'http://localhost:4000',
                changeOrigin: true,
            },
        },
    },
    build: {
        target: 'es2020',
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom'],
                    motion: ['framer-motion'],
                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
                },
            },
        },
    },
});
