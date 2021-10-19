/* jshint esversion: 6 */
import user from './modules/user'
import { createStore } from 'vuex'

export default createStore({
  modules: {
    user
  }
})

