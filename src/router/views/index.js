export default [
    {
        path: '/bigs',
        name: '首页',
        meta: { isTab: false },
        component: () =>
            import(/* webpackChunkName: "pages" */ '@/views/bigs/index.vue'),
    },
]
