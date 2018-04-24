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
import ErrorList from './components/Errorlist'

export default {
  name: 'App',
  computed: {
    authenticated () {
      return this.$store.getters.authenticated
    },
    loading () {
      return this.$store.getters.loading
    },
  },
  created () {
    this.authorizeApi()
  },
  watch: {
    authenticated (newAuthenticated, oldAuthenticated) {
      if (newAuthenticated) {
        this.authorizeApi()
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
    authorizeApi () {
      // set up Authorization header
      let token = this.$store.state.auth.apiToken
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
