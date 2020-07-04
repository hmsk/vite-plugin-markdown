# vite-plugin-frontmatter-markdown

```js
const fmPlugin = require('vite-frontmatter-markdown')

module.exports = {
  plugins: [fmPlugin(options)]
}
```

```vue
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
