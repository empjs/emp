import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Hello from 'src/components/Hello'
ReactDOM.render(
  <>
    <Hello />
    <div style={{backgroundColor: '#eee', padding: '20px'}}>
      <h2>React Project Component: Hello!!!!!</h2>
    </div>
  </>,
  document.getElementById('emp-root'),
)
