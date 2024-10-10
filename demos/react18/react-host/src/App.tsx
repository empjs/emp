import {CountComp} from './CountComp'
type HostType = {
  name?: string
}
const App = ({name}: HostType) => {
  return (
    <>
      <h1>React 18 Runtime Host: {name ? name : ''}</h1>
      <CountComp />
    </>
  )
}
export default App
