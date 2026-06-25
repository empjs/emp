import 'abortcontroller-polyfill'
import {createRoot} from 'react-dom/client'
import {RouterConfigProvider, RouterEntry} from './Router'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
// root.render(<RouterEntry />)
root.render(<RouterConfigProvider />)

// import ReactDOM from 'react-dom'
// import App from './App'
// ReactDOM.render(<RouterConfigProvider />, document.getElementById('emp-root'))
console.log('EMP_SHARE_RUNTIME', window)
