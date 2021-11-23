import {observer} from 'mobx-react-lite'
import incStore from './store/incStore'
const StoreComp = observer(() => {
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
