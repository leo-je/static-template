import { reactive } from "vue";
import { createRouter, createWebHistory, Router, RouteRecordRaw } from "vue-router";
import { AppRouter, AppRouterState, RouterInfo } from "../interface";
const modules = import.meta.glob('../**/*.vue')

const appRouterState = reactive<AppRouterState>({
    router: initRouter(),
    modules: modules
})
function getRow(routerInfo: RouterInfo): RouteRecordRaw {
    console.log("getRow:" + routerInfo.componentPath)
    let view = modules[routerInfo.componentPath ? routerInfo.componentPath.replace("@", "..").replace("src", "..") : "../view/commonView.vue"]
    if (!view) {
        view = modules['../view/commonView.vue']
        console.log(view)
    }
    const row: RouteRecordRaw = {
        path: routerInfo.path ? routerInfo.path : "",
        name: routerInfo.name,
        component: view
    }
    if (routerInfo.children != null && routerInfo.children.length > 0) {
        const ch: RouteRecordRaw[] = []
        routerInfo.children.forEach(c => {
            ch.push(getRow(c))
        })
        row.children = ch
    }
    return row;
}

function initRouter() {
    const routes: Array<RouteRecordRaw> = []
    const routerInfos: Array<RouterInfo> = [
        {
            path: '/401',
            name: '401',
            componentPath: '../view/401.vue',
        },
    ]
    if (routerInfos) {
        routerInfos.forEach(routerInfo => {
            if (!routerInfo.componentPath) return;
            const row = getRow(routerInfo)
            routes.push(row)
        })
    }

    let router = createRouter({
        history: createWebHistory(),
        routes,
    });

    return router;
}



export const appRouterContext: AppRouter = {
    routerState: appRouterState
}
const router = appRouterContext.routerState.router
export default router;

export function setRouter(data: RouterInfo[]) {
    const router = appRouterContext.routerState.router
    console.log("setRouter==============>")
    let routerInfos = data;
    let routes2: Array<RouteRecordRaw> = []
    if (routerInfos) {  
        routerInfos.forEach((routerInfo) => {
            const row = getRow(routerInfo)
            routes2.push(row)
        })
    }
    console.log(routes2)
    routes2.forEach(r => {
        router.addRoute(r)
    })
    let dd = router.getRoutes()
    console.log(dd)
    console.log("setRouter==============>")
    appRouterContext.routerState.router = router
    router.push({ path: "/" })
}

export function getRouter(): Router {
    return appRouterContext.routerState.router
}