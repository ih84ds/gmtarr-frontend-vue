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
  // FIXME add a way to remove/clear errors or maybe just use a "flash" module...
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
</style>
