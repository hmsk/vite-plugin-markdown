<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  {{ html }}
  {{ toc }}
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import md from './assets/content.md'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      html: md.html,
      toc: md.toc
    }
  }
}
</script>
