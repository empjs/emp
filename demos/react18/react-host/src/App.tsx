import {CountComp} from './CountComp'
type HostType = {
  name?: string
  component?: React.ElementType
}
const App = ({name, component}: HostType) => {
  return (
    <>
      <h1>React 18 Runtime Host: {name ? name : ''}</h1>
      {component && <component />}
      <CountComp />
    </>
  )
}
export default App
