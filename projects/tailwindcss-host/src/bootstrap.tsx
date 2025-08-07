import {createRoot} from 'react-dom/client'
import Container from './Container'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<Container />)
