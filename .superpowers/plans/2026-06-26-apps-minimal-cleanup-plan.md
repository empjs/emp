# Apps Minimal Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce `apps/**` to the smallest useful support surface by proving coverage with Rstest-backed real acceptance first, then merging or deleting redundant app directories in small verified batches.

**Architecture:** Add a catalog-driven apps governance layer before removing directories. Rstest becomes the root rules and acceptance runner, while real support coverage is split into one default single-app build pack, one P0 Module Federation browser path, and optional compat packs that run only when their capability changes.

**Tech Stack:** Node.js `^20.19.0 || >=22.12.0`, `pnpm@10.33.0`, `@rstest/core@0.10.6`, optional `playwright@1.61.1` imported from Rstest for one MF browser smoke, existing EMP CLI/Rspack/Rslib build scripts.

## Global Constraints

- Default communication and review notes are Chinese.
- Do not touch the unrelated static-index work currently visible in this checkout: `.superpowers/plans/2026-06-26-static-index-display.md`, `packages/cli/src/script/index.ts`, `packages/cli/src/script/static.ts`, `packages/cli/src/server/static/createStaticServer.ts`, `packages/cli/src/server/static/types.ts`, `packages/cli/test/cli-help.test.mjs`, and `packages/cli/test/static-server.test.ts`.
- Work from current `v4` live state; re-run `git status --short --branch` before each batch.
- Use `Users-Bigo-Desktop-develop-fontend-workspace-emp` codebase-memory index for code discovery before fallback search.
- Do not delete any app before a catalog entry and a real acceptance command prove its capability is covered elsewhere.
- Default acceptance keeps the minimum representative support set: `rspack2-modern-module`, `rspack2-optimization`, `mf-host`, `mf-app`, `vue-3-base`, `vue-3-project`, `tailwind-4`, `react-19-tanstack`, plus existing Rslib/CDN packages for library output.
- Module Federation requires only one default paired browser test: `@empjs/share` runtime, `mf-host`, and `mf-app`.
- Tailwind default support is v4. `tailwind-2` and `tailwind-3` are legacy compat and do not run in default acceptance.
- `lib-main`, `lib-react`, `unpkg-demo`, and `unpkg-lib` are removed only after Rslib/CDN package smoke proves the library-output use case.
- `apps/**` and `website` remain excluded from release package scope.
- New or migrated tests use Rstest. Existing `node:test` files are migrated or deleted in the same batch that replaces their coverage.
- Do not submit generated files, caches, local indexes, `node_modules/`, `dist/`, `output/`, `.rspack-cache/`, `.turbo/`, `.codebase-memory/`, or `.codegraph/`.
- The local Codex runtime can resolve bare `pnpm` to `11.x`; validation commands must force `pnpm@10.33.0` through Corepack or a temporary PATH wrapper.

## Current Evidence

- `git status --short --branch` currently reports `v4...origin/v4` plus unrelated static-index changes in `packages/cli/**` and `.superpowers/plans/2026-06-26-static-index-display.md`; apps cleanup must not stage or rewrite those files.
- `corepack pnpm@10.33.0 apps:check` reports 59 apps and `issues: []`.
- Duplicate package names currently exist:
  - `react-19-tanstack`: `react-19-tanstack`, `react-tanstack`
  - `tailwind-demo`: `tailwind-4`, `tailwind-4-polyfill`, `tailwind-demo`, `tailwindcss-app`
  - `unpkg-lib`: `unpkg-demo`, `unpkg-lib`
  - `vue-3-project`: `vue-3-project`, `vue3-app`, `vue3-host`
- `react-tanstack` is not byte-identical to `react-19-tanstack`; it carries extra TanStack route examples. Cleanup must either move one representative dynamic route into `react-19-tanstack` or explicitly drop that extra demo scope.
- `vue3-app` and `vue3-host` are not byte-identical to `vue-3-project` and `vue-3-base`; they include Pinia/router-style coverage. Cleanup must move the necessary Pinia/router assertion into the Vue 3 canonical set before deletion.
- `tailwind-demo` differs from `tailwind-4`; it is an older PostCSS/Tailwind style demo. Default support still stays on `tailwind-4`, with v2/v3 as legacy compat.
- `lib-react` and `unpkg-lib` differ. They should be replaced by package-level Rslib/CDN smoke, not deleted as simple duplicates.

---

