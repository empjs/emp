import React from 'react'
import {Remote18App} from './B18'
import {React16Info} from './Info'

const App = () => (
  <div>
    <React16Info desc="React16Info">
      <h2>Remote18App frist Render</h2>
      <Remote18App>
        <React16Info desc="React16Info in Remote18App">{/* <Remote18App /> */}</React16Info>
      </Remote18App>
      <h2>Remote18App second Render</h2>
      <Remote18App></Remote18App>
    </React16Info>
  </div>
)

export default App
