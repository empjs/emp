import {expect, rstest, test} from '@rstest/core'
import {
  clickButton,
  clickText,
  expectFrameText,
  frameDiagnostics,
  frameDocument,
  loadAppFrame,
  removeFrame,
} from '@empjs/test-support/browser/frame'

test('adapter-app renders local React, Vue 2, and Vue 3 remotes through bridge adapters', async () => {
  const frame = await loadAppFrame('adapter-app')
  try {
    await expectFrameText(frame, 'Vue 2 Remote App')
    await expectFrameText(frame, 'React Adapter Host')
    await expectFrameText(frame, /value:\s*0/)
    await expectFrameText(frame, 'EMP跨框架集成演示')

    await clickText(frame, 'More... update from base')
    await expectFrameText(frame, 'EMP Vue2 Component From BASE!')

    await clickButton(frame, /Vuex Store\s*:\s*0/)
    await expectFrameText(frame, /Vuex Store\s*:\s*1/)

    await clickButton(frame, /^add$/)
    await rstest.waitFor(() => {
      const text = frameDocument(frame).body.textContent ?? ''
      expect(text, frameDiagnostics(frame)).toContain('value: 1')
    })
  } finally {
    await removeFrame(frame)
  }
}, 90000)
