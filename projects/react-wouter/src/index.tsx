import {createRoot} from 'react-dom/client'
import {RouterProviderConfig} from './Router'
import './styles.css'

const rootElement = document.getElementById('emp-root')!
const root = createRoot(rootElement)
root.render(<RouterProviderConfig />)
