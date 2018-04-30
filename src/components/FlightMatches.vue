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
          <td>{{ match.item.name }}</td>
          <td>{{ match.item.wins }}</td>
          <td>{{ match.item.losses }}</td>
          <td>{{ match.item.ties }}</td>
        </template>
      </v-data-table>
    </div>
    <p v-if="!date.matches.length">There are no matches right now. Check back soon!</p>
  </div>
</template>

<script>
export default {
  name: 'FlightMatches',
  props: ['matchesByDate']
}
</script>
