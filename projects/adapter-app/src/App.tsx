import {ReactAdapter} from '@empjs/adapter-react'
import ahApp from 'ah/App'
import React from 'react'

// React Adapter 实例化
const react18 = new ReactAdapter(EMP_ADAPTER_REACT)
const Remote18App = react18.adapter(ahApp)
// console.log('ahApp', ahApp)
//
const App = () => (
  <div>
    <h1>React App</h1>
    <p>React Version {React.version}</p>
    <Remote18App />
  </div>
)

export default App
