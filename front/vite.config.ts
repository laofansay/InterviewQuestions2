import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
    plugins: [vue()],
    css: {
        postcss: './postcss.config.js',  // 引用 PostCSS 配置
    },
    server: {
        port: 5174,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                // 如果后端接口没有 /api 前缀（比如只是 app.get('/users')），就需要 rewrite
                // rewrite: path => path.replace(/^\/api/, '')
            },

        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src') // 注意加上 path.resolve 更稳
        }
    }
})