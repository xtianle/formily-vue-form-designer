import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import MonacoEditorPlugin from 'vite-plugin-monaco-editor'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), MonacoEditorPlugin()],
  resolve: {
    alias: {
      '@designable/shared': fileURLToPath(
        new URL('./src/packages/designable/shared', import.meta.url)
      ),
      '@designable/core': fileURLToPath(
        new URL('./src/packages/designable/core', import.meta.url)
      ),
      '@designable/transformer': fileURLToPath(
        new URL('./src/packages/designable/transformer', import.meta.url)
      ),
      '@designer-main-body': fileURLToPath(
        new URL('./src/packages/designer-main-body', import.meta.url)
      ),
      '@designer-renderer': fileURLToPath(
        new URL('./src/packages/designer-renderer', import.meta.url)
      ),
      '@designer-setings-from': fileURLToPath(
        new URL('./src/packages/designer-setings-from', import.meta.url)
      ),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
