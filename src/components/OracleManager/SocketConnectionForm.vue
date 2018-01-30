<template>
  <form @submit.prevent="toggleConnect" >
    <label for="account">Account
      <input id="account" name="account" type="text" v-model="account" required/>
    </label>
    <label for="host">
      Host
      <input id="host" name="host" type="text" v-model="host" required/>
    </label>
    <label for="port">
      Port
      <input id="port" name="port" type="number" v-model="port" required/>
    </label>
    <label for="http-port">
      HttpPort
      <input id="http-port" name="httpPort" type="number" v-model="httpPort"/>
    </label>
    <input type="submit" :value="submitText" required/>
  </form>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'SocketConnectionForm',
    data () {
      return {
//        account: 'ak$3psxY3PDWJLNty69Xadf627EjaR4zm7FWKKLsFUjw1idyVfKd7eyqq2o2FYdw2h94e3uc6tiMhrmznA7aDAtungCSQxMex',
//        host: '185.170.114.87',
//        port: 8020
        account: 'ak$3t4UJ7FoXDcv7K79T5V7P175hhA14UG4xUb4wNbaPzj2UkZB1UENzLf3JC7gy5hkcTxbapR3uG7nUTteHS2jwKoJSYuyAn',
        host: 'localhost',
        port: 3124,
        httpPort: 3123
      }
    },
    computed: {
      submitText () {
        return this.isClosed ? 'Connect' : 'Disconnect'
      },
      ...mapGetters(['isClosed'])
    },
    methods: {
      toggleConnect () {
        if (this.isClosed) {
          this.$store.dispatch(
            'connect',
            {account: this.account, host: this.host, port: this.port}
          )
        } else {
          this.$store.dispatch('disconnect')
        }
      }
    }
  }
</script>

