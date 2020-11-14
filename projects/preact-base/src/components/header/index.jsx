import {Link} from 'preact-router/match'
import style from './style.module.less'

const Header = ({menu}) => (
  <header className={style.header}>
    <h1>Preact App</h1>
    <nav>
      {menu &&
        menu.map(item => (
          <Link activeClassName={style.active} href={item.path}>
            {item.name}
          </Link>
        ))}
    </nav>
  </header>
)

export default Header
