/* jshint esversion: 6 */
import user from './modules/user'
import { createStore } from 'vuex'

const store = createStore({
  modules: {
    user
  }
})

export default store