### Task 1: Catalog And Root Rstest Rules

**Files:**
- Create: `scripts/apps.catalog.mjs`
- Create: `scripts/apps.rules.test.ts`
- Create: `scripts/release.rules.test.ts`
- Create: `rstest.config.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Delete after green replacement: `scripts/apps.test.mjs`
- Delete after green replacement: `scripts/release.test.mjs`

**Interfaces:**
- Produces `DEFAULT_APP_ACCEPTANCE: string[]` with app dirs `['rspack2-modern-module', 'rspack2-optimization', 'mf-host', 'mf-app', 'vue-3-base', 'vue-3-project', 'tailwind-4', 'react-19-tanstack']`.
- Produces `COMPAT_APP_GROUPS: Record<string, string[]>` for `tailwind-legacy`, `vue2`, `vue3-pinia-router`, `react-runtime-legacy`, `adapter`, `runtime-layout`, `assets-proxy`.
- Produces `MERGE_CANDIDATES: Array<{group: string, canonical: string[], removeAfterCovered: string[], requiredEvidence: string[]}>`.
- Produces root `rstest.config.ts` including `scripts/**/*.test.ts`.
- Consumes existing `discoverApps`, `validateApps`, and release-core exports.

- [ ] **Step 1: Write failing catalog tests**

Create `scripts/apps.rules.test.ts` with the following assertions:

```ts
import {describe, expect, test} from '@rstest/core'
import {discoverApps, validateApps} from './apps.mjs'
import {DEFAULT_APP_ACCEPTANCE, MERGE_CANDIDATES, getDuplicatePackageNames} from './apps.catalog.mjs'

describe('apps catalog rules', () => {
  test('default acceptance is intentionally small and canonical', async () => {
    const apps = await discoverApps()
    const appDirs = new Set(apps.map(app => app.dir))

    expect(DEFAULT_APP_ACCEPTANCE).toEqual([
      'rspack2-modern-module',
      'rspack2-optimization',
      'mf-host',
      'mf-app',
      'vue-3-base',
      'vue-3-project',
      'tailwind-4',
      'react-19-tanstack',
    ])
    expect(DEFAULT_APP_ACCEPTANCE.every(dir => appDirs.has(dir))).toBe(true)
    expect(DEFAULT_APP_ACCEPTANCE.length).toBeLessThanOrEqual(8)
  })

  test('current workspace apps still pass structural validation', async () => {
    const apps = await discoverApps()
    await expect(validateApps(apps)).resolves.toEqual([])
  })

  test('known duplicate package names are cataloged before cleanup', async () => {
    const apps = await discoverApps()
    expect(getDuplicatePackageNames(apps)).toEqual({
      'react-19-tanstack': ['react-19-tanstack', 'react-tanstack'],
      'tailwind-demo': ['tailwind-4', 'tailwind-4-polyfill', 'tailwind-demo', 'tailwindcss-app'],
      'unpkg-lib': ['unpkg-demo', 'unpkg-lib'],
      'vue-3-project': ['vue-3-project', 'vue3-app', 'vue3-host'],
    })
  })

  test('merge candidates require evidence before deletion', () => {
    expect(MERGE_CANDIDATES.map(candidate => candidate.group)).toEqual([
      'react-tanstack',
      'vue3-pinia-router',
      'tailwind-default-v4',
      'library-output',
    ])
    expect(MERGE_CANDIDATES.every(candidate => candidate.requiredEvidence.length > 0)).toBe(true)
  })
})
```

- [ ] **Step 2: Write failing release rule test**

Create `scripts/release.rules.test.ts` by porting the current `scripts/release.test.mjs` assertions to Rstest imports:

```ts
import {describe, expect, test} from '@rstest/core'
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {
  applyInternalVersion,
  buildPublishCommands,
  createReleasePlan,
  prependChangelog,
  renderChangelogEntry,
  validateReleasePlan,
} from './release-core.mjs'

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))

