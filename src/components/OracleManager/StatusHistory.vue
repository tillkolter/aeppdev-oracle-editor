<template>
  <table class="status-history">
    <tr v-for="status in statusHistory">
      <td class="timestamp">{{formatTimestamp(status.timestamp)}}</td>
      <td class="message">&nbsp;&nbsp;&nbsp;{{status.message}}</td>
    </tr>
  </table>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'StatusHistory',
    computed: {
      ...mapGetters(['statusHistory'])
    },
    methods: {
      formatTimestamp (date) {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
      }
    }
  }
</script>

<style lang="scss">
  .status-history {
    max-width: 600px;
    .timestamp {
      vertical-align: top;
    }
    .message {
      word-break: break-all;
    }
  }
</style>
