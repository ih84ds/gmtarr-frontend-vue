<template>
  <div>Logging in...</div>
</template>

<script>
export default {
  name: 'Login',
  created () {
    if (this.$route.name === 'logout') {
      this.logout()
    } else {
      this.login()
    }
  },
  methods: {
    login () {
      let code = this.$route.query.code
      // NOTE: we build from location components insetead of using href to esure we exclude extra junk--query string, etc.
      let redirect_uri = [window.location.protocol, '//', window.location.host, window.location.pathname].join('')
      if (code) {
        let next = sessionStorage.getItem('login-next')
        if (next) {
          sessionStorage.removeItem('login-next')
        }
        let nextRoute = next ? {path: next} : {name: 'home'}
        let params = {
          code: code,
          redirect_uri: redirect_uri,
        }
        this.$store.dispatch('requestAuthToken', params)
          .then(() => {
            this.$router.replace(nextRoute)
          })
          .catch(error => {
            this.$store.commit('addError', error.toString())
            this.$router.replace(nextRoute)
          })
      } else {
        let next = this.$route.query.next
        if (next) {
          sessionStorage.setItem('login-next', next)
        }
        // redirect back to this page from WA login page
        this.$store.dispatch('authenticate', redirect_uri)
      }
    },

    logout () {
      this.$store.dispatch('logout')
        .then(() => {
          console.log('logged out')
          this.$router.replace({name: 'home'})
        })
    }
  }
}
</script>
