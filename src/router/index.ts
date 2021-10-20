import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from '../store'
const modules = import.meta.globEager('../view/**/*.vue')


export interface RouterInfo {
    path: string,
    name: string,
    componentPath: string,
    children?: Array<RouterInfo>
}
let routerInfos: Array<RouterInfo> = []
const routes: Array<RouteRecordRaw> = []
await store.dispatch("LoadMenu",{}).then(data=>{
    if(data){
        routerInfos = [Object.assign({},data)]
    }
})

// const routerInfos: Array<RouterInfo> = [
//     {
//         path: '/',
//         name: 'dashboard',
//         componentPath: '../view/dashboard.vue',
//         children: [
//             {
//                 path: '/setting/roles',
//                 name: 'SettingRoles',
//                 componentPath: '../view/setting/roles.vue',
//             },
//             {
//                 path: '/setting/groups',
//                 name: 'SettingGroups',
//                 componentPath: '../view/setting/groups.vue',
//             },
//             {
//                 path: '/setting/users',
//                 name: 'SettingUsers',
//                 componentPath: '../view/setting/users.vue',
//             },
//             {
//                 path: '/setting/menu',
//                 name: 'SettingMenu',
//                 componentPath: '../view/setting/menu.vue',
//             },
//         ]
//     },

// ]

// const routes: Array<RouteRecordRaw> = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: () => import('../view/dashboard.vue'),
    //     children: [
    //         {
    //             path: '/setting/roles',
    //             name: 'SettingRoles',
    //             component: () => import('../view/setting/roles.vue'),
    //         },
    //         {
    //             path: '/setting/groups',
    //             name: 'SettingGroups',
    //             component: () => import('../view/setting/groups.vue'),
    //         },
    //         {
    //             path: '/setting/users',
    //             name: 'SettingUsers',
    //             component: () => import('../view/setting/users.vue'),
    //         },
    //     ]
    // },
// ];

const getRow = (routerInfo: RouterInfo): RouteRecordRaw => {
    console.log(routerInfo)
    const row: RouteRecordRaw = {
        path: routerInfo.path,
        name: routerInfo.name,
        component: () => import(/* @vite-ignore */routerInfo.componentPath?routerInfo.componentPath:"../view/setting.vue"),
    }
    console.log(routerInfo.children)
    if (routerInfo.children!=null && routerInfo.children.length > 0) {
        const ch:RouteRecordRaw[]=[]
        routerInfo.children.forEach(c => {
            ch.push(getRow(c))
        })
        row.children = ch
    }
    return row;
}

if (routerInfos) {
    routerInfos.forEach(routerInfo => {
        const row = getRow(routerInfo)
        routes.push(row)
    })
}

console.log(modules)
console.log(routes)


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;