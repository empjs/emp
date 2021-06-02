import {Random} from './Random'
import React from 'react'
import {observer} from 'mobx-react'
import CounterStore from 'src/CounterStore'
const Counter = observer(() => {
  return (
    <div>
      <h1>mobx5</h1>
      <p> mobx: 5.15.7</p>
      <p>mobx-react: 6.3.1</p>
      <Random />
      <span>Count: {CounterStore.data.count}</span>
      <button type="button" onClick={() => CounterStore.inc()}>
        +1
      </button>
    </div>
  )
})

export default Counter
