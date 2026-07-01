import {test} from '@rstest/core'
import {clickButton, clickText, expectFrameText, loadAppFrame, removeFrame} from '../../../test-support/browser/frame'

test('vue-2-base toggles base content and composition state', async () => {
  const frame = await loadAppFrame('vue-2-base')
  try {
    await expectFrameText(frame, 'Content Component')
    await expectFrameText(frame, 'Hello JSX Component')
    await expectFrameText(frame, 'Element Table')
    await expectFrameText(frame, 'CompositionApi')
    await clickButton(frame, /Vuex Store : 0/)
    await expectFrameText(frame, 'Vuex Store : 1')
    await clickText(frame, 'More... update from base')
    await expectFrameText(frame, 'EMP Vue2 Component From BASE!')
    await expectFrameText(frame, 'Vue2 Add Button')
    await expectFrameText(frame, 'button components in content from import')
    await expectFrameText(frame, 'dynamic import')
    await clickButton(frame, /count is: 0, state.count is 0/)
    await expectFrameText(frame, 'count is: 1, state.count is 1')
  } finally {
    await removeFrame(frame)
  }
}, 90000)
