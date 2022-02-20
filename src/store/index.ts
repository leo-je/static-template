/* jshint esversion: 6 */
import user from './modules/user'
import menu from './modules/menu'
import todolist from './modules/todolist'
import { createStore } from 'vuex'
import persistedState from "vuex-persistedstate";
export default createStore({
  modules: {
    user,
    menu,
    todolist,
  },
  plugins: [persistedState({
    key: 'je-store',
    paths: []
  })]
})

