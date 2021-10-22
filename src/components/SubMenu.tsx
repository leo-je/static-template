import { defineComponent } from "vue";
import { getRouter } from "../router";
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
    const getMenu = (menus: any) => {
      return menus.map((item: any) => {
        return <>
          {item.children ? <a-sub-menu title={item.name} >
            {getMenu(item.children)}
          </a-sub-menu> : <a-menu-item onClick={() => getRouter().push({ path: item.path })} >{item.name}</a-menu-item>}
        </>
      })
    }
    return () => getMenu(props.menus);
  }
})

