<template>
  <div>
    home: {{ match.home_player.name }}
    visitor: {{ match.visitor_player.name }}
    <div v-if="played" class="match-result">
      {{ winnerName }} {{ match.score }}
    </div>
    <button v-if="canEditScore" v-on:click="editScore">
      Enter Score
    </button>
  </div>
</template>

<script>
export default {
  name: 'FlightMatch',
  props: ['match'],
  computed: {
    canEditScore () {
      return this.isMyMatch
    },
    isMyMatch () {
      let myPlayers = this.$store.state.api.myPlayers
      let homeId = this.match.home_player.id
      let visitorId = this.match.visitor_player.id
      return (homeId in myPlayers) || (visitorId in myPlayers)
    },
    played () {
      return !!this.match.played_date
    },
    winningPlayer() {
      if (this.match.winner === 'home') {
        return this.match.home_player
      } else if (this.match.winner === 'visitor') {
        return this.match.visitor_player
      }
      return null
    },
    winnerName () {
      if (this.winningPlayer) {
        return this.winningPlayer.name
      } else if (this.match.winner === 'double default') {
        return "Double Default"
      }
      return null
    },
  },
  methods: {
    editScore () {
      this.$router.push({name: 'match-edit', params: { id: this.match.id }})
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
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
