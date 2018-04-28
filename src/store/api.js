import axios from 'axios'
import jwtDecode from 'jwt-decode'

const axiosConfig = {
  baseURL: process.env.API_BASE_URL
}

const $axios = axios.create(axiosConfig)

const OAUTH_URL = process.env.WA_OAUTH_LOGIN_URL
const OAUTH_CLIENT_ID = 'roundrobin'
const OAUTH_SCOPE = 'contacts_me'

const state = {
  authToken: localStorage.getItem('api-auth-token') || '',
  currentFlight: null,
  currentFlightMatches: [],
  currentFlightPlayers: [],
  currentFlightStandings: [],
  currentLeague: null,
  currentLeagueFlights: [],
  currentMatch: null,
  currentMatchOptions: null,
  leagues: [],
  myPlayers: {},
}

const getters = {
  authenticated: (state, getters) => {
    return !!state.authToken
  },
  authTokenData: (state, getters) => {
    return getters.authenticated ? jwtDecode(state.authToken) : null
  },
  authTokenExpiration: (state, getters) => {
    let expiration = null
    let tokenData = getters.authTokenData
    let expTimestamp = tokenData.exp
    if (expTimestamp > 0) {
      // exp is in seconds, Date expects milliseconds
      expiration = new Date(expTimestamp * 1000)
    }
    return expiration
  },
}

const mutations = {
  authorizeApi: (state) => {
    if (state.authToken) {
      // set up Authorization header
      $axios.defaults.headers.common['Authorization'] = 'JWT ' + state.authToken
    }
  },
  clearAuthToken: (state) => {
    state.authToken = ''
    // fugget about it
    localStorage.removeItem('api-auth-token')
  },
  clearMyPlayers: (state) => {
    state.myPlayers = {}
  },
  deauthorizeApi: (state) => {
    // remove Authorization header
    delete $axios.defaults.headers.common['Authorization']
  },
  setAuthToken: (state, token) => {
    state.authToken = token
    // save for late in case user leaves and comes back
    localStorage.setItem('api-auth-token', token)
  },
  setCurrentFlight: (state, flight) => {
    state.currentFlight = flight
  },
  setCurrentFlightMatches: (state, matches) => {
    state.currentFlightMatches = matches
  },
  setCurrentFlightPlayers: (state, players) => {
    state.currentFlightPlayers = players
  },
  setCurrentFlightStandings: (state, standings) => {
    state.currentFlightStandings = standings
  },
  setCurrentLeague: (state, league) => {
    state.currentLeague = league
  },
  setCurrentLeagueFlights: (state, flights) => {
    state.currentLeagueFlights = flights
  },
  setCurrentMatch: (state, match) => {
    state.currentMatch = match
  },
  setCurrentMatchOptions: (state, options) => {
    state.currentMatchOptions = options
  },
  setLeagues: (state, leagues) => {
    state.leagues = leagues
  },
  setMyPlayers: (state, players) => {
    state.myPlayers = players
  },
}

