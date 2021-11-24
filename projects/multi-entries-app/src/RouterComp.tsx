import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'
import App from 'src/App'
import About from 'src/About'
import Nav from './Nav'
const RouterComp = () => (
  <>
    <Nav />
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/about" component={About} />
      </Switch>
    </BrowserRouter>
  </>
)
export default RouterComp
