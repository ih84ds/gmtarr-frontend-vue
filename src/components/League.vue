<template>
  <div>
    <div class="content" v-if="league">
      <h2>{{ league.name }}</h2>
      <ul v-if="flights.length">
        <li v-for="flight in flights" :key="flight.id">
          <router-link :to="{name: 'flight', params: {leagueId: id, flightId: flight.id}}">{{ flight.name }}</router-link>
        </li>
      </ul>
      <p v-else>There are no flights right now. Check back soon!</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number
  },
  name: 'League',
  computed: {
    league () {
      return this.$store.state.api.currentLeague
    },
    flights () {
      return this.$store.state.api.currentLeagueFlights
    },
  },
  created () {
    this.fetchData()
  },
  watch: {
    id: 'fetchData'
  },
  methods: {
    fetchData () {
      this.$store.dispatch('fetchLeague', this.id)
      this.$store.dispatch('fetchLeagueFlights', this.id)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
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
