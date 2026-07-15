import {loadRemote, registerRemotes} from '@empjs/share/sdk'
import {lazy, Suspense, type ComponentType} from 'react'
import css from './App.module.scss'
import Bound from './Bound'

registerRemotes([
  {
    name: 'mfHost',
    entry: `http://${location.hostname}:6001/emp.json`,
  },
])

type HostProps = {
  from?: string
  nameformRemote?: string
  increment?: number
}

const Host = lazy(async () => {
  const remote = await loadRemote<{default: ComponentType<HostProps>}>('mfHost/App')
  if (!remote) throw new Error('mfHost/App was not loaded')
  return remote
})

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
