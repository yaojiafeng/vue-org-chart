import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@org-chart': resolve(__dirname, '../packages/org-chart/src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
