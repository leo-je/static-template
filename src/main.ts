import { createApp } from 'vue'
import { appRouterContext } from './router'
import store from './store'
import App from './App.vue'
import antd from 'ant-design-vue'
import ElementPlus from 'element-plus';
import DesignForm from 'vue-form-create'

import VForm3 from 'vform3-builds';  //引入VForm 3库
import 'vform3-builds/dist/designer.style.css'  //引入VForm3样式

import 'ant-design-vue/dist/antd.css';
import 'element-plus/theme-chalk/src/index.scss';
import './assets/iconfont.js';

createApp(App)
    .use(appRouterContext.routerState.router)
    .use(antd)
    .use(ElementPlus)
    .use(DesignForm)
    .use(VForm3)
    .use(store)
    .mount('#app');




