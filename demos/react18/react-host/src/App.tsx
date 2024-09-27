type HostType = {
  name?: string
}
const App = ({name}: HostType) => <h1>React 18 Runtime Host: {name ? name : ''}</h1>
export default App
