import {expect, rstest, test} from '@rstest/core'
import {frameDiagnostics, frameDocument, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'

test('dual-role app serves two ports that consume each other', async () => {
  const roleA = await loadAppFrame('dual-role-a')
  const roleB = await loadAppFrame('dual-role-b')
  try {
    await rstest.waitFor(() => {
      const roleAText = frameDocument(roleA).body.textContent ?? ''
      const roleBText = frameDocument(roleB).body.textContent ?? ''
      expect(roleAText, frameDiagnostics(roleA)).toContain('Dual role 8201 consumed peer 8202')
      expect(roleBText, frameDiagnostics(roleB)).toContain('Dual role 8202 consumed peer 8201')
    }, {timeout: 10000})
  } finally {
    await removeFrame(roleA)
    await removeFrame(roleB)
  }
}, 120000)
