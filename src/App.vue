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
    // 获取当前路径,在设置完router后打开
    let currUrl = location.pathname + location.search
    console.log(location.pathname)
    if (location.pathname != '/logout') {
      http("get", "/api-user/busi/menu/valid/tree", { id: "0" })
        .then(data => {
          //后台获取路由数并添加到路由对象
          setRouter([data], currUrl)
        }).catch(e => {
          console.error("==============>", e);
        });
    }else{
      
    }
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
  min-width: 1422px;
}
</style>
