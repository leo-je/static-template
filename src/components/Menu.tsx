import { defineComponent } from "vue";
import { getRouter } from "../router";
export default defineComponent({
  name: 'Menu',
  props: {
    menus: Array,
  },
  // setup(props) {
  //   return props
  // },
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

