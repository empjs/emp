import rt from '@empjs/share/runtime'
import {lazy, Suspense} from 'react'

//
import {ip, port} from './config'

const isEmp = true
let Info: any
let About: any
if (isEmp) {
  Info = lazy(() => rt.load('@ah/Info'))
  About = lazy(() => rt.load('@ah/About'))
} else {
  Info = lazy(() => import('src/components/Info'))
  About = lazy(() => import('src/components/About'))
}
const App = () => {
  return (
    <div className={`app`}>
      <h1 className="app-title">App and Host In One Project!</h1>
      <Suspense>
        <Info desc={`from app ${ip}:${port}`} />
        <About desc={`from app ${ip}:${port}`} />
      </Suspense>
    </div>
  )
}
export default App
