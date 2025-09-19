import React from 'react'
import {Box, React16Info} from './Info'
import {Remote18App} from './React18'
import {RemoteVue3App} from './Vue3'

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
      <Box>
        <h2>Vue3 Component</h2>
        <RemoteVue3App name="vue3 in React 16" />
      </Box>
      <Remote18App></Remote18App>
    </React16Info>
  </div>
)

export default App
