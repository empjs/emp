// import rt from '@empjs/share/runtime'

import {lazy, Suspense} from 'react'
import {ip, port} from './config'
import {mf} from './index'

const isEmp = true
let Info: any
let About: any
if (isEmp) {
  Info = lazy(() => mf.loadRemote<any>('@ah/Info'))
  About = lazy(() => mf.loadRemote<any>('@ah/About'))
} else {
  Info = lazy(() => import('src/components/Info'))
  About = lazy(() => import('src/components/About'))
}
const App = () => {
  return (
    <div className={`app`}>
      <h1 className="app-title">App and Host In One Project</h1>
      <p className="app-info">{`from app ${ip}:${port}`}</p>
      <Suspense>
        <Info />
        <About />
      </Suspense>
    </div>
  )
}
export default App
