import { createApp } from 'vue'
import { appRouterContext } from './router'
import store from './store'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';

createApp(App)
    .use(appRouterContext.routerState.router)
    // .use(Antd)
    .use(store)
    .mount('#app');




