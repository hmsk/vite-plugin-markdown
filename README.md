# vite-plugin-markdown

[![npm](https://img.shields.io/npm/v/vite-plugin-markdown.svg?style=for-the-badge)](https://www.npmjs.com/package/vite-plugin-markdown) [![npm beta channel](https://img.shields.io/npm/v/vite-plugin-markdown/beta?style=for-the-badge&label=beta&color=yellow)](https://www.npmjs.com/package/vite-plugin-markdown/v/beta)


A plugin enables you to import a Markdown file as various formats on your [vite](https://github.com/vitejs/vite) project.

## Setup

```
npm i -D vite-plugin-markdown
```

<details>
<summary>For vite v1</summary>

```
npm i -D vite-plugin-markdown@vite-1
```
</details>

### Config

```js
const mdPlugin = require('vite-plugin-markdown')

module.exports = {
  plugins: [mdPlugin(options)]
}
```

Then you can import front matter attributes from `.md` file as default.

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

### Options

```ts
mode?: ('html' | 'markdown' | 'toc' | 'react' | 'vue')[]
markdown?: (body: string) => string
markdownIt?: MarkdownIt | MarkdownIt.Options
```

Enum for `mode` is provided as `Mode`

```ts
import { Mode } from 'vite-plugin-markdown'

console.log(Mode.HTML) //=> 'html'
console.log(Mode.MARKDOWN) //=> 'markdown'
console.log(Mode.TOC) //=> 'toc'
console.log(Mode.REACT) //=> 'react'
console.log(Mode.VUE) //=> 'vue'
```

"Mode" enables you to import markdown file in various formats (HTML, ToC, React/Vue Component)

#### `Mode.HTML`

<details>
  <summary>Import compiled HTML</summary>

```md
# This is awesome

Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.
```

```ts
import { html } from './contents/the-doc.md';

console.log(html) //=> "<h1>This is awesome</h1><p>ite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production.</p>"
```

</details>

#### `Mode.MARKDOWN`

<details>
  <summary>Import the raw Markdown content</summary>

```js
import { markdown } from './contents/the-doc.md'

console.log(markdown) //=> "# This is awesome \n Vite is an opinionated web dev build tool that serves your code via native ES Module imports during dev and bundles it with Rollup for production."
```
</details>

#### `Mode.TOC`

<details>
  <summary>Import ToC metadata</summary>

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

</details>

#### `Mode.REACT`

<details>
  <summary>Import as a React component</summary>

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
      <ReactComponent MyComponent={MyComponent} />
    </div>
}
```

`MyComponent` on markdown perform as a React component.

</details>
</details>

#### `Mode.VUE`

<details>
  <summary>Import as a Vue component</summary>

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
</details>


### Type declarations

In TypeScript project, need to declare typedefs for `.md` file as you need.

```ts
declare module '*.md' {
  // "unknown" would be more detailed depends on how you structure frontmatter
  const attributes: Record<string, unknown>; 

  // When "Mode.TOC" is requested
  const toc: { level: string, content: string }[];

  // When "Mode.HTML" is requested
  const html: string;

  // When "Mode.RAW" is requested
  const raw: string

  // When "Mode.React" is requested. VFC could take a generic like React.VFC<{ MyComponent: TypeOfMyComponent }>
  import React from 'react'
  const ReactComponent: React.VFC;
  
  // When "Mode.Vue" is requested
  import { ComponentOptions, Component } from 'vue';
  const VueComponent: ComponentOptions;
  const VueComponentWith: (components: Record<string, Component>) => ComponentOptions;

  // Modify below per your usage
  export { attributes, toc, html, ReactComponent, VueComponent, VueComponentWith };
}
```

Save as `vite.d.ts` for instance.

## License

MIT
