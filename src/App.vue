<template>
  <router-view />
</template>

<script lang="ts">
import http from './utils/http';
import { setRouter } from './router'
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    return {}
  },
  mounted() {
    this.$router.push({path:'/401'})
    http("get", "/api-user/busi/menu/valid/tree", { id: "0" })
      .then(data => {
        //后台获取路由数并添加到路由对象
        setRouter([data]  )
      }).catch(e => {
        console.error("==============>", e);
      });
  },
  beforeCreate() {

  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
