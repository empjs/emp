import assert from 'node:assert/strict'
import {mkdir, writeFile} from 'node:fs/promises'
import {chromium} from 'playwright'

const base = process.env.BRIDGE_URL || 'http://localhost:7704'
const output = process.env.BRIDGE_ARTIFACTS || '/private/tmp/emp-bridge-acceptance'
await mkdir(output, {recursive: true})
const browser = await chromium.launch({channel: 'chrome', headless: true})
const page = await browser.newPage({viewport: {width: 1440, height: 1050}})
const errors = []
const warnings = []
const requests = []
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => {
  if (message.type() === 'error' && !message.text().includes('模拟组件加载失败')) errors.push(message.text())
  if (message.type() === 'warning') warnings.push(message.text())
})
page.on('requestfailed', request => requests.push(`${request.method()} ${request.url()}`))
const ids = ['react16', 'react17', 'react18', 'react19', 'vue2', 'vue3']
const results = {matrix: [], interactions: [], screenshots: []}
const ready = async count => {
  await page.waitForFunction(
    expected => document.querySelectorAll('.demo-card .status.running').length === expected,
    count,
    {timeout: 15000},
  )
}
const readCount = async card => Number(await card.locator('[data-count]').first().textContent())
try {
  await page.goto(base)
  await ready(6)
  assert.equal(await page.locator('[data-result="pending"]').count(), 36)
  await page.screenshot({path: `${output}/desktop.png`, fullPage: true})
  results.screenshots.push(`${output}/desktop.png`)
  await page.locator('[data-verify-all]').click()
  await page.waitForFunction(() => document.querySelector('[data-verify-all]')?.disabled === false, null, {
    timeout: 120000,
  })
  results.matrix = await page
    .locator('[data-pair]')
    .evaluateAll(cells =>
      cells.map(cell => ({pair: cell.dataset.pair, status: cell.dataset.result, detail: cell.textContent})),
    )
  assert.equal(
    results.matrix.filter(item => item.status === 'passed').length,
    36,
    JSON.stringify(results.matrix.filter(item => item.status !== 'passed')),
  )
  for (const host of process.env.BRIDGE_HOSTS?.split(',') || ids) {
    await page.locator('[data-host-select]').selectOption(host)
    await ready(6)
    const card = page.locator(`[data-card="${host}-vue3"]`)
    const before = await readCount(card)
    await card.locator('[data-increment]').click()
    await page.waitForFunction(
      ({host, value}) =>
        document.querySelector(`[data-card="${host}-vue3"] [data-count]`)?.textContent === String(value),
      {host, value: before + 1},
    )
    await page.locator('[data-name-input]').fill(`从 ${host} 更新`)
    await page.locator('[data-step-select]').selectOption('3')
    await page.locator('[data-note-toggle]').uncheck()
    await page.waitForFunction(host => {
      const card = document.querySelector(`[data-card="${host}-vue3"]`)
      return (
        card?.querySelector('[data-demo-name]')?.textContent === `从 ${host} 更新` &&
        card?.querySelector('[data-demo-note]')?.textContent === '未提供'
      )
    }, host)
    assert.equal(await readCount(card), before + 1)
    await card.locator('[data-increment]').click()
    await page.waitForFunction(
      ({host, value}) =>
        document.querySelector(`[data-card="${host}-vue3"] [data-count]`)?.textContent === String(value),
      {host, value: before + 4},
    )
    await card.getByRole('button', {name: '卸载', exact: true}).click()
    await page.waitForFunction(host => !document.querySelector(`[data-card="${host}-vue3"] [data-runtime]`), host)
    await card.getByRole('button', {name: '重新挂载', exact: true}).click()
    await ready(6)
    assert.equal(await readCount(card), 0)
    await card.getByRole('button', {name: '模拟失败', exact: true}).click()
    await card.getByRole('alert').waitFor()
    await card.getByRole('button', {name: '重试', exact: true}).click()
    await ready(6)
    await card.getByRole('button', {name: '慢加载', exact: true}).click()
    await card.getByRole('button', {name: '卸载', exact: true}).click()
    await page.waitForTimeout(850)
    assert.equal(await card.locator('[data-runtime]').count(), 0, '加载中卸载后组件不能重新挂载')
    await card.getByRole('button', {name: '重新挂载', exact: true}).click()
    await ready(6)
    await card.getByRole('button', {name: '关闭慢加载', exact: true}).click()
    await ready(6)
    await page.locator('[data-step-select]').selectOption('1')
    await page.waitForFunction(
      () =>
        document.querySelector('[data-step-select]')?.value === '1' &&
        Array.from(document.querySelectorAll('.demo-card [data-increment]')).every(
          button => button.textContent === '+1',
        ),
    )
    await page.locator('[data-note-toggle]').check()
    await page.getByRole('button', {name: '多实例', exact: true}).click()
    await ready(6)
    await page.waitForFunction(() => document.querySelectorAll('.demo-card [data-runtime]').length === 12)
    assert.equal(await page.locator('[data-runtime]').count(), 12)
    await card.locator('[data-increment]').first().click()
    await page.waitForFunction(
      host => document.querySelector(`[data-card="${host}-vue3"] [data-count]`)?.textContent === '1',
      host,
    )
    assert.equal(await card.locator('[data-count]').nth(1).textContent(), '0')
    await page.getByRole('button', {name: '混合嵌套', exact: true}).click()
    await ready(2)
    const nested = page.locator(`[data-card="${host}-vue3-react19"]`)
    assert.equal(await nested.locator('[data-host]').count(), 2)
    await nested.locator('[data-increment]').click()
    await page.waitForFunction(
      host => document.querySelector(`[data-card="${host}-vue3-react19"] [data-count]`)?.textContent === '1',
      host,
    )
    await nested.getByRole('button', {name: '卸载', exact: true}).click()
    await page.waitForFunction(
      host => !document.querySelector(`[data-card="${host}-vue3-react19"] [data-runtime]`),
      host,
    )
    await page.getByRole('button', {name: '基础通信', exact: true}).click()
    await ready(6)
    results.interactions.push({
      host,
      props: true,
      callback: true,
      unmount: true,
      retry: true,
      asyncCancellation: true,
      instances: true,
      nesting: true,
    })
  }
  await page.locator('[data-host-select]').selectOption('react17')
  await page.locator('[data-name-input]').fill('Hello, Bridge')
  await ready(6)
  await page.screenshot({path: `${output}/desktop-verified.png`, fullPage: true})
  results.screenshots.push(`${output}/desktop-verified.png`)
  await page.setViewportSize({width: 390, height: 844})
  await page.evaluate(() => {
    document.activeElement?.blur()
    window.scrollTo(0, 0)
  })
  await page.screenshot({path: `${output}/mobile.png`, clip: {x: 0, y: 0, width: 390, height: 740}})
  await page.locator('[data-card="react17-vue3"]').scrollIntoViewIfNeeded()
  await page.screenshot({path: `${output}/mobile-demo.png`})
  results.screenshots.push(`${output}/mobile.png`, `${output}/mobile-demo.png`)
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
    false,
    '移动端页面横向溢出',
  )
  assert.deepEqual(requests, [], '资源加载失败')
  assert.deepEqual(errors, [], '浏览器运行错误')
  assert.deepEqual(warnings, [], '浏览器生命周期或框架警告')
  console.log(
    JSON.stringify({
      matrix: '36/36',
      hosts: results.interactions.length,
      browserErrors: errors.length,
      warnings: warnings.length,
      mobileOverflow: false,
      output,
    }),
  )
} catch (error) {
  results.failureState = await page.evaluate(() => ({
    step: document.querySelector('[data-step-select]')?.value,
    cards: Array.from(document.querySelectorAll('[data-card]')).map(card => ({
      card: card.getAttribute('data-card'),
      counts: Array.from(card.querySelectorAll('[data-count]')).map(node => node.textContent),
      buttons: Array.from(card.querySelectorAll('[data-increment]')).map(node => node.textContent),
      status: card.querySelector('.status')?.textContent,
    })),
  }))
  await page.screenshot({path: `${output}/failure.png`, fullPage: true})
  throw error
} finally {
  await writeFile(`${output}/results.json`, JSON.stringify({...results, errors, warnings, requests}, null, 2))
  await browser.close()
}
