<template>
  <div>
    <img src="../assets/rr.png">
    <h1>GMTA Round Robin</h1>
    <ul v-if="leagues.length">
      <li v-for="league in leagues" :key="league.id">
        <router-link :to="{name: 'league', params: {id: league.id}}">{{ league.name }}</router-link>
      </li>
    </ul>
    <p v-else>There are no leagues right now. Check back soon!</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    leagues () {
      return this.$store.state.api.leagues
    }
  },
  created () {
    this.$store.dispatch('fetchLeagues')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
