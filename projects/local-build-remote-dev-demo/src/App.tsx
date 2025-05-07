import rt from '@empjs/share/runtime'
import {Suspense, lazy} from 'react'
// import RemoteApp from './RemoteApp'
function App() {
  const RemoteApp = lazy(() => rt.load('rc/RemoteApp'))
  return (
    <div className="App">
      <h1>EMP 3 Local</h1>
      <Suspense>
        <RemoteApp />
      </Suspense>
    </div>
  )
}

export default App
