import {observer} from 'mobx-react'
import useIncStore from './store/incStore'
const StoreComp = observer(() => {
  const incStore = useIncStore(state => state)
  return (
    <>
      <p>{incStore.num}</p>
      <pre>{incStore.code}</pre>
      <button
        onClick={() => {
          incStore.inc()
          incStore.loadData()
        }}
      >
        +1
      </button>
    </>
  )
})
export default StoreComp
