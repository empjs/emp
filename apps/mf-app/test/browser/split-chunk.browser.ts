import {expect, rstest, test} from '@rstest/core'
import {clickButton, expectFrameText, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('Federation splitChunks requests and renders the remote async chunk', async () => {
  const frame = await loadAppFrame('mf-app')
  try {
    const performance = frame.contentWindow?.performance
    const before = new Set((performance?.getEntriesByType('resource') ?? []).map(entry => entry.name))

    await clickButton(frame, 'Load federation split chunk')
    await expectFrameText(frame, 'Federation async chunk rendered')

    await rstest.waitFor(() => {
      const newRemoteScripts = (performance?.getEntriesByType('resource') ?? [])
        .map(entry => entry.name)
        .filter(name => !before.has(name) && /:6001\/js\/.*\.js(?:\?|$)/.test(name))
      expect(newRemoteScripts.length, `new remote resources: ${newRemoteScripts.join(', ')}`).toBeGreaterThan(0)
    })
  } finally {
    await removeFrame(frame)
  }
}, 120000)
