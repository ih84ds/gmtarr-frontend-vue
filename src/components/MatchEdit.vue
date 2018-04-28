<template>
  <div>
    <ul class="form-errors" v-if="errors.length">
      <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
    </ul>
    <form v-on:submit.prevent="submitScore">
      <select name="status" v-model="status">
        <option :value="null">--</option>
        <option v-for="opt in statusChoices" :key="opt.value" :value="opt.value">{{ opt.display_name }}</option>
      </select>
      <input type="date" name="played_date" v-model="played_date">
      <select name="winner" v-model="winner">
        <option :value="null">--</option>
        <option v-for="opt in winnerChoices" :key="opt.value" :value="opt.value">{{ opt.display_name }}</option>
      </select>
      <input type="number" name="score_winner" v-model.number="score_winner" step="1" min="0" max="11">
      &ndash;
      <input type="number" name="score_loser" v-model.number="score_loser" step="1" min="0" max="10">
      <button>
        Submit Score
      </button>
      <button v-on:click.prevent="onCancel">
        Cancel
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MatchEdit',
  props: ['id'],
  data: function () {
    return {
      errors: [],
      played_date: null,
      score_loser: null,
      score_winner: null,
      status: null,
      winner: null,
    }
  },
  computed: {
    canEditScore () {
      return this.isMyMatch
    },
    homePlayerName () {
      return this.match && this.match.home_player.name
    },
    isMyMatch () {
      if (this.match) {
        let myPlayers = this.$store.state.api.myPlayers
        let homeId = this.match.home_player.id
        let visitorId = this.match.visitor_player.id
        return (homeId in myPlayers) || (visitorId in myPlayers)
      }
      return false
    },
    match () {
      return this.$store.state.api.currentMatch
    },
    played () {
      return this.match && !!this.match.played_date
    },
    score: {
      get: function () {
        return this.score_winner + '-' + this.score_loser
      },
      set: function(score) {
        let parts = score && score.split('-')
        if (parts && parts.length === 2) {
          this.score_winner = parseInt(parts[0])
          this.score_loser = parseInt(parts[1])
        } else {
          // invalid score. nullify it.
          this.score_winner = null
          this.score_loser = null
        }
      }
    },
    statusChoices () {
      // use the options specified by the api server
      let matchOptions = this.$store.state.api.currentMatchOptions
      let apiChoices = []
      try {
        apiChoices = matchOptions.actions.PUT.status.choices
      } catch (e) {
        // options not defined.
      }
      return apiChoices
    },
    visitorPlayerName () {
      return this.match && this.match.visitor_player.name
    },
    winnerChoices () {
      // use the options specified by the api server
      let matchOptions = this.$store.state.api.currentMatchOptions
      let apiChoices = []
      try {
        apiChoices = matchOptions.actions.PUT.winner.choices
      } catch (e) {
        // options not defined.
      }
      // make it more user-friendly by displaying player names
      let homePlayerName = this.homePlayerName
      let visitorPlayerName = this.visitorPlayerName
      // must create our own array instead of modifying the state object directly (by reference)
      let winnerChoices = []
      for (let i = 0; i < apiChoices.length; i++) {
        let myChoice = { value: apiChoices[i].value, display_name: apiChoices[i].display_name }
        if (myChoice.value === 'home' && homePlayerName) { myChoice.display_name = homePlayerName }
        if (myChoice.value === 'visitor' && visitorPlayerName) { myChoice.display_name = visitorPlayerName }
        winnerChoices.push(myChoice)
      }
      return winnerChoices
    },
  },
  created () {
    this.fetchData()
  },
  watch: {
    id: 'fetchData',
    match: 'setDataFromMatch',
  },
  methods: {
    onCancel () {
      this.$router.back()
    },
    clearData () {
      this.played_date = null
      this.score = null
      this.status = null
      this.winner = null
    },
    clearErrors () {
      this.errors = []
    },
    fetchData () {
      this.$store.dispatch('fetchMatch', this.id)
      this.$store.dispatch('fetchMatchOptions', this.id)
    },
    setDataFromMatch () {
      if (this.match) {
        this.played_date = this.match.played_date
        this.score = this.match.score
        this.status = this.match.status
        this.winner = this.match.winner
      } else {
        this.clearData()
      }
      this.clearErrors()
    },
    submitScore () {
      this.clearErrors()
      let params = {
        id: this.id,
        data: {
          played_date: this.played_date,
          score: this.score,
          status: this.status,
          winner: this.winner,
        }
      }
      this.$store.dispatch('submitMatchScore', params)
        .then((response) => {
          this.$router.push({name: 'flight', params: { id: this.match.flight.id }})
        })
        .catch((error) => {
          let errors = error.response.data
          for (let fieldName in errors) {
            let fieldErrors = errors[fieldName]
            for (var i = fieldErrors.length - 1; i >= 0; i--) {
              let fieldError = fieldErrors[i]
              this.errors.push(fieldName+': '+fieldError)
            }
          }
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
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
