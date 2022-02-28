import { RouterInfo } from "@/interface";

const routers:Array<RouterInfo> = [
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

export default routers