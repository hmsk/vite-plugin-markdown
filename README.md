# vite-plugin-frontmatter-markdown

[![npm](https://img.shields.io/npm/v/vite-plugin-frontmatter-markdown/next.svg?style=for-the-badge)](https://www.npmjs.com/package/vite-plugin-frontmatter-markdown)

## What this plugin enables you to write:

### In Vue

```js
<template>
  <article>
    <h1>{{ attributes.title }}</h1>
    <p>{{ attributes.description }}</p>
    <div v-html="html" />
  </article>
</template>

<script>
import { attributes, html } from './contents/the-doc.md';

export default {
  data () {
    return {
      attributes, html
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
markdown?: (body: string) => string
markdownIt?: MarkdownIt | MarkdownIt.Options
```
