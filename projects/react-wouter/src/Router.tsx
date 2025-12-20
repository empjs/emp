import {Link, Route, Router, Switch, useRoute} from 'wouter'
import Home from './Home'
import Info from './Info'
import NotFound from './NotFound'
import User, {UserList} from './User'

// Custom Link component to handle active state
const ActiveLink = ({href, children}: {href: string; children: React.ReactNode}) => {
  const [isActive] = useRoute(href)
  return (
    <Link href={href} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  )
}

export const Nav = () => {
  return (
    <nav>
      <div style={{fontWeight: 'bold', marginRight: 'auto'}}>Emp Wouter App</div>
      <ActiveLink href="/">Home</ActiveLink>
      <ActiveLink href="/info">Info</ActiveLink>
      <ActiveLink href="/users">Users</ActiveLink>
      <ActiveLink href="/404-test">404 Test</ActiveLink>
    </nav>
  )
}

export const RouterProvider = () => {
  return (
    <Router>
      <Nav />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/info" component={Info} />
          <Route path="/users" component={UserList} />
          <Route path="/user/:id" component={User} />

          {/* Default 404 route */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </Router>
  )
}
