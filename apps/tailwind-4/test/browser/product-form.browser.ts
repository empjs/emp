import {test} from '@rstest/core'
import {checkInput, clickButton, expectFrameText, expectInputChecked, loadAppFrame, removeFrame} from '../../../test-support/browser/frame'

test('tailwind product form keeps size selection and add-to-bag flow on the real page', async () => {
  const frame = await loadAppFrame('tailwind-4')
  try {
    await expectFrameText(frame, 'Tailwind CSS 4')
    await expectFrameText(frame, 'Classic Utility Jacket')
    await expectFrameText(frame, 'Free shipping on all continental US orders.')

    await checkInput(frame, 'input[name="size"][value="xl"]')
    await clickButton(frame, 'Add to bag')

    await expectFrameText(frame, 'Classic Utility Jacket')
    await expectFrameText(frame, 'Free shipping on all continental US orders.')
    await expectInputChecked(frame, 'input[name="size"][value="xl"]', true)
  } finally {
    await removeFrame(frame)
  }
}, 60000)
