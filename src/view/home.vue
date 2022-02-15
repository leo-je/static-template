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
            <SubMenu v-if="menus.length > 0" :menus="menus"></SubMenu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '695px' }">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">Ant Design ©2018 Created by Ant UED</a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { message, Layout, LayoutHeader, LayoutFooter, LayoutContent, Menu, LayoutSider } from 'ant-design-vue';
import { UserOutlined, createFromIconfontCN } from "@ant-design/icons-vue";
import SubMenu from '../components/submenu';
import store from '../store';
import { RouterInfo } from '../interface';


const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

export default defineComponent({
  setup() {
    return {
      loading: false,
      selectedKeys1: ["2"],
      selectedKeys2: ["1"],
      openKeys: ["sub1"],
      user: ref({
        nickName: "xxx",
      }),
      menus: ref<RouterInfo[]>([])
    };
  },
  components: {
    UserOutlined,
    IconFont,
    SubMenu,
    ALayout: Layout,
    ALayoutHeader: LayoutHeader,
    ALayoutFooter: LayoutFooter,
    ALayoutContent: LayoutContent,
    AMenu: Menu,
    ALayoutSider: LayoutSider,
  },
  methods: {
    to(path: string) {
      this.$router.push({ path });
    }
  },
  mounted() {
    console.log("dashboard")
    let _this = this;
    store
      .dispatch("LoginByUsername", {})
      .then((data) => {
        this.user = Object.assign(this.user, data);
        return store.dispatch("LoadMenu", { id: "0" });
      }).then((data: any) => {
        console.log("============LoginByUsername==========>", data)
        if (data) {
          let menus = [data]
          console.log("===========LoginByUsername===========>", menus)
          _this.menus = (menus);
        }
      })
      .catch((e: Error) => {
        console.error("dash", e);
        message.error(e.message);
        this.loading = false;
      });
  },
  beforeCreate() {
    // this.$router.push({ path: "/" });
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