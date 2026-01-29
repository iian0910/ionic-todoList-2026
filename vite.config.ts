/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ionic-todoList-2026/",
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 自動在每個 SCSS 檔案中注入這些變數
        additionalData: `@import "@/theme/_color.scss";`
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
