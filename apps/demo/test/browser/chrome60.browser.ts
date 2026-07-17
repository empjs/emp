import {frameDocument, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'
import {expect, test} from '@rstest/core'

test('demo chrome60 preset renders with the expected compatibility APIs', async () => {
  const frame = await loadAppFrame('demo')
  try {
    const view = frameDocument(frame).defaultView
    expect(view).toBeTruthy()
    expect(typeof view?.Promise).toBe('function')
    expect(typeof view?.Promise.allSettled).toBe('function')
    expect(typeof view?.Object.fromEntries).toBe('function')
    expect(typeof view?.Array.prototype.flat).toBe('function')
  } finally {
    await removeFrame(frame)
  }
}, 60000)
