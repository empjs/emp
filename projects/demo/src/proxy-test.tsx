import React from 'react'
import ReactDOM from 'react-dom/client'
import ProxyTest from './ProxyTest'
import './reset.css'

const root = ReactDOM.createRoot(document.getElementById('emp-root')!)

root.render(
  <React.StrictMode>
    <ProxyTest />
  </React.StrictMode>,
)
