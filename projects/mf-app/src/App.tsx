import {loadRemote, registerRemotes} from '@empjs/share/sdk'
import {lazy, Suspense, useEffect} from 'react'
import css from './App.module.scss'
import Bound from './Bound'

registerRemotes([
  {
    name: 'mfHost',
    entry: 'http://localhost:6001/emp.json',
  },
])

const Host = lazy(() => loadRemote('mfHost/App'))

const App = () => {
  return (
    <div className={css.main}>
      <Bound name="MF-Host">
        <Suspense fallback={<div>Loading...</div>}>
          <Host from="fromMainAppName" nameformRemote="nameformRemote" increment={1} />
        </Suspense>
      </Bound>
      <Bound name="MF-APP">
        <h1>mf-app</h1>
        <p>mf app body</p>
      </Bound>
    </div>
  )
}
export default App
