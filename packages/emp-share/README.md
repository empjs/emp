# EMP Share
```
pnpm add @empjs/share
```
## 01 @empjs/share/rspack - Emp Share Plugin
> 
使用方法
```js
import {pluginRspackEmpShare} from '@empjs/share/rspack'
import {defineConfig} from '@empjs/cli'
export default defineConfig(store => {
  return {
    plugins: [
      pluginRspackEmpShare({
        name: 'mfHost',
        shared: {
          react: {
            singleton: true,
            requiredVersion: '18',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '18',
          },
        },
        exposes: {
          './App': './src/App',
          './CountComp': './src/CountComp',
        },
      }),
    ],
  }
})
```

## 02 @empjs/share/library - Module Federation SDK 封装 
+ `full.js` 为全量函数库、主要应对直接 老项目的桥接、通过 `window`直接调用共享,包含:
  + MFRuntime
  + MFSDK
  + reactAdapter
  + runtime
+ `sdk.js` 为 SDK库包含 `MFRuntime` 与 `MFSDK`,调用还是需要安装 `pnpm add @empjs/share/runtime`
+ `sdkPolyfill.js` 为 `sdk` + `core-js`


## 03 @empjs/share/runtime - 运行时引用
### 项目调用

```js
import React, {useEffect, useState, version} from 'react'
import ReactDOM from 'react-dom'
import {CountComp as CountComp16, ShowCountComp as ShowCountComp16, Card} from './CountComp'
import {reactAdapter} from '@empjs/share/adapter' // 使用 react 
import empRuntime from '@empjs/share/runtime' // runtime 加载器
const entry = process.env.mfhost as string
// 实例化远程 emp
empRuntime.init({
  shared: reactAdapter.shared,
  remotes: [
    {
      name: 'mfHost',
      entry,
    },
  ],
  name: 'federationRuntimeDemo',
})
// 封装 React 18的组件 以便插入到 React 16
const MfApp = reactAdapter.adapter(empRuntime.load('mfHost/App'))
const CountComp = reactAdapter.adapter(empRuntime.load('mfHost/CountComp'), 'CountComp')

// 创建 React 16 组件
const ParentComponent = () => {
  return (
    <Card title={() => <>App Inject mfHost</>}>
      <CountComp name="a" />
      <CountComp16 />
    </Card>
  )
}
// 封装 React 16的组件 以便插入到 React 18
const ParentComponentAdepter = reactAdapter.adapter(ParentComponent, 'default', React, ReactDOM)
const App = () => {
  return (
    <>
      <h1>App React Version {version}</h1>
      <ShowCountComp16 />
      <Card title="EMP From mfhost">
        <MfApp component={ParentComponentAdepter} />
      </Card>
    </>
  )
}
export default App
```
