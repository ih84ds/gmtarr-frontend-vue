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
    authenticated () {
      return this.$store.getters.authenticated
    },
    loading () {
      return this.$store.getters.loading
    },
  },
  created () {
    this.$store.dispatch('initApi')
  },
  methods: {
    authenticate () {
      let currentPath = this.$route.fullPath
      this.$router.push({name: 'login', query: { next: currentPath }})
    },
    logout () {
      this.$router.push({name: 'logout'})
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
