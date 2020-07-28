import Frontmatter from 'front-matter'
import MarkdownIt from 'markdown-it'
import { parse, HTMLElement, Node } from 'node-html-parser'
import { Transform } from 'vite'
import { compileTemplate } from '@vue/compiler-sfc'

export enum Mode {
  TOC = "toc",
  HTML = "html",
  VUE = "vue"
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
  #exports: string = ''
  #contextCode: string = ''

  addProperty (key: string, value: string | object, contextCode?: string): void {
    const exportedContent = typeof value === 'string' ? value : JSON.stringify(value)
    this.#exports += `export const ${key} = ${exportedContent}\n`
    if (contextCode) {
      this.#contextCode += `${contextCode}\n`
    }
  }

  export (): string {
    return [this.#contextCode, this.#exports].join('\n')
  }
}

const transform = (options: PluginOptions): Transform => {
  return {
    test: ({ path }) => path.endsWith('.md'),
    transform: ({ code, path }) => {
      const content = new ExportedContent()
      const fm = Frontmatter<object>(code)
      content.addProperty('attributes', fm.attributes)

      const html = markdownCompiler(options).render(fm.body)
      if (options.mode?.includes(Mode.HTML)) {
        content.addProperty('html', JSON.stringify(html))
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

      if (options.mode?.includes(Mode.VUE)) {
        const root = parse(html, { pre: true, script: true, comment: true, style: true })

        // Top-level <pre> tags become <pre v-pre>
        root.childNodes.forEach(childNode => {
          if (childNode instanceof HTMLElement && ['pre', 'code'].includes(childNode.tagName)) {
            (childNode as HTMLElement).setAttribute('v-pre', 'true')
          }
        })

        // Any <code> tag becomes <code v-pre> excepting under `<pre>`
        const markCodeAsPre = (node: Node): void => {
          if (node instanceof HTMLElement) {
            if (node.tagName === 'code') node.setAttribute('v-pre', 'true')
            if ((node as HTMLElement).childNodes.length > 0) {
              node.childNodes.forEach(markCodeAsPre)
            }
          }
        }
        root.childNodes.forEach(markCodeAsPre)

        const { code: compiledVueCode } = compileTemplate({ source: root.toString(), filename: path })
        const vueCode = compiledVueCode.replace('\nexport function render(', '\nfunction vueRender(')
        content.addProperty('VueComponent', '{ render: vueRender }', vueCode)
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
