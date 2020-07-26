<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  <h1>Attributes</h1>
  <table style="margin: auto;">
    <tr v-for='(line) in Object.entries(attributes)'>
      <td style="text-align: left;"><strong>{{ line[0] }}</strong></td>
      <td><code>{{ line[1] }}</code></td>
    </tr>
  </table>
  <h1>HTML</h1>
  {{ html }}
  <h1>TOC</h1>
  {{ toc }}
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { attributes, html, toc }  from './assets/content.md'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      attributes,
      html,
      toc
    }
  }
}
</script>
