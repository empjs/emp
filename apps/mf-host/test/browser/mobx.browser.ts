import {test} from '@rstest/core'
import {clickButton, expectFrameText, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('mf-host increments the real MobX counter', async () => {
  const frame = await loadAppFrame('mf-host')
  try {
    await expectFrameText(frame, 'EMP 3.0 React')
    await expectFrameText(frame, 'Mobx Count')
    await expectFrameText(frame, 'mixin test')
    await expectFrameText(frame, /Mobx Count\s*0/)

    await clickButton(frame, /count is 0/)

    await expectFrameText(frame, /count is 1/)
    await expectFrameText(frame, /Mobx Count\s*1/)
  } finally {
    await removeFrame(frame)
  }
}, 90000)
