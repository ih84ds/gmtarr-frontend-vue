<template>
  <div id="app">
    <router-link :to="{name: 'home'}" id="logo-header">
      <img src="./assets/gmta-logo.png">
      <img src="./assets/rr.png">
      <h1>GMTA Round Robin</h1>
    </router-link>
    <button v-if="authenticated" v-on:click="logout">
      Log Out
    </button>
    <button v-else v-on:click="authenticate">
      Log In
    </button>
    <error-list/>
    <div class="loading" v-if="loading">
      Loading...
    </div>
    <router-view/>
  </div>
</template>

<script>
import ErrorList from './components/ErrorList'

export default {
  name: 'App',
  computed: {
    apiToken () {
      return this.$store.state.auth.apiToken
    },
    authenticated () {
      return this.$store.getters.authenticated
    },
    loading () {
      return this.$store.getters.loading
    },
    apiTokenExpiration () {
      return this.$store.getters.apiTokenExpiration
    }
  },
  created () {
    this.authorizeApi()
    this.refreshApiToken()
  },
  watch: {
    apiToken (newToken, oldToken) {
      if (this.authenticated) {
        this.authorizeApi()
        this.scheduleApiTokenRefresh()
      } else {
        this.deauthorizeApi()
      }
    }
  },
  methods: {
    authenticate () {
      let currentPath = this.$route.fullPath
      this.$router.push({name: 'login', query: { next: currentPath }})
    },
    logout () {
      this.$router.push({name: 'logout'})
    },
    refreshApiToken () {
      if (this.authenticated) {
        this.$store.dispatch('refreshToken')
      }
    },
    scheduleApiTokenRefresh() {
      let expiration = this.apiTokenExpiration
      if (expiration instanceof Date) {
        let now = new Date()
        let msLeft = expiration.getTime() - now.getTime()
        // refresh token one minute before it expires
        let refreshAt = msLeft - 60000
        if (refreshAt < 0) {
          // if there is less that a minute left, refresh now
          refreshAt = 0
        }
        setTimeout(this.refreshApiToken, refreshAt)
      }
    },
    authorizeApi () {
      // set up Authorization header
      let token = this.apiToken
      if (token) {
        this.$axios.defaults.headers.common['Authorization'] = 'JWT ' + token
      }
    },
    deauthorizeApi () {
      // remove Authorization header
      delete this.$axios.defaults.headers.common['Authorization']
    },
  },
  components: {
    ErrorList
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#logo-header {
  
}
h1, h2 {
  font-weight: normal;
}
</style>
