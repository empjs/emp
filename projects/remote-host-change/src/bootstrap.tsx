import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Hello from '@emp/demo1/components/Demo'
const App = () => (
  <>
    <h1>Remote Host Change</h1>
    <Hello />
  </>
)
ReactDOM.render(<App />, document.getElementById('emp-root'))
