import {test} from '@rstest/core'
import {clickButton, expectFrameText, loadAppFrame, removeFrame} from '../../../test-support/browser/frame'

test('mf-app renders the remote host shell and updates remote state', async () => {
  const frame = await loadAppFrame('mf-app')
  try {
    await expectFrameText(frame, 'MF-Host')
    await expectFrameText(frame, 'MF-APP')
    await expectFrameText(frame, 'EMP 3.0 React')
    await expectFrameText(frame, 'mf-app')
    await expectFrameText(frame, 'mf app body')
    await expectFrameText(frame, 'fromMainAppName')
    await expectFrameText(frame, 'nameformRemote')
    await expectFrameText(frame, /Mobx Count\s*0/)

    await clickButton(frame, /count is 0/)

    await expectFrameText(frame, /count is 1/)
    await expectFrameText(frame, /Mobx Count\s*1/)
  } finally {
    await removeFrame(frame)
  }
}, 90000)
