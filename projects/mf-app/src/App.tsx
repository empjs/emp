import Host from 'mfHost/App'
import Bound from './Bound'
import css from './App.module.scss'
const App = () => (
  <div className={css.main}>
    <Bound name="MF-Host">
      <Host />
    </Bound>
    <Bound name="MF-APP">
      <h1>mf-app</h1>
      <p>mf app body</p>
    </Bound>
  </div>
)
export default App
