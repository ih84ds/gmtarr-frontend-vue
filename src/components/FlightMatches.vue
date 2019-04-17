<template>
  <div>
    <h1 class="text-xs-left">Schedule</h1>
    <div v-for="date in matchesByDate" :key="date.date">
      <h2>{{ date.date }}</h2>
      <v-data-table
        :headers="headers"
        :items="date.matches"
        hide-actions
      >
        <template slot="items" slot-scope="match">
          <td :class="match.item.winner === 'home' ? 'winner' : ''">{{ match.item.home_player.name }}</td>
          <td :class="match.item.winner === 'visitor' ? 'winner' : ''">{{ match.item.visitor_player.name }}</td>
          <td v-if="match.item.score" class="text-xs-right">
            <v-btn class="scoreEnter" flat :disabled="!canEdit(match.item)" @click.native="editScore(match.item.id)">{{ match.item.score }}</v-btn>
          </td>
          <td v-else class="text-xs-right">
            <v-btn flat @click="editScore(match.item.id)" v-if="canEdit(match.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </div>
    <p v-if="!matchesByDate.length">There are no matches right now. Check back soon!</p>
  </div>
</template>

<script>
export default {
  name: 'FlightMatches',
  props: ['matchesByDate', 'myPlayers'],
  data () {
    return {
      headers: [
        {
          text: 'Home',
          align: 'left',
          sortable: false,
          value: 'home_player',
          class: 'forty'
        },
        {
          text: 'Visitor',
          align: 'left',
          sortable: false,
          value: 'visitor_player',
          class: 'forty'
        },
        {
          text: 'Score',
          align: 'right',
          sortable: false,
          value: 'score',
          class: 'twenty'
        }
      ]
    }
  },
  methods: {
    canEdit: function (match) {
      if (this.myPlayers) {
        let myPlayers = this.myPlayers
        let homeId = match.home_player.id
        let visitorId = match.visitor_player.id
        return (homeId in myPlayers) || (visitorId in myPlayers)
      }
    },
    editScore: function (matchId) {
      this.$emit('editScore', matchId)
    }
  }
}
</script>

<style>
td {
  text-align: left;
}
td.winner {
  font-weight: bold !important;
  font-style: italic;
}
.theme--light td button.v-btn.scoreEnter {
  color: teal !important;
  text-decoration: underline;
}
.theme--light td button.v-btn.v-btn--disabled {
  color: #000000 !important;
  text-decoration: none;
}
.forty {
  width: 40%;
}
.twenty {
  width: 20%;
}
</style>
