# Apps Real Browser Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为当前 `apps/*` 定制真实浏览器交互测试，覆盖可运行的用户交互、Module Federation 远程加载、跨框架桥接与非交互 app 的可验收边界，并在至少 5 轮测试补全循环后收口。

**Architecture:** 保持 Rstest 为统一入口，新增一个非默认的 apps browser lane：Node 环境 Rstest 负责启动真实 app 服务和 Playwright，测试文件用真实页面导航、点击、输入、路由跳转和 DOM 断言覆盖交互。默认 `apps:acceptance` 继续负责构建/产物验收，browser lane 通过独立脚本运行，避免把长耗时交互测试塞进默认 CI。

**Tech Stack:** Rstest `0.10.6`、Playwright `1.61.1`、EMP CLI、`corepack pnpm@10.33.0`、Node.js child_process/http/net 工具。

## Global Constraints

- 默认中文沟通；所有进度、评审和最终结果优先中文。
- 先查 live checkout，不沿用历史假设；保留已有未提交改动，不回滚用户改动。
- 新增测试优先纳入 Rstest；不要引入 Vitest、Jest、Mocha、Ava 等第二套 runner。
- 测试必须是真实验收/集成场景：真实 CLI、真实 app 服务、真实浏览器、真实 DOM/交互断言。
- `apps/**` 是示例/验收项目，不参与发布包范围；本计划允许读和必要地修改 `apps/mf-app/src/App.tsx` 以修复硬编码远程 host。
- `pnpm-lock.yaml` 只因 browser 测试依赖实际变化而修改。
- 不提交生成物、缓存、本地索引、dist、coverage、`.worktrees/`。
- Browser lane 独立于默认 `apps:acceptance`；默认验收不得重新依赖已移除的 `test:apps:mf`。
- 至少完成 5 轮循环：MF、Vue、React/Tailwind/Demo、coverage matrix/workflow、final validation；如果某轮发现没有更多可写用例，必须在 `.superpowers/sdd/apps-real-browser-test-cycles.md` 写明原因。

---

### Task 1: Browser Harness And Root Target

**Files:**
- Create: `scripts/run-app-browser-tests.mjs`
- Create: `test/apps.browser.test.ts`
- Modify: `package.json`
- Modify: `rstest.config.ts`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: `test/apps.rules.test.ts`
- Modify: `pnpm-lock.yaml`
- Create/append: `.superpowers/sdd/apps-real-browser-test-cycles.md`

**Interfaces:**
- Produces: `pnpm test:apps:browser` command.
- Produces: `scripts/run-app-browser-tests.mjs` CLI that builds/starts only the apps needed by the browser tests, runs `rstest` against `test/apps.browser.test.ts`, and cleans up child processes.
- Consumes: current `scripts/root-test-targets.mjs` root target metadata and `scripts/run-root-test.mjs` conventions.

- [ ] **Step 1: Write the failing rule test**

Add assertions in `test/apps.rules.test.ts` that expect:

```ts
expect(rootPackage.scripts?.['test:apps:browser']).toBe('node scripts/run-app-browser-tests.mjs')
expect(rootTestTargets).toContain("'apps-browser'")
expect(rootTestTargets).toContain('test/apps.browser.test.ts')
expect(workflow).toContain('test:apps:browser')
```

- [ ] **Step 2: Run RED**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/apps.rules.test.ts --reporter dot`

Expected: FAIL because `test:apps:browser`, `apps-browser`, or `test/apps.browser.test.ts` is missing.

- [ ] **Step 3: Implement root browser lane**

Implement:

```js
// scripts/root-test-targets.mjs
const rootBrowserTestTargetEntries = [['apps-browser', ['test/apps.browser.test.ts']]]
export const ROOT_BROWSER_TEST_TARGETS = Object.freeze(Object.fromEntries(rootBrowserTestTargetEntries))
export const ROOT_BROWSER_TEST_PACKAGE_SCRIPTS = Object.freeze({'test:apps:browser': 'apps-browser'})
```

Keep `ROOT_TEST_TARGETS.all` as the default non-browser lane; do not add browser files to default `all`.

Add package script:

```json
"test:apps:browser": "node scripts/run-app-browser-tests.mjs"
```

Update workflow guard to require the script, browser target, and browser test file, while confirming `apps:acceptance` still does not include `pnpm test:apps:browser`.

- [ ] **Step 4: Implement runner and empty browser test**

Create `scripts/run-app-browser-tests.mjs` with:

```js
#!/usr/bin/env node
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
import {fileURLToPath} from 'node:url'
import path from 'node:path'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const children = new Set()

