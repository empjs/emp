import {expect, test} from '@rstest/core'

type ReactGlobal = {
  version: string
  createElement: (type: unknown, props?: unknown, ...children: unknown[]) => unknown
  Component: unknown
  Fragment: unknown
}

type ReactDOMGlobal = {
  version: string
  render: (element: unknown, container: Element) => unknown
  unmountComponentAtNode: (container: Element) => boolean
}

type ReactRouterDOMGlobal = {
  MemoryRouter: unknown
  Routes: unknown
  Route: unknown
}

type ReactAdapterGlobal = {
  React: ReactGlobal
  ReactDOM: ReactDOMGlobal
  ReactRouterDOM: ReactRouterDOMGlobal
}

const adapterGlobalName = 'EMP_ADAPTER_REACT'
const runtimeAsset = '/container-static/lib-react-17/runtime.umd.js'

let adapterLoad: Promise<HTMLScriptElement> | undefined

async function loadScript(src: string) {
  const script = document.createElement('script')
  await new Promise<void>((resolve, reject) => {
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.append(script)
  })
  return script
}

async function loadAdapter() {
  const win = window as typeof window & Record<string, unknown>
  if (!win[adapterGlobalName]) {
    adapterLoad ??= loadScript(runtimeAsset)
    await adapterLoad
  }
  return win[adapterGlobalName] as ReactAdapterGlobal
}

function createContainer() {
  const container = document.createElement('div')
  document.body.append(container)
  return container
}

test('React 17 adapter bundle self-bootstraps the EMP_ADAPTER_REACT global', async () => {
  const win = window as typeof window & Record<string, unknown>
  delete win[adapterGlobalName]
  delete win.React
  delete win.ReactDOM
  delete win.ReactRouterDOM
  adapterLoad = undefined

  const adapter = await loadAdapter()

  expect(adapter).toBeTruthy()
  expect(adapter.React.version).toBe('17.0.2')
  expect(adapter.ReactDOM.version).toBe('17.0.2')
  expect(typeof adapter.React.createElement).toBe('function')
  expect(typeof adapter.React.Component).toBe('function')
  expect(typeof adapter.ReactDOM.render).toBe('function')
  expect(typeof adapter.ReactDOM.unmountComponentAtNode).toBe('function')
  expect(typeof adapter.ReactRouterDOM.MemoryRouter).toBe('function')
  expect(typeof adapter.ReactRouterDOM.Routes).toBe('function')
  expect(typeof adapter.ReactRouterDOM.Route).toBe('function')

  expect(win.React).toBe(adapter.React)
  expect(win.ReactDOM).toBe(adapter.ReactDOM)
  expect(win.ReactRouterDOM).toBe(adapter.ReactRouterDOM)
})

test('React 17 adapter renders and unmounts through the bundled ReactDOM', async () => {
  const {React, ReactDOM} = await loadAdapter()
  const container = createContainer()

  try {
    ReactDOM.render(React.createElement('span', {id: 'e2e-react-17'}, 'react17-e2e'), container)

    expect(container.textContent).toBe('react17-e2e')
    expect(container.querySelector('#e2e-react-17')).toBeTruthy()

    ReactDOM.unmountComponentAtNode(container)
    expect(container.textContent).toBe('')
  } finally {
    container.remove()
  }
})

test('React 17 adapter router resolves a matched route inside MemoryRouter', async () => {
  const {React, ReactDOM, ReactRouterDOM} = await loadAdapter()
  const container = createContainer()

  try {
    ReactDOM.render(
      React.createElement(
        ReactRouterDOM.MemoryRouter,
        {initialEntries: ['/e2e']},
        React.createElement(
          ReactRouterDOM.Routes,
          null,
          React.createElement(ReactRouterDOM.Route, {
            path: '/e2e',
            element: React.createElement('span', null, 'react17-router-e2e'),
          }),
        ),
      ),
      container,
    )

    expect(container.textContent).toBe('react17-router-e2e')
  } finally {
    ReactDOM.unmountComponentAtNode(container)
    container.remove()
  }
})
