<template>
  <v-app id="app">

    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>GMTA Round Robin</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <template v-if="!authenticated">
          <v-btn icon class="hidden-md-and-up" flat @click="authenticate">
            <v-icon>fingerprint</v-icon>
          </v-btn>
          <v-btn class="hidden-sm-and-down" flat @click="authenticate">Log in</v-btn>
        </template>
        <template v-if="authenticated">
          <v-btn class="hidden-md-and-up" icon @click="logout">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
          <v-btn class="hidden-sm-and-down" flat @click="logout">Logout</v-btn>
        </template>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-breadcrumbs divider="/">
        <v-breadcrumbs-item
          v-for="item in getPathItems(fullPath)"
          :key="item.text"
          :to="{path: item.routerPath}"
          :disabled="item.disabled"
          exact
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex text-xs-center>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import ErrorList from './components/ErrorList'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    authenticated () {
      return this.$store.getters.authenticated
    },
    loading () {
      return this.$store.getters.loading
    },
    fullPath () {
      return this.$router.app.$route.fullPath
    },
    ...mapGetters('variables', ['getPathItems'])
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
  color: #2c3e50
}
/* #logo-header {

} */
h1, h2 {
  font-weight: normal;
}
</style>