const actions = {
  authenticate (context, redirect_uri) {
    let authArgs = {
      client_id: OAUTH_CLIENT_ID,
      scope: OAUTH_SCOPE,
      redirect_uri: redirect_uri,
    }
    let queryString = objecToQueryString(authArgs)
    window.location.replace(OAUTH_URL+'?'+queryString)
  },
  fetchFlight (context, flightId) {
    context.commit('setCurrentFlight', null)
    return $axios
      .get('flights/'+flightId)
      .then(response => {
        context.commit('setCurrentFlight', response.data)
      })
      .catch(error => {
        if (error.response.status === 404) {
          context.commit('addError', "Flight not found.")
        } else {
          context.commit('addError', error.toString())
        }
      })
  },
  fetchFlightMatches (context, flightId) {
    context.commit('setCurrentFlightMatches', [])
    return $axios
      .get('flights/'+flightId+'/matches')
      .then(response => {
        context.commit('setCurrentFlightMatches', response.data)
      })
      .catch(error => {
        if (error.response.status === 404) {
          context.commit('addError', "Flight matches not found.")
        } else {
          context.commit('addError', error.toString())
        }
      })
  },
  fetchFlightPlayers (context, flightId) {
    context.commit('setCurrentFlightPlayers', [])
    return $axios
      .get('flights/'+flightId+'/players')
      .then(response => {
        context.commit('setCurrentFlightPlayers', response.data)
      })
      .catch(error => {
        if (error.response.status === 404) {
          context.commit('addError', "Flight players not found.")
        } else {
          context.commit('addError', error.toString())
        }
      })
  },
  fetchFlightStandings (context, flightId) {
    context.commit('setCurrentFlightStandings', [])
    return $axios
      .get('flights/'+flightId+'/standings')
      .then(response => {
        context.commit('setCurrentFlightStandings', response.data)
      })
      .catch(error => {
        if (error.response.status === 404) {
          context.commit('addError', "Flight standings not found.")
        } else {
          context.commit('addError', error.toString())
        }
      })
  },
  fetchLeague (context, leagueId) {
    context.commit('setCurrentLeague', null)
    return $axios
      .get('leagues/'+leagueId)
      .then(response => {
        context.commit('setCurrentLeague', response.data)
      })
      .catch(error => {
        if (error.response.status === 404) {
          context.commit('addError', "League not found.")
        } else {
          context.commit('addError', error.toString())
        }
      })
  },
  fetchLeagueFlights (context, leagueId) {
    context.commit('setCurrentLeagueFlights', [])
    return $axios
      .get('leagues/'+leagueId+'/flights')
      .then(response => {
        context.commit('setCurrentLeagueFlights', response.data)
      })
      .catch(error => {
        if (error.response.status === 404) {
          context.commit('addError', "League flights not found.")
        } else {
          context.commit('addError', error.toString())
        }
      })
  },
  fetchLeagues (context) {
    return $axios
      .get('leagues')
      .then(response => {
        context.commit('setLeagues', response.data)
      })
      .catch(error => {
        context.commit('addError', error.toString())
      })
  },
  fetchMatch (context, matchId) {
    context.commit('setCurrentMatch', null)
    return $axios
      .get('matches/'+matchId)
      .then(response => {
        context.commit('setCurrentMatch', response.data)
      })
      .catch(error => {
        if (error.response.status === 404) {
          context.commit('addError', "Match not found.")
        } else {
          context.commit('addError', error.toString())
        }
      })
  },
  fetchMatchOptions (context, matchId) {
    context.commit('setCurrentMatchOptions', null)
    return $axios
      .options('matches/'+matchId)
      .then(response => {
        context.commit('setCurrentMatchOptions', response.data)
      })
      .catch(error => {
        if (error.response.status === 404) {
          context.commit('addError', "Match Options not found.")
        } else {
          context.commit('addError', error.toString())
        }
      })
  },
  fetchMyPlayers (context) {
    if (context.getters.authenticated) {
      context.commit('setMyPlayers', {})
      return $axios
        .get('players/mine')
        .then(response => {
          let myPlayers = {}
          let myPlayersArray = response.data
          for (var i = myPlayersArray.length - 1; i >= 0; i--) {
            let player = myPlayersArray[i]
            myPlayers[player.id] = player
          }
          context.commit('setMyPlayers', myPlayers)
        })
        .catch(error => {
          context.commit('addError', error.toString())
        })
    }
  },
  initApi (context) {
    context.commit('authorizeApi')
    // tell the app we're loading something
    $axios.interceptors.request.use((config) => {
        context.commit('beginLoader')
        return config
      })
    // tell the app we're done loading the thing
    $axios.interceptors.response.use((response) => {
        context.commit('endLoader')
        return response
      }, (error) => {
        context.commit('endLoader')
        return Promise.reject(error)
      })
    context.dispatch('refreshAuthToken')
    context.dispatch('fetchMyPlayers')
  },
  logout (context) {
    context.commit('clearAuthToken')
    context.commit('clearMyPlayers')
    context.commit('deauthorizeApi')
  },
  refreshAuthToken (context) {
    if (context.getters.authenticated) {
      let data = { token: state.authToken }
      return $axios.post('refresh-token', data)
        .then(response => {
          context.commit('setAuthToken', response.data.token)
          context.commit('authorizeApi')
          context.dispatch('scheduleAuthTokenRefresh')
        })
        .catch(error => {
          context.commit('clearAuthToken')
          context.commit('deauthorizeApi')
        })
    }
  },
  requestAuthToken (context, params) {
    return $axios.get('auth-token', { params: params })
      .then(response => {
        context.commit('setAuthToken', response.data.token)
        context.commit('authorizeApi')
        context.dispatch('fetchMyPlayers')
        context.dispatch('scheduleAuthTokenRefresh')
      })
      // No catch... leave current token as-is
  },
  scheduleAuthTokenRefresh (context) {
    let expiration = context.getters.authTokenExpiration
    if (expiration instanceof Date) {
      let now = new Date()
      let msLeft = expiration.getTime() - now.getTime()
      // refresh token one minute before it expires
      let refreshAt = msLeft - 60000
      if (refreshAt < 0) {
        // if there is less that a minute left, refresh now
        refreshAt = 0
      }
      setTimeout(() => { context.dispatch('refreshAuthToken') }, refreshAt)
    }
  },
  submitMatchScore (context, params) {
    return $axios.put('matches/'+params.id, params.data)
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