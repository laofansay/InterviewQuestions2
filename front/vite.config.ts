import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  console.log('env', env.VITE_API_URL)
  return {
    plugins: [vue()],
    css: {
        postcss: './postcss.config.js',
    },
    server: {
        port: 5174,
        host: true,
        proxy: {
            '/api': {
                target: env.VITE_API_URL || 'http://localhost:3000',
                changeOrigin: true,
            },
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~@': path.resolve(__dirname, './src')
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false
    }
  }
})