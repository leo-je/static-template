import { createApp } from 'vue'
import { setRouter } from './router'
import store from './store'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import http from './utils/http';


http("get", "/api-user/busi/menu/valid/tree", { id: "1" })
    .then(data => {
        createApp(App)
            .use(setRouter(data))
            .use(Antd)
            .use(store)
            .mount('#app');
    }).catch(e => {
        console.error("==============>", e);
    });


