// @ts-check
const { markdownPlugin, Mode } = require('vite-plugin-markdown')

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  plugins: [markdownPlugin({ mode: [Mode.HTML, Mode.TOC, Mode.VUE] })]
}

module.exports = config
