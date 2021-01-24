import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Hello from 'src/components/Hello'
import Hello2 from 'src/components/Hello2'
import {Hello3} from 'src/components/Hello3'
import {Hello4, Hello5} from 'src/components/Hello45'

ReactDOM.render(
  <>
    <div style={{backgroundColor: '#eee', padding: '20px'}}>
      <h2>React Error Boundary Loader Demo</h2>
    </div>
    <div>hello should be here: </div>
    <Hello />
    <div style={{borderTop: '1px solid #000'}}>hello2 should be here:</div>
    <Hello2 />
    <div style={{borderTop: '1px solid #000'}}>hello3 should be here:</div>
    <Hello3 />
    <div style={{borderTop: '1px solid #000'}}>hello4 should be here:</div>
    <Hello4 />
    <div style={{borderTop: '1px solid #000'}}>hello5 should be here:</div>
    <Hello5 />
    <div style={{borderTop: '1px solid #000'}}></div>
  </>,
  document.getElementById('emp-root'),
)
