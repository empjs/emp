import {expect, test} from '@rstest/core'
import {expectFrameText, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('ESM Federation entry is consumed through native module import', async () => {
  const frame = await loadAppFrame('esm-federation')
  try {
    await expectFrameText(frame, 'ESM Federation provider ready')
  } finally {
    await removeFrame(frame)
  }

  const entry = await import(/* webpackIgnore: true */ '/container-static/esm-federation/esm-entry.js')
  expect(entry.get).toEqual(expect.any(Function))
  expect(entry.init).toEqual(expect.any(Function))

  await entry.init({})
  const factory = await entry.get('./Message')
  const remote = factory() as {createRemoteMessage?: () => string}
  expect(remote.createRemoteMessage?.()).toBe('ESM Federation remote loaded')
}, 60000)
