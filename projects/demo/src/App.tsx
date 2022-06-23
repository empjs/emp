import {lazy, Suspense} from 'react'
import {ArrowFunction} from './ArrowFunction'
import ClassDefault from './ClassDefault'
import {ClassNamed} from './ClassNamed'
import FunctionDefault from './FunctionDefault'
import {FunctionNamed} from './FunctionNamed'
import {Link} from 'react-router-dom'
import incStore from './store/incStore'
import {observer} from 'mobx-react-lite'
import partition from 'lodash/partition'
import Decorators from './Decorators'
//
// import css from './App.module.less'
import css from './App.module.scss'
import Files from './Files'

console.log('css', css, process.env.env)
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
      <pre>{incStore.code}</pre>
      <button
        onClick={() => {
          incStore.inc()
          incStore.loadData()
        }}
      >
        +1
      </button>
      <Decorators />
    </>
  )
})
const App = () => {
  return (
    <>
      <Nav />
      <div>
        <h3>[SRC] From PublicPath ENV:{process.env.env}</h3>
        <Files />
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
