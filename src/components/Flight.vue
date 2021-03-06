<template>
  <div>
    <v-card v-if="flight">
      <v-toolbar>
        <v-toolbar-title>{{ flight.name }}</v-toolbar-title>
      </v-toolbar>

      <v-container v-if="authenticated" fluid grid-list-xs>
        <v-layout row wrap>
          <v-flex v-for="player in players" :key="player.id" xs12 sm6 md4 class="px-4 py-3 text-xs-left">
            <h2 v-html="player.name"></h2>
            <h2 v-if="player.email">
              <a :href="'mailto:'+player.email" v-html="player.email"></a>
            </h2>
            <h2 v-if="player.phone">
              <a :href="'tel:'+player.phone">{{ player.phone }}</a>
            </h2>
          </v-flex>
        </v-layout>
      </v-container>
      <v-subheader v-else>Log in to view player info.</v-subheader>

      <flight-standings :flight="flight" class="ma-3"></flight-standings>

      <flight-matches :matchesByDate="matchesByDate" :myPlayers="$store.state.api.myPlayers" @editScore="editScore" class="ma-3"></flight-matches>

    </v-card>
  </div>
</template>

<script>
import FlightMatches from './FlightMatches'
import FlightStandings from './FlightStandings'

export default {
  props: {
    id: Number
  },
  name: 'Flight',
  computed: {
    authenticated () {
      return this.$store.getters.authenticated
    },
    flight () {
      return this.$store.state.api.currentFlight
    },
    isMyFlight () {
      const myPlayers = this.$store.state.api.myPlayers
      for (let p in this.players) {
        let player = this.players[p]
        if (player.id in myPlayers) {
          return true
        }
      }
      return false
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
      // fetch fresh copy of user's players in case it got stale
      this.$store.dispatch('fetchMyPlayers', this.id)
    },
    editScore (matchId) {
      this.$router.push({name: 'match-edit', params: { id: matchId }})
    }
  },
  components: {
    FlightMatches,
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
