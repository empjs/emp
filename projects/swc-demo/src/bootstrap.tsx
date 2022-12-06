import {createRoot} from 'react-dom/client'
import {App} from './App'
const rootElm = document.getElementById('emp-root') as HTMLElement
const root = createRoot(rootElm)

root.render(<App />)

//
console.log('react root', root)
