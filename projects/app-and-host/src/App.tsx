import rt from '@empjs/share/runtime'
import {lazy, Suspense} from 'react'

//
import {ip, port} from './config'

const App = () => {
  const Info = lazy(() => rt.load('@ah/Info'))
  const About = lazy(() => rt.load('@ah/About'))
  return (
    <div className={`app`}>
      <h1 className="app-title">App and Host In One Project!!!</h1>
      <Suspense>
        <Info desc={`from app ${ip}:${port}`} />
        <About desc={`from app ${ip}:${port}`} />
      </Suspense>
    </div>
  )
}
export default App
