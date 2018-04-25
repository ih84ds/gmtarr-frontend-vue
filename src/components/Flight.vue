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
      <ul v-if="matchesByDate.length">
        <li v-for="date in matchesByDate" :key="date.date">
          {{ date.date }}
          <ul v-if="date.matches.length">
            <li v-for="match in date.matches" :key="match.id">
              home: {{ match.home_player.name }}
              visitor: {{ match.visitor_player.name }}
            </li>
          </ul>
        </li>
      </ul>
      <p v-else>There are no matches right now. Check back soon!</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number
  },
  name: 'Flight',
  data () {
    return {
      flight: null,
      players: [],
      matches: [],
    }
  },
  computed: {
    matchesByDate: function () {
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
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    id: 'fetchData'
  },
  methods: {
    fetchData () {
      this.fetchFlight()
      this.fetchPlayers()
      this.fetchMatches()
    },
    fetchFlight () {
      this.$store.commit('beginLoader')
      this.$axios
        .get('flights/'+this.id)
        .then(response => {
          this.flight = response.data
          this.$store.commit('endLoader')
        })
        .catch(error => {
          this.flight = null
          if (error.response.status === 404) {
            this.$store.commit('addError', "Flight not found.")
          } else {
            this.$store.commit('addError', error.toString())
          }
          this.$store.commit('endLoader')
        })
    },
    fetchMatches () {
      this.$store.commit('beginLoader')
      this.$axios
        .get('flights/'+this.id+'/matches')
        .then(response => {
          this.matches = response.data
          this.$store.commit('endLoader')
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.$store.commit('addError', "Flight matches not found.")
          } else {
            this.$store.commit('addError', error.toString())
          }
          this.$store.commit('endLoader')
        })
    },
    fetchPlayers () {
      this.$store.commit('beginLoader')
      this.$axios
        .get('flights/'+this.id+'/players')
        .then(response => {
          this.players = response.data
          this.$store.commit('endLoader')
        })
        .catch(error => {
          this.players = []
          if (error.response.status === 404) {
            this.$store.commit('addError', "Flight players not found.")
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
