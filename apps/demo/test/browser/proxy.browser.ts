import {test} from '@rstest/core'
import {
  clickButton,
  clickElement,
  expectFrameText,
  expectResultCard,
  fillByPlaceholder,
  loadAppFrame,
  navigateFrame,
  removeFrame,
} from '@empjs/test-support/browser/frame'
import {rewriteDemoApiFetch, simulateDemoApiFailure} from '@empjs/test-support/browser/demo-api'

test('demo shell and proxy page keep form and API interactions working end to end', async () => {
  const frame = await loadAppFrame('demo')
  try {
    await expectFrameText(frame, 'EMP 3.0')
    await clickElement(frame, 'button', /./)
    await expectFrameText(frame, 'Image Text')
    await fillByPlaceholder(frame, '你的名字', 'Codex')
    await clickButton(frame, '保存')
    await expectFrameText(frame, '已保存：Codex')

    await navigateFrame(frame, 'demo', '/proxy-test.html')
    rewriteDemoApiFetch(frame)

    await expectFrameText(frame, 'EMP Proxy 功能测试')
    await expectFrameText(frame, '代理配置: /api/* → 本地测试 API')

    await clickButton(frame, '运行所有基础测试')

    await expectResultCard(frame, '/api/hello', 'Hello from test API server!')
    await expectResultCard(frame, '/api/user', 'Test User')
    await expectResultCard(frame, '/api/posts', 'First Post')

    await clickButton(frame, '测试延迟响应 (2秒)')
    await expectResultCard(frame, '/api/delay', 'Delayed response after 2 seconds')

    await clickButton(frame, '测试错误响应')
    await expectResultCard(frame, '/api/error', 'Internal Server Error')

    await clickButton(frame, '测试 POST /api/echo')
    await expectResultCard(frame, '/api/echo', 'success')
    await expectResultCard(frame, '/api/echo', 'data')
  } finally {
    await removeFrame(frame)
  }
}, 120000)

test('demo proxy page surfaces proxy target unavailable diagnostics', async () => {
  const frame = await loadAppFrame('demo', '/proxy-test.html')
  try {
    rewriteDemoApiFetch(frame)
    simulateDemoApiFailure(frame, '/api/hello', 'proxy target unavailable: ECONNREFUSED')

    await expectFrameText(frame, 'EMP Proxy 功能测试')
    await clickButton(frame, '测试 GET /api/hello')

    await expectResultCard(frame, '/api/hello', 'proxy target unavailable')
    await expectResultCard(frame, '/api/hello', 'ECONNREFUSED')
  } finally {
    await removeFrame(frame)
  }
}, 60000)
