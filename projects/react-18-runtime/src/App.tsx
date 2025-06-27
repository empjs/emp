import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'
import {lazy, Suspense, useEffect} from 'react'

const ip = process.env.ip
empRuntime.init({
  shared: reactAdapter.shared,
  remotes: [
    {
      name: 'react_astro_ui',
      entry: `http://${ip}:2800/emp.json`,
    },
  ],
})
export const App = () => {
  const Layout = lazy(() => empRuntime.load('react_astro_ui/App'))
  useEffect(() => {
    setTimeout(async () => {
      // console.log('react_astro_ui', (await empRuntime.load('react_astro_ui/App')).default.toString())
    }, 1000)
  }, [])
  return (
    <Suspense fallback="loading...">
      <Layout>
        <h1>react 18</h1>
      </Layout>
    </Suspense>
  )
}
export default App
