# EMP React Template

## 目录架构

```
|--src
    |--components // 组件目录
        |--RouterComp // 路由组件
    |--App.tsx // MF中exposes的APP组件
    |--bootstrap.tsx //入口文件
    |--emp-config.js // emp配置文件
```

## 使用说明
1. 在项目的emp-config.js引入emp.js

```
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        files: {
          js: ['https://你的项目地址/emp.js'],
        },
      },
    }
    return args
  })
```

2. 在MF的配置中引入

```
config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        remotes: {
          '@emp-react/base': 'empReactBase', // 设置别名
        },
        },
      },
    }
    return args
  })
```

3. 同步类型文件

+  通过配置scripts手动更新（emp tss https://你的项目地址/index.d.ts -n @emp-react-base.d.ts）
+ [安装vscode插件 emp-sync-base自动同步](https://marketplace.visualstudio.com/items?itemName=Benny.emp-sync-base)

4. 使用 
```
import React, {lazy, SuspenseProps} from 'react'
import EmpApp from '@emp-react/base/App'
import {RouteProps} from 'react-router-dom'

const routes: RouteProps[] = [
  {
    path: '/v2/mall',
    component: lazy(() => import(`src/pages/v2/mall`)),
  },
  {
    path: '/v2/props',
    component: lazy(() => import(`src/pages/v2/props`)),
  },
]

/**
* routes?: RouteProps[]
* fallback?: SuspenseProps['fallback']
*/

<EmpApp routes={routes} fallback="loading..." />

```
