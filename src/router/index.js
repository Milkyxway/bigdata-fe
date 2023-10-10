import { createRouter, createWebHashHistory } from 'vue-router'
export const routeList = [
  {
    path: '/login',
    name: 'login',
    alias: '/',
    component: () => import('../views/login.vue')
  },

  {
    path: '/home',
    name: 'home',
    id: 'home',
    component: () => import('../views/home.vue'),
    children: [
      {
        path: '/report',
        name: '报表模块',
        iconName: 'view',
        component: () => import('../views/PersonalHome.vue'),
        children: [
          {
            path: '/report/list',
            name: '报表列表',
            isSider: true,
            component: () => import('../views/reportlist.vue')
          }
        ]
      },
      {
        path: '/develop',
        name: '开发模块',
        iconName: 'view',
        component: () => import('../views/PersonalHome.vue'),
        children: [
          {
            path: '/develop/match',
            name: '匹配需求',
            isSider: true,
            component: () => import('../views/matchfunc.vue')
          },
          {
            path: '/develop/create',
            name: '创建任务',
            isSider: true,
            component: () => import('../views/createperiod.vue')
          },
          {
            path: '/develop/tasklist',
            name: '任务列表',
            isSider: true,
            component: () => import('../views/tasklist.vue')
          },
          {
            path: '/develop/taskdetail/:taskId',
            name: '任务详情',
            isSider: false,
            component: () => import('../views/taskdetail.vue')
          }
        ]
      },
      {
        path: '/sql',
        name: '脚本库',
        iconName: 'view',
        component: () => import('../views/PersonalHome.vue'),
        children: [
          {
            path: '/sql/list',
            name: '脚本列表',
            isSider: true,
            component: () => import('../views/commonsql.vue')
          }
        ]
      }
      // {
      //   name: '账号模块',
      //   path: '/personal',
      //   component: () => import('../views/PersonalHome.vue'),
      //   children: [
      //     {
      //       path: '/personal/password',
      //       name: '修改密码',
      //       isSider: true,
      //       component: () => import('../views/password.vue')
      //     },
      //     {
      //       path: '/personal/createaccount',
      //       name: '创建账号',
      //       isSider: true,
      //       auth: ['admin'],
      //       component: () => import('../views/createaccount.vue')
      //     }
      //   ]
      // }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routeList
})

export default router