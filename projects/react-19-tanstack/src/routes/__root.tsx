import {createRootRoute, Link, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'

const Nav = () => (
  <div className="p-2 flex gap-2 border-b border-gray-300">
    <Link to="/" className="[&.active]:font-bold">
      Home
    </Link>
    <Link to="/about" className="[&.active]:font-bold">
      About
    </Link>
  </div>
)
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
