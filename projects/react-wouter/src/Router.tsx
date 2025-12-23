import {lazy, Suspense} from 'react'
import {Link, Route, Router, Switch, useRoute} from 'wouter'
import Home from './Home'
import Info from './Info'
import NotFound from './NotFound'
import User, {UserList} from './User'

// const DynamicPage = lazy(() => import('./DynamicPage'))

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
      <ActiveLink href="/dynamic">Dynamic</ActiveLink>
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

// --- Configuration Based Routing Example ---

export type RouteConfig = {
  path?: string
  component?: React.ComponentType<any>
  async?: () => Promise<{default: React.ComponentType<any>}>
}

const withSuspense = (LazyComponent: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<div>Loading Page...</div>}>
    <LazyComponent {...props} />
  </Suspense>
)

const processRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  return routes.map(route => {
    if (route.async) {
      const LazyComponent = lazy(route.async)
      return {
        ...route,
        component: withSuspense(LazyComponent),
      }
    }
    return route
  })
}

export const routes: RouteConfig[] = processRoutes([
  {path: '/', component: Home},
  {path: '/info', component: Info},
  {path: '/users', component: UserList},
  {path: '/user/:id', component: User},
  {path: '/dynamic', async: () => import('./DynamicPage')},
  // Fallback route (no path specified)
  {component: NotFound},
])

export const RouterProviderConfig = () => {
  return (
    <Router hook={useH}>
      <Nav />
      <main>
        <Switch>
          {routes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
        </Switch>
      </main>
    </Router>
  )
}
