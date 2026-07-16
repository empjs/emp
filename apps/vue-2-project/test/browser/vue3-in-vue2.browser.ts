import {expect, rstest, test} from '@rstest/core'
import {clickButton, expectFrameText, frameDocument, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('Vue3 in Vue2 updates props, keeps Pinia state, and unmounts cleanly', async () => {
  const frame = await loadAppFrame('vue-2-project')
  try {
    await expectFrameText(frame, /Pinia count from-vue2-initial:\s*0/)

    await clickButton(frame, 'Update Vue3 props')
    await expectFrameText(frame, /Pinia count from-vue2-updated:\s*0/)

    await clickButton(frame, 'Increment Pinia Count')
    await expectFrameText(frame, /Pinia count from-vue2-updated:\s*1/)

    const win = frame.contentWindow as Window & {__EMP_VUE3_IN_VUE2_UNMOUNTS__?: number}
    const unmountsBeforeToggle = win?.__EMP_VUE3_IN_VUE2_UNMOUNTS__ ?? 0
    await clickButton(frame, 'Toggle Vue3 remote')
    await rstest.waitFor(() => {
      expect(frameDocument(frame).querySelector('[data-vue3-in-vue2]')).toBeNull()
      expect(win?.__EMP_VUE3_IN_VUE2_UNMOUNTS__).toBe(unmountsBeforeToggle + 1)
    })

    await clickButton(frame, 'Toggle Vue3 remote')
    await expectFrameText(frame, /Pinia count from-vue2-updated:\s*0/)
  } finally {
    await removeFrame(frame)
  }
}, 120000)
