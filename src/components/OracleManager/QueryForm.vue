<template>
  <div class="oracle-query">
    <form id="oracle-query" class="oracle-query-form" @submit.prevent="onSubmit">
      <label for="oracle-id">Oracle Id</label>
      <input placeholder="enter oracle id" type="text" id="oracle-id" v-model="oracleId"/>
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
    </form>
    <ae-button class="query-btn"
               form="oracle-query"
               :type="oracleId && query ? 'dramatic': 'boring'"
               :inactive="!oracleId || !query"
    >Send Query</ae-button>
  </div>
</template>

<script>
  import {AeButton} from '@aeternity/aepp-components'
  import {mapGetters} from 'vuex'

  export default {
    name: 'QueryForm',
    components: {AeButton},
    data () {
      return {
        oracleId: '',
        queryFee: 4,
        queryTtl: 10,
        responseTtl: 10,
        fee: 7,
        query: 42
      }
    },
    watch: {
      stateOracleId (value) {
        this.oracleId = value
      }
    },
    computed: {
      ...mapGetters({
        stateOracleId: 'oracleId'
      })
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

<style lang="scss">
  .oracle-query {
    border: 1px solid;
    margin-left: 24px;
    height: auto;
    display: flex;
    flex-direction: column;
    padding: 16px;
    &-form {
      /*height: 100%;*/
      display: flex;
      flex-direction: column;
    }
  }
  .query-btn {
    margin-top: auto;
  }
</style>
