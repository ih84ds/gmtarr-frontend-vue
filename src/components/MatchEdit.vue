<template>
  <div>
    <ul class="form-errors" v-if="errors.length">
      <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
    </ul>
    <v-container grid-list-lg>
      <v-form v-on:submit.prevent="submitScore" v-model="valid">
        <v-select
          v-model="status"
          :items="statusChoices"
          item-text="display_name"
          item-value="value"
          :rules="[v => !!v || 'Status is required']"
          label="Status"
          required
        ></v-select>
      <v-menu
            ref="dateMenu"
            :close-on-content-click="false"
            v-model="dateMenu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              v-model="played_date_formatted"
              label="Match date"
              hint="MM/DD/YYYY format"
              persistent-hint
              append-icon="event"
              @blur="played_date = parseDate(played_date_formatted)"
              required
              :rules="[v => !!v || 'Match date is required']"
            ></v-text-field>
            <v-date-picker v-model="played_date" no-title @input="dateMenu = false"></v-date-picker>
          </v-menu>
        <v-select
          v-model="winner"
          :items="winnerChoices"
          item-text="display_name"
          item-value="value"
          :rules="[v => !!v || 'Winner is required']"
          label="Winner"
          required
        ></v-select>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-text-field
              v-model.number="score_winner"
              type="number"
              label="Winner score"
              required
              max="11"
              min="0"
              :rules="[v => (!isNaN(v) && v <= 11 && v >= 0) || 'Winner score between 0 and 11 is required']"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model.number="score_loser"
              type="number"
              label="Loser score"
              required
              max="10"
              min="0"
              :rules="[v => (!isNaN(v) && v <= 10 && v >= 0) || 'Loser score between 0 and 10 is required']"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-btn outline color="red" @click="cancel">cancel</v-btn>
        <v-btn outline color="grey" @click="clearData">clear</v-btn>
        <v-btn
          outline
          color="green"
          type="submit"
          :disabled="!valid"
        >
          submit
        </v-btn>
      </v-form>
    </v-container>
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
      played_date_formatted: null,
      date: null,
      dateMenu: false,
      score_loser: null,
      score_winner: null,
      status: null,
      winner: null,
      valid: true,
      maxWinnerScore: 11
    }
  },
  computed: {
    canEditScore () {
      return this.isMyMatch
    },
    flight () {
      return this.match && this.match.flight
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
    played_date (val) {
      this.played_date_formatted = this.formatDate(this.played_date)
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
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
          this.$router.push({name: 'flight', params: { flightId: this.flight.id, leagueId: this.flight.league }})
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
    cancel () {
      this.$router.push({name: 'flight', params: { flightId: this.flight.id, leagueId: this.flight.league }})
    }
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
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
