import VuePlugin from '@vitejs/plugin-vue'
import plugin, { Mode } from 'vite-plugin-markdown'

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  plugins: [VuePlugin(), plugin({ mode: [Mode.HTML, Mode.TOC, Mode.VUE] })],
}

module.exports = config
