<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-header class="header">
      <div class="logo">
        <!-- <img src="logo.png"/> -->
        <span>pm</span>
      </div>
      <div class="userInfo">
        <!-- <span id="nickName">你好,{{ user.nickName }}</span> -->
        <div id="nickName">
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              你好,{{ user.nickName }}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu @click="item => dropdownMenuHandle(item)">
                <a-menu-item key="logout">
                  <a href="javascript:;">注销</a>
                </a-menu-item>
                <a-menu-item key="2">
                  <a href="javascript:;">2nd menu item</a>
                </a-menu-item>
                <a-menu-item key="3">
                  <a href="javascript:;">3rd menu item</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 0px">
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider
          width="200"
          style="background: #fff;max-height: calc(100vh - 200px);
    overflow: auto;"
        >
          <a-menu
            mode="inline"
            v-model:selectedKeys="selectedKeys2"
            v-model:openKeys="openKeys"
            style
          >
            <SubMenu v-if="menus.length > 0" :menus="menus"></SubMenu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content
          :style="{ padding: '0 24px', minHeight: mainHeight, maxHeight: mainHeight, overflow: 'auto' }"
        >
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">.....</a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { message, Layout, LayoutHeader, LayoutFooter, LayoutContent, Menu, LayoutSider, Dropdown, MenuItem } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';
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
      visible: ref(false),
      loading: false,
      selectedKeys1: ["2"],
      selectedKeys2: ["1"],
      openKeys: ["sub1"],
      user: ref({
        nickName: "xxx",
      }),
      menus: ref<RouterInfo[]>([]),
      mainHeight: ref('600px')
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
    ADropdown: Dropdown,
    AMenuItem: MenuItem,
    ALayoutSider: LayoutSider,
    DownOutlined: DownOutlined
  },
  methods: {
    log(k: any) {
      // console.log(k)
    },
    to(path: string) {
      this.$router.push({ path });
    },
    updateMainHigth() {
      let _this = this;
      let windowHeight = window.innerHeight;//document.body.clientHeight
      windowHeight = windowHeight - 64 - 70 - 48 - 4
      if (windowHeight < 400) {
        windowHeight = 400
      }
      _this.mainHeight = windowHeight + 'px'
    },
    dropdownMenuHandle(item: any) {
      // console.log(item)
      if (item.key == 'logout') {
        store.dispatch('user_logout')
      }
    },
  },
  mounted() {
    // console.log("home")
    let _this = this;
    store
      .dispatch("LoginByUsername", {})
      .then((data) => {
        this.user = Object.assign(this.user, data);
        return store.dispatch("LoadMenu", { id: "0" });
      }).then((data: any) => {
        // console.log("============LoginByUsername==========>", data)
        if (data) {
          let menus = [data]
          // console.log("===========LoginByUsername===========>", menus)
          _this.menus = (menus);
        }
      })
      .catch((e: Error) => {
        // console.error("dash", e);
        message.error(e.message);
        this.loading = false;
      });
    window.onresize = () => {
      return (() => {
        let windowHeight = document.body.clientHeight
        windowHeight = windowHeight - 64 - 70 - 48 - 4
        if (windowHeight < 400) {
          windowHeight = 400
        }
        _this.mainHeight = windowHeight + 'px'
      })()
    }
    this.updateMainHigth()
  },
  beforeCreate() {
    // this.$router.push({ path: "/" });
  },
});
</script>

<style scoped lang="less">
::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性

  background-color: #f8f8f8;
}

::-webkit-scrollbar {
  //滚动条的宽度

  width: 5px;

  height: 9px;
}

::-webkit-scrollbar-thumb {
  //滚动条的设置

  background-color: rgba(0, 0, 0, 0.85);

  background-clip: padding-box;

  min-height: 28px;
}

::-webkit-scrollbar-thumb:hover {
  undefinedbackground-color: #bbb;
}
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