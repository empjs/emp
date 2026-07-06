import {test} from '@rstest/core'
import {expectFrameText, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('rspack2 modern module renders the ESM marker into the DOM', async () => {
  const frame = await loadAppFrame('rspack2-modern-module')
  try {
    await expectFrameText(frame, 'rspack2 modern module ready')
  } finally {
    await removeFrame(frame)
  }
}, 60000)
