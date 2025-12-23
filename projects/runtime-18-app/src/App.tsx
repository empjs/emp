import {createInstance, reactShare, registerShared} from '@empjs/share/sdk'
import {lazy, Suspense} from 'react'
import Title from './Title'

const mf = createInstance({
  name: 'runtime-18-app',
  remotes: [
    {
      name: 'runtimeHost_3911',
      entry: `http://${process.env.ip}:3911/emp.json`,
      alias: 'r91',
    },
    {
      name: 'runtimeHost_3912',
      entry: `http://${process.env.ip}:3912/emp.json`,
      alias: 'r92',
    },
    {
      name: 'runtimeHost_3913',
      entry: `http://${process.env.ip}:3913/emp.json`,
      alias: 'r93',
    },
  ],
  shared: reactShare(),
})

const R93 = lazy(() => mf.loadRemote<any>('r93/App'))
const R92 = lazy(() => mf.loadRemote<any>('r92/App'))
const R91 = lazy(() => mf.loadRemote<any>('r91/App'))
//
const App = () => (
  <div>
    <Title />
    <Suspense>
      <R93 name="from port 91 Name 93" />
      <R92 name="from port 92" />
      <R91 name="from port 91" />
    </Suspense>
  </div>
)
export default App
