<template>
  <div>
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
  data () {
    return {
      leagues: []
    }
  },
  created () {
    this.$axios
      .get('leagues')
      .then(response => {
        this.leagues = response.data
      })
      .catch(error => {
        this.$store.commit('addError', error.toString())
      })
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
  // display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
