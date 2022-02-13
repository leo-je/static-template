import { defineComponent } from "vue";
import { getRouter, appRouterContext } from "../router";
import { SubMenu, MenuItem } from "ant-design-vue";

export default defineComponent({
  name: 'subMenu',
  props: {
    menus: Array,
  },
  components: {
    ASubMenu: SubMenu,
    AMenuItem: MenuItem
  },
  setup(props) {
    const getMenu = (menus: any[]) => {
      // 排除顶级菜单不渲染
      let tagMenus = menus[0].pId == '~' ? menus[0].children : menus;
      return tagMenus.map((item: any) => {
        console.log(item.path)
        return (
          <>
            {item.children ?
              <>
                <a-sub-menu title={item.name} >
                  {
                    getMenu(item.children)
                  }
                </a-sub-menu>
              </> :
              <>
                <a-menu-item onClick={() => {
                  appRouterContext.routerState.router.push({ path: item.path })
                }} >{item.name
                  }</a-menu-item>
              </>
            }
          </>)
      })
    }
    return () => getMenu(props.menus);
  }
})

