// @ts-check
const reactPlugin = require('vite-plugin-react')
const { markdownPlugin, Mode } = require('vite-plugin-markdown')

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  jsx: 'react',
  plugins: [reactPlugin, markdownPlugin({ mode: [Mode.HTML, Mode.TOC, Mode.REACT] })]
}

module.exports = config
