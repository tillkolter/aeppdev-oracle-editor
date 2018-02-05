<template>
  <div class="socket-console">
    <pre :class="['socket-console__line', messageItem.incoming ? 'incoming': 'outgoing']"
         v-html="getOutputHtml(messageItem)"
         v-for="messageItem in messages"
    ></pre>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'SocketConsole',
    computed: {
      ...mapGetters(['messages'])
    },
    methods: {
      getOutputHtml (messageItem) {
        return `${messageItem.incoming ? 'RECEIVED:' : 'SENT:'}&nbsp;${messageItem.message}`
      }
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
    min-width: 600px;
    text-align: left;
    background-color: black;
    color: lightgreen;
    font-family: monospace;
    font-size: 14px;
    overflow-wrap: break-word;
    &__line {
      white-space: pre-wrap;
      &.incoming {
        color: lightgreen;
      }
      &.outgoing {
        color: lightblue;
      }
    }
  }
</style>
