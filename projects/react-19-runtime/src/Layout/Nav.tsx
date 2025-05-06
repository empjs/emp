import {Link, NavLink} from 'react-router-dom'

export function Nav() {
  return (
    <nav>
      <NavLink to="/" className={({isActive}) => (isActive ? 'active' : '')}>
        Home
      </NavLink>

      <NavLink className={({isActive}) => (isActive ? 'active' : '')} to="/about">
        About
      </NavLink>
    </nav>
  )
}
