import Host from 'mfHost/App'
import css from './App.module.scss'
import Bound from './Bound'

const App = () => (
  <div className={css.main}>
    <Bound name="MF-Host">
      <Host from="fromMainAppName" nameformRemote="nameformRemote" />
    </Bound>
    <Bound name="MF-APP">
      <h1>mf-app</h1>
      <p>mf app body</p>
    </Bound>
  </div>
)
export default App
