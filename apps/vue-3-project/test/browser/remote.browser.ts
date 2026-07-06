import {test} from '@rstest/core'
import {clickButton, clickLink, expectFrameText, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('vue-3-project consumes remote Vue 3 routes and Pinia component', async () => {
  const frame = await loadAppFrame('vue-3-project')
  try {
    await expectFrameText(frame, 'Hello App')
    await expectFrameText(frame, 'Current route path: /')
    await expectFrameText(frame, 'Vue 3 Project')
    await expectFrameText(frame, 'vue3Base/PiniaCount')
    await clickButton(frame, 'Increment Pinia Count')
    await expectFrameText(frame, /Pinia count remote:\s*1/)
    await clickLink(frame, 'Go to Host Home')
    await expectFrameText(frame, /Current route path:\s*\/hostHome/)
    await expectFrameText(frame, 'Vue 3 base Component')
    await expectFrameText(frame, 'Host Home')
    await clickLink(frame, 'Go to Home')
    await expectFrameText(frame, 'Current route path: /')
    await expectFrameText(frame, 'Vue 3 Project')
  } finally {
    await removeFrame(frame)
  }
}, 120000)

test('vue-3-project supports direct hash route refresh for remote host home', async () => {
  const frame = await loadAppFrame('vue-3-project', '/#/hostHome')
  try {
    await expectFrameText(frame, 'Hello App')
    await expectFrameText(frame, /Current route path:\s*\/hostHome/)
    await expectFrameText(frame, 'Vue 3 base Component')
    await expectFrameText(frame, 'Host Home')
  } finally {
    await removeFrame(frame)
  }
}, 60000)
