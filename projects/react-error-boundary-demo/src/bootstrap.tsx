import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Hello from 'src/components/Hello'
import Hello2 from 'src/components/Hello2'
ReactDOM.render(
  <>
    <Hello />
    <Hello2 />
    <div style={{backgroundColor: '#eee', padding: '20px'}}>
      <h2>React Project Component: Hello!!!!!</h2>
    </div>
  </>,
  document.getElementById('emp-root'),
)
