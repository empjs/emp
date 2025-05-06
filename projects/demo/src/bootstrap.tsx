import {createRoot} from 'react-dom/client'
import App from 'src/react/App'
import 'src/reset.scss'
import 'src/index.scss'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<App />)
