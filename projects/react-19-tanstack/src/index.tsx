import 'src/style.css'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {createRoot} from 'react-dom/client'

// Import the generated route tree
import {routeTree} from './routeTree.gen'

// Create a new router instance
const router = createRouter({routeTree})

// Render the app
const rootElement = document.getElementById('emp-root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
