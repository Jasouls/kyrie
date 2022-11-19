import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../pages/Home.vue'),
    redirect: { name: 'SVG' },
    children: [
      {
        path: 'svg',
        name: 'SVG',
        component: () => import('@/components/common/Svg.vue'),
        meta: {
          title: 'SVG',
        },
      },
      {
        path: 'canvas',
        name: 'CANVAS',
        component: () => import('@/components/common/Canvas.vue'),
        meta: {
          title: 'CANVAS',
        },
      },
      {
        path: 'd3',
        name: 'D3',
        component: () => import('@/components/common/D3.vue'),
        meta: {
          title: 'D3',
        },
      },
      {
        path: 'echarts',
        name: 'ECHARTS',
        component: () => import('@/components/common/Echarts.vue'),
        meta: {
          title: 'ECHARTS',
        },
      },
      {
        path: 'map',
        name: 'MAP',
        component: () => import('@/components/common/Map.vue'),
        meta: {
          title: 'MAP',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
