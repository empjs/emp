import {createRoot} from 'react-dom/client'
import App from './App'
import './reset.scss'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<App />)
