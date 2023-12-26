import HostApp from '@mfHost/App'
import {StoreProvider} from '@mfHost/store'
import StoreComp from './StoreComp'

const App = () => {
  return (
    <>
      <StoreProvider>
        <HostApp />
      </StoreProvider>
      <h1>Micro app</h1>
      <StoreComp />
    </>
  )
}
export default App
