<template>
  <ul class="errors" v-if="errors.length">
    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
  </ul>
</template>

<script>
export default {
  name: 'ErrorList',
  computed: {
    errors () {
      return this.$store.state.errors
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  // display: inline-block;
  margin: 0 10px;
}
</style>
