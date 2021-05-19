import * as React from 'react'

import Hello from './components/Hello'
import HelloDEMO from '@emp/demo1/components/Demo'
const Hello2 = React.lazy(() => import('@emp/demo1/components/Demo'))
const config = await import('@emp/demo1/configs/index')
const App = () => (
  <>
    <Hello compiler="TypeScript 2" framework="React DEMO 2" />
    <div style={{backgroundColor: '#eee', padding: '20px'}}>
      <h2>remote import load one!</h2>
      <HelloDEMO />
      <h2>remote lazy load!!</h2>
      <React.Suspense fallback={<div />}>
        <Hello2 />
      </React.Suspense>
      ENV:{process.env.EMP_ENV}
      <p>config:{JSON.stringify(config.default)}</p>
    </div>
  </>
)

export default App
