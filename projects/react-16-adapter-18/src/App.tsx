import React, {useEffect, useState, version} from 'react'
import ReactDOM from 'react-dom'
import {Card, CountComp as CountComp16, ShowCountComp as ShowCountComp16} from './CountComp'
import './index.scss'
import './normalize.css'

import {empRuntime, reactAdapter} from './share'

// 封装 React 18的组件 以便插入到 React 16
const MfApp = reactAdapter.adapter(empRuntime.load('mfHost/App'))
const CountComp = reactAdapter.adapter(empRuntime.load('mfHost/CountComp'), 'CountComp')

// 创建 React 16 组件
const ParentComponent = () => {
  return (
    <Card title={() => <>App Inject mfHost</>}>
      <CountComp name="ab" />
      <CountComp16 />
    </Card>
  )
}
// 封装 React 16的组件 以便插入到 React 18
const ParentComponentAdepter = reactAdapter.adapter(ParentComponent, 'default', React, ReactDOM)
const App = () => {
  useEffect(() => {
    setTimeout(() => {
      empRuntime.load('mfHost/App').then(o => {
        console.log(o)
      })
    }, 1000)
  }, [])
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
