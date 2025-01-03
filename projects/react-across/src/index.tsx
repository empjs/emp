import React from 'react'
import ReactDOM from 'react-dom'
import {createRoot} from 'react-dom/client'
import App from './App'
if (React.version.startsWith('17.')) {
  ;(ReactDOM as any).render(<App />, document.getElementById('emp-root'))
} else {
  const dom = document.getElementById('emp-root')!
  const root = createRoot(dom)
  root.render(<App />)
}
