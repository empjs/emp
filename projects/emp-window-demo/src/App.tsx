import {lazy, Suspense} from 'react'
import runtime from './runtime'

const MfApp: any = lazy(() => runtime.load('mfHost/App'))

const App = () => {
  return (
    <>
      <h1>App React Version</h1>
      <Suspense>
        <MfApp />
      </Suspense>
    </>
  )
}
export default App
