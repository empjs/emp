import {Router} from 'preact-router'
import Header from '@emp-preact/base/header'
import Home from '../routes/home'

const App = () => (
  <div id="app">
    <Header menu={[{name: 'index', path: '/'}]} />
    <Router>
      <Home path="/" />
    </Router>
  </div>
)

export default App
