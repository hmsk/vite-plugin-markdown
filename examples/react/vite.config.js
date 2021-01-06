// @ts-check
const reactRefresh = require('@vitejs/plugin-react-refresh')
const { plugin: mdPlugin, Mode } = require('vite-plugin-markdown')

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  plugins: [reactRefresh, mdPlugin({ mode: [Mode.HTML, Mode.TOC, Mode.REACT] })]
}

module.exports = config
