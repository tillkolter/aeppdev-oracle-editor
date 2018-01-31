<template>
  <div>
    <div v-for="status in statusHistory">
      {{formatTimestamp(status.timestamp)}}&nbsp;&nbsp;&nbsp;{{status.message}}
    </div>
  </div>
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
