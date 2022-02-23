import { reactive } from "vue";
import { createRouter, createWebHistory, Router, RouteRecordRaw } from "vue-router";
import { AppRouter, AppRouterState, RouterInfo } from "../interface";
const modules = import.meta.glob('../**/*.(vue|tsx)')

const appRouterState = reactive<AppRouterState>({
    router: initRouter(),
    modules: modules
})
function getRow(routerInfo: RouterInfo): RouteRecordRaw | null {
    if (routerInfo.type === '3') {
        console.log(routerInfo)
        return null;
    }
    let view = modules[routerInfo.componentPath ? routerInfo.componentPath.replace("@", "..").replace("src", "..") : "../view/commonView.vue"]
    if (!view) {
        view = modules['../view/commonView.vue']
    }
    const row: RouteRecordRaw = {
        path: routerInfo.path ? routerInfo.path : "",
        name: routerInfo.name,
        component: view
    }
    if (routerInfo.children != null && routerInfo.children.length > 0) {
        const ch: RouteRecordRaw[] = []
        routerInfo.children.forEach(c => {
            let r = getRow(c);
            if (r) ch.push(r);
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
        {
            path: '/logout',
            name: 'logout',
            componentPath: '../view/logout.vue',
        },
    ]
    if (routerInfos) {
        routerInfos.forEach(routerInfo => {
            if (!routerInfo.componentPath) return;
            const row = getRow(routerInfo)
            row ? routes.push(row) : null
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

export function setRouter(data: RouterInfo[], path?: string) {
    const router = appRouterContext.routerState.router;
    let firstPath = '/';
    let tagetData: RouterInfo[] | null = data.slice(0);
    let top: RouterInfo | null = null;
    if (tagetData && tagetData[0].pId == '~') {
        top = tagetData[0].children?.filter(ch => ch.path === 'top')[0] || null;
        let children = tagetData[0].children?.filter(ch => ch.path != 'top') || [];
        if (tagetData && top) {
            firstPath = children[0].path || firstPath
            tagetData = [];
            let tagetData_0 = top.children?.filter(ch => ch.path === '/')[0] || null;
            if (tagetData_0) {
                tagetData_0.children = children;
                tagetData[0] = tagetData_0;
            }
            tagetData.push(...top.children || []);
        }
    }
    console.log(tagetData)
    let routes2: Array<RouteRecordRaw> = []
    if (tagetData) {
        tagetData.forEach((routerInfo) => {
            const row = getRow(routerInfo);
            row ? routes2.push(row) : null;
        })
    }
    console.log(tagetData)
    routes2.forEach(r => {
        router.addRoute(r)
    })
    appRouterContext.routerState.router = router
    if (path && path !== '/') {
        // xxx?dd=xx&ddf=ff
        let paramArr = path.split('?').length > 1 ? path.split('?')[1].split('&') : []
        let query: { [key: string]: any } = {}
        if (paramArr.length > 0) {
            paramArr.map(arr => {
                arr = decodeURIComponent(arr)
                query[arr.split('=')[0]] = arr.split('=')[1]
            })
        }
        path = path.split('?')[0]
        router.push({ path, query })
    } else {
        router.push({ path: firstPath })
    }

}


export function getRouter(): Router {
    return appRouterContext.routerState.router
}