<template>
  <div>logout</div>
  <div>
    <a @click="() => { to('/') }">返回首页</a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
/**
 * 
 * 登出流程：
 * 1.(store-user-logout)跳转gateway的登出地址：清除gateway的session
 * 2.(gateway)gateway重定向到oauth2登出地址，清除oauth2的session
 * 3.(oauth2)跳转到前端的logout页面
 * 
 */
export default defineComponent({
  setup() {
    return {};
  },
  components: {

  },
  methods: {
    to(path: string) {
      location.href = path
    },
  },
  mounted() {
    console.log("================= logout ================= ");
  },
  beforeCreate() {

  },
});
</script>

<style scoped>
#components-layout-demo-top-side .logo {
  text-align: left;
  line-height: 25px;
  width: 120px;
  height: 31px;
  /* background: rgba(255, 255, 255, 0.2); */
  margin: 16px 28px 16px 0;
  float: left;
}
#components-layout-demo-top-side .logo img {
  width: 31px;
  height: 31px;
}

#components-layout-demo-top-side .logo span {
  font-size: 40px;
  color: aquamarine;
}
#components-layout-demo-top-side .userInfo {
  position: absolute;
  text-align: left;
  line-height: 25px;
  width: 120px;
  height: 31px;
  /* background: rgba(255, 255, 255, 0.2); */
  margin: 16px 28px 16px 0;
  right: 5px;
}

#nickName {
  font-size: 16px;
  color: aquamarine;
}
</style>