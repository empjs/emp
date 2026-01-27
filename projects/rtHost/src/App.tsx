import {createInstance} from '@empjs/share/sdk'
import {lazy, Suspense, useCallback, useState} from 'react'

const mf = createInstance({
  name: 'rtHost',
  remotes: [
    {
      name: 'rtProvider',
      entry: 'http://localhost:4001/emp.json',
    },
    {
      name: 'rtLayout',
      entry: 'http://127.0.0.1:4004/emp.json',
    },
  ],
})
const ProviderApp = lazy(() => mf.loadRemote<any>('rtProvider/App'))

const App = () => {
  const [instanceIds, setInstanceIds] = useState<number[]>(() => [Date.now()])

  const handleAddRemote = useCallback(async () => {
    await mf.loadRemote<any>('rtProvider/App')
    setInstanceIds(ids => [...ids, Date.now()])
  }, [])

  return (
    <div>
      <h1>Host</h1>
      <button type="button" onClick={handleAddRemote}>
        添加远程组件
      </button>
      {instanceIds.map(id => (
        <Suspense key={id} fallback={<div>Loading...</div>}>
          <ProviderApp name={'From Host'} debug={true} status={'Running'} />
        </Suspense>
      ))}
    </div>
  )
}
export default App
