<template>
  <div class="flight">
    <div class="content" v-if="flight">
      <h2>{{ flight.name }}</h2>
      <ul v-if="players.length">
        <li v-for="player in players" :key="player.id">
          {{ player.name }}
          ({{ player.ntrp}})
          <a v-if="player.email" :href="'mailto:'+player.email">{{ player.email }}</a>
          <a v-if="player.phone" :href="'tel:'+player.phone">{{ player.phone }}</a>
        </li>
      </ul>
      <p v-else>There are no players right now. Check back soon!</p>
      <flight-standings :flight="flight"></flight-standings>
      <h3>Schedule</h3>
      <ul v-if="matchesByDate.length">
        <li v-for="date in matchesByDate" :key="date.date">
          {{ date.date }}
          <ul v-if="date.matches.length">
            <li v-for="match in date.matches" :key="match.id">
              <flight-match :match="match"></flight-match>
            </li>
          </ul>
        </li>
      </ul>
      <p v-else>There are no matches right now. Check back soon!</p>
    </div>
  </div>
</template>

<script>
import FlightMatch from './FlightMatch'
import FlightStandings from './FlightStandings'

export default {
  props: {
    id: Number
  },
  name: 'Flight',
  computed: {
    flight () {
      return this.$store.state.api.currentFlight
    },
    matches () {
      return this.$store.state.api.currentFlightMatches
    },
    matchesByDate  () {
      const matchesByDate = []
      const dates = []
      const dateMatches = {}
      for (let m in this.matches) {
        let match = this.matches[m]
        let date = match.scheduled_date
        if (!(date in dateMatches)) {
          dates.push(date)
          dateMatches[date] = []
        }
        dateMatches[date].push(match)
      }
      dates.sort().forEach(function (date) {
        matchesByDate.push({
          date: date,
          matches: dateMatches[date]
        })
      })
      return matchesByDate
    },
    players () {
      return this.$store.state.api.currentFlightPlayers
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
      this.$store.dispatch('fetchFlight', this.id)
      this.$store.dispatch('fetchFlightMatches', this.id)
      this.$store.dispatch('fetchFlightPlayers', this.id)
    },
  },
  components: {
    FlightMatch,
    FlightStandings,
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
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
