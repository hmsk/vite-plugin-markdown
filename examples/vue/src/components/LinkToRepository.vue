<template>
  <a
    :style="style"
    href="https://github.com/hmsk/vite-plugin-markdown"
    target="_blank"
   >
    <slot />
  </a>
</template>

<script>
export default {
  name: 'LinkToRepository',
  props: {
    color: String
  },
  computed: {
    style () {
      return {
        color: this.color
      }
    }
  }
}
</script>
