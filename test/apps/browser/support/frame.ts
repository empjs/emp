import {expect, rstest} from '@rstest/core'

export type TextMatcher = string | RegExp

export const appPaths = {
  'adapter-app': '/container-static/adapter-app/',
  'adapter-host': '/container-static/adapter-host/',
  demo: '/container-static/demo/',
  'mf-app': '/container-static/mf-app/',
  'mf-host': '/container-static/mf-host/',
  'react-19-tanstack': '/container-static/react-19-tanstack/',
  'rspack2-optimization': '/container-static/rspack2-optimization/',
  'tailwind-4': '/container-static/tailwind-4/',
  'vue-2-base': '/container-static/vue-2-base/',
  'vue-2-project': '/container-static/vue-2-project/',
  'vue-3-base': '/container-static/vue-3-base/',
  'vue-3-project': '/container-static/vue-3-project/',
} as const

export type AppName = keyof typeof appPaths

export function appUrl(app: AppName, route = '/') {
  const base = appPaths[app]
  if (route === '/') return base
  return `${base}${route.replace(/^\//, '')}`
}

export function normalizeText(text: string | null | undefined) {
  return (text ?? '').replace(/\s+/g, ' ').trim()
}

export function textMatches(text: string | null | undefined, matcher: TextMatcher) {
  const normalized = normalizeText(text)
  return typeof matcher === 'string' ? normalized.includes(matcher) : matcher.test(normalized)
}

export function frameDocument(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument
  expect(doc, `iframe ${frame.title} has no contentDocument`).toBeTruthy()
  return doc as Document
}

export function frameDiagnostics(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument
  const body = normalizeText(doc?.body?.textContent).slice(0, 1600)
  return `src:${frame.src}\ntitle:${doc?.title ?? ''}\nbody:${body}`
}

export async function loadAppFrame(app: AppName, route = '/') {
  const frame = document.createElement('iframe')
  frame.title = `${app}-browser-test`
  frame.src = appUrl(app, route)
  frame.style.width = '1440px'
  frame.style.height = '1000px'
  frame.style.border = '0'
  document.body.appendChild(frame)
  await waitForFrameLoad(frame)
  await expectFrameReady(frame)
  return frame
}

export async function navigateFrame(frame: HTMLIFrameElement, app: AppName, route: string) {
  frame.src = appUrl(app, route)
  await waitForFrameLoad(frame)
  await expectFrameReady(frame)
}

export async function removeFrame(frame: HTMLIFrameElement) {
  frame.remove()
}

async function waitForFrameLoad(frame: HTMLIFrameElement) {
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(`Timed out loading ${frame.src}`)), 60000)
    frame.addEventListener(
      'load',
      () => {
        window.clearTimeout(timeout)
        resolve()
      },
      {once: true},
    )
  })
}

export async function expectFrameReady(frame: HTMLIFrameElement) {
  await rstest.waitFor(
    () => {
      const doc = frameDocument(frame)
      expect(normalizeText(doc.body.textContent).length, frameDiagnostics(frame)).toBeGreaterThan(0)
      expect(doc.querySelector('body')).toBeTruthy()
    },
    {timeout: 30000},
  )
  await expectNoFrameworkOverlay(frame)
}

export async function expectNoFrameworkOverlay(frame: HTMLIFrameElement) {
  await rstest.waitFor(() => {
    const text = normalizeText(frameDocument(frame).body.textContent)
    expect(text, frameDiagnostics(frame)).not.toMatch(
      /(?:Compiled with problems|Failed to compile|Module not found|Uncaught Error|ReferenceError|TypeError|SyntaxError|Internal Server Error)/,
    )
  })
}

export async function expectFrameText(frame: HTMLIFrameElement, matcher: TextMatcher, timeout = 30000) {
  await rstest.waitFor(
    () => {
      expect(textMatches(frameDocument(frame).body.textContent, matcher), frameDiagnostics(frame)).toBe(true)
    },
    {timeout},
  )
}

export function deepestMatch(elements: Element[], matcher: TextMatcher) {
  const matches = elements.filter(element => textMatches(element.textContent, matcher))
  return (
    matches.find(
      element => !Array.from(element.children).some(child => textMatches(child.textContent, matcher)),
    ) ?? matches[0]
  )
}