function spawnChild(cmd, args, options = {}) {
  const child = spawn(cmd, args, {
    cwd: repoRoot,
    env: {...process.env, FORCE_COLOR: '0', ...options.env},
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  children.add(child)
  child.stdout.on('data', chunk => process.stdout.write(chunk))
  child.stderr.on('data', chunk => process.stderr.write(chunk))
  return child
}

async function stopChild(child) {
  if (!child.pid || child.exitCode !== null) return
  try {
    process.kill(-child.pid, 'SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }
  await Promise.race([
    new Promise(resolve => child.once('exit', resolve)),
    new Promise(resolve => setTimeout(resolve, 3000)),
  ])
}

async function cleanup() {
  await Promise.all([...children].map(stopChild))
}

async function waitForHttp(url, timeoutMs = 60000) {
  const startedAt = Date.now()
  let lastError
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
      lastError = new Error(`${url} returned ${response.status}`)
    } catch (error) {
      lastError = error
    }
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError instanceof Error ? lastError.message : String(lastError)}`)
}

async function run(cmd, args) {
  const child = spawn(cmd, args, {cwd: repoRoot, env: process.env, stdio: 'inherit'})
  await new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} failed with ${code}`))))
  })
}

process.once('SIGINT', () => cleanup().finally(() => process.exit(130)))
process.once('SIGTERM', () => cleanup().finally(() => process.exit(143)))

try {
  await run('corepack', ['pnpm', 'exec', 'rstest', 'run', '--config', 'rstest.config.ts', 'test/apps.browser.test.ts', '--reporter', 'dot'])
} finally {
  await cleanup()
}
```

Create `test/apps.browser.test.ts` with one failing placeholder assertion that will be replaced in later tasks:

```ts
import {expect, test} from '@rstest/core'

test('apps browser lane is wired', () => {
  expect(process.env.APPS_BROWSER_BASE_URLS).toBeDefined()
})
```

- [ ] **Step 5: Run GREEN**

Run:

```bash
corepack pnpm exec rstest run --config rstest.config.ts test/apps.rules.test.ts --reporter dot
corepack pnpm test:apps:browser
```

Expected: rules pass; browser lane reaches the placeholder test. If placeholder fails because the runner does not yet set env, set `APPS_BROWSER_BASE_URLS={}` in the runner before spawning Rstest.

### Task 2: Cycle 1 - Module Federation React Smoke

**Files:**
- Modify: `apps/mf-app/src/App.tsx`
- Modify: `scripts/run-app-browser-tests.mjs`
- Modify: `test/apps.browser.test.ts`
- Append: `.superpowers/sdd/apps-real-browser-test-cycles.md`

**Interfaces:**
- Consumes: `pnpm test:apps:browser` from Task 1.
- Produces: Playwright-backed MF coverage for `mf-host` and `mf-app`.

- [ ] **Step 1: Write MF browser tests first**

In `test/apps.browser.test.ts`, add tests that:

```ts
test('mf-host increments MobX count through the real page', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['mf-host']}/`)
  await expectText(page, 'EMP 3.0 React')
  await expectText(page, 'Mobx Count')
  await page.getByRole('button', {name: /count is 0/}).click()
  await expectText(page, 'count is 1')
})

test('mf-app renders mf-host remote and remote interaction updates', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['mf-app']}/`)
  await expectText(page, 'MF-Host')
  await expectText(page, 'fromMainAppName')
  await expectText(page, 'nameformRemote')
  await page.getByRole('button', {name: /count is 0/}).click()
  await expectText(page, 'count is 1')
})
```

- [ ] **Step 2: Run RED**

Run: `corepack pnpm test:apps:browser`

Expected: FAIL until the runner starts `mf-host`, `mf-app`, and `emp-share` runtime service.

- [ ] **Step 3: Implement MF service orchestration**

In `scripts/run-app-browser-tests.mjs`, build/start:

```bash
corepack pnpm --filter @empjs/share build
node packages/cli/bin/emp.js static packages/emp-share/output --host 127.0.0.1 --port 2100
corepack pnpm --filter ./apps/mf-host dev
corepack pnpm --filter ./apps/mf-app dev
```

Wait for `http://127.0.0.1:2100/sdk.js`, `http://127.0.0.1:6001/`, and `http://127.0.0.1:6002/`.

