import {lazy} from 'react'
import {DashboardOutlined, UserOutlined, AccountBookOutlined, GlobalOutlined, SettingOutlined} from '@ant-design/icons'
// const LazyImport = (src: string) => lazy(() => import(/* webpackChunkName: "[request]" */ `src/pages/${src}`))
export const routes: Array<Troutes> = [
  {
    path: '/',
    name: '主页',
    icon: DashboardOutlined,
    component: lazy(() => import(`src/pages/index/HomeComp`)),
  },
  {
    path: '/about',
    name: '关于',
    icon: AccountBookOutlined,
    component: lazy(() => import('src/pages/about/AboutComp')),
  },
  {
    path: '/lang/:lang',
    url: '/lang/en',
    name: '国际化',
    icon: GlobalOutlined,
    component: lazy(() => import('src/pages/lang/LangComp')),
  },
  {
    path: '/crud',
    name: '增删改查',
    icon: SettingOutlined,
    component: lazy(() => import('src/pages/crud')),
  },
  /*   {
    path: '/CrudComponent-demo',
    name: 'CrudComponent-demo',
    icon: SettingOutlined,
    component: lazy(() => import('src/pages/CrudComponent-demo')),
  }, */
  {
    path: '/me',
    name: '我',
    icon: UserOutlined,
    component: lazy(() => import('src/pages/me/MeComp')),
    routes: [
      {
        path: '/me/home',
        name: '二级主页',
        component: lazy(() => import('src/pages/index/HomeComp')),
      },
      {
        path: '/me/about',
        name: '二级关于',
        component: lazy(() => import('src/pages/about/AboutComp')),
      },
    ],
  },
]

export type Troutes = {
  path: string
  component?: any
  name?: string
  url?: string
  icon?: any
  routes?: Array<Troutes>
  role?: string // 权限管理
}
