import {CountComp} from './CountComp'
type HostType = {
  name?: string
  children?: React.ReactNode
}
const App = ({name, children}: HostType) => {
  return (
    <div>
      <h1>React 18 Runtime Host: {name ? name : ''}</h1>
      <CountComp />
      {children}
    </div>
  )
}
export default App
