import {expect, rstest, test} from '@rstest/core'
import {clickButton, frameDocument, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

function styleSnapshot(element: Element) {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  return {
    backgroundColor: style?.backgroundColor,
    color: style?.color,
    margin: style?.margin,
    padding: style?.padding,
  }
}

test('Tailwind MF isolation applies remote utilities without changing host styles', async () => {
  const frame = await loadAppFrame('mf-app')
  try {
    const sentinel = frameDocument(frame).querySelector('[data-host-style-sentinel]')
    expect(sentinel).toBeTruthy()
    const before = styleSnapshot(sentinel as Element)

    await clickButton(frame, 'Load Tailwind remote')
    await rstest.waitFor(() => {
      const remote = frameDocument(frame).querySelector('[data-tailwind-remote="scoped"]')
      expect(remote).toBeTruthy()
      const remoteStyle = remote?.ownerDocument.defaultView?.getComputedStyle(remote)
      expect(remoteStyle?.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      expect(remoteStyle?.backgroundColor).not.toBe('transparent')
      expect(remoteStyle?.color).not.toBe('rgb(17, 24, 39)')
      expect(remoteStyle?.paddingTop).toBe('24px')
      expect(remoteStyle?.borderRadius).toBe('12px')
    })

    expect(styleSnapshot(sentinel as Element)).toEqual(before)
  } finally {
    await removeFrame(frame)
  }
}, 120000)
