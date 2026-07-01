import 'src/tailwindcss.css'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {createRoot} from 'react-dom/client'

// Import the generated route tree
import {routeTree} from './routeTree.gen'

const routeBasepath = location.pathname.startsWith('/container-static/react-19-tanstack')
  ? '/container-static/react-19-tanstack'
  : '/'

// Create a new router instance
const router = createRouter({routeTree, basepath: routeBasepath})

// Render the app
const rootElement = document.getElementById('emp-root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
