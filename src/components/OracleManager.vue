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
    <div class="logs">
      <socket-console></socket-console>
      <status-history></status-history>
    </div>
  </div>
</template>

<script>
  import SocketConnectionForm from './OracleManager/SocketConnectionForm'
  import SocketConsole from './OracleManager/SocketConsole'
  import OracleRegistrationForm from './OracleManager/OracleRegistrationForm'
  import OracleStatus from './OracleManager/OracleStatus'
  import QueryForm from './OracleManager/QueryForm'
  import StatusHistory from './OracleManager/StatusHistory'
  export default {
    components: {
      StatusHistory,
      QueryForm,
      OracleStatus,
      OracleRegistrationForm,
      SocketConsole,
      SocketConnectionForm},
    name: 'OracleManager'
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
  .logs {
    display: flex;
  }
</style>
