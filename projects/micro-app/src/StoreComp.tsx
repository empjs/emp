import {observer} from 'mobx-react-lite'
import incStore from '@microHost/incStore'
const StoreComp = observer(() => {
  return (
    <>
      <h1>@microHost incStore</h1>
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
