<template>
  <div class="oracle-registration">
    <div class="oracle-registration-form__panel">
      <form id="oracle-registration-form" class="oracle-registration-form" @submit.prevent="onRegister">
        <label>
          Query Format
        </label>
        <input type="text" v-model="queryFormat"/>
        <label>
          Response Format
        </label>
        <input type="responseFormat" v-model="responseFormat"/>
        <label for="queryFee">
          Query Fee
        </label>
        <input id="queryFee" type="queryFee" v-model="queryFee"/>
        <label for="ttl">
          Time to live
        </label>
        <input id="ttl" type="text" v-model="ttl"/>
        <label for="fee">
          Fee
        </label>
        <input id="fee" type="fee" v-model="fee"/>
      </form>
      <div class="oracle-registration__buttons">
        <ae-button form="oracle-registration-form"
                   :type="registrationButtonType"
                   :inactive="registrationEnabled"
        >Register</ae-button>
      </div>
    </div>
    <div class="oracle-lambda-form">
      <form id="lambda-form" @submit.prevent="onTestJS">
        <label for="lambda">Oracle Responder</label>
        <textarea id="lambda" rows="12" col="80" v-model="lambda" type="textarea"></textarea>
      </form>
      <div class="oracle-lambda__test">
        <div>
          <label for="lambda-input">Input</label>
          <input id="lambda-input" v-model="inputValue" type="text"/>
        </div>
        <div class="oracle-lambda-buttons">
          <ae-button form="lambda-form" :type="oracleId ? 'normal': 'boring'">Test</ae-button>
          <ae-button @click="onSubmitJS" :type="'exciting'" :inactive="lambdaUptodate || !oracleId">Save</ae-button>
        </div>
      </div>
      <div>{{error ? 'This function does not compile': ''}}</div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {AeButton} from '@aeternity/aepp-components'

  export default {
    name: 'OracleRegistrationForm',
    components: {AeButton},
    data () {
      return {
        queryFormat: 'a query format',
        responseFormat: 'a response format',
        queryFee: 4,
        ttl: 50,
        fee: 5,
        inputValue: '42',
        lambda: `function responderFunction (input) {
  return new Promise((resolve, reject) => {
     let max = parseInt(input)
     resolve(Math.floor(Math.random() * Math.floor(max)).toString())
  })
}
`,
        error: ''
      }
    },
    methods: {
      onRegister () {
        let data = {
          queryFormat: this.queryFormat,
          responseFormat: this.responseFormat,
          queryFee: this.queryFee,
          ttl: this.ttl,
          fee: this.fee
        }
        this.$store.dispatch('registerOracle', data)
      },
      onSubmitJS () {
        this.checked(this.lambda, () => console.log('submit'))
        this.$store.dispatch('setLambda', this.lambda)
      },
      checked (code, command) {
        try {
          /* eslint no-new-func: 'off' */
          Function(code)
          if (command) {
            command.call()
          }
        } catch (e) {
          this.error = e
          console.log(e)
        }
      },
      onTestJS (e) {
        let executedCode = `
          responderFunction('${this.inputValue}').then(
            (response) => alert(response)
          );
        `
        this.checked(this.lambda, () => this.loadJS('dynamic.js', `${this.lambda} ${executedCode}`, document.body))
      },
      loadJS (url, implementationCode, location) {
        // url is URL of external file, implementationCode is the code
        // to be called from the file, location is the location to
        // insert the <script> element
        let scriptTag = document.createElement('script')
        scriptTag.type = 'text/javascript'
        scriptTag.innerHTML = implementationCode
        location.appendChild(scriptTag)
      }
    },
    computed: {
      ...mapGetters(['oracleLambda', 'oracleLambdaString', 'oracleId', 'webSocket']),
      registrationButtonType () {
        if (this.webSocket) {
          if (this.oracleId) {
            return 'boring'
          } else {
            return 'dramatic'
          }
        } else {
          return 'boring'
        }
      },
      registrationEnabled () {
        return typeof this.webSocket === 'undefined'
      },
      lambdaUptodate () {
        return this.lambda === this.oracleLambdaString
      }
    },
    mounted () {
      this.onSubmitJS()
    }
  }
</script>

<style lang="scss">
  .oracle {
    &-registration {
      padding: 16px;
      border: 1px solid black;
      display: flex;
      flex-direction: row;
      &-form {
        padding: 16px;
        border: 1px solid black;
        display: flex;
        flex-direction: column;
        label {
          margin-right: auto;
        }
        width: 300px;
        &__panel {
          display: flex;
          flex-direction: column;
        }
      }
      &__buttons {
        margin-top: auto;
      }
    }
    &-lambda {
      margin-top: auto;
      &-form {
        padding: 16px;
        display: flex;
        flex-direction: column;
        text-align: left;
        border: 1px solid black;
        min-width: 400px;
        max-width: 800px;
        form {
          display: flex;
          flex-direction: column;
        }
        margin-left: 16px;
      }
      &__test {
        margin-top: auto;
        display: flex;
      }
    }
  }
</style>
