import {loadRemote} from '@empjs/share/sdk'

import {lazy, Suspense} from 'react'
import {ip, port} from './config'

const isEmp = true
let Info
let About
if (isEmp) {
  Info = lazy(() => loadRemote('@ah/Info'))
  About = lazy(() => loadRemote('@ah/About'))
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
