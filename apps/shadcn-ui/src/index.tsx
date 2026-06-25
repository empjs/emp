import {createRoot} from 'react-dom/client'
import {TableDemo} from './Table'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<TableDemo />)
