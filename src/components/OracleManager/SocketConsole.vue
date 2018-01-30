<template>
  <div class="socket-console">
    <pre v-html="message" v-for="message in messages"></pre>
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

<style>
  .socket-console {
    text-align: left;
    background-color: black;
    color: lightgreen;
    font-family: monospace;
    font-size: 14px;
    overflow-wrap: break-word;
  }
</style>