describe('release package scope', () => {
  test('apps and website are workspace packages but never internal release packages', async () => {
    const root = await mkdtemp(join(tmpdir(), 'emp-release-'))
    const writeJson = async (file: string, value: unknown) => {
      await mkdir(join(root, file, '..'), {recursive: true})
      await writeFile(join(root, file), `${JSON.stringify(value, null, 2)}\n`)
    }

    try {
      await writeJson('package.json', {
        name: 'emp-workspace',
        version: '4.0.0',
        private: true,
        engines: {node: '^20.19.0 || >=22.12.0', pnpm: '10.x'},
        packageManager: 'pnpm@10.33.0',
      })
      await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - packages/**\n  - apps/**\n  - website\n')
      await writeJson('packages/cli/package.json', {name: '@empjs/cli', version: '4.0.0', publishConfig: {access: 'public'}})
      await writeJson('apps/demo/package.json', {name: '@empjs/fake-app', version: '1.0.0'})
      await writeJson('website/package.json', {name: '@empjs/offical', version: '1.0.0', private: true})

      const plan = await createReleasePlan(root)
      expect(plan.workspacePackages.some(pkg => pkg.dir.startsWith('apps/'))).toBe(true)
      expect(plan.internalPackages.some(pkg => pkg.dir.startsWith('apps/'))).toBe(false)
      expect(plan.internalPackages.some(pkg => pkg.dir === 'website')).toBe(false)
      expect(validateReleasePlan(plan)).toEqual([])
    } finally {
      await rm(root, {recursive: true, force: true})
    }
  })
})
```

- [ ] **Step 3: Verify RED**

Run:

```bash
tmp_pnpm_dir=$(mktemp -d)
printf '%s\n' '#!/bin/sh' 'exec corepack pnpm@10.33.0 "$@"' > "$tmp_pnpm_dir/pnpm"
chmod +x "$tmp_pnpm_dir/pnpm"
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:rules
```

Expected: fails because `rstest.config.ts`, `scripts/apps.catalog.mjs`, and Rstest rule files do not exist and `test:rules` is still the old node runner.

- [ ] **Step 4: Add catalog implementation**

Create `scripts/apps.catalog.mjs` with these exports:

```js
export const DEFAULT_APP_ACCEPTANCE = [
  'rspack2-modern-module',
  'rspack2-optimization',
  'mf-host',
  'mf-app',
  'vue-3-base',
  'vue-3-project',
  'tailwind-4',
  'react-19-tanstack',
]

export const COMPAT_APP_GROUPS = {
  'tailwind-legacy': ['tailwind-2', 'tailwind-3'],
  vue2: ['vue-2-base', 'vue-2-project', 'vue-2-element', 'vue-2-stylus'],
  'vue3-pinia-router': ['vue3-app', 'vue3-host'],
  'react-runtime-legacy': ['react-16-adapter-18', 'react-18-runtime', 'runtime-18-app', 'runtime-18-host'],
  adapter: ['adapter-app', 'adapter-host', 'adapter-vue2-host', 'adapter-vue3-host', 'vue3-in-vue2'],
  'runtime-layout': ['rtHost', 'rtLayout', 'rtProvider', 'emp-window-demo'],
  'assets-proxy': ['demo', 'proxy-demo', 'auto-pages', 'mobile-vw-rem', 'pixi-js-demo', 'es5-import-demo'],
}

export const MERGE_CANDIDATES = [
  {
    group: 'react-tanstack',
    canonical: ['react-19-tanstack'],
    removeAfterCovered: ['react-tanstack'],
    requiredEvidence: ['react-19-tanstack build passes', 'route artifact includes static and dynamic route coverage'],
  },
  {
    group: 'vue3-pinia-router',
    canonical: ['vue-3-base', 'vue-3-project'],
    removeAfterCovered: ['vue3-app', 'vue3-host'],
    requiredEvidence: ['vue-3-project build passes', 'canonical Vue 3 route or source contains Pinia/router coverage'],
  },
  {
    group: 'tailwind-default-v4',
    canonical: ['tailwind-4'],
    removeAfterCovered: ['tailwind-4-polyfill', 'tailwind-demo', 'tailwindcss-app', 'tailwindcss-host'],
    requiredEvidence: ['tailwind-4 build passes', 'CSS artifact exists and Tailwind v4 package is used'],
  },
  {
    group: 'library-output',
    canonical: ['packages/cdn-*', 'packages/lib-*', 'packages/emp-share'],
    removeAfterCovered: ['lib-main', 'lib-react', 'unpkg-demo', 'unpkg-lib'],
    requiredEvidence: ['Rslib package build passes', 'static service serves a library/runtime asset over HTTP'],
  },
]

export function getDuplicatePackageNames(apps) {
  const byName = new Map()
  for (const app of apps) {
    byName.set(app.name, [...(byName.get(app.name) ?? []), app.dir])
  }

  return Object.fromEntries(
    [...byName.entries()]
      .filter(([, dirs]) => dirs.length > 1)
      .map(([name, dirs]) => [name, dirs.sort()]),
  )
}
```

- [ ] **Step 5: Wire root Rstest**

Create `rstest.config.ts`:

```ts
import {defineConfig} from '@rstest/core'

export default defineConfig({
  testEnvironment: 'node',
  include: ['scripts/**/*.test.ts'],
})
```

Modify root `package.json`:

```json
{
  "scripts": {
    "test:rules": "rstest run --config rstest.config.ts"
  },
  "devDependencies": {
    "@rstest/core": "0.10.6"
  }
}
```

Run dependency install to update the lockfile:

```bash
corepack pnpm@10.33.0 install --lockfile-only
```

- [ ] **Step 6: Verify GREEN and remove old rule tests**

Run:

```bash
tmp_pnpm_dir=$(mktemp -d)
printf '%s\n' '#!/bin/sh' 'exec corepack pnpm@10.33.0 "$@"' > "$tmp_pnpm_dir/pnpm"
chmod +x "$tmp_pnpm_dir/pnpm"
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:rules
```

Expected: Rstest reports pass for `scripts/apps.rules.test.ts` and `scripts/release.rules.test.ts`.

Delete `scripts/apps.test.mjs` and `scripts/release.test.mjs` only after this command passes.

- [ ] **Step 7: Commit Task 1**

Run:

```bash
git status --short
git add package.json pnpm-lock.yaml rstest.config.ts scripts/apps.catalog.mjs scripts/apps.rules.test.ts scripts/release.rules.test.ts scripts/apps.test.mjs scripts/release.test.mjs
git diff --cached --check
git commit -m "test: move app rules to rstest catalog"
```

### Task 2: Minimal Single-App Real Acceptance

**Files:**
- Create: `scripts/apps.acceptance.test.ts`
- Modify: `package.json`
- Modify: `apps/README.md`

**Interfaces:**
- Consumes `DEFAULT_APP_ACCEPTANCE` from `scripts/apps.catalog.mjs`.
- Produces root scripts:
  - `test:apps:single`: `rstest run --config rstest.config.ts scripts/apps.acceptance.test.ts`
  - `apps:acceptance`: `pnpm empbuild && pnpm apps:check && pnpm test:apps:single`
- Produces per-app artifact assertions for the 8 default apps.

- [ ] **Step 1: Write failing real acceptance test**

Create `scripts/apps.acceptance.test.ts`:

```ts
import {describe, expect, test} from '@rstest/core'
import {execFile as execFileCallback} from 'node:child_process'
import {existsSync, readdirSync} from 'node:fs'
import {join} from 'node:path'
import {promisify} from 'node:util'
import {DEFAULT_APP_ACCEPTANCE} from './apps.catalog.mjs'

const execFile = promisify(execFileCallback)
const repoRoot = join(import.meta.dirname, '..')

const expectedArtifacts: Record<string, string[]> = {
  'rspack2-modern-module': ['dist/index.html'],
  'rspack2-optimization': ['dist/index.html'],
  'mf-host': ['dist/emp.json', 'dist/emp.js'],
  'mf-app': ['dist/emp.json', 'dist/index.html'],
  'vue-3-base': ['dist/mf-manifest.json', 'dist/emp.js'],
  'vue-3-project': ['dist/mf-manifest.json', 'dist/index.html'],
  'tailwind-4': ['dist/index.html'],
  'react-19-tanstack': ['dist/index.html'],
}

describe('default apps real acceptance', () => {
  for (const appDir of DEFAULT_APP_ACCEPTANCE) {
    test(`${appDir} builds and emits expected artifacts`, async () => {
      const result = await execFile('pnpm', ['--filter', `./apps/${appDir}`, 'build'], {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024 * 20,
      })

      expect(result.stderr).not.toContain('ERROR')
      for (const artifact of expectedArtifacts[appDir]) {
        expect(existsSync(join(repoRoot, 'apps', appDir, artifact))).toBe(true)
      }

      const distFiles = readdirSync(join(repoRoot, 'apps', appDir, 'dist'), {recursive: true})
      expect(distFiles.length).toBeGreaterThan(0)
    }, 120000)
  }
})
```

- [ ] **Step 2: Verify RED**

Run:

```bash
tmp_pnpm_dir=$(mktemp -d)
printf '%s\n' '#!/bin/sh' 'exec corepack pnpm@10.33.0 "$@"' > "$tmp_pnpm_dir/pnpm"
chmod +x "$tmp_pnpm_dir/pnpm"
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:single
```

Expected: fails because `test:apps:single` is not defined.

- [ ] **Step 3: Wire scripts**

Modify root `package.json` scripts:

```json
{
  "scripts": {
    "test:apps:single": "rstest run --config rstest.config.ts scripts/apps.acceptance.test.ts",
    "apps:acceptance": "pnpm empbuild && pnpm apps:check && pnpm test:apps:single"
  }
}
```

- [ ] **Step 4: Update README matrix**

Modify `apps/README.md` so the top matrix has three visible layers:

```md
## Default Acceptance

| 能力域 | canonical subject | 命令 |
| --- | --- | --- |
| Rspack 2 baseline | `rspack2-modern-module`, `rspack2-optimization` | `pnpm test:apps:single` |
| React MF browser/build | `mf-host`, `mf-app`, `@empjs/share` | `pnpm test:apps:single`, `pnpm test:apps:mf` |
| Vue 3 MF | `vue-3-base`, `vue-3-project` | `pnpm test:apps:single` |
| Tailwind v4 | `tailwind-4` | `pnpm test:apps:single` |
| React 19 router/query | `react-19-tanstack` | `pnpm test:apps:single` |

## Compat Packs

Compat apps stay out of default acceptance and run only when their capability changes.
```

- [ ] **Step 5: Verify GREEN**

Run:

```bash
tmp_pnpm_dir=$(mktemp -d)
printf '%s\n' '#!/bin/sh' 'exec corepack pnpm@10.33.0 "$@"' > "$tmp_pnpm_dir/pnpm"
chmod +x "$tmp_pnpm_dir/pnpm"
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:single
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 apps:acceptance
```

Expected: all 8 default apps build and emit artifacts. `apps:acceptance` also runs `empbuild` and `apps:check`.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add package.json scripts/apps.acceptance.test.ts apps/README.md
git diff --cached --check
git commit -m "test: define minimal app acceptance pack"
```

### Task 3: P0 Module Federation Browser Smoke

**Files:**
- Create: `scripts/apps.mf-browser.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes existing `scripts/static-services.mjs` for `emp-share` runtime when possible.
- Produces root script `test:apps:mf`: `rstest run --config rstest.config.ts scripts/apps.mf-browser.test.ts`.
- Uses Playwright only as a browser library imported inside Rstest; Rstest remains the test runner.

- [ ] **Step 1: Add Playwright dependency to root**

Run:

```bash
corepack pnpm@10.33.0 add -Dw playwright@1.61.1
```

Expected: root `package.json` and `pnpm-lock.yaml` update only for this dependency.

- [ ] **Step 2: Write failing browser test**

Create `scripts/apps.mf-browser.test.ts`:

```ts
import {describe, expect, test} from '@rstest/core'
import {spawn} from 'node:child_process'
import {once} from 'node:events'
import {setTimeout as delay} from 'node:timers/promises'
import {chromium} from 'playwright'

const repoRoot = new URL('..', import.meta.url).pathname

function startProcess(command: string, args: string[]) {
  const child = spawn(command, args, {cwd: repoRoot, env: process.env, stdio: ['ignore', 'pipe', 'pipe']})
  const output: string[] = []
  child.stdout?.on('data', chunk => output.push(String(chunk)))
  child.stderr?.on('data', chunk => output.push(String(chunk)))
  return {child, output}
}

async function waitForHttp(url: string, timeoutMs = 60000) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
    } catch {
      await delay(500)
    }
  }
  throw new Error(`Timed out waiting for ${url}`)
}

