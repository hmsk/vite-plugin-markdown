import Frontmatter from 'front-matter'
import MarkdownIt from 'markdown-it'
import { Plugin } from 'vite'
import { TransformResult } from 'rollup'
import { parseDOM, DomUtils } from 'htmlparser2'
import { Element, Node as DomHandlerNode } from 'domhandler'

export enum Mode {
  TOC = 'toc',
  HTML = 'html',
  REACT = 'react',
  VUE = 'vue',
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
  return MarkdownIt({ html: true, xhtmlOut: options.mode?.includes(Mode.REACT) }) // TODO: xhtmlOut should be got rid of in next major update
}

class ExportedContent {
  #exports: string[] = []
  #contextCode = ''

  addContext (contextCode: string): void {
    this.#contextCode += `${contextCode}\n`
  }

  addExporting (exported: string): void {
    this.#exports.push(exported)
  }

  export (): string {
    return [this.#contextCode, `export { ${this.#exports.join(', ')} }`].join('\n')
  }
}

const tf = (code: string, id: string, options: PluginOptions): TransformResult => {
  if (!id.endsWith('.md')) return null

  const content = new ExportedContent()
  const fm = Frontmatter<unknown>(code)
  content.addContext(`const attributes = ${JSON.stringify(fm.attributes)}`)
  content.addExporting('attributes')

  const html = markdownCompiler(options).render(fm.body)
  if (options.mode?.includes(Mode.HTML)) {
    content.addContext(`const html = ${JSON.stringify(html)}`)
    content.addExporting('html')
  }

  if (options.mode?.includes(Mode.TOC)) {
    const root = parseDOM(html)
    const indicies = root.filter(
      rootSibling => rootSibling instanceof Element && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(rootSibling.tagName)
    ) as Element[]

    const toc: { level: string; content: string }[] = indicies.map(index => ({
      level: index.tagName.replace('h', ''),
      content: DomUtils.getInnerHTML(index),
    }))

    content.addContext(`const toc = ${JSON.stringify(toc)}`)
    content.addExporting('toc')
  }

  if (options.mode?.includes(Mode.REACT)) {
    const root = parseDOM(html, { lowerCaseTags: false })
    const subComponentNamespace = 'SubReactComponent'

    const markCodeAsPre = (node: DomHandlerNode): void => {
      if (node instanceof Element) {
        if (node.tagName.match(/^[A-Z].+/)) {
          node.tagName = `${subComponentNamespace}.${node.tagName}`
        }
        if (['pre', 'code'].includes(node.tagName) && node.attribs?.class) {
          node.attribs.className = node.attribs.class
          delete node.attribs.class
        }

        if (node.tagName === 'code') {
          const codeContent = DomUtils.getInnerHTML(node, { decodeEntities: true })
          node.attribs.dangerouslySetInnerHTML = `vfm{{ __html: \`${codeContent.replace(/([\\`])/g, '\\$1')}\`}}vfm`
          node.childNodes = []
        }

        if (node.childNodes.length > 0) {
          node.childNodes.forEach(markCodeAsPre)
        }
      }
    }
    root.forEach(markCodeAsPre)

    const h = DomUtils.getOuterHTML(root, { selfClosingTags: true }).replace(/"vfm{{/g, '{{').replace(/}}vfm"/g, '}}')

    const reactCode = `
      const markdown =
        <div>
          ${h}
        </div>
    `
    const compiledReactCode = `
      function (props) {
        Object.keys(props).forEach(function (key) {
          SubReactComponent[key] = props[key]
        })
        ${require('@babel/core').transformSync(reactCode, { ast: false, presets: ['@babel/preset-react'] }).code}
        return markdown
      }
    `
    content.addContext(`import React from "react"\nconst ${subComponentNamespace} = {}\nconst ReactComponent = ${compiledReactCode}`)
    content.addExporting('ReactComponent')
  }

  if (options.mode?.includes(Mode.VUE)) {
    const root = parseDOM(html)

    // Top-level <pre> tags become <pre v-pre>
    root.forEach((node: DomHandlerNode) => {
      if (node instanceof Element) {
        if (['pre', 'code'].includes(node.tagName)) {
          node.attribs['v-pre'] = 'true'
        }
      }
    })

    // Any <code> tag becomes <code v-pre> excepting under `<pre>`
    const markCodeAsPre = (node: DomHandlerNode): void => {
      if (node instanceof Element) {
        if (node.tagName === 'code') node.attribs['v-pre'] = 'true'
        if (node.childNodes.length > 0) node.childNodes.forEach(markCodeAsPre)
      }
    }
    root.forEach(markCodeAsPre)

    const { code: compiledVueCode } = require('@vue/compiler-sfc').compileTemplate({ source: DomUtils.getOuterHTML(root, { decodeEntities: true }), filename: id, id })
    content.addContext(compiledVueCode.replace('\nexport function render(', '\nfunction vueRender(') + `\nconst VueComponent = { render: vueRender }\nVueComponent.__hmrId = ${JSON.stringify(id)}\nconst VueComponentWith = (components) => ({ components, render: vueRender })\n`)
    content.addExporting('VueComponent')
    content.addExporting('VueComponentWith')
  }

  return {
    code: content.export(),
  }
}

export const plugin = (options: PluginOptions = {}): Plugin => {
  return {
    name: 'vite-plugin-markdown',
    enforce: 'pre',
    transform (code, id) {
      return tf(code, id, options)
    },
  }
}

export default plugin
exports.default = plugin
