# React umd 共享
## 启动命令
> 根目录执行
```sh
pnpm react:umd
```
## 项目依赖
```
"axios": "^0.21.4",
"mobx": "^6.3.7",
"mobx-react": "^7.2.1",
"mobx-react-lite": "^3.2.2",
"react": "^17.0.2",
"react-dom": "^17.0.2",
"react-router-dom": "5"
```

## 项目结构

### 基站项目 - 共享库
> project/mf-host

#### emp-config.js
```js
const {defineConfig} = require('@efox/emp')
module.exports = defineConfig(() => {
  return {
    server: {
      port: 8881,
    },
    empShare: {
      name: 'mfHost', //共享名称
      exposes: {// 共享组件
        './App': './src/App',
        './incStore': './src/store/incStore',
        './css': './src/Button/Button.module.css',//共享样式
      },
      shared: {//公用库
        react: {requiredVersion: '^17.0.1', singleton: true},
        'react-dom': {requiredVersion: '^17.0.1', singleton: true},
      },
    },
  }
})

```
#### 共享模块 逻辑
+ Store 状态管理 [store/incStore.ts](https://github.com/efoxTeam/emp/blob/main/projects/mf-host/src/store/incStore.ts)

:::tip 提示
- 使用状态管理同时需要共享需求，最好使用去中心化的方式导出 不用 provider 进行封装
- 共享 Store 可以让主应用调用，从而操作基站相关逻辑
:::
```js
import {makeAutoObservable} from 'mobx'
class IncStore {
  num = 0
  code: any = ''
  constructor() {
    makeAutoObservable(this)
  }
  inc() {
    this.num += 1
  }
  async loadData() {
    const d = await fetch('https://unpkg.com/mobx-react-lite@3.2.2').then(res => res.text())
    this.code = d
  }
}

export default new IncStore()
```
+ App 组件 [App.tsx](https://github.com/efoxTeam/emp/blob/main/projects/mf-host/src/App.tsx)
:::tip App的作用
- App为基站的组件 expose 出口
- 整合 `button` `StoreComp` 等组件，形成带业务形态的共享组件
:::
> 组合 作为业务组件 并 导出
```js
import {Button} from 'src/Button'
import StoreComp from './StoreComp'
export {Button, StoreComp}
const App = () => {
  return (
    <>
      <h1>Micro Host</h1>
      <StoreComp />
      <Button customLabel="HOST" />
    </>
  )
}
export default App
```
- StoreComp 组件 [StoreComp.tsx](https://github.com/efoxTeam/emp/blob/main/projects/mf-host/src/StoreComp.tsx)
> 利用Mobx 绑定进行状态管理组件 与 IncStore 联动
```js
import {observer} from 'mobx-react'
import incStore from './store/incStore'
const StoreComp = observer(() => {
  return (
    <>
      <p>{incStore.num}</p>
      <pre>{incStore.code}</pre>
      <button
        onClick={() => {
          incStore.inc()
          incStore.loadData()
        }}
      >
        +1
      </button>
    </>
  )
})
export default StoreComp
```
- Button 组件 [Button/index.tsx](https://github.com/efoxTeam/emp/blob/main/projects/mf-host/src/Button/index.tsx)
#### tsconfig.json
```json
{
	"extends": "@efox/emp/emp-tsconfig", //集成emp配置
	"compilerOptions": {
		"types": [
			"@efox/emp/client" //加入 emp类型提示
		],
		"baseUrl": ".",
	},
	"include": [
		"src",
	]
}

```


#### d.ts 生成与共享
执行命令
```sh
cd projects/mf-host
pnpm build:ts
```
- `projects/mf-host` 目录会生成 `dist/empShareTypes` 目录提供给主项目进行同步
- 通过 `pnpm start` 即可发布共享给主应用
- 通过 `pnpm dev` 也可以访问 `index.d.ts` 文件 `dev环境 为保证调试性能 默认不生成 d.ts`


### 主项目 - 应用
> project/mf-app
#### Step 1
配置 emp-config.js 声明使用远程内容 如
```js
const {defineConfig} = require('@efox/emp')
module.exports = defineConfig(() => {
  return {
    server: {
      port: 8882,
    },
    empShare: {
      name: 'mfApp',
      remotes: {
        '@mfHost': `mfHost@http://127.0.0.1:8881/emp.js`,//远程基站地址
      },
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: {requiredVersion: '^17.0.1', singleton: true},
        'react-dom': {requiredVersion: '^17.0.1', singleton: true},
      },
    },
  }
})

```
#### Step 2
开发前，先同步 `d.ts` 执行 `emp dts`,同步后 代码同步到 `src/empShareypes`
- @mfHost.d.ts
```js
declare module '@mfHost/App' {
  /// <reference types="react" />
  import {Button} from '@mfHost/Button'
  import StoreComp from '@mfHost/StoreComp'
  export {Button, StoreComp}
  const App: () => JSX.Element
  export default App
}
declare module '@mfHost/bootstrap' {
  export {}
}
declare module '@mfHost' {}
declare module '@mfHost/StoreComp' {
  /// <reference types="react" />
  const StoreComp: () => JSX.Element
  export default StoreComp
}
declare module '@mfHost/Button' {
  import * as React from 'react'
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    customLabel: string
  }
  export const Button: ({customLabel, ...rest}: ButtonProps) => JSX.Element
  export {}
}
declare module '@mfHost/incStore' {
  class IncStore {
    num: number
    code: any
    constructor()
    inc(): void
    loadData(): Promise<void>
  }
  const _default: IncStore
  export default _default
}
```

#### Step3
> 引用 基站内容
- css 引用暂时无法同步类型 可以参考 `projects/mf-app/src/types.d.ts`
- 样式引用 `import css from '@mfHost/css'` 如 `projects/mf-app/src/StoreComp.tsx`
- 共享Store 以及 本地Store 用例 如 `projects/mf-app/src/App.tsx`

详细内容可以参考 [Demo](https://github.com/efoxTeam/emp/tree/main/projects/mf-app)
