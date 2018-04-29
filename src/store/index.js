import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'
import variables from './variables'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  loaderCount: 0,
  errors: [],
}

const getters = {
  loading: (state, getters) => {
    return state.loaderCount > 0
  }
}

const mutations = {
  addError (state, error) {
    state.errors.push(error)
  },
  clearErrors (state) {
    state.errors = []
  },
  removeError (state, index) {
    if (index >= 0 && index < state.errors.length) {
      state.errors.splice(index, 1)
    }
  },
  beginLoader (state) {
    state.loaderCount++
  },
  endLoader (state) {
    state.loaderCount--
  }
}

const actions = {

}

const modules = {
  api,
  variables
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
  strict: debug
})


if (module.hot) {
  // accept actions and mutations as hot modules
  let hotModules = [
    './modules/variables',
    './modules/api'
  ]

  module.hot.accept(hotModules, () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    // swap in the new actions and mutations
    store.hotUpdate({
      modules: {
        variables: newVrequire('./vars').default,
        api: newVrequire('./api').default
      }
    })
  })
}

export default store
