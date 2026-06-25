import {createRoot} from 'react-dom/client'
import App from 'src/pages/work/App'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<App />)
