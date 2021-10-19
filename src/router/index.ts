import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../view/dashboard.vue'),
        children: [
            {
                path: '/setting/roles',
                name: 'SettingRoles',
                component: () => import('../components/HelloWorld.vue'),
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;