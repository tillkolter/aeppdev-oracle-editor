import OracleConnection from 'aepp-oracles-sdk'

const state = {
  messages: [],
  webSocket: undefined,
  oracleId: undefined,
  status: 'No Oracle',
  lambda: (x) => `Response for ${x}`
}

const mutations = {
  ADD_MESSAGE (state, message) {
    state.messages.push(message)
  },
  SET_WEBSOCKET_CONNECTION (state, socket) {
    state.webSocket = socket
  },
  SET_ORACLE_ID (state, id) {
    state.oracleId = id
  },
  SET_ORACLE_STATUS (state, status) {
    state.status = status
  },
  SET_LAMBDA (state, lambda) {
    state.lambda = lambda
  },
  SUBMIT_QUERY (state, {oracleId, queryFee, queryTtl, responseTtl, fee, query}) {
    state.webSocket.query(oracleId, queryFee, queryTtl, responseTtl, fee, query)
  }
}

const actions = {
  connect ({commit}, {host, port, account, httpPort}) {
    let connection = new OracleConnection(host, port, account, {httpPort})
    connection.on('message', (message) => {
      commit('ADD_MESSAGE', JSON.stringify(JSON.parse(message), null, 1))
    })
    connection.on('open', () => {
      commit('SET_WEBSOCKET_CONNECTION', connection)
    })
    connection.on('registeredOracle', (oracleId) => {
      commit('SET_ORACLE_ID', oracleId)
      commit('SET_ORACLE_STATUS', 'Registered')
      connection.subscribe(oracleId)
    })
    connection.on('newQuery', function (queryData) {
      connection.respond(queryData['query_id'], 4, state.lambda(JSON.stringify(queryData)))
    })
    connection.on('query', function (queryId) {
      console.log(`Query id ${queryId}`)
      connection.subscribeQuery(queryId)
    })
    connection.on('subscribed', function (queryId) {
      console.log(`Subscription event ${JSON.stringify(queryId)}`)
    })
    connection.on('response', function (response) {
      console.log(`CLIENT RESPONSE: ${response}`)
    })
  },
  disconnect ({commit, state}) {
    state.webSocket.close()
  },
  registerOracle ({commit}, {queryFormat, responseFormat, queryFee, ttl, fee}) {
    state.webSocket.register(queryFormat, responseFormat, queryFee, ttl, fee)
    commit('SET_ORACLE_STATUS', 'Pending')
  },
  setLambda ({commit}, lambda) {
    console.log(lambda)
    commit('SET_LAMBDA', lambda)
  },
  submitQuery ({commit}, args) {
    commit('SUBMIT_QUERY', args)
  }
}

const getters = {
  messages: (state) => state.messages,
  webSocket: (state) => state.webSocket,
  isConnected: (state) => state.webSocket && state.webSocket.readyState === WebSocket.OPEN,
  isClosed: (state) => typeof state.webSocket === 'undefined' || state.webSocket.readyState === WebSocket.CLOSED,
  isConnecting: (state) => state.webSocket && state.webSocket.readyState === WebSocket.CONNECTING,
  isClosing: (state) => state.webSocket && state.webSocket.readyState === WebSocket.CLOSING,
  oracleStatus: (state) => state.status,
  oracleId: (state) => state.oracleId,
  oracleLambda: (state) => state.lambda
}

export default {
  state,
  mutations,
  actions,
  getters
}
