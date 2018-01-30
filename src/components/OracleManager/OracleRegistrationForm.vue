<template>
  <div class="oracle-registration">
    <form class="oracle-registration-form" @submit.prevent="onRegister">
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
      <input type="submit" value="Register Oracle"/>
    </form>
    <div class="oracle-lambda-form">
      <form @submit.prevent="onTestJS">
        <label for="lambda">Oracle Responder</label>
        <textarea id="lambda" rows="15" col="80" v-model="lambda" type="textarea"></textarea>
        <label for="lambda-input">Test Input</label>
        <input id="lambda-input" v-model="inputValue" type="text"/>
        <input type="submit" value="Test"/>
      </form>
      <button @click="onSubmitJS">Submit</button>
      <button @click="onTestSubmitted">Test Submitted</button>
      <div>{{error ? 'This function does not compile': ''}}</div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'OracleRegistrationForm',
    data () {
      return {
        queryFormat: 'a query format',
        responseFormat: 'a response format',
        queryFee: 4,
        ttl: 50,
        fee: 5,
        inputValue: '',
        lambda: `function responderFunction (input) {
  return "response to input: " + input;
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
        this.$store.dispatch('setLambda', Function(`return ${this.lambda}`)())
      },
      checked (code, command) {
        try {
          /* eslint no-new-func: 'off' */
          Function(code)
          command.call()
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
      },
      onTestSubmitted () {
        if (this.oracleLambda) {
          console.log(this.oracleLambda('test'))
        }
      }
    },
    computed: {
      ...mapGetters(['oracleLambda'])
    }
  }
</script>

<style lang="scss">
  .oracle {
    &-registration {
      display: flex;
      flex-direction: row;
      &-form {
        padding: 16px;
        display: flex;
        flex-direction: column;
        width: 50%;
        label {
          margin-right: auto;
        }
      }
    }
    &-lambda-form {
      padding: 16px;
      width: 50%;
      display: flex;
      flex-direction: column;
    }
  }
</style>
