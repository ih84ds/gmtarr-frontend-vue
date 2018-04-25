import jwtDecode from 'jwt-decode'
import api from '../api'
import router from '../router'

const OAUTH_URL = process.env.WA_OAUTH_LOGIN_URL
const OAUTH_CLIENT_ID = 'roundrobin'
const OAUTH_SCOPE = 'contacts_me'

const state = {
  apiToken: localStorage.getItem('api-token') || '',
}

const getters = {
  authenticated: (state, getters) => {
    // FIXME: check token expiration and/or validity?
    return !!state.apiToken
  },
  apiTokenData: (state, getters) => {
    return getters.authenticated ? jwtDecode(state.apiToken) : null
  },
  apiTokenExpiration: (state, getters) => {
    let expiration = null
    let tokenData = getters.apiTokenData
    let expTimestamp = tokenData.exp
    if (expTimestamp > 0) {
      // exp is in seconds, Date expects milliseconds
      expiration = new Date(expTimestamp * 1000)
    }
    return expiration
  },
}

const mutations = {
  setApiToken: (state, token) => {
    state.apiToken = token
    // set up Authorization header
    api.defaults.headers.common['Authorization'] = 'JWT '+token
    // save for late in case user leaves and comes back
    localStorage.setItem('api-token', token)
  },
  clearApiToken: (state) => {
    state.apiToken = ''
    // remove Authorization header
    delete api.defaults.headers.common['Authorization']
    // fugget about it
    localStorage.removeItem('api-token')
  }
}

const actions = {
  authenticate: (context, redirect_uri) => {
    let authArgs = {
      client_id: OAUTH_CLIENT_ID,
      scope: OAUTH_SCOPE,
      redirect_uri: redirect_uri,
    }
    let queryString = objecToQueryString(authArgs)
    window.location.replace(OAUTH_URL+'?'+queryString)
  },
  refreshToken: (context) => {
    let data = { token: state.apiToken }
    return api.post('refresh-token', data)
      .then(response => {
        context.commit('setApiToken', response.data.token)
      })
      .catch(error => {
        context.commit('clearApiToken')
      })
  },
  requestToken: (context, params) => {
    return api.get('auth-token', { params: params })
      .then(response => {
        context.commit('setApiToken', response.data.token)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}

function objecToQueryString(obj) {
  let params = []
  for (let key in obj) {
    params.push(key + '=' + encodeURIComponent(obj[key]))
  }
  return params.join('&')
}