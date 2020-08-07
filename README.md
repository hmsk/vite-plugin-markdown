# vite-plugin-markdown

[![npm](https://img.shields.io/npm/v/vite-plugin-markdown.svg?style=for-the-badge)](https://www.npmjs.com/package/vite-plugin-markdown)

A plugin enables you to import a Markdown file as various formats on your [vite](https://github.com/vitejs/vite) project.

## Setup

```
npx i -D vite-plugin-markdown
```

### Config

```js
const mdPlugin = require('vite-plugin-markdown')

module.exports = {
  plugins: [mdPlugin(options)]
}
```

### Options

```ts
mode?: ('html' | 'toc' | 'react' | 'vue')[]
markdown?: (body: string) => string
markdownIt?: MarkdownIt | MarkdownIt.Options
```

Enum for `mode` is provided as `Mode`

```ts
import { Mode } from 'vite-plugin-markdown'

console.log(Mode.HTML) //=> 'html'
console.log(Mode.TOC) //=> 'toc'
console.log(Mode.REACT) //=> 'react'
console.log(Mode.VUE) //=> 'vue'
```

## Mode examples:

### Import Front Matter attributes

```md
---
title: Awesome Title
description: Describe this awesome content
tags:
  - "great"
  - "awesome"
  - "rad"
---

# This is awesome

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.
```

```ts
import { attributes } from './contents/the-doc.md';

console.log(attributes) //=> { title: 'Awesome Title', description: 'Describe this awesome content', tags: ['great', 'awesome', 'rad'] }
```

### Import compiled HTML (`Mode.HTML`)

```md
# This is awesome

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.
```

```ts
import { html } from './contents/the-doc.md';

console.log(html) //=> "<h1>This is awesome</h1><p>ite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.</p>"
```

### Import ToC metadata (`Mode.TOC`)

```md
# vite

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.

## Status

## Getting Started

# Notes
```

```ts
import { toc } from './contents/the-doc.md'

console.log(toc) //=> [{ level: '1', content: 'vite' }, { level: '2', content: 'Status' }, { level: '2', content: 'Getting Started' }, { level: '1', content: 'Notes' },]
```

### Import as a React component (`Mode.REACT`)

```jsx
import React from 'react'
import { ReactComponent } from './contents/the-doc.md'

function MyReactApp() {
  return (
    <div>
      <ReactComponent />
    </div>
}
```

<details>
<summary>Custom Element on a markdown file can be runnable as a React component as well</summary>

```md
# This is awesome

Vite is <MyComponent type={'react'}>
```

```jsx
import React from 'react'
import { ReactComponent } from './contents/the-doc.md'
import { MyComponent } from './my-component'

function MyReactApp() {
  return (
    <div>
      <ReactComponent my-component={MyComponent} />
    </div>
}
```

`MyComponent` on markdown perform as a React component.

</details>

### Import as a Vue component (`Mode.VUE`)

```vue
<template>
  <article>
    <markdown-content />
  </article>
</template>

<script>
import { VueComponent } from './contents/the-doc.md'

export default {
  components: {
    MarkdownContent: VueComponent
  }
};
</script>
```

<details>
<summary>Custom Element on a markdown file can be runnable as a Vue component as well</summary>

```md
# This is awesome

Vite is <MyComponent :type="'vue'">
```

```vue
<template>
  <article>
    <markdown-content />
  </article>
</template>

<script>
import { VueComponentWith } from './contents/the-doc.md'
import MyComponent from './my-component.vue'

export default {
  components: {
    MarkdownContent: VueComponentWith({ MyComponent })
  }
};
</script>
```

`MyComponent` on markdown perform as a Vue component.

</details>

## License

MIT
