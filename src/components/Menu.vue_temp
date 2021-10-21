<template>
  <a-menu
    mode="inline"
    v-model:selectedKeys="selectedKeys2"
    v-model:openKeys="openKeys"
    style="height: 100%"
  >
    <a-sub-menu key="sub1">
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
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: 'Menu',
  setup() {
    return {
      selectedKeys2: ref(""),
      openKeys: ref("")
    }
  },
  methods: {
    getMenu(menus) {
    }
  }
})
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
