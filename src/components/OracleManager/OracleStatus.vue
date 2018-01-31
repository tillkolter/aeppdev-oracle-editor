<template>
  <div class="oracle-status">
    <div>Current Oracle Id: {{oracleId}}</div>
    <div>Status: {{oracleStatus}}</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'OracleStatus',
    computed: {
      ...mapGetters(['oracleId', 'oracleStatus'])
    }
  }
</script>

<style>
  .oracle-status {
    margin-left: 32px;
  }
</style>
