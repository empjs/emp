import {reactAdapter} from '@empjs/share/adapter'
import rt from '@empjs/share/runtime'
import {Suspense, lazy} from 'react'
// 实例化
rt.init({
  name: 'runtimeHost',
  shared: reactAdapter.shared,
  remotes: [
    // {
    //   name: 'runtime_18_host',
    //   entry: 'http://localhost:1802/emp.js',
    // },
  ],
})
// 动态注册
rt.register([
  {
    name: 'runtimeHost',
    entry: 'http://192.168.5.17:1802/output/mf-manifest.json',
    // entry: 'https://emp-demo-react18-host.pages.dev/demos/react18/react-host/dist/mf-manifest.json'
  },
])
const RemoteApp = lazy(() => rt.load('runtimeHost/App'))
console.log('RemoteApp', RemoteApp)
const App = () => (
  <div>
    <h1>React 18 Runtime App</h1>
    <Suspense><RemoteApp name="from home" /></Suspense>
  </div>
)
export default App
