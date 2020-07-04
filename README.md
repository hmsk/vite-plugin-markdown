# vite-plugin-frontmatter-markdown

What this repo makes real:

```js
const fmPlugin = require('vite-frontmatter-markdown')

module.exports = {
  plugins: [fmPlugin(options)]
}
```

```vue
<template>
  <div>
    <the-doc />
  </div>
</template>

<script>
import { vueComponent as theDoc } from './contents/the-doc.md';

export default {
  components: {
    theDoc,
  },
};
</script>
```
