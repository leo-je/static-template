/* jshint esversion: 6 */
import user from './modules/user'
import menu from './modules/menu'
import { createStore } from 'vuex'

export default createStore({
  modules: {
    user,
    menu
  }
})

