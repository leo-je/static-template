<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-header class="header">
      <div class="logo">
        <!-- <img src="logo.png"/> -->
        <span>pm</span>
      </div>
      <div class="userInfo">
        <span id="nickName">你好,{{ user.nickName }}</span>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 0px">
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            mode="inline"
            v-model:selectedKeys="selectedKeys2"
            v-model:openKeys="openKeys"
            style="height: 100%"
          >
            <a-sub-menu key="sub1">
              <template #title>
                <span><user-outlined />系统维护</span>
              </template>
              <a-menu-item key="roles" @click="to('/setting/roles')"
                >角色维护</a-menu-item
              >
              <a-menu-item key="4" @click="to('/setting/users')"
                >用户管理</a-menu-item
              >
              <a-menu-item key="5" @click="to('/setting/groups')"
                >用户组管理</a-menu-item
              >
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '695px' }">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
    return {
      loading:false,
      selectedKeys1: ["2"],
      selectedKeys2: ["1"],
      openKeys: ["sub1"],
      user: ref({
        nickName: "xxx",
      }),
    };
  },
  components: {
    UserOutlined,
  },
  methods: {
    to(path: string) {
      this.$router.push({ path });
    },
  },
  mounted() {
    let _this = this;
    this.$store
      .dispatch("LoginByUsername", {})
      .then((data) => {
        console.log("user-data", data);
        console.log("user", this.user);
        this.user = Object.assign(this.user, data);
        console.log("user", this.user);
      })
      .catch((e:Error) => {
        console.error("dash", e);
        message.error(e.message);
        this.loading = false;
      });
  },
  beforeCreate() {
    this.$router.push({ path: "/setting/roles" });
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