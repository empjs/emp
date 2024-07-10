import React, {useEffect, useState, version} from 'react'
import ReactDOM from 'react-dom'
import {CountComp as CountComp16, ShowCountComp as ShowCountComp16} from './CountComp'
import './index.scss'
import './normalize.css'
// 引用runtime
// import {empRuntime, withReactAdapter} from '@empjs/plugin-emp-runtime/runtime'
const EmpShareLib = (window as any).EmpShareLib
const {empRuntime, withReactAdapter} = EmpShareLib
// console.log(process.env.mfhost)
// 实例化远程 emp
empRuntime.init({
  remotes: [
    {
      name: 'mfHost',
      entry: `${process.env.mfhost}`,
    },
  ],
  name: 'federationRuntimeDemo',
})
// 封装 React 18的组件 以便插入到 React 16
const MfApp = withReactAdapter(empRuntime.load('mfHost/App'))
const CountComp = withReactAdapter(empRuntime.load('mfHost/CountComp'), 'CountComp')

// 创建 React 16 组件
const ParentComponent = () => {
  return (
    <Card title={() => <>App Inject mfHost</>}>
      <CountComp />
      <CountComp16 />
    </Card>
  )
}
// 封装 React 16的组件 以便插入到 React 18
const ParentComponentAdepter = withReactAdapter(ParentComponent, 'default', React, ReactDOM)
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
const Card = (props: any) => (
  <div className="card">
    <span className="title">{typeof props.title === 'string' ? props.title : props.title()}</span>
    {props.children}
  </div>
)
