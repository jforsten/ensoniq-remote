import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
