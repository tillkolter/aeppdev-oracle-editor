import Aeternity from 'aepp-sdk'

import {truncate} from '../../utils/strings'

const state = {
  messages: [],
  provider: undefined,
  oracleId: undefined,
  status: 'Disconnected from Websocket',
  statusHistory: [],
  pollingInterval: undefined,
  lambda: (x) => new Promise((resolve, reject) => resolve(`Response for ${x}`)),
  lambdaString: '',
  blockHeight: undefined,
  responses: {},
  readyState: WebSocket.CLOSED,
  oracles: undefined
}

const mutations = {
  ADD_MESSAGE (state, message) {
    state.messages.push(message)
  },
  SET_WEBSOCKET_CONNECTION (state, socket) {
    state.provider = socket
  },
  SET_ORACLE_ID (state, id) {
    if (typeof id === 'undefined') {
      state.provider && state.provider.webSocket && state.provider.webSocket.close()
    }
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
    let sentData = state.oracles.query(oracleId, queryFee, queryTtl, responseTtl, fee, query)
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
  },
  SET_READY_STATE (state, readyState) {
    state.readyState = readyState
  },
  SET_ORACLES (state, oracles) {
    state.oracles = oracles
  }
}

const actions = {
  connect ({commit}, {host, port, httpPort}) {
    let client = new Aeternity(new Aeternity.providers.WebsocketProvider(host, port))
    let oracles = client.oracles
    let provider = client.provider
    provider.on('message', (message) => {
      let ingoingMessage = {
        message: JSON.stringify(JSON.parse(message), null, 1),
        incoming: true
      }
      commit('ADD_MESSAGE', ingoingMessage)
    })
    provider.on('close', () => {
      commit('SET_ORACLES', null)
      commit('SET_WEBSOCKET_CONNECTION', null)
      commit('SET_ORACLE_STATUS', 'Disconnected from Websocket')
      commit('SET_READY_STATE', WebSocket.CLOSED)
    })
    provider.on('open', () => {
      commit('SET_WEBSOCKET_CONNECTION', provider)
      commit('SET_ORACLES', oracles)
      commit('SET_ORACLE_STATUS', 'Connected to Websocket')
      commit('SET_READY_STATE', WebSocket.OPEN)
    })
    provider.on('registeredOracle', (oracleId) => {
      commit('SET_ORACLE_ID', oracleId)
      commit('SET_ORACLE_STATUS', 'Oracle registered')
      let sentData = oracles.subscribe(oracleId)
      commit('ADD_MESSAGE', {
        message: JSON.stringify(sentData, null, 1),
        incoming: false
      })
    })
    provider.on('newQuery', function (queryData) {
      state.lambda(queryData['query']).then(
        (response) => {
          let sentData = oracles.respond(queryData['query_id'], 4, response)
          commit('ADD_MESSAGE', {
            message: JSON.stringify(sentData, null, 1),
            incoming: false
          })
          commit('SET_ORACLE_STATUS', `Oracle sent answer to question ${truncate(queryData['query_id'])}`)
        }
      ).catch((error) => console.error(error))
    })
    provider.on('query', function (queryId) {
      let sentData = oracles.subscribeQuery(queryId)
      commit('ADD_MESSAGE', {
        message: JSON.stringify(sentData, null, 1),
        incoming: false
      })
      commit('SET_ORACLE_STATUS', `Waiting for response to question ${truncate(queryId)}`)
      commit('SET_QUERY_ID', queryId)
    })
    provider.on('response', function (response) {
      commit('SET_ORACLE_STATUS', `Client received response to question ${truncate(response['query_id'])} => ${response['response']}`)
      commit('SET_RESPONSE', {
        queryId: response['query_id'],
        response: response['response']
      })
    })
    provider.on('newBlock', function (blockHeight) {
      commit('SET_BLOCK_HEIGHT', blockHeight)
    })
  },
  disconnect ({commit, state}) {
    state.provider && state.provider.close()
    commit('SET_ORACLE_ID', undefined)
  },
  registerOracle ({commit}, {queryFormat, responseFormat, queryFee, ttl, fee}) {
    let sentData = state.oracles.register(queryFormat, responseFormat, queryFee, ttl, fee)
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
  webSocket: (state) => state.provider,
  isConnected: (state) => state.oracles && state.readyState === WebSocket.OPEN,
  isClosed: (state) => !state.oracles || state.readyState === WebSocket.CLOSED,
  oracleStatus: (state) => state.status,
  oracleId: (state) => state.oracleId,
  oracleLambda: (state) => state.lambda,
  oracleLambdaString: (state) => state.lambdaString,
  blockHeight: (state) => state.blockHeight,
  statusHistory: (state) => state.statusHistory,
  connectionStatus: (state) => {
    if (state.provider) {
      switch (state.provider.readyState) {
        case WebSocket.OPEN:
          return 'Connected'
        case WebSocket.CLOSED:
          return 'Disconnected'
        case WebSocket.CONNECTING:
          return 'Connecting'
        case WebSocket.CLOSING:
          return 'Closing'
        default:
          console.log(state.provider.readyState)
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
