import {getInstance, loadRemote} from '@module-federation/runtime'
import {lazy, Suspense} from 'react'

const mf = getInstance()
mf?.registerRemotes([
  {
    name: 'runtimeProvider',
    entry: 'http://localhost:4001/mf-manifest.json',
  },
])
const ProviderApp = lazy(() => loadRemote('runtimeProvider/App'))
const App = () => (
  <div>
    <h1>Host</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <ProviderApp name={'From Host'} debug={'string'} status={'Running'} />
    </Suspense>
  </div>
)
export default App
