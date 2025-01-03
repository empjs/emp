import React, {Suspense, lazy} from 'react'
import {Nav} from './Nav'
import './style.scss'
import sdk from './share'
export const App = () => {
  const C1 = lazy(() => sdk.load('c2100/Component'))
  const C2 = lazy(() => sdk.load('c2200/Component'))
  return (
    <div className="container">
      <Nav />
      <h1 className="title">react {React.version}</h1>
      <div className="remoteComponent">
        <h2>加载-多版本-远程组件</h2>
        <Suspense fallback={'loading...'}>
          <C1 />
          <C2 />
        </Suspense>
      </div>
    </div>
  )
}
export default App
