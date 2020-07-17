# vite-plugin-frontmatter-markdown

[![npm](https://img.shields.io/npm/v/vite-plugin-frontmatter-markdown.svg?style=for-the-badge)](https://www.npmjs.com/package/vite-plugin-frontmatter-markdown)

## What this plugin enables you to write:

### In Vue

```js
<template>
  <div>
    <nav>
      <ul>
        <li
          v-for='(heading, i) in toc'
          :key='i'
          class=`heading-${heading.level}`>
          {{ heading.text }}
        </li>
      </ul>
    </nav>
    <article>
      <h1>{{ attributes.title }}</h1>
      <p>{{ attributes.description }}</p>
      <div v-html="html" />
    </article>
  </div>
</template>

<script>
import { attributes, html, toc } from './contents/the-doc.md';

export default {
  data () {
    return {
      attributes, html, toc
    }
  }
};
</script>
```

## Config

```js
const fmPlugin = require('vite-frontmatter-markdown')

module.exports = {
  plugins: [fmPlugin(options)]
}
```

### Options

```ts
mode?: 'html' | 'toc'
markdown?: (body: string) => string
markdownIt?: MarkdownIt | MarkdownIt.Options
```
