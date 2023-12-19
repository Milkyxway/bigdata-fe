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
        auth: ['section', 'developer'],
        component: () => import('../views/PersonalHome.vue'),
        children: [
          {
            path: '/report/list',
            name: '报表列表',
            isSider: true,
            auth: ['developer', 'section'],
            component: () => import('../views/reportlist.vue')
          },
          {
            path: '/report/selfhelp',
            name: '自助提数',
            auth: ['section', 'developer'],
            isSider: true,
            component: () => import('../views/selfhelp.vue')
          }
        ]
      },
      {
        path: '/develop',
        name: '任务模块',
        iconName: 'view',
        auth: ['developer'],
        component: () => import('../views/PersonalHome.vue'),
        children: [
          // {
          //   path: '/develop/match',
          //   name: '匹配需求',
          //   isSider: true,
          //   component: () => import('../views/matchfunc.vue')
          // },
          {
            path: '/develop/create/:type',
            name: '创建任务',
            auth: ['developer'],
            isSider: true,
            component: () => import('../views/createperiod.vue')
          },
          {
            path: '/develop/tasklist',
            name: '任务列表',
            auth: ['developer', 'section'],
            isSider: true,
            component: () => import('../views/tasklist.vue')
          },
          {
            path: '/develop/taskdetail/:taskId',
            name: '任务详情',
            isSider: false,
            component: () => import('../views/taskdetail.vue')
          },
          {
            path: '/develop/task/params',
            name: '参数配置',
            auth: ['developer'],
            isSider: true,
            component: () => import('../views/configparams.vue')
          }
        ]
      },
      {
        path: '/sql',
        name: '脚本库',
        iconName: 'view',
        auth: ['developer'],
        component: () => import('../views/PersonalHome.vue'),
        children: [
          {
            path: '/sql/list',
            name: '脚本列表',
            isSider: true,
            auth: ['developer'],
            component: () => import('../views/commonsql.vue')
          }
        ]
      },
      {
        path: '/develop',
        name: '工具箱',
        iconName: 'view',
        auth: ['developer'],
        component: () => import('../views/PersonalHome.vue'),
        children: [
          {
            path: '/develop/match',
            name: '匹配需求',
            auth: ['developer'],
            isSider: true,
            component: () => import('../views/matchfunc.vue')
          }
        ]
      },
      {
        name: '账号模块',
        path: '/personal',
        component: () => import('../views/PersonalHome.vue'),
        children: [
          {
            path: '/personal/password',
            name: '修改密码',
            isSider: true,
            auth: ['admin', 'section', 'employee', 'developer'],
            component: () => import('../views/password.vue')
          },
          {
            path: '/personal/createaccount',
            name: '创建账号',
            isSider: true,
            auth: ['admin', 'developer'],
            component: () => import('../views/createaccount.vue')
          },
          {
            path: '/personal/users',
            name: '用户管理',
            isSider: true,
            auth: ['admin'],
            component: () => import('../views/users.vue')
          }
        ]
      }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routeList
})

export default router
