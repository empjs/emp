import {createRoot} from 'react-dom/client'
import less from 'src/app.module.less'
import scss from 'src/app.module.scss'
import './index.scss'
import './normalize.css'
const App = () => {
  return (
    <div className="app">
      <h1 className={scss.title}> Hello Word!</h1>
      <p className={less.p}>this is in app module css</p>
    </div>
  )
}
const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<App />)
