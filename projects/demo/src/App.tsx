import {lazy, Suspense} from 'react'
import {ArrowFunction} from './ArrowFunction'
import ClassDefault from './ClassDefault'
import {ClassNamed} from './ClassNamed'
import FunctionDefault from './FunctionDefault'
import {FunctionNamed} from './FunctionNamed'
import css from './App.module.less'
import {Link} from 'react-router-dom'
import incStore from './store/incStore'
import {observer} from 'mobx-react-lite'
import partition from 'lodash/partition'
console.log('css', css)
console.log(
  'partition',
  partition([1, 2, 3, 4], n => n % 2),
)
const LazyComponent = lazy(() => import('./LazyComponent'))
const Nav = observer(() => {
  return (
    <>
      <Link to="about">About</Link>
      <p>{incStore.num}</p>
      <button onClick={() => incStore.inc()}>+1</button>
    </>
  )
})
function App() {
  return (
    <>
      <Nav />
      <div>
        <h3>[SRC] From PublicPath ENV:{process.env.env}</h3>
        <img src="/logo.jpg" />
        <h3>src from require</h3>
        <img src={require('./assets/logo.jpg')} />
        <h3>background</h3>
        <div className={css.bg}>bg</div>
        <ClassDefault />
        <ClassNamed />
        <FunctionDefault />
        <FunctionNamed />
        <ArrowFunction />
        <Suspense fallback={<h1>Loading</h1>}>
          <LazyComponent />
        </Suspense>
      </div>
    </>
  )
}

export default App
