import {createInstance, loadRemote, registerRemotes} from '@empjs/share/sdk'
import {lazy, Suspense, useCallback, useState} from 'react'

registerRemotes([
  {
    name: 'rtProvider',
    entry: 'http://localhost:4001/emp.json',
  },
])

setTimeout(() => {
  registerRemotes([
    {
      name: 'rtLayout',
      entry: 'http://127.0.0.1:4004/emp.json',
    },
  ])
}, 5000)

// const mf = createInstance({
//   name: 'rtHost',
//   remotes: [
//     {
//       name: 'rtProvider',
//       entry: 'http://localhost:4001/emp.json',
//     },
//     {
//       name: 'rtLayout',
//       entry: 'http://127.0.0.1:4004/emp.json',
//     },
//   ],
// })
// const ProviderApp = lazy(() => mf.loadRemote<any>('rtProvider/App'))

const App = () => {
  const [Components, setComponents] = useState<React.ReactNode[]>([])

  const handleAddRemote = useCallback(() => {
    // Use React.lazy to wrap dynamic import for Suspense
    // registerRemotes([
    //   {
    //     name: 'rtProvider',
    //     entry: 'http://localhost:4001/emp.json',
    //   },
    //   // {
    //   //   name: 'rtLayout',
    //   //   entry: 'http://127.0.0.1:4004/emp.json',
    //   // },
    // ])
    const RemoteComponent = lazy(() => loadRemote('rtProvider/App'))
    const LayoutComponent = lazy(() => loadRemote('rtLayout/App'))
    setComponents(prev => [...prev, <RemoteComponent key={prev.length} />])
  }, [setComponents])

  return (
    <div>
      <h1>Host</h1>
      <button type="button" onClick={handleAddRemote}>
        添加远程组件
      </button>
      {Components.map((component, index) => (
        <Suspense key={index} fallback={<div>Loading...</div>}>
          {component}
        </Suspense>
      ))}
    </div>
  )
}
export default App
