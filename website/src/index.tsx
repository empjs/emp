import './styles.css'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './App'

const rootElement = document.getElementById('emp-root')

if (!rootElement) {
  throw new Error('Missing #emp-root mount node')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
