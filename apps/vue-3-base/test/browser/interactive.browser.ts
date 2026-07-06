import {test} from '@rstest/core'
import {clickButton, expectFrameText, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('vue-3-base keeps local Ant Design and Pinia interactions working', async () => {
  const frame = await loadAppFrame('vue-3-base')
  try {
    await expectFrameText(frame, 'Vue 3 Base')
    await expectFrameText(frame, '胡彦斌')
    await clickButton(frame, 'add')
    await expectFrameText(frame, 'value: 1')
    await clickButton(frame, 'Increment Pinia Count')
    await expectFrameText(frame, /Pinia count base:\s*1/)
  } finally {
    await removeFrame(frame)
  }
}, 90000)
