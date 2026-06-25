import {createRootRoute, Link, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import {Nav} from 'src/components/Nav'

const RootLayout = () => (
  <>
    <div className="tailwind-react-contaner">
      <Nav />
      <Outlet />
    </div>
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({component: RootLayout})
