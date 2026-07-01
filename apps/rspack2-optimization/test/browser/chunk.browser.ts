import {test} from '@rstest/core'
import {expectFrameText, loadAppFrame, removeFrame} from '../../../test-support/browser/frame'

test('rspack2 optimization chunk output renders the pure value into the DOM', async () => {
  const frame = await loadAppFrame('rspack2-optimization')
  try {
    await expectFrameText(frame, 'pure-value')
  } finally {
    await removeFrame(frame)
  }
}, 60000)
