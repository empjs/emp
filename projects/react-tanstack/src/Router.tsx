import {createRootRoute, createRoute, createRouter, Outlet, RouterProvider, useLocation} from '@tanstack/react-router'
import {lazy, Suspense} from 'react'
import Home from './Home'
import Info from './Info'
import NotFound from './NotFound'
import User, {UserList} from './User'

const DynamicPageLazy = lazy(() => import('./DynamicPage'))

const ActiveLink = ({to, children}: {to: string; children: React.ReactNode}) => {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <a href={to} className={isActive ? 'active' : ''}>
      {children}
    </a>
  )
}

export const Nav = () => {
  return (
    <nav>
      <div style={{fontWeight: 'bold', marginRight: 'auto'}}>Emp TanStack Router App</div>
      <ActiveLink to="/">Home</ActiveLink>
      <ActiveLink to="/info">Info</ActiveLink>
      <ActiveLink to="/users">Users</ActiveLink>
      <ActiveLink to="/dynamic">Dynamic</ActiveLink>
      <ActiveLink to="/404-test">404 Test</ActiveLink>
    </nav>
  )
}

const OutletAny: any = Outlet

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Nav />
      <main>
        <OutletAny />
      </main>
    </>
  ),
  notFoundComponent: NotFound,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const infoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'info',
  component: Info,
})

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'users',
  component: UserList,
})

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'user/$id',
  component: (props: any) => <User id={String(props.params?.id)} />,
})

const dynamicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dynamic',
  component: () => (
    <Suspense fallback={<div>Loading Page...</div>}>
      <DynamicPageLazy />
    </Suspense>
  ),
})

const routeTree = rootRoute.addChildren([homeRoute, infoRoute, usersRoute, userRoute, dynamicRoute])
const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const RouterProviderConfig = () => {
  return <RouterProvider router={router} />
}
