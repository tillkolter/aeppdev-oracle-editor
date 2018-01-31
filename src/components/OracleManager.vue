<template>
  <div>
    <div class="status-panel">
      <socket-connection-form></socket-connection-form>
      <oracle-status></oracle-status>
    </div>
    <div class="interaction">
      <oracle-registration-form></oracle-registration-form>
      <query-form></query-form>
    </div>
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

<style lang="scss">
  .interaction {
    display: flex;
    flex-direction: row;
  }
  .status-panel {
    display: flex;
    flex-direction: row;
  }
</style>
