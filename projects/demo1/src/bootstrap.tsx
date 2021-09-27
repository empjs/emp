import ReactDOM from 'react-dom'
import Hello from 'src/components/Hello'
import {log} from '@emp/demo2/helper'
import Hello2 from '@emp/demo2/components/Hello'
import Demo from 'src/components/Demo'
log('==============testing!!!!==============================')
const arr = [1, 2, 3, 4, 5, 6, 7, 8]
console.log('==============for of demo======================')
for (const v of arr) {
  console.log(v)
}
ReactDOM.render(
  <>
    <Hello />
    <Demo />
    <div style={{backgroundColor: '#eee', padding: '20px'}}>
      <h2>Demo2 Component: Hello</h2>
      <Hello2 compiler={'emp'} framework={'react'} />
    </div>
  </>,
  document.getElementById('emp-root'),
)
