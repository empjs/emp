import React, { useEffect, useState, version } from 'react'
import ReactDOM from 'react-dom'
import { Card, CountComp as CountComp16, ShowCountComp as ShowCountComp16 } from './CountComp'
import './index.css'
import './normalize.css'
import { reactAdapter } from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'
const entry = process.env.mfhost as string
// 实例化远程 emp
empRuntime.init({
  shared: reactAdapter.shared,
  remotes: [
    {
      name: 'runtimeHost',
      entry,
    },
  ],
  name: 'federationRuntimeDemo',
})
// 封装 React 18的组件 以便插入到 React 16
const React18App = reactAdapter.adapter(empRuntime.load('runtimeHost/App'))

// 封装 React 16的组件 以便插入到 React 18
const ParentComponentAdepter = reactAdapter.adapter(CountComp16, 'default', React, ReactDOM)

const App = () => {
  return (
    <>
      <h1>App React Version {version}</h1>
      <ShowCountComp16 />
      <Card title="EMP From mfhost">
        <React18App>
          <ParentComponentAdepter />
        </React18App>
      </Card>
    </>
  )
}
export default App
