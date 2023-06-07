import {Button} from 'src/Button'
import StoreComp from './StoreComp'
import incStore from './store/incStore'
// export {Button, StoreComp, incStore}
const App = () => {
  return (
    <>
      <h1>Micro Host #2</h1>
      <p>update from remote host</p>
      <StoreComp />
      <Button customLabel="HOST" />
    </>
  )
}
export default App
