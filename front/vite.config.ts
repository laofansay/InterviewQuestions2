import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    css: {
        postcss: './postcss.config.js',
    },
    server: {
        port: 5174,
        host: true,
        proxy: {
            '/api': {
                target: process.env.VITE_API_URL || 'http://localhost:3000',
                changeOrigin: true,
            },
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false
    }
})