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
                component: () => import('../view/setting/roles.vue'),
            },
            {
                path: '/setting/groups',
                name: 'SettingGroups',
                component: () => import('../view/setting/groups.vue'),
            },
            {
                path: '/setting/users',
                name: 'SettingUsers',
                component: () => import('../view/setting/users.vue'),
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;