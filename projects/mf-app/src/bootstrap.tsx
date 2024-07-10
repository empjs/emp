import {createRoot} from 'react-dom/client'
import './normalize.css'
import App from './App'
const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<App />)
