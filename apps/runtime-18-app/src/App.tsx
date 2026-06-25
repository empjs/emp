import {loadRemote, registerRemotes} from '@empjs/share/sdk'
import {lazy, Suspense} from 'react'
import Title from './Title'

// const host = `${process.env.ip}`
const host = `localhost`
registerRemotes([
  {
    name: 'runtimeHost_3911',
    entry: `http://${host}:3911/emp.json`,
    alias: 'r91',
  },
  {
    name: 'runtimeHost_3912',
    entry: `http://${host}:3912/emp.json`,
    alias: 'r92',
  },
  {
    name: 'runtimeHost_3913',
    entry: `http://${host}:3913/emp.json`,
    alias: 'r93',
  },
  // {
  //   name: 'runtimeHost_3802',
  //   entry: `http://${host}:3802/emp.json`,
  //   alias: 'r3802',
  // },
])
// const R3802 = lazy(() => loadRemote('r3802/App'))
const R93 = lazy(() => loadRemote('r93/App'))
const R92 = lazy(() => loadRemote('r92/App'))
const R91 = lazy(() => loadRemote('r91/App'))
//
const App = () => (
  <div>
    <Title />
    <Suspense>
      {/* <R3802 name="from port 3802" /> */}
      <R93 name="from port 91 Name 93" />
      <R92 name="from port 92" />
      <R91 name="from port 91" />
    </Suspense>
  </div>
)
export default App
