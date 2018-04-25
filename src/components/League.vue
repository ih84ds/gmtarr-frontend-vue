<template>
  <div>
    <div class="content" v-if="league">
      <h2>{{ league.name }}</h2>
      <ul v-if="flights.length">
        <li v-for="flight in flights" :key="flight.id">
          <router-link :to="{name: 'flight', params: {id: flight.id}}">{{ flight.name }}</router-link>
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
  data () {
    return {
      league: null,
      flights: [],
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
      this.fetchLeague()
      this.fetchFlights()
    },
    fetchFlights () {
      this.$store.commit('beginLoader')
      this.$axios
        .get('leagues/'+this.id+'/flights')
        .then(response => {
          this.flights = response.data
          this.$store.commit('endLoader')
        })
        .catch(error => {
          this.flights = []
          if (error.response.status === 404) {
            this.$store.commit('addError', "League flights not found.")
          } else {
            this.$store.commit('addError', error.toString())
          }
          this.$store.commit('endLoader')
        })
    },
    fetchLeague () {
      this.$store.commit('beginLoader')
      this.$axios
        .get('leagues/'+this.id)
        .then(response => {
          this.league = response.data
          this.$store.commit('endLoader')
        })
        .catch(error => {
          this.league = null
          if (error.response.status === 404) {
            this.$store.commit('addError', "League not found.")
          } else {
            this.$store.commit('addError', error.toString())
          }
          this.$store.commit('endLoader')
        })
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
  //display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
