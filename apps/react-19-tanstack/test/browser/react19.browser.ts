import {test} from '@rstest/core'
import {
  clickButton,
  clickLink,
  expectFrameText,
  expectInputValue,
  expectLocationPath,
  fillByPlaceholder,
  loadAppFrame,
  removeFrame,
} from '@empjs/test-support/browser/frame'

test('react-19-tanstack covers action state, optimistic, transition, deferred, and router lab flows', async () => {
  const frame = await loadAppFrame('react-19-tanstack')
  try {
    await expectFrameText(frame, 'Tailwind CSS 4 Showcase')

    await clickLink(frame, 'React 19')
    await expectFrameText(frame, 'React 19 Feature Suite')
    await expectFrameText(frame, 'useActionState()')
    await expectFrameText(frame, 'useOptimistic()')
    await expectFrameText(frame, 'useDeferredValue')
    await expectFrameText(frame, 'startTransition')
    await expectFrameText(frame, 'useFormStatus()')

    await fillByPlaceholder(frame, 'Your name', 'EMP')
    await expectInputValue(frame, '[placeholder="Your name"]', 'EMP')
    await clickButton(frame, 'Save')
    await expectFrameText(frame, 'Saved: EMP')

    await fillByPlaceholder(frame, 'Add item', 'Gamma')
    await expectInputValue(frame, '[placeholder="Add item"]', 'Gamma')
    await clickButton(frame, 'Add')
    await expectFrameText(frame, 'Gamma')

    await fillByPlaceholder(frame, 'Filter rows', 'Row 99')
    await expectInputValue(frame, '[placeholder="Filter rows"]', 'Row 99')
    await expectFrameText(frame, 'Matched: 11')

    await fillByPlaceholder(frame, 'Search items', 'Item 42')
    await expectInputValue(frame, '[placeholder="Search items"]', 'Item 42')
    await expectFrameText(frame, 'Matched: 11')

    await clickLink(frame, 'Router Lab')
    await expectFrameText(frame, 'TanStack Router Lab')
    await clickLink(frame, 'Alice')
    await expectFrameText(frame, 'Alice')
    await expectFrameText(frame, 'Route param')
    await expectFrameText(frame, 'alice')
    await expectLocationPath(frame, /router-lab\/alice$/)
  } finally {
    await removeFrame(frame)
  }
}, 120000)

test('react-19-tanstack supports direct route refresh for router lab detail pages', async () => {
  const frame = await loadAppFrame('react-19-tanstack', '/router-lab/alice')
  try {
    await expectFrameText(frame, 'TanStack Router Lab')
    await expectFrameText(frame, 'Alice')
    await expectFrameText(frame, 'Route param')
    await expectFrameText(frame, 'alice')
    await expectLocationPath(frame, /router-lab\/alice$/)
  } finally {
    await removeFrame(frame)
  }
}, 60000)
