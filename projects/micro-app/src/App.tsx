import HostApp from '@microHost/App'
import StoreComp from './StoreComp'

const App = () => {
  return (
    <>
      <StoreComp />
      <HostApp />
      <h1>Micro app #2</h1>
    </>
  )
}
export default App
export {HostApp}
