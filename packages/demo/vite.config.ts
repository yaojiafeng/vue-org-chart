import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 通过环境变量控制是否使用构建产物
// 开发时：不设置 USE_DIST，使用源码（热更新快）
// 验证构建时：设置 USE_DIST=true，使用构建产物（模拟真实 npm 安装）
const useDist = process.env.USE_DIST === 'true'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // 根据环境变量决定使用源码还是构建产物
      '@org-chart': useDist
        ? resolve(__dirname, '../org-chart/dist')
        : resolve(__dirname, '../org-chart/src'),
      'vue-org-chart': resolve(__dirname, '../org-chart')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
