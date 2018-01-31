<template>
  <div class="oracle-status">
    <div>Connection Status: {{connectionStatus}}</div>
    <div>Current Oracle Id: {{oracleId}}</div>
    <div>Status: {{oracleStatus}}</div>
    <div>Block height: {{blockHeight}}</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'OracleStatus',
    computed: {
      ...mapGetters([
        'oracleId',
        'oracleStatus',
        'connectionStatus',
        'blockHeight'
      ])
    }
  }
</script>

<style>
  .oracle-status {
    margin-left: 32px;
  }
</style>
