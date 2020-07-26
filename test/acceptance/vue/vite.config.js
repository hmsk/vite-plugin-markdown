// @ts-check
const fmPlugin = require('vite-plugin-frontmatter-markdown')

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  plugins: [fmPlugin({ mode: ['html', 'toc', 'vue'] })]
}

module.exports = config
