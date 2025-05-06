import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'
// import App from './App'
import {Suspense, lazy} from 'react'
const ip = process.env.ip
const port = process.env.port
empRuntime.init({
  shared: {...reactAdapter.shared},
  remotes: [
    {
      name: 'mfHost',
      entry: `http://${ip}:${port}/emp.js`,
    },
  ],
})
const App = lazy(() => empRuntime.load('mfHost/App'))
//

export const Layout = (props: any) => {
  return (
    <div>
      <h1 style={{borderBottom: `1px solid #eee`}}>Module Ferderation Layout</h1>
      <Suspense fallback={<div>加载中...</div>}>
        <App />
      </Suspense>
    </div>
  )
}

export default Layout
