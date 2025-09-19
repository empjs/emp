import React from 'react'
import {Remote18App} from './B18'
import {Box, React16Info} from './Info'

const App = () => (
  <div>
    <React16Info desc="React16Info">
      <Remote18App>
        <React16Info desc="React16Info in Remote18App">
          <Remote18App>
            <React16Info />
          </Remote18App>
        </React16Info>
      </Remote18App>

      <Remote18App></Remote18App>
    </React16Info>
  </div>
)

export default App
