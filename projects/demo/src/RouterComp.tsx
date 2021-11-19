import {HashRouter, Switch, Route} from 'react-router-dom'
import App from 'src/App'
import About from 'src/About'
const RouterComp = () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/about" component={About} />
    </Switch>
  </HashRouter>
)
export default RouterComp
