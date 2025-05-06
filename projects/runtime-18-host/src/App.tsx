import './common.scss'
//
type HostType = {
  name?: string
}
const port: any = process.env.port
console.log('port', port)
const App = ({name}: HostType) => (
  <h1 className={`p${port}`}>
    React 18 Runtime Host: {name ? name : ''} : {port}
  </h1>
)
export default App
