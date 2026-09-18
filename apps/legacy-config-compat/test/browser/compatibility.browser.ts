import {frameDocument, loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'
import {expect, rstest, test} from '@rstest/core'

test('legacy configuration project renders, polyfills APIs, and preserves CSS Modules prefix', async () => {
  const frame = await loadAppFrame('legacy-config-compat')
  try {
    const document = frameDocument(frame)
    expect(document.body.textContent).toContain('Legacy configuration compatibility works')
    expect(document.querySelector('[data-testid="compatibility-apis"]')?.textContent).toContain('1:2')
    expect(document.querySelector('[data-testid="legacy-config-page"]')?.className).toMatch(/^legacy-/)

    // plugin-postcss 把源文件里的 320px 转成 20rem 才进了产物。
    // 注意：只在 16px 根字号下量宽度是「无区分度」的断言——320px 与 20rem 在 16px 下数值同为
    // 320，转换没发生也会通过。所以先确认默认布局不变（320），再把根字号放大一倍再量：
    // rem 会跟随缩放（640），px 不会。这一步才真正区分「转换发生了」。
    const remProbe = document.querySelector<HTMLElement>('[data-testid="rem-probe"]')
    expect(remProbe).toBeTruthy()
    expect(remProbe?.offsetWidth).toBe(320)

    const root = document.documentElement
    const originalFontSize = root.style.fontSize
    root.style.fontSize = '32px'
    try {
      expect(remProbe?.offsetWidth).toBe(640)
    } finally {
      root.style.fontSize = originalFontSize
    }

    const counter = document.querySelector<HTMLButtonElement>('[data-testid="counter"]')
    expect(counter).toBeTruthy()
    counter?.click()
    await rstest.waitFor(() => expect(counter?.textContent).toContain('Count: 1'))
  } finally {
    await removeFrame(frame)
  }
}, 60000)
