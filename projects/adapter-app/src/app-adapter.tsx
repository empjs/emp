import {ReactAdapter} from '@empjs/adapter-react'
import ahApp from 'ah/App'
import React from 'react'
import {React16Info} from './Info'

const {EMP_ADAPTER_REACT} = window as any
// React Adapter 实例化
const react18 = new ReactAdapter(EMP_ADAPTER_REACT)
const Remote18App = react18.adapter(ahApp)
// console.log('ahApp', ahApp)
// TODO React18的组件插入React16组件
//
const App = () => (
  <div>
    <React16Info desc="React16Info" />
    <Remote18App>
      <React16Info desc="React16Info in Remote18App">
        <Remote18App />
      </React16Info>
    </Remote18App>
  </div>
)

export default App
