<template>
  <div>
    <h3>Standings</h3>
    <ul v-if="standings">
      <li v-for="player in standings" :key="player.player_id">
        {{ player.name }} {{ player.wins }}-{{ player.losses }} ({{ player.game_wins }}-{{ player.game_losses }})
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FlightStandings',
  props: ['flight'],
  computed: {
    standings () {
      return this.$store.state.api.currentFlightStandings
    },
  },
  created () {
    this.fetchData()
  },
  watch: {
    flight: 'fetchData'
  },
  methods: {
    fetchData () {
      this.$store.dispatch('fetchFlightStandings', this.flight.id)
    },
  },
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
  //display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
