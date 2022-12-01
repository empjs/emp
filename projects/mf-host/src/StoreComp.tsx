import {observer} from 'mobx-react'
import incStore from './store/incStore'
import css from 'src/Button/Button.module.css'
import {Button} from 'src/Button'
const StoreComp = observer(() => {
  return (
    <>
      <p>
        Host Store <b>{incStore.num}</b>
      </p>
      <pre>{incStore.code}</pre>
      <Button
        customLabel="Host Button +1"
        onClick={() => {
          incStore.inc()
          incStore.loadData()
        }}
      >
        +1
      </Button>
    </>
  )
})
export default StoreComp
