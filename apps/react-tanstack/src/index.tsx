import {createRouter, RouterProvider} from '@tanstack/react-router'
import {createRoot} from 'react-dom/client'
import {routeTree} from './routeTree.gen'
import './styles.css'

const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('emp-root')!
const root = createRoot(rootElement)
root.render(<RouterProvider router={router} />)
