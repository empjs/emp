import {BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter} from 'react-router-dom'
import About from './About'
import App from './App'
import Layout from './Layout'
export const RouterEntry = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<App />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export const routerConfig = createBrowserRouter([
  {
    path: '/',
    // Component: Layout,
    async lazy() {
      const {default: Component} = await import('./Layout')
      return {Component}
    },
    children: [
      {
        index: true,
        // Component: App,
        async lazy() {
          const {default: Component} = await import('./App')
          return {Component}
        },
      },
      {
        path: 'about',
        // Component: About,
        async lazy() {
          const {default: Component} = await import('./About')
          return {Component}
        },
      },
    ],
  },
])

export const RouterConfigProvider = () => <RouterProvider router={routerConfig} />
