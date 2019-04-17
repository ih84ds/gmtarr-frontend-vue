<template>
  <div>
    <h1 class="text-xs-left">Standings</h1>
    <v-data-table
      :headers="headers"
      :items="standings"
      hide-actions
    >
      <template slot="items" slot-scope="player">
        <td class="text-xs-left">{{ player.item.name }}</td>
        <td class="text-xs-right">{{ player.item.wins }}</td>
        <td class="text-xs-right">{{ player.item.losses }}</td>
        <td class="text-xs-right">{{ player.item.ties }}</td>
        <td class="text-xs-right">{{ gamesWonPerc(player) }}%</td>
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
          align: 'right',
          sortable: false
        },
        {
          text: 'L',
          align: 'right',
          sortable: false
        },
        {
          text: 'Tie',
          align: 'right',
          sortable: false
        },
        {
          text: 'Game %',
          align: 'right',
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
      return Math.round(player.item.game_win_percentage) || 0
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