Set:

```js
APPS_BROWSER_BASE_URLS: JSON.stringify({
  'mf-host': 'http://127.0.0.1:6001',
  'mf-app': 'http://127.0.0.1:6002',
})
```

Keep current `apps/mf-app/src/App.tsx` hostname-based remote entry so browser tests do not depend on a developer LAN IP.

- [ ] **Step 4: Run GREEN**

Run: `corepack pnpm test:apps:browser`

Expected: MF tests pass in a real browser.

- [ ] **Step 5: Record cycle**

Append a line to `.superpowers/sdd/apps-real-browser-test-cycles.md`:

```md
Cycle 1 MF React: covered mf-host local count and mf-app remote count/render through real browser.
```

### Task 3: Cycle 2 - Vue 2 And Vue 3 Remote Interactions

**Files:**
- Modify: `scripts/run-app-browser-tests.mjs`
- Modify: `test/apps.browser.test.ts`
- Append: `.superpowers/sdd/apps-real-browser-test-cycles.md`

**Interfaces:**
- Consumes: Playwright helpers in `test/apps.browser.test.ts`.
- Produces: Vue base/project remote tests.

- [ ] **Step 1: Write Vue browser tests first**

Add tests for:

```ts
test('vue-3-base increments local button and pinia count', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['vue-3-base']}/`)
  await expectText(page, 'Vue 3 Base')
  await page.getByRole('button', {name: 'add'}).first().click()
  await expectText(page, 'value: 1')
  await page.getByRole('button', {name: 'Increment Pinia Count'}).click()
  await expectText(page, 'Pinia count base: 1')
})

test('vue-3-project navigates to remote host home and increments remote pinia', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['vue-3-project']}/`)
  await page.getByRole('link', {name: 'Go to Host Home'}).click()
  await expectText(page, 'Vue 3 base Component')
  await page.getByRole('link', {name: 'Go to Home'}).click()
  await expectText(page, 'vue3Base/PiniaCount')
  await page.getByRole('button', {name: 'Increment Pinia Count'}).click()
  await expectText(page, 'Pinia count remote: 1')
})

test('vue-2-base toggles more content and composition count', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['vue-2-base']}/`)
  await expectText(page, 'Content Component')
  await page.getByText('More... update from base').click()
  await expectText(page, 'Vue2 Add Button')
  await page.getByRole('button', {name: /count is: 0, state.count is 0/}).click()
  await expectText(page, 'count is: 1, state.count is 1')
})

test('vue-2-project renders remote content and remote composition interaction', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['vue-2-project']}/`)
  await expectText(page, 'Project App vue 2 project')
  await expectText(page, 'EMP Vue2 Component From BASE!')
  await page.getByRole('button', {name: /count is: 0, state.count is 0/}).click()
  await expectText(page, 'count is: 1, state.count is 1')
})
```

- [ ] **Step 2: Run RED**

Run: `corepack pnpm test:apps:browser`

Expected: FAIL until Vue services are started.

- [ ] **Step 3: Implement Vue service orchestration**

Start:

```bash
corepack pnpm --filter ./apps/vue-3-base dev
corepack pnpm --filter ./apps/vue-3-project dev
corepack pnpm --filter ./apps/vue-2-base dev
corepack pnpm --filter ./apps/vue-2-project dev
```

