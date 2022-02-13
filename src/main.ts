import { createApp } from 'vue'
import { appRouterContext } from './router'
import store from './store'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'ant-design-vue/dist/antd.css';

createApp(App)
    .use(appRouterContext.routerState.router)
    .use(ElementPlus)
    .use(store)
    .mount('#app');




