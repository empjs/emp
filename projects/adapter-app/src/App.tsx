import React from 'react'
import {Remote18App} from './adapter/React18'
import {Vue2Content, Vue2Hello, Vue2Table} from './adapter/Vue2'
import {RemoteVue3App} from './adapter/Vue3'
import {Box, ReactInfo} from './components/Info'

const App = () => (
  <div>
    <Box>
      <h1>Vue 2 Remote App</h1>
      <Box>
        <Vue2Hello name="vue2 in React" />
      </Box>
      <Box>
        <Vue2Content />
      </Box>
      <Box>
        <Vue2Table />
      </Box>
    </Box>
    <ReactInfo desc="ReactInfo">
      <Remote18App>
        <ReactInfo desc="ReactInfo in Remote18App">
          <Remote18App>
            <ReactInfo desc="last component " />
          </Remote18App>
        </ReactInfo>
      </Remote18App>
      <Box>
        <h2>Vue3 Component</h2>
        <RemoteVue3App name="vue3 in React 16" />
      </Box>
      <Remote18App>
        <RemoteVue3App name="vue3 in React 18" />
      </Remote18App>
    </ReactInfo>
  </div>
)

export default App
