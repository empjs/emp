import {Outlet} from 'react-router-dom'
import {Nav} from './Nav'
import './styles.scss'

const Layout = () => {
  return (
    <div className="layout">
      <Nav />
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}
export default Layout
