import {loadRemote, registerRemotes} from '@empjs/share/sdk'
import {lazy, Suspense} from 'react'

registerRemotes([
  {
    name: 'rtProvider',
    entry: 'http://localhost:4001/emp.json',
  },
])
const ProviderApp = lazy(() => loadRemote('rtProvider/App'))
const App = () => (
  <div>
    <h1>Host</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <ProviderApp name={'From Host'} debug={true} status={'Running'} />
    </Suspense>
  </div>
)
export default App
