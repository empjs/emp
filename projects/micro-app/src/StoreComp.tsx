import useIncStore from '@microHost/incStore'
const StoreComp = () => {
  const incStore = useIncStore(state => state)
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
}
export default StoreComp
