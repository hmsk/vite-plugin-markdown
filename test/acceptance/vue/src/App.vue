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
  <h1>Vue Component</h1>
  <content-markdown />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import LinkToRepository from './components/LinkToRepository.vue'
import { attributes, html, toc, VueComponent, VueComponentWith }  from './assets/content.md'

export default {
  name: 'App',
  components: {
    HelloWorld,
    ContentMarkdown: VueComponentWith({ LinkToRepository })
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
