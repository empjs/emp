import {expect} from '@rstest/core'

type DemoApiWindow = Window & {
  __empDemoApiFetchRewritten?: boolean
  __empDemoApiFailures?: Record<string, string>
}

function requestPath(input: RequestInfo | URL) {
  if (typeof input === 'string') return new URL(input, window.location.href).pathname
  if (input instanceof URL) return input.pathname
  return new URL(input.url).pathname
}

export function rewriteDemoApiFetch(frame: HTMLIFrameElement) {
  const win = frame.contentWindow as DemoApiWindow | null
  expect(win, `iframe ${frame.title} has no contentWindow`).toBeTruthy()
  if (win!.__empDemoApiFetchRewritten) return

  const originalFetch = win!.fetch.bind(win)
  const ResponseCtor = win!.Response
  const fetchDemoApi = (pathname: string, init?: RequestInit) => {
    const url = new URL(`/container-static/demo${pathname}`, 'http://localhost:51203')
    return new Promise<Response>((resolve, reject) => {
      const request = new win!.XMLHttpRequest()
      request.open(pathname.startsWith('/api/echo') ? 'POST' : (init?.method ?? 'GET'), url.href)
      request.onload = () => {
        resolve(
          new ResponseCtor(request.responseText, {
            status: request.status,
            statusText: request.statusText,
            headers: {'content-type': request.getResponseHeader('content-type') ?? 'application/json'},
          }),
        )
      }
      request.onerror = () => reject(new TypeError(`Demo API request failed: ${url.pathname}`))
      request.send((init?.body as XMLHttpRequestBodyInit | null | undefined) ?? null)
    })
  }
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
    const forcedFailure = win!.__empDemoApiFailures?.[requestPath(input)]
    if (forcedFailure) return Promise.reject(new TypeError(forcedFailure))

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

export function simulateDemoApiFailure(frame: HTMLIFrameElement, pathname: `/api/${string}`, message: string) {
  const win = frame.contentWindow as DemoApiWindow | null
  expect(win, `iframe ${frame.title} has no contentWindow`).toBeTruthy()
  win!.__empDemoApiFailures = {...win!.__empDemoApiFailures, [pathname]: message}
}
