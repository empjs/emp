import {test} from '@rstest/core'
import {clickButton, clickText, expectFrameText, loadAppFrame, removeFrame} from '../../../test-support/browser/frame'

test('vue-2-project renders Vue 2 remote content and remote composition state', async () => {
  const frame = await loadAppFrame('vue-2-project')
  try {
    await expectFrameText(frame, 'Project App vue 2 project')
    await expectFrameText(frame, '=== @v2b/Content ===')
    await expectFrameText(frame, '=== @v2b/Table ===')
    await expectFrameText(frame, 'CompositionApi')
    await expectFrameText(frame, '王小虎')
    await clickButton(frame, /Vuex Store : 0/)
    await expectFrameText(frame, 'Vuex Store : 1')
    await clickText(frame, 'More... update from base')
    await expectFrameText(frame, 'EMP Vue2 Component From BASE!')
    await expectFrameText(frame, 'Vue2 Add Button')
    await clickButton(frame, /count is: 0, state.count is 0/)
    await expectFrameText(frame, 'count is: 1, state.count is 1')
  } finally {
    await removeFrame(frame)
  }
}, 120000)
