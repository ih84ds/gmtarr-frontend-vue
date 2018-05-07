<template>
  <div>
    <h1 class="text-xs-left">Standings</h1>
    <v-data-table
      :headers="headers"
      :items="standings"
      hide-actions
    >
      <template slot="items" slot-scope="player">
        <td>{{ player.item.name }}</td>
        <td>{{ player.item.wins }}</td>
        <td>{{ player.item.losses }}</td>
        <td>{{ player.item.ties }}</td>
        <td>{{ gamesWonPerc(player) }}%</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'FlightStandings',
  props: ['flight'],
  data () {
    return {
      headers: [
        {
          text: '',
          align: 'left',
          sortable: false
        },
        {
          text: 'W',
          align: 'left',
          sortable: false
        },
        {
          text: 'L',
          align: 'left',
          sortable: false
        },
        {
          text: 'Tie',
          align: 'left',
          sortable: false
        },
        {
          text: 'Game %',
          align: 'left',
          sortable: false
        }
      ]
    }
  },
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
    gamesWonPerc: function (player) {
      let wins = parseInt(player.item.game_wins)
      let losses = parseInt(player.item.game_losses)
      return Math.round(wins * 100 / (wins + losses)) || 0
    }
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
