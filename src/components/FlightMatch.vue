<template>
  <div>
    home: {{ match.home_player.name }}
    visitor: {{ match.visitor_player.name }}
    <div v-if="played" class="match-result">
      {{ winnerName }} {{ match.score }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightMatch',
  props: ['match'],
  computed: {
    played () {
      return !!this.match.played_date
    },
    winningPlayer() {
      if (this.match.winner) {
        let winnerKey = this.match.winner + '_player'
        return this.match[winnerKey]
      }
      return null
    },
    winnerName () {
      let winner = this.winningPlayer
      return winner.name
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
