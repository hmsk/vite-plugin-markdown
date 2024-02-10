import VuePlugin from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import plugin, { Mode } from 'vite-plugin-markdown'

/**
 * @type { import('vite').UserConfig }
 */
export default defineConfig({
  plugins: [VuePlugin(), plugin({ mode: [Mode.HTML, Mode.TOC, Mode.VUE] })],
})
