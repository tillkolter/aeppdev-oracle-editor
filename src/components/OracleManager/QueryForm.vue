<template>
  <form @submit.prevent="onSubmit">
    <label for="oracle-id">Oracle Id</label>
    <input type="text" id="oracle-id" v-model="oracleId"/>
    <label for="query-fee">Query Fee</label>
    <input type="number" id="query-fee" v-model="queryFee"/>
    <label for="query-ttl">Query Ttl</label>
    <input type="number" id="query-ttl" v-model="queryTtl"/>
    <label for="response-ttl">Response Ttl</label>
    <input type="number" id="response-ttl" v-model="responseTtl"/>
    <label for="fee">Fee</label>
    <input type="number" id="fee" v-model="fee"/>
    <label for="query">Query</label>
    <input type="text" id="query" v-model="query"/>
    <input type="submit" value="Submit Query"/>
  </form>
</template>

<script>
  export default {
    name: 'QueryForm',
    data () {
      return {
        oracleId: '',
        queryFee: 4,
        queryTtl: 10,
        responseTtl: 10,
        fee: 7,
        query: 'q9KS5jrMp83vTS7ZN'
      }
    },
    methods: {
      onSubmit () {
        let data = {
          oracleId: this.oracleId,
          queryFee: this.queryFee,
          queryTtl: this.queryTtl,
          responseTtl: this.responseTtl,
          fee: this.fee,
          query: this.query
        }
        this.$store.dispatch('submitQuery', data)
      }
    }
  }
</script>
