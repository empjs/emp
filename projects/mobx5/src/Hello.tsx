import {Random} from './Random'
import React from 'react'
import CounterStore from 'src/CounterStore'
import {useStores, StoreContext} from 'src/store'
import {observer, useObserver} from 'mobx-react'
function Counter() {
  // const {CounterStore} = useStores()
  console.log('CounterStore', CounterStore)
  return useObserver(() => (
    <div>
      <h1>mobx5</h1>
      <Random />
      <span>Count: {CounterStore.data.count}</span>
      <button type="button" onClick={() => CounterStore.inc()}>
        +1
      </button>
    </div>
  ))
}
const Hello = () => (
  <>
    <StoreContext.Provider value={{CounterStore}}>
      <h1>MOBX 5 HELLO</h1>
      <Random />
      <Counter />
    </StoreContext.Provider>
  </>
)
export default Hello
