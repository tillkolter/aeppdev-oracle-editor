<template>
  <div v-if="messages && messages.length > 0" class="socket-console">
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
    max-height: 300px;
    min-height: 300px;
    overflow: scroll;
    margin: 32px 0;
    padding: 16px;
    max-width: 600px;
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
