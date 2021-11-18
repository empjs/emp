import {lazy, Suspense} from 'react'
import {ArrowFunction} from './ArrowFunction'
import ClassDefault from './ClassDefault'
import {ClassNamed} from './ClassNamed'
import FunctionDefault from './FunctionDefault'
import {FunctionNamed} from './FunctionNamed'
import css from './App.module.less'
console.log('css', css)
const LazyComponent = lazy(() => import('./LazyComponent'))

function App() {
  return (
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
  )
}

export default App
