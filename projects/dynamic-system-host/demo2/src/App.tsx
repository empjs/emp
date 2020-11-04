import * as React from 'react'

import Hello from './components/Hello'
const App = () => (
  <>
    <Hello compiler="TypeScript 2" framework="React DEMO 2" />
    <div style={{backgroundColor: '#eee', padding: '20px'}}>process.env.EMP_ENV:{process.env.EMP_ENV}</div>
  </>
)

export default App
