import OracleConnection from 'aepp-oracles-sdk'
import {truncate} from '../../utils/strings'

const state = {
  messages: [],
  oracleConnection: undefined,
  oracleId: undefined,
  status: 'Disconnected from Websocket',
  statusHistory: [],
  pollingInterval: undefined,
  lambda: (x) => new Promise((resolve, reject) => resolve(`Response for ${x}`)),
  lambdaString: '',
  blockHeight: undefined,
  responses: {}
}

const mutations = {
  ADD_MESSAGE (state, message) {
    state.messages.push(message)
  },
  SET_WEBSOCKET_CONNECTION (state, socket) {
    state.oracleConnection = socket
  },
  SET_ORACLE_ID (state, id) {
    state.oracleId = id
  },
  SET_ORACLE_STATUS (state, status) {
    state.status = status
    state.statusHistory.push({timestamp: new Date(), message: status})
  },
  SET_LAMBDA (state, lambda) {
    state.lambda = Function(`return ${lambda}`)()
    state.lambdaString = lambda
  },
  SUBMIT_QUERY (state, {oracleId, queryFee, queryTtl, responseTtl, fee, query}) {
    let sentData = state.oracleConnection.query(oracleId, queryFee, queryTtl, responseTtl, fee, query)
    state.messages.push({
      message: JSON.stringify(sentData),
      incoming: false
    })
  },
  SET_BLOCK_HEIGHT (state, height) {
    state.blockHeight = height
  },
  SET_QUERY_ID (state, queryId) {
    state.queryId = queryId
  },
  SET_RESPONSE (state, {queryId, response}) {
    state.responses[queryId] = response
  }
}

const actions = {
  connect ({commit}, {host, port, account, httpPort}) {
    let connection = new OracleConnection(host, port, account, {httpPort})
    connection.on('message', (message) => {
      let ingoingMessage = {
        message: JSON.stringify(JSON.parse(message), null, 1),
        incoming: true
      }
      commit('ADD_MESSAGE', ingoingMessage)
    })
    connection.on('close', () => {
      commit('SET_WEBSOCKET_CONNECTION', null)
      commit('SET_ORACLE_STATUS', 'Disconnected from Websocket')
    })
    connection.on('open', () => {
      commit('SET_WEBSOCKET_CONNECTION', connection)
      commit('SET_ORACLE_STATUS', 'Connected to Websocket')
    })
    connection.on('registeredOracle', (oracleId) => {
      commit('SET_ORACLE_ID', oracleId)
      commit('SET_ORACLE_STATUS', 'Oracle registered')
      let sentData = connection.subscribe(oracleId)
      commit('ADD_MESSAGE', {
        message: JSON.stringify(sentData, null, 1),
        incoming: false
      })
    })
    connection.on('newQuery', function (queryData) {
      state.lambda(queryData['query']).then(
        (response) => {
          let sentData = connection.respond(queryData['query_id'], 4, response)
          commit('ADD_MESSAGE', {
            message: JSON.stringify(sentData, null, 1),
            incoming: false
          })
          commit('SET_ORACLE_STATUS', `Oracle sent answer to question ${truncate(queryData['query_id'])}`)
        }
      ).catch((error) => console.error(error))
    })
    connection.on('query', function (queryId) {
      let sentData = connection.subscribeQuery(queryId)
      commit('ADD_MESSAGE', {
        message: JSON.stringify(sentData, null, 1),
        incoming: false
      })
      commit('SET_ORACLE_STATUS', `Waiting for response to question ${truncate(queryId)}`)
      commit('SET_QUERY_ID', queryId)
    })
    connection.on('response', function (response) {
      commit('SET_ORACLE_STATUS', `Client received response to question ${truncate(response['query_id'])} => ${response['response']}`)
      commit('SET_RESPONSE', {
        queryId: response['query_id'],
        response: response['response']
      })
    })
    connection.on('newBlock', function (blockHeight) {
      commit('SET_BLOCK_HEIGHT', blockHeight)
    })
  },
  disconnect ({commit, state}) {
    state.oracleConnection && state.oracleConnection.webSocket && state.oracleConnection.webSocket.close()
    commit('SET_ORACLE_ID', undefined)
  },
  registerOracle ({commit}, {queryFormat, responseFormat, queryFee, ttl, fee}) {
    let sentData = state.oracleConnection.register(queryFormat, responseFormat, queryFee, ttl, fee)
    commit('ADD_MESSAGE', {
      message: JSON.stringify(sentData, null, 1),
      incoming: false
    })
    commit('SET_ORACLE_STATUS', 'Waiting for Oracle registration confirmation (waiting for next block)')
  },
  setLambda ({commit}, lambda) {
    /* eslint no-new-func: 'off' */
    commit('SET_LAMBDA', lambda)
  },
  submitQuery ({commit}, args) {
    commit('SUBMIT_QUERY', args)
    commit('SET_ORACLE_STATUS', 'Sending query')
  }
}

const getters = {
  messages: (state) => state.messages,
  webSocket: (state) => state.oracleConnection,
  isConnected: (state) => state.oracleConnection && state.oracleConnection.readyState === WebSocket.OPEN,
  isClosed: (state) => !state.oracleConnection || state.oracleConnection.readyState === WebSocket.CLOSED,
  isConnecting: (state) => state.oracleConnection && state.oracleConnection.readyState === WebSocket.CONNECTING,
  isClosing: (state) => state.oracleConnection && state.oracleConnection.readyState === WebSocket.CLOSING,
  oracleStatus: (state) => state.status,
  oracleId: (state) => state.oracleId,
  oracleLambda: (state) => state.lambda,
  oracleLambdaString: (state) => state.lambdaString,
  blockHeight: (state) => state.blockHeight,
  statusHistory: (state) => state.statusHistory,
  connectionStatus: (state) => {
    if (state.oracleConnection) {
      switch (state.oracleConnection.webSocket.readyState) {
        case WebSocket.OPEN:
          return 'Connected'
        case WebSocket.CLOSED:
          return 'Disconnected'
        case WebSocket.CONNECTING:
          return 'Connecting'
        case WebSocket.CLOSING:
          return 'Closing'
        default:
          console.log(state.oracleConnection.webSocket.readyState)
          return 'Undefined'
      }
    } else {
      return 'Disconnected'
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
