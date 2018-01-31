<template>
  <form id="connection" class="connection-form" @submit.prevent="toggleConnect" >
    <label for="account">Account
      <input id="account" name="account" type="text" v-model="account" required/>
    </label>
    <div>
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
    </div>
    <div>
      <ae-button form="connection" :type="webSocket ? 'exciting': 'dramatic'">{{submitText}}</ae-button>
    </div>
  </form>
</template>

<script>
  import {AeButton} from '@aeternity/aepp-components'
  import {mapGetters} from 'vuex'

  let config
  try {
    config = require('../../config.json')
  } catch (e) {
    console.error('Missing configuration file')
  }

  export default {
    name: 'SocketConnectionForm',
    components: {AeButton},
    data () {
      return {
        account: (config && config.account) || '',
        port: (config && config.port) || 3104,
        host: (config && config.host) || 'localhost',
        httpPort: (config && config.httpPort) || 3003
      }
    },
    computed: {
      submitText () {
        return this.isClosed ? 'Connect' : 'Disconnect'
      },
      ...mapGetters(['isClosed', 'webSocket'])
    },
    methods: {
      toggleConnect () {
        if (this.isClosed) {
          this.$store.dispatch(
            'connect',
            {account: this.account, host: this.host, port: this.port, httpPort: this.httpPort}
          )
        } else {
          this.$store.dispatch('disconnect')
        }
      }
    }
  }
</script>

<style>
  .connection-form {
    display: flex;
    flex-direction: column;
  }
  #account {
    width: 100%;
  }
</style>
