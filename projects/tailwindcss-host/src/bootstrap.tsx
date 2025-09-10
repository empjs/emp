import {createRoot} from 'react-dom/client'
import Container from './component/Container'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<Container />)