Wait for ports `9301`, `9302`, `9001`, and `9002`, then add them to `APPS_BROWSER_BASE_URLS`.

- [ ] **Step 4: Run GREEN**

Run: `corepack pnpm test:apps:browser`

Expected: Vue tests pass in a real browser.

- [ ] **Step 5: Record cycle**

Append:

```md
Cycle 2 Vue remotes: covered Vue 2/3 local and remote interactions through real browser.
```

### Task 4: Cycle 3 - React 19, Tailwind, Demo, Static App Interactions

**Files:**
- Modify: `scripts/run-app-browser-tests.mjs`
- Modify: `test/apps.browser.test.ts`
- Append: `.superpowers/sdd/apps-real-browser-test-cycles.md`

**Interfaces:**
- Consumes: service orchestration from earlier tasks.
- Produces: tests for React 19 router/forms, Tailwind radio form, demo shell/proxy, and Rspack DOM smoke.

- [ ] **Step 1: Write tests first**

Add tests for:

```ts
test('react-19-tanstack router and forms respond', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['react-19-tanstack']}/`)
  await page.getByRole('link', {name: 'React 19'}).click()
  await page.getByPlaceholder('你的名字').fill('EMP')
  await page.getByRole('button', {name: '保存'}).click()
  await expectText(page, '已保存：EMP')
  await page.getByPlaceholder('添加条目').fill('Gamma')
  await page.getByRole('button', {name: '添加'}).click()
  await expectText(page, 'Gamma')
  await page.getByPlaceholder('筛选行').fill('Row 99')
  await expectText(page, '匹配：11')
  await page.getByRole('link', {name: 'Router Lab'}).click()
  await expectText(page, 'Router Lab')
})

test('tailwind-4 product size selector changes checked state', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['tailwind-4']}/`)
  await expectText(page, 'Classic Utility Jacket')
  await page.locator('input[name="size"][value="xl"]').check({force: true})
  await expect(page.locator('input[name="size"][value="xl"]')).toBeChecked()
})

test('demo shell toggles sider and proxy page calls all APIs', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls.demo}/`)
  await expectText(page, 'EMP 3.0')
  await page.getByRole('button').first().click()
  await expectText(page, 'Image Text')
  await page.goto(`${baseUrls.demo}/proxy-test.html`)
  await page.getByRole('button', {name: '测试所有接口'}).click()
  await expectText(page, 'Hello from test API server!')
  await expectText(page, 'Test User')
  await expectText(page, 'First Post')
})

test('rspack2-optimization loads dynamic chunk into DOM', async () => {
  const page = await browser.newPage()
  await page.goto(`${baseUrls['rspack2-optimization']}/`)
  await expectText(page, 'pure-value')
})
```

- [ ] **Step 2: Run RED**

Run: `corepack pnpm test:apps:browser`

Expected: FAIL until these services/API server/static apps are started.

- [ ] **Step 3: Implement services**

Start:

```bash
corepack pnpm --filter ./apps/react-19-tanstack dev
corepack pnpm --filter ./apps/tailwind-4 build
node packages/cli/bin/emp.js static apps/tailwind-4/dist --host 127.0.0.1 --port 8104
corepack pnpm --filter ./apps/demo dev
node apps/demo/test-server.js
corepack pnpm --filter ./apps/rspack2-optimization build
node packages/cli/bin/emp.js static apps/rspack2-optimization/dist --host 127.0.0.1 --port 8102
```

Wait for ports `1992`, `8104`, `8000`, `3001`, and `8102`.

- [ ] **Step 4: Run GREEN**

Run: `corepack pnpm test:apps:browser`

Expected: tests pass in a real browser.

- [ ] **Step 5: Record cycle**

Append:

```md
Cycle 3 React/Tailwind/Demo/Rspack: covered router/forms/radio/proxy/dynamic chunk through real browser.
```

### Task 5: Cycle 4 - Coverage Matrix And Known Non-Writable Gaps

**Files:**
- Create: `test/apps.browser-coverage.test.ts`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `test/apps.rules.test.ts`
- Append: `.superpowers/sdd/apps-real-browser-test-cycles.md`

**Interfaces:**
- Produces: a fast Rstest coverage matrix that requires every `TARGET_APP_DIRS` app to be classified as `browser-interactive`, `browser-smoke`, `build-only`, or `blocked-missing-local-remote`.

- [ ] **Step 1: Write matrix test first**

Create `test/apps.browser-coverage.test.ts`:

```ts
import {describe, expect, test} from '@rstest/core'
import {TARGET_APP_DIRS} from '../scripts/apps.catalog.mjs'

