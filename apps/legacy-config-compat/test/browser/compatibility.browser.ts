import {frameDocument, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'
import {expect, rstest, test} from '@rstest/core'

test('legacy configuration project renders, polyfills APIs, and preserves CSS Modules prefix', async () => {
  const frame = await loadAppFrame('legacy-config-compat')
  try {
    const document = frameDocument(frame)
    expect(document.body.textContent).toContain('Legacy configuration compatibility works')
    expect(document.querySelector('[data-testid="compatibility-apis"]')?.textContent).toContain('1:2')
    expect(document.querySelector('[data-testid="legacy-config-page"]')?.className).toMatch(/^legacy-/)

    const counter = document.querySelector<HTMLButtonElement>('[data-testid="counter"]')
    expect(counter).toBeTruthy()
    counter?.click()
    await rstest.waitFor(() => expect(counter?.textContent).toContain('Count: 1'))
  } finally {
    await removeFrame(frame)
  }
}, 60000)