export async function findElement(frame: HTMLIFrameElement, selector: string, matcher: TextMatcher, timeout = 30000) {
  let found: Element | undefined
  await rstest.waitFor(
    () => {
      found = deepestMatch(Array.from(frameDocument(frame).querySelectorAll(selector)), matcher)
      expect(found, `${selector} ${String(matcher)} not found\n${frameDiagnostics(frame)}`).toBeTruthy()
    },
    {timeout},
  )
  return found as HTMLElement
}

export async function clickElement(frame: HTMLIFrameElement, selector: string, matcher: TextMatcher, timeout?: number) {
  const element = await findElement(frame, selector, matcher, timeout)
  element.click()
}

export async function clickButton(frame: HTMLIFrameElement, matcher: TextMatcher, timeout?: number) {
  await clickElement(frame, 'button, [role="button"]', matcher, timeout)
}

export async function clickLink(frame: HTMLIFrameElement, matcher: TextMatcher, timeout?: number) {
  await clickElement(frame, 'a', matcher, timeout)
}

export async function clickText(frame: HTMLIFrameElement, matcher: TextMatcher, timeout?: number) {
  await clickElement(frame, 'button, a, [role="button"], div, span, p', matcher, timeout)
}

export async function fillByPlaceholder(frame: HTMLIFrameElement, placeholder: string, value: string) {
  let input: HTMLInputElement | HTMLTextAreaElement | undefined
  await rstest.waitFor(() => {
    input = frameDocument(frame).querySelector(`[placeholder="${placeholder}"]`) ?? undefined
    expect(input, `${placeholder} input not found\n${frameDiagnostics(frame)}`).toBeTruthy()
  })
  setInputValue(input!, value)
  await expectInputValue(frame, `[placeholder="${placeholder}"]`, value)
}

export function setInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const win = input.ownerDocument.defaultView ?? window
  const prototype =
    input instanceof win.HTMLTextAreaElement ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
  input.focus()
  if (valueSetter) {
    valueSetter.call(input, value)
  } else {
    input.value = value
  }
  input.dispatchEvent(new win.Event('input', {bubbles: true}))
  input.dispatchEvent(new win.Event('change', {bubbles: true}))
}

export async function checkInput(frame: HTMLIFrameElement, selector: string) {
  let input: HTMLInputElement | undefined
  await rstest.waitFor(() => {
    input = frameDocument(frame).querySelector(selector) ?? undefined
    expect(input, `${selector} input not found\n${frameDiagnostics(frame)}`).toBeTruthy()
  })
  const win = input!.ownerDocument.defaultView ?? window
  input!.checked = true
  input!.dispatchEvent(new win.Event('input', {bubbles: true}))
  input!.dispatchEvent(new win.Event('change', {bubbles: true}))
  await expectInputChecked(frame, selector, true)
}

export async function expectInputValue(frame: HTMLIFrameElement, selector: string, value: string) {
  await rstest.waitFor(() => {
    const input = frameDocument(frame).querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)
    expect(input, `${selector} input not found\n${frameDiagnostics(frame)}`).toBeTruthy()
    expect(input!.value).toBe(value)
  })
}

export async function expectInputChecked(frame: HTMLIFrameElement, selector: string, checked: boolean) {
  await rstest.waitFor(() => {
    const input = frameDocument(frame).querySelector<HTMLInputElement>(selector)
    expect(input, `${selector} input not found\n${frameDiagnostics(frame)}`).toBeTruthy()
    expect(input!.checked).toBe(checked)
  })
}

export async function expectLocationPath(frame: HTMLIFrameElement, matcher: TextMatcher) {
  await rstest.waitFor(() => {
    const pathname = frame.contentWindow?.location.pathname
    expect(textMatches(pathname, matcher), `${pathname ?? ''}\n${frameDiagnostics(frame)}`).toBe(true)
  })
}

export async function expectResultCard(frame: HTMLIFrameElement, matcher: TextMatcher, expected: TextMatcher) {
  let text = ''
  await rstest.waitFor(
    () => {
      const card = deepestMatch(Array.from(frameDocument(frame).querySelectorAll('.result-card')), matcher)
      text = normalizeText(card?.textContent)
      expect(textMatches(text, expected), `${String(expected)} not found in ${text}`).toBe(true)
    },
    {timeout: 30000},
  )
}
