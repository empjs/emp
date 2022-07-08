import {observer} from 'mobx-react'
import store from './store'
const App = observer(() => {
  const changeData = () => {
    store.setdata({m: Math.random()})
  }
  return (
    <>
      <h1>App</h1>
      <br />
      <button onClick={changeData}>change data</button>
      <p>{JSON.stringify(store.data)}</p>
    </>
  )
})
export default App
