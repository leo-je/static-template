<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: 'App',
  components: {
  },
    mounted() {
    // let _this = this;
    // store
    //   .dispatch("LoginByUsername", {})
    //   .then((data,) => {
    //     store.dispatch("LoadMenu", { id: "1" }).then(data => {
    //     if (data) {
    //         let routerData: Array<RouteRecordRaw> = [Object.assign({}, data)]
    //         const newRouter = createRouter({
    //             history: createWebHistory(),
    //             routes: routerData,
    //         })
    //         router. // reset router
    //     }
    // })
    //   })
    //   .catch((e: Error) => {
    //     console.error("dash", e);
    //     message.error(e.message);
    //   });
  },
  beforeCreate() {
    this.$router.push({ path: "/" });
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