describe('P0 Module Federation browser smoke', () => {
  test('mf-app renders mf-host remote through emp-share runtime', async () => {
    const processes = [
      startProcess('pnpm', ['--filter', '@empjs/share', 'start']),
      startProcess('pnpm', ['--filter', './apps/mf-host', 'dev']),
      startProcess('pnpm', ['--filter', './apps/mf-app', 'dev']),
    ]

    try {
      const manifest = await waitForHttp('http://127.0.0.1:6001/emp.json')
      const manifestJson = await manifest.json()
      expect(JSON.stringify(manifestJson)).toContain('./App')

      await waitForHttp('http://127.0.0.1:6002/')
      const browser = await chromium.launch()
      const page = await browser.newPage()
      const consoleErrors: string[] = []
      page.on('console', message => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })
      await page.goto('http://127.0.0.1:6002/', {waitUntil: 'networkidle'})
      await expect(await page.textContent('body')).toContain('MF-APP')
      await expect(await page.textContent('body')).toContain('MF-Host')
      await page.getByRole('button', {name: /count is 0/i}).click()
      await expect(await page.textContent('body')).toContain('count is 1')
      await browser.close()
      expect(consoleErrors).toEqual([])
    } finally {
      for (const {child} of processes.reverse()) {
        child.kill('SIGTERM')
        await Promise.race([once(child, 'exit'), delay(2000)])
      }
    }
  }, 120000)
})
```

- [ ] **Step 3: Verify RED**

Run:

```bash
tmp_pnpm_dir=$(mktemp -d)
printf '%s\n' '#!/bin/sh' 'exec corepack pnpm@10.33.0 "$@"' > "$tmp_pnpm_dir/pnpm"
chmod +x "$tmp_pnpm_dir/pnpm"
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:mf
```

Expected: fails because the script is not wired yet or the browser test needs launch/wait tuning.

- [ ] **Step 4: Wire script and acceptance**

Modify root `package.json`:

```json
{
  "scripts": {
    "test:apps:mf": "rstest run --config rstest.config.ts scripts/apps.mf-browser.test.ts",
    "apps:acceptance": "pnpm empbuild && pnpm apps:check && pnpm test:apps:single && pnpm test:apps:mf"
  }
}
```

- [ ] **Step 5: Verify GREEN**

Run:

```bash
tmp_pnpm_dir=$(mktemp -d)
printf '%s\n' '#!/bin/sh' 'exec corepack pnpm@10.33.0 "$@"' > "$tmp_pnpm_dir/pnpm"
chmod +x "$tmp_pnpm_dir/pnpm"
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:mf
```

Expected: `mf-app` renders `MF-APP`, `mf-host` remote renders `MF-Host`, the count button changes from `0` to `1`, and console errors are empty after services are ready.

- [ ] **Step 6: Commit Task 3**

Run:

```bash
git add package.json pnpm-lock.yaml scripts/apps.mf-browser.test.ts
git diff --cached --check
git commit -m "test: add mf browser acceptance"
```

### Task 4: Merge High-Confidence Duplicate Package Names

**Files:**
- Modify: `apps/react-19-tanstack/src/**`
- Delete: `apps/react-tanstack/**`
- Modify: `apps/vue-3-project/src/**`
- Modify: `apps/vue-3-base/src/**`
- Delete after coverage is moved: `apps/vue3-app/**`
- Delete after coverage is moved: `apps/vue3-host/**`
- Modify: `apps/README.md`

**Interfaces:**
- Consumes `DEFAULT_APP_ACCEPTANCE` and `MERGE_CANDIDATES`.
- Produces no duplicate package names for `react-19-tanstack` and `vue-3-project`.
- Preserves one TanStack dynamic route signal inside `react-19-tanstack`.
- Preserves one Vue 3 Pinia/router signal inside the canonical Vue 3 pair.

- [ ] **Step 1: Write failing duplicate cleanup assertion**

Update `scripts/apps.rules.test.ts` duplicate assertion to expect only the still-unmerged groups:

```ts
expect(getDuplicatePackageNames(apps)).toEqual({
  'tailwind-demo': ['tailwind-4', 'tailwind-4-polyfill', 'tailwind-demo', 'tailwindcss-app'],
  'unpkg-lib': ['unpkg-demo', 'unpkg-lib'],
})
```

- [ ] **Step 2: Verify RED**

Run:

```bash
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:rules
```

Expected: fails while `react-tanstack`, `vue3-app`, and `vue3-host` still exist.

- [ ] **Step 3: Merge React TanStack route coverage**

Move only one dynamic route example into `apps/react-19-tanstack/src/routes/user.$id.tsx` and keep the existing React 19 route. Do not port all old demo pages.

Expected source shape:

```tsx
import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/user/$id')({
  component: UserRoute,
})

function UserRoute() {
  const {id} = Route.useParams()
  return <section data-testid="tanstack-user-route">User {id}</section>
}
```

Delete `apps/react-tanstack`.

- [ ] **Step 4: Merge Vue 3 Pinia/router signal**

Move one minimal Pinia store or equivalent router signal from `vue3-app/vue3-host` into canonical Vue 3 source. Keep it small: a single store file and one route/component reference is enough.

Expected retained assertion target:

```ts
export const useCountStore = defineStore('count', {
  state: () => ({count: 0}),
  actions: {
    increment() {
      this.count += 1
    },
  },
})
```

Delete `apps/vue3-app` and `apps/vue3-host` after the canonical Vue 3 build passes with the moved source.

- [ ] **Step 5: Verify GREEN**

Run:

```bash
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:rules
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:single
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 --filter ./apps/react-19-tanstack build
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 --filter ./apps/vue-3-base --filter ./apps/vue-3-project build
```

Expected: duplicate list no longer includes `react-19-tanstack` or `vue-3-project`; canonical React/Vue builds pass.

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add apps/react-19-tanstack apps/react-tanstack apps/vue-3-base apps/vue-3-project apps/vue3-app apps/vue3-host apps/README.md scripts/apps.rules.test.ts
git diff --cached --check
git commit -m "refactor(apps): merge react and vue duplicate examples"
```

### Task 5: Tailwind Default V4 Cleanup

**Files:**
- Modify: `scripts/apps.rules.test.ts`
- Modify: `apps/README.md`
- Delete after coverage is proven: `apps/tailwind-4-polyfill/**`
- Delete after coverage is proven: `apps/tailwind-demo/**`
- Delete after coverage is proven: `apps/tailwindcss-app/**`
- Delete after coverage is proven: `apps/tailwindcss-host/**`

**Interfaces:**
- Keeps `tailwind-4` as the default Tailwind app.
- Keeps `tailwind-2` and `tailwind-3` as legacy compat apps.
- Removes `tailwind-demo` duplicate package-name group after `tailwind-4` CSS artifact assertion passes.

- [ ] **Step 1: Tighten Tailwind catalog assertion**

Update `scripts/apps.rules.test.ts` so duplicate package names after this task only include `unpkg-lib`.

- [ ] **Step 2: Verify RED**

Run:

```bash
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:rules
```

Expected: fails while Tailwind duplicate apps still exist.

- [ ] **Step 3: Delete non-default Tailwind duplicates**

Remove:

```text
apps/tailwind-4-polyfill
apps/tailwind-demo
apps/tailwindcss-app
apps/tailwindcss-host
```

Keep:

```text
apps/tailwind-4
apps/tailwind-2
apps/tailwind-3
```

- [ ] **Step 4: Verify Tailwind real coverage**

Run:

```bash
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 --filter ./apps/tailwind-4 build
test -f apps/tailwind-4/dist/index.html
find apps/tailwind-4/dist -name '*.css' -print -quit
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:rules
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:single
```

Expected: `tailwind-4` emits at least one CSS file and rule tests pass without the Tailwind duplicate group.

- [ ] **Step 5: Commit Task 5**

Run:

```bash
git add apps/README.md scripts/apps.rules.test.ts apps/tailwind-4-polyfill apps/tailwind-demo apps/tailwindcss-app apps/tailwindcss-host
git diff --cached --check
git commit -m "refactor(apps): keep tailwind v4 as default"
```

### Task 6: Replace Library Apps With Rslib/CDN Smoke

**Files:**
- Create: `scripts/apps.library-smoke.test.ts`
- Modify: `package.json`
- Modify: `scripts/apps.rules.test.ts`
- Modify: `apps/README.md`
- Delete after smoke is green: `apps/lib-main/**`
- Delete after smoke is green: `apps/lib-react/**`
- Delete after smoke is green: `apps/unpkg-demo/**`
- Delete after smoke is green: `apps/unpkg-lib/**`

**Interfaces:**
- Produces root script `test:apps:library`: `rstest run --config rstest.config.ts scripts/apps.library-smoke.test.ts`.
- Uses existing static services `emp-share`, `cdn-react-18`, `lib-react-17`, or `lib-vue-2`.
- Eliminates the final duplicate package name group `unpkg-lib`.

- [ ] **Step 1: Write failing library smoke**

Create `scripts/apps.library-smoke.test.ts`:

```ts
import {describe, expect, test} from '@rstest/core'
import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {buildStaticCommand, selectStaticServices} from './static-services.mjs'

const repoRoot = join(import.meta.dirname, '..')

describe('Rslib and CDN package smoke', () => {
  test('library output is covered by packages instead of apps', () => {
    for (const file of [
      'packages/emp-share/output/sdk.js',
      'packages/cdn-react-18/dist/react.production.umd.js',
      'packages/lib-react-17/dist/react.production.umd.js',
    ]) {
      expect(existsSync(join(repoRoot, file))).toBe(true)
    }
  })

  test('static service commands can serve package output', () => {
    const services = selectStaticServices({services: ['emp-share', 'cdn-react-18']})
    expect(services.map(service => buildStaticCommand(service, {host: '0.0.0.0'}).url)).toEqual([
      'http://localhost:1800/',
      'http://localhost:2100/',
    ])
  })
})
```

- [ ] **Step 2: Wire script and verify RED**

Modify `package.json`:

```json
{
  "scripts": {
    "test:apps:library": "rstest run --config rstest.config.ts scripts/apps.library-smoke.test.ts"
  }
}
```

Run before package builds:

```bash
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:library
```

Expected: fails if package outputs are absent.

- [ ] **Step 3: Build package outputs**

Run:

```bash
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 empbuild
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:library
```

Expected: library smoke passes after package outputs exist.

- [ ] **Step 4: Delete library/unpkg app pair**

Remove:

```text
apps/lib-main
apps/lib-react
apps/unpkg-demo
apps/unpkg-lib
```

Update `scripts/apps.rules.test.ts` so `getDuplicatePackageNames(apps)` returns `{}`.

- [ ] **Step 5: Verify GREEN**

Run:

```bash
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:rules
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:library
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 apps:acceptance
```

Expected: no duplicate package names remain; default acceptance and library package smoke pass.

- [ ] **Step 6: Commit Task 6**

Run:

```bash
git add package.json scripts/apps.library-smoke.test.ts scripts/apps.rules.test.ts apps/README.md apps/lib-main apps/lib-react apps/unpkg-demo apps/unpkg-lib
git diff --cached --check
git commit -m "refactor(apps): replace library demos with package smoke"
```

### Task 7: Final Verification And Push

**Files:**
- Read-only verification across the repository.

**Interfaces:**
- Proves the cleanup goal with current state evidence.
- Leaves no duplicate package names in `apps/**`.
- Leaves default acceptance controlled by the 8 canonical app dirs and package smoke.

- [ ] **Step 1: Run complete local gates**

Run:

```bash
tmp_pnpm_dir=$(mktemp -d)
printf '%s\n' '#!/bin/sh' 'exec corepack pnpm@10.33.0 "$@"' > "$tmp_pnpm_dir/pnpm"
chmod +x "$tmp_pnpm_dir/pnpm"
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 workflow:check
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:rules
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:single
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:mf
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 test:apps:library
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 ci:verify
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 apps:acceptance
git diff --check
```

Expected: all commands exit `0`.

- [ ] **Step 2: Confirm app count and duplicate state**

Run:

```bash
PATH="$tmp_pnpm_dir:$PATH" corepack pnpm@10.33.0 apps:check
node - <<'NODE'
import {discoverApps} from './scripts/apps.mjs'
import {getDuplicatePackageNames} from './scripts/apps.catalog.mjs'
const apps = await discoverApps()
console.log(JSON.stringify({count: apps.length, duplicates: getDuplicatePackageNames(apps)}, null, 2))
NODE
```

Expected: `duplicates` is `{}`. App count is lower than the starting count `59` by the directories deleted in Tasks 4, 5, and 6.

- [ ] **Step 3: Commit any verification doc updates**

If `apps/README.md` changed during final verification, run:

```bash
git add apps/README.md
git diff --cached --check
git commit -m "docs(apps): document minimal support matrix"
```

If no files changed, skip this commit.

- [ ] **Step 4: Push and verify remote**

Run:

```bash
git status --short --branch
git push origin v4
git fetch origin v4
git rev-parse HEAD origin/v4
```

Expected: `HEAD` and `origin/v4` hashes match.

## Confirmation Gate

This plan is executable, but deletion starts only after explicit confirmation. The first safe execution unit is Task 1 because it only adds Rstest catalog/rule coverage and does not delete apps. Directory deletion begins in Task 4 after Tasks 1-3 are green.
