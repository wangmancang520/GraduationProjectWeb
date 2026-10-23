import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
      extensions: ['.mjs', '.js', '.ts', '.json', '.vue']
    },
    server: {
      host: '127.0.0.1', port: 8080,
      proxy: { '/api': { target: env.API_PROXY_TARGET || 'http://localhost:8081', changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') } }
    },
    build: { sourcemap: false }
  }
})
