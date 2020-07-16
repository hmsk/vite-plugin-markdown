import Frontmatter from 'front-matter'
import MarkdownIt from 'markdown-it'
import { Transform } from 'vite'

export enum Mode {
  TOC = "toc",
  HTML = "html"
}

export interface PluginOptions {
  mode?: Mode[]
  markdown?: (body: string) => string
  markdownIt?: MarkdownIt | MarkdownIt.Options
}

const markdownCompiler = (options: PluginOptions): MarkdownIt | { render: (body: string) => string } => {
  if (options.markdownIt) {
    if (options.markdownIt instanceof MarkdownIt || (options.markdownIt?.constructor?.name === 'MarkdownIt')) {
      return options.markdownIt as MarkdownIt
    } else if (typeof options.markdownIt === 'object') {
      return MarkdownIt(options.markdownIt)
    }
  } else if (options.markdown) {
    return { render: options.markdown }
  }
  return MarkdownIt({ html: true })
}

class ExportedContent {
  content: string = ''

  addProperty (key: string, value: string | object): void {
    this.content += `${key}: ${JSON.stringify(value)},
    `
  }

  export (): string {
    return `{ ${this.content} }`
  }
}

const transform = (options: PluginOptions): Transform => {
  return {
    test: ({ path }) => path.endsWith('.md'),
    transform: ({ code }) => {
      const content = new ExportedContent()
      const fm = Frontmatter<object>(code)
      content.addProperty('attributes', fm.attributes)

      if (options.mode?.includes(Mode.HTML)) {
        const html = markdownCompiler(options).render(fm.body)
        content.addProperty('html', html)
      }

      return {
        code: `const things = ${content.export()}
              export default things
              `
      }
    }
  }
}

module.exports = (options: PluginOptions = {}) => {
  return {
    transforms: [transform(options)]
  }
}
