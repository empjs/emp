// import ReactDOM from 'react-dom'
import RouterComp from 'src/RouterComp'
import './normalize.css'
// ReactDOM.render(<RouterComp />, document.getElementById('emp-root'))
import {createRoot} from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom'
console.log('[mf-app] react', React.version)
console.log('[mf-app] react-dom', ReactDOM.version)

const domNode = document.getElementById('emp-root')!
const root = createRoot(domNode)
root.render(<RouterComp />)
