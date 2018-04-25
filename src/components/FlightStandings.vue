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
  data () {
    return {
      standings: [],
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    flight: 'fetchData'
  },
  methods: {
    fetchData () {
      this.fetchStandings()
    },
    fetchStandings () {
      this.$store.commit('beginLoader')
      this.$axios
        .get('flights/'+this.flight.id+'/standings')
        .then(response => {
          this.standings = response.data
          this.$store.commit('endLoader')
        })
        .catch(error => {
          this.flight = null
          if (error.response.status === 404) {
            this.$store.commit('addError', "Flight standings not found.")
          } else {
            this.$store.commit('addError', error.toString())
          }
          this.$store.commit('endLoader')
        })
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
