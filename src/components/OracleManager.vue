<template>
  <div>
    <socket-connection-form></socket-connection-form>
    <oracle-registration-form></oracle-registration-form>
    <oracle-status></oracle-status>
    <query-form></query-form>
    <socket-console></socket-console>
  </div>
</template>

<script>
  import SocketConnectionForm from './OracleManager/SocketConnectionForm'
  import SocketConsole from './OracleManager/SocketConsole'
  import OracleRegistrationForm from './OracleManager/OracleRegistrationForm'
  import OracleStatus from './OracleManager/OracleStatus'
  import QueryForm from './OracleManager/QueryForm'
  export default {
    components: {QueryForm, OracleStatus, OracleRegistrationForm, SocketConsole, SocketConnectionForm}, name: 'OracleManager'
  }
</script>
