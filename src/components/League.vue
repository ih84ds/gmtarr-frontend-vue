<template>
  <div>
    <v-card v-if="league">
      <v-toolbar>
        <v-toolbar-title>{{ league.name }}</v-toolbar-title>
      </v-toolbar>
      <v-list v-if="flights.length">
        <v-list-tile v-for="flight in flights" :key="flight.id" :to="{name: 'flight', params: {leagueId: id, flightId: flight.id}}">
          <v-list-tile-content>
            <v-list-tile-title v-html="flight.name"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <p v-else>There are no flights right now. Check back soon!</p>
    </v-card>
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
