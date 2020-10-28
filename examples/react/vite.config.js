// @ts-check
const reactPlugin = require('vite-plugin-react')
const { plugin: mdPlugin, Mode } = require('vite-plugin-markdown')

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  jsx: 'react',
  plugins: [reactPlugin, mdPlugin({ mode: [Mode.HTML, Mode.TOC, Mode.REACT] })]
}

module.exports = config