const browserCoverage = {
  'adapter-app': 'blocked-missing-local-remote',
  'adapter-host': 'browser-smoke',
  demo: 'browser-interactive',
  'mf-app': 'browser-interactive',
  'mf-host': 'browser-interactive',
  'react-19-tanstack': 'browser-interactive',
  'rspack2-modern-module': 'build-only',
  'rspack2-optimization': 'browser-smoke',
  'tailwind-4': 'browser-interactive',
  'vue-2-base': 'browser-interactive',
  'vue-2-project': 'browser-interactive',
  'vue-3-base': 'browser-interactive',
  'vue-3-project': 'browser-interactive',
} as const

describe('apps browser coverage matrix', () => {
  test('classifies every current apps/* target', () => {
    expect(Object.keys(browserCoverage).sort()).toEqual([...TARGET_APP_DIRS].sort())
  })

  test('keeps at least five real browser cycles documented', () => {
    expect(Object.values(browserCoverage).filter(value => value === 'browser-interactive').length).toBeGreaterThanOrEqual(8)
  })
})
```

- [ ] **Step 2: Run RED**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/apps.browser-coverage.test.ts --reporter dot`

Expected: FAIL until root target metadata and rule tests include this file.

- [ ] **Step 3: Wire matrix target**

Add `test/apps.browser-coverage.test.ts` to the non-browser `rules` or a dedicated root target so `workflow:check` sees it. Do not add long-running Playwright browser execution to `ci:verify`.

- [ ] **Step 4: Run GREEN**

Run:

```bash
corepack pnpm exec rstest run --config rstest.config.ts test/apps.browser-coverage.test.ts --reporter dot
corepack pnpm workflow:check
```

Expected: matrix and workflow pass.

- [ ] **Step 5: Record cycle**

Append:

```md
Cycle 4 coverage matrix: every TARGET_APP_DIRS entry classified; adapter-app remains blocked because local adapter-vue2-host and adapter-vue3-host are retired from apps/*.
```

### Task 6: Cycle 5 - Full Validation, Review, And No-More-Writable-Cases Audit

**Files:**
- Modify as needed only if validation exposes defects.
- Append: `.superpowers/sdd/apps-real-browser-test-cycles.md`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: final validation evidence and remaining risk statement.

- [ ] **Step 1: Run focused validation**

Run:

```bash
corepack pnpm test:apps:browser
corepack pnpm test:rules
corepack pnpm workflow:check
git diff --check
```

Expected: all pass.

- [ ] **Step 2: Run broader apps validation**

Run:

```bash
corepack pnpm apps:check
corepack pnpm test:apps:single
```

Expected: pass. If too slow or blocked by unrelated existing failures, capture the exact failure and continue only after fixing in-scope issues.

- [ ] **Step 3: Audit no-more-writable-cases**

Review `apps/*/src` for remaining `button`, `input`, `select`, `textarea`, router links, MF remotes, and dynamic import flows. Add a short entry:

```md
Cycle 5 final audit: no more in-scope writable browser cases found beyond adapter-app blocked remotes and rspack2-modern-module build-only module.
```

- [ ] **Step 4: Dispatch final review**

Use an `emp-deep`/`code-reviewer` subagent in read-only mode to review:

```text
Scope: browser test harness, app browser tests, root workflow target changes, MF hostname fix.
Ask: find missing interactions, flaky service orchestration, default CI regression, protected path violations.
```

- [ ] **Step 5: Fix review blockers and re-run validation**

For any Critical/Important review finding, dispatch one fix subagent with the complete findings list, then rerun the focused validation commands in Step 1.
