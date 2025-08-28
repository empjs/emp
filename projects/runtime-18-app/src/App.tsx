import rt from '@empjs/share/runtime'
import {lazy, Suspense} from 'react'

const R93 = lazy(() => rt.load('r93/App'))
const R92 = lazy(() => rt.load('r92/App'))
const R91 = lazy(() => rt.load('r91/App'))
;(async () => {
  console.log('R93', (await rt.load('r92/App')).default.toString())
  console.log('R92', (await rt.load('r92/App')).default.toString())
  console.log('R91', (await rt.load('r91/App')).default.toString())
})()
const App = () => (
  <div>
    <h1>React 18 Runtime App!!</h1>
    <Suspense>
      <R93 name="from port 91 Name 93" />
      <R92 name="from port 92" />
      <R91 name="from port 91" />
    </Suspense>
  </div>
)
export default App
