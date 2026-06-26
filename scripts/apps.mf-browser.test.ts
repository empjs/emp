import {describe, expect, test} from '@rstest/core'
import {spawn} from 'node:child_process'
import {once} from 'node:events'
import {setTimeout as delay} from 'node:timers/promises'
import {chromium, type Browser} from 'playwright'

const repoRoot = process.cwd()

function startProcess(command: string, args: string[]) {
  const child = spawn(command, args, {
    cwd: repoRoot,
    detached: true,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const output: string[] = []
  child.stdout?.on('data', chunk => output.push(String(chunk)))
  child.stderr?.on('data', chunk => output.push(String(chunk)))
  return {child, output}
}

async function stopProcess(processHandle: ReturnType<typeof startProcess>) {
  if (processHandle.child.exitCode !== null || !processHandle.child.pid) return
  try {
    globalThis.process.kill(-processHandle.child.pid, 'SIGTERM')
  } catch {
    processHandle.child.kill('SIGTERM')
  }
  await Promise.race([once(processHandle.child, 'exit'), delay(2000)])
}

async function waitForHttp(url: string, timeoutMs = 60000) {
  const startedAt = Date.now()
  let lastError: unknown
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
      lastError = new Error(`${url} returned ${response.status}`)
    } catch (error) {
      lastError = error
    }
    await delay(500)
  }
  throw new Error(`Timed out waiting for ${url}: ${String(lastError)}`)
}

describe('P0 Module Federation browser smoke', () => {
  test('mf-app renders mf-host remote through emp-share runtime', async () => {
    const processes = [
      startProcess('pnpm', ['--filter', '@empjs/share', 'start']),
      startProcess('pnpm', ['--filter', './apps/mf-host', 'dev']),
      startProcess('pnpm', ['--filter', './apps/mf-app', 'dev']),
    ]
    let browser: Browser | undefined

    try {
      const manifest = await waitForHttp('http://127.0.0.1:6001/emp.json')
      const manifestJson = await manifest.json()
      expect(JSON.stringify(manifestJson)).toContain('./App')

      await waitForHttp('http://127.0.0.1:6002/')
      browser = await chromium.launch()
      const page = await browser.newPage()
      const consoleErrors: string[] = []
      page.on('console', message => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })

      await page.goto('http://127.0.0.1:6002/', {waitUntil: 'networkidle'})
      const bodyBeforeClick = await page.textContent('body')
      expect(bodyBeforeClick).toContain('MF-APP')
      expect(bodyBeforeClick).toContain('MF-Host')

      await page.getByRole('button', {name: /count is 0/i}).click()
      const bodyAfterClick = await page.textContent('body')
      expect(bodyAfterClick).toContain('count is 1')
      expect(consoleErrors).toEqual([])
    } finally {
      await browser?.close()
      await Promise.all(processes.reverse().map(stopProcess))
    }
  }, 120000)
})
