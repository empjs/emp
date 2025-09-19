import React from 'react'
import {Box, React16Info} from './components/Info'
import {Remote18App} from './adapter/React18'
import {RemoteVue3App} from './adapter/Vue3'

const App = () => (
  <div>
    <React16Info desc="React16Info">
      <Remote18App>
        <React16Info desc="React16Info in Remote18App">
          <Remote18App>
            <React16Info desc="last component " />
          </Remote18App>
        </React16Info>
      </Remote18App>
      <Box>
        <h2>Vue3 Component</h2>
        <RemoteVue3App name="vue3 in React 16" />
      </Box>
      <Remote18App>
      <RemoteVue3App name="vue3 in React 18" />
      </Remote18App>
    </React16Info>
  </div>
)

export default App
