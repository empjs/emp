import './common.scss'
//  mfHost: `mfHost@http://${store.server.ip}:6001/emp.js`,
// import Host from 'mfHost/App'

//
type HostType = {
  name?: string
}
const port: any = process.env.port
console.log('port', port)
const App = ({name}: HostType) => (
  <h1 className={`p${port}`}>
    React 18 Runtime Host: {name ? name : ''} : {port}
    {/* <Host from="fromMainAppName" nameformRemote="nameformRemote" /> */}
  </h1>
)
export default App
