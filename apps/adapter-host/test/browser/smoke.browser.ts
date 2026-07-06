import {test} from '@rstest/core'
import {expectFrameText, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('adapter-host renders the React bridge shell and version', async () => {
  const frame = await loadAppFrame('adapter-host')
  try {
    await expectFrameText(frame, 'React Adapter Host')
    await expectFrameText(frame, /React Version\s+\d+\./)
  } finally {
    await removeFrame(frame)
  }
}, 60000)
