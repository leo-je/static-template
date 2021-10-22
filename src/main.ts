import { createApp } from 'vue'
import router, { setRouter } from './router'
import store from './store'
import App from './App.vue'
import http from './utils/http';
import 'ant-design-vue/dist/antd.css';

createApp(App)
    // .use(setRouter({}))
    .use(router)
    // .use(Antd)
    .use(store)
    .mount('#app');

http("get", "/api-user/busi/menu/valid/tree", { id: "0" })
    .then(data => {
        setRouter(data)
    }).catch(e => {
        console.error("==============>", e);
    });


