<template>
  <div class="socket-console">
    <pre class="socket-console__line" v-html="message" v-for="message in messages"></pre>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'SocketConsole',
    computed: {
      ...mapGetters(['messages'])
    }
  }
</script>

<style lang="scss">
  .socket-console {
    margin: 32px auto;
    max-width: 1600px;
    text-align: left;
    background-color: black;
    color: lightgreen;
    font-family: monospace;
    font-size: 14px;
    overflow-wrap: break-word;
    &__line {
      white-space: pre-wrap;
    }
  }
</style>
