import Frontmatter from 'front-matter'
import MarkdownIt from 'markdown-it'
import { parse, HTMLElement } from 'node-html-parser'
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
  #content: string = ''

  addProperty (key: string, value: string | object): void {
    this.#content += `export const ${key} = ${JSON.stringify(value)}\n`
  }

  export (): string {
    return this.#content
  }
}

const transform = (options: PluginOptions): Transform => {
  return {
    test: ({ path }) => path.endsWith('.md'),
    transform: ({ code }) => {
      const content = new ExportedContent()
      const fm = Frontmatter<object>(code)
      content.addProperty('attributes', fm.attributes)

      const html = markdownCompiler(options).render(fm.body)
      if (options.mode?.includes(Mode.HTML)) {
        content.addProperty('html', html)
      }

      if (options.mode?.includes(Mode.TOC)) {
        const root = parse(html)
        const indicies = root.childNodes.filter(
          childNode => childNode instanceof HTMLElement && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(childNode.tagName)
        ) as HTMLElement[]

        const toc: { level: string; content: string }[] = indicies.map(index => ({
          level: index.tagName.replace('h', ''),
          content: index.childNodes.toString()
        }))

        content.addProperty('toc', toc)
      }

      return {
        code: content.export()
      }
    }
  }
}

module.exports = (options: PluginOptions = {}) => {
  return {
    transforms: [transform(options)]
  }
}
