import {Random} from './Random'
import React from 'react'
import {observer} from 'mobx-react'
import CounterStore from 'src/CounterStore'
const Counter = observer(() => {
  return (
    <div>
      <h1>mobx6</h1>
      <Random />
      <span>Count: {CounterStore.data.count}</span>
      <button type="button" onClick={() => CounterStore.inc()}>
        +1
      </button>
    </div>
  )
})
const Demo = () => (
  <>
    <Counter />
  </>
)
export default Demo
