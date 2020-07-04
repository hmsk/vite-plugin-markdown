import frontmatter from "front-matter"
import markdownIt from "markdown-it"
import { Transform } from 'vite'

const transform: Transform = {
  test: ({ path }) => path.endsWith('.md'),
  transform: ({ code }) => {
    const fm = frontmatter(code)
    const html = markdownIt({ html: true }).render(fm.body)
    return {
      code: `const things = {
               attributes: ${JSON.stringify(fm.attributes)},
               html: ${JSON.stringify(html)}
             }
             export default things
            `
    }
  }
}

module.exports = (options = {}) => {
  return {
    transforms: [transform]
  }
}
