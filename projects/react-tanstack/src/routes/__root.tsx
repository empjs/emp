import {createRootRoute, Outlet, useLocation, useNavigate} from '@tanstack/react-router'
import NotFound from '../NotFound'

const OutletAny: any = Outlet

const ActiveLink = ({to, children}: {to: string; children: React.ReactNode}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = location.pathname === to
  return (
    <a
      href={to}
      className={isActive ? 'active' : ''}
      onClick={e => {
        e.preventDefault()
        navigate({to: to as any})
      }}
    >
      {children}
    </a>
  )
}

const Layout = () => {
  return (
    <>
      <nav>
        <div style={{fontWeight: 'bold', marginRight: 'auto'}}>Emp TanStack Router App</div>
        <ActiveLink to="/">Home</ActiveLink>
        <ActiveLink to="/info">Info</ActiveLink>
        <ActiveLink to="/users">Users</ActiveLink>
        <ActiveLink to="/dynamic">Dynamic</ActiveLink>
        <ActiveLink to="/404-test">404 Test</ActiveLink>
      </nav>
      <main>
        <OutletAny />
      </main>
    </>
  )
}

export const Route = createRootRoute({
  component: Layout,
  notFoundComponent: NotFound,
})
