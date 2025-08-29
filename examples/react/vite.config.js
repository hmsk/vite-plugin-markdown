// @ts-check
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown'

/**
 * @type { import('vite').UserConfig }
 */
export default defineConfig({
  plugins: [reactRefresh, mdPlugin({ mode: [Mode.HTML, Mode.MARKDOWN, Mode.TOC, Mode.REACT] })],
})

