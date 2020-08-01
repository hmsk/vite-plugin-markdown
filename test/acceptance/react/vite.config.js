// @ts-check
const reactPlugin = require('vite-plugin-react')
const mdPlugin = require('vite-plugin-markdown')

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  jsx: 'react',
  plugins: [reactPlugin, mdPlugin({ mode: ['html', 'toc', 'react'] })]
}

module.exports = config
