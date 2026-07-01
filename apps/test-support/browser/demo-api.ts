import {expect} from '@rstest/core'

export function rewriteDemoApiFetch(frame: HTMLIFrameElement) {
  const win = frame.contentWindow as (Window & {__empDemoApiFetchRewritten?: boolean}) | null
  expect(win, `iframe ${frame.title} has no contentWindow`).toBeTruthy()
  if (win!.__empDemoApiFetchRewritten) return

  const originalFetch = win!.fetch.bind(win)
  const ResponseCtor = win!.Response
  const fetchDemoApi = (pathname: string, init?: RequestInit) => originalFetch(`http://localhost:3001${pathname}`, init)
  const errorResponse = () =>
    Promise.resolve(
      new ResponseCtor(
        JSON.stringify({
          success: false,
          error: 'Internal Server Error',
          message: 'This is a test error response',
        }),
        {
          status: 500,
          headers: {'content-type': 'application/json'},
        },
      ),
    )

  win!.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      if (input === '/api/error') return errorResponse()
      if (input === '/api/echo') return fetchDemoApi(input, init)
      return originalFetch(`/container-static/demo${input}`, init)
    }
    if (input instanceof Request && new URL(input.url).pathname.startsWith('/api/')) {
      const url = new URL(input.url)
      const forwardedInit = {
        method: input.method,
        headers: input.headers,
        body: input.body,
      }
      if (url.pathname === '/api/error') return errorResponse()
      if (url.pathname === '/api/echo') return fetchDemoApi(url.pathname + url.search, forwardedInit)
      return originalFetch(`/container-static/demo${url.pathname}${url.search}`, forwardedInit)
    }
    return originalFetch(input, init)
  }
  win!.__empDemoApiFetchRewritten = true
}
