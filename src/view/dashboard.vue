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
            <Menu v-if="menus.length > 0" :menus="menus"></Menu>
            <!-- <template v-if="menus">
              <template v-for="(subitem) in menus" :key="subitem.id">
                <template v-if="subitem.type !== '2'">
                  <a-menu-item
                    v-if="!subitem.children"
                    :key="subitem.id"
                    @click="to(subitem.path)"
                  >{{ subitem.name }}</a-menu-item>
                  <a-sub-menu v-else>
                    <template #title>
                      <span>
                        <user-outlined />
                        {{ subitem.name }}
                      </span>
                    </template>
                    
                    <template v-for="(subitem3) in subitem.children" v-bind:key="subitem3.id">
                      <a-menu-item
                        v-if="!subitem3.children"
                        :key="subitem3.id"
                        @click="to(subitem3.path)"
                      >{{ subitem3.name }}</a-menu-item>
                      <a-sub-menu v-else>
                        <template #title>
                          <span>
                            <user-outlined />
                            {{ subitem3.name }}
                          </span>
                        </template>
                        <template v-for="(subitem4) in subitem3.children" :key="subitem4.id">
                          <a-menu-item
                            v-if="subitem4.type !== '2'"
                            @click="to(subitem4.path)"
                          >{{ subitem4.name }}</a-menu-item>
                        </template>
                      </a-sub-menu>
                    </template>
                  </a-sub-menu>
                </template>
              </template>
            </template>-->
            <!-- <a-sub-menu v-for="(item) in menus" :key="item.id">
              <template #title>
                <span>
                   <component :is="'UserOutlined'" /> 
                  <IconFont v-if="item.iconName" :type="item.iconName" />
                  {{ item.name }}
                </span>
              </template>
               
              <template v-if="item.children">
                <template v-for="(subitem) in item.children" :key="subitem.id">
                  <a-menu-item
                    v-if="!subitem.children"
                    :key="subitem.id"
                    @click="to(subitem.path)"
                  >{{ subitem.name }}</a-menu-item>
                  <a-sub-menu v-else>
                    <template #title>
                      <span>
                        <user-outlined />
                        {{ subitem.name }}
                      </span>
                    </template>
                     3 
                    <template v-for="(subitem3) in subitem.children" v-bind:key="subitem3.id">
                      <a-menu-item
                        v-if="!subitem3.children"
                        key="{{subitem3.id}}"
                        @click="to(subitem3.path)"
                      >{{ subitem3.name }}</a-menu-item>
                      <a-sub-menu v-else>
                        <template #title>
                          <span>
                            <user-outlined />
                            {{ subitem3.name }}
                          </span>
                        </template>
                        <a-menu-item
                          v-for="(subitem4) in subitem3.children"
                          v-bind:key="subitem4.id"
                          @click="to(subitem4.path)"
                        >{{ subitem4.name }}</a-menu-item>
                      </a-sub-menu>
                    </template>
                  </a-sub-menu>
                </template>
              </template>
            </a-sub-menu>-->

            <!-- <a-sub-menu key="sub1">
              <template #title>
                <span>
                  <user-outlined />系统维护
                </span>
              </template>
              <a-menu-item key="roles" @click="to('/setting/roles')">角色维护</a-menu-item>
              <a-menu-item key="4" @click="to('/setting/users')">用户管理</a-menu-item>
              <a-menu-item key="5" @click="to('/setting/groups')">用户组管理</a-menu-item>
              <a-sub-menu key="sub1-2">
                <template #title>
                  <span>
                    <user-outlined />系统维护2
                  </span>
                </template>
                <a-menu-item key="roles2" @click="to('/setting/roles')">角色维护</a-menu-item>
                <a-menu-item key="42" @click="to('/setting/users')">用户管理</a-menu-item>
                <a-menu-item key="52" @click="to('/setting/groups')">用户组管理</a-menu-item>
                <a-menu-item key="52" @click="to('/setting/menu')">菜单管理</a-menu-item>
              </a-sub-menu>
              <a-menu-item key="5" @click="to('/setting/menu')">菜单管理</a-menu-item>
            </a-sub-menu>-->
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
import { defineComponent, computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined } from "@ant-design/icons-vue";
import { createFromIconfontCN } from '@ant-design/icons-vue';
import Menu from '../components/Menu';
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
    Menu,
  },
  methods: {
    to(path: string) {
      this.$router.push({ path });
    }
  },
  mounted() {
    let _this = this;
    store
      .dispatch("LoginByUsername", {})
      .then((data) => {
        this.user = Object.assign(this.user, data);
        return store.dispatch("LoadMenu", { id: "1" });
      }).then((data: any) => {
        console.log("======================>", data)
        if (data) {
          let menus = data.children
          console.log("======================>", menus)
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