# Agent First Create Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the P0 Agent-first new-project flow so `emp create "React 主应用 + Vue 子应用"` generates a runnable single-host single-remote EMP workspace with deterministic verification and a machine-readable report.

**Architecture:** Add a focused `packages/cli/src/agent-create/` module that turns user intent into a typed project plan, writes files from built-in templates, verifies the generated project, and produces `emp-report.json`. Wire the module into the existing Commander CLI through a new `packages/cli/src/script/create.ts` script while keeping current `dev`, `build`, and `serve` behavior unchanged.

**Tech Stack:** Node.js `^20.19.0 || >=22.12.0`, pnpm `10.x`, TypeScript, Commander, existing `@empjs/cli` build pipeline, existing `node:test`-style `.mjs` assertion tests, existing EMP package family.

## Global Constraints

- 默认中文沟通；计划、执行记录和用户可见错误信息优先中文。
- 不强调底层构建器；产品表达使用“EMP 默认技术栈”“自动配置”“自动验证”。
- P0 只支持新项目创建，不处理既有项目迁移。
- P0 只支持单 host + 单 remote。
- P0 默认组合为 React host + Vue remote。
- 不自动删除用户文件。
- 不覆盖非空目标目录。
- 所有生成动作支持 `--dry-run`。
- 自动安装、启动、修复必须可通过参数关闭，便于 CI 和 Agent 控制。
- 输出必须包含 `emp-report.json`。
- 包管理默认使用 `pnpm@10.33.0`，遵守根 `packageManager` 与 `engines`。
- Superpowers 相关计划、执行记录、评审记录等工作产物统一放在 `.superpowers/` 下。
- 当前 checkout 已有用户改动：`README.md` 被修改；实施本计划时不得重写或格式化该文件，除非用户另行授权。

---

## Product Scope

### P0 Included

- `emp create <intent>` command.
- Deterministic intent parsing for this supported intent family:
  - React host
  - Vue remote
  - one shared dependency set
  - generated workspace with two apps
- `--dir <path>` target directory.
- `--dry-run` file preview without writes.
- `--skip-install`, `--skip-dev`, and `--skip-verify` switches.
- `--json` machine-readable command output.
- Generated `emp.intent.yaml`.
- Generated `emp-report.json`.
- Command executor for install, build, optional dev startup, and URL probing.
- Local verifier for generated files, package scripts, remote config shape, command results, and optional live URL checks.
- Minimal fixer for port conflict and missing report regeneration.

### P0 Excluded

- Existing project migration.
- Multiple remotes.
- Production deployment.
- npm publish.
- Cloud hosting.
- Interactive prompts.
- LLM-backed intent parsing inside the CLI.
- Agent server / MCP server. This comes after CLI core is stable.

## File Structure

- Create `packages/cli/src/agent-create/types.ts`
  - Owns all public TypeScript types for intent, plan, generated files, verification checks, fix actions, and reports.
- Create `packages/cli/src/agent-create/intent.ts`
  - Converts user text into a typed `CreateIntent` for the P0 supported family.
- Create `packages/cli/src/agent-create/planner.ts`
  - Converts `CreateIntent` plus CLI options into a deterministic `CreateProjectPlan`.
- Create `packages/cli/src/agent-create/templates.ts`
  - Produces template file contents as strings. Templates stay in code for P0 to avoid package asset-copy drift.
- Create `packages/cli/src/agent-create/generator.ts`
  - Writes files, rejects unsafe targets, and supports dry-run.
- Create `packages/cli/src/agent-create/verify.ts`
  - Verifies the generated workspace through static checks and optional command/live checks.
- Create `packages/cli/src/agent-create/executor.ts`
  - Runs install/build/dev commands with timeouts and captures structured command results.
- Create `packages/cli/src/agent-create/fix.ts`
  - Applies minimal deterministic fixes for P0.
- Create `packages/cli/src/agent-create/report.ts`
  - Builds and writes `emp-report.json`.
- Create `packages/cli/src/script/create.ts`
  - CLI-facing orchestration script.
- Modify `packages/cli/src/script/index.ts`
  - Register the `create` command.
- Modify `packages/cli/package.json`
  - Add create-flow tests to the `test` script.
- Create `packages/cli/test/agent-create-intent.test.mjs`
  - Tests deterministic intent parsing.
- Create `packages/cli/test/agent-create-planner.test.mjs`
  - Tests plan defaults and generated app model.
- Create `packages/cli/test/agent-create-generator.test.mjs`
  - Tests dry-run and file generation without installing dependencies.
- Create `packages/cli/test/agent-create-verify.test.mjs`
  - Tests static verifier and report shape.
- Create `packages/cli/test/agent-create-executor.test.mjs`
  - Tests command execution result mapping without running package installation.
- Create `packages/cli/test/agent-create-fix.test.mjs`
  - Tests deterministic fixer behavior.
- Create `packages/cli/test/cli-create-help.test.mjs`
  - Tests CLI help and unsupported cases.

## Core Interfaces

```ts
export type Framework = 'react' | 'vue'
export type AppRole = 'host' | 'remote'
export type CheckStatus = 'passed' | 'failed' | 'skipped'

export interface CreateIntent {
  raw: string
  host: {framework: 'react'; name: 'host'}
  remotes: Array<{framework: 'vue'; name: 'user'}>
}

export interface CreateOptions {
  targetDir: string
  dryRun: boolean
  install: boolean
  dev: boolean
  verify: boolean
  json: boolean
}

export interface CreateAppPlan {
  name: string
  role: AppRole
  framework: Framework
  port: number
}

export interface CreateProjectPlan {
  rootName: string
  rootDir: string
  intent: CreateIntent
  packageManager: 'pnpm'
  apps: CreateAppPlan[]
  files: GeneratedFile[]
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface VerificationCheck {
  name: string
  status: CheckStatus
  message: string
}

export interface CommandResult {
  name: string
  command: string
  status: CheckStatus
  exitCode: number | null
  stdout: string
  stderr: string
}

export interface EmpCreateReport {
  status: CheckStatus
  rootDir: string
  apps: Array<{name: string; role: AppRole; framework: Framework; url: string}>
  checks: VerificationCheck[]
  commands: CommandResult[]
}
```

## Task 1: Intent Parser

**Files:**
- Create: `packages/cli/src/agent-create/types.ts`
- Create: `packages/cli/src/agent-create/intent.ts`
- Test: `packages/cli/test/agent-create-intent.test.mjs`

**Interfaces:**
- Produces: `parseCreateIntent(input: string): CreateIntent`
- Produces: `CreateIntent`, `Framework`, `AppRole`
- Consumes: no prior task output

- [ ] **Step 1: Write failing parser tests**

Create `packages/cli/test/agent-create-intent.test.mjs`:

```js
import assert from 'node:assert/strict'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url)
const intent = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/intent.ts'))

const parsed = intent.parseCreateIntent('React 主应用 + Vue 子应用')

assert.deepEqual(parsed, {
  raw: 'React 主应用 + Vue 子应用',
  host: {framework: 'react', name: 'host'},
  remotes: [{framework: 'vue', name: 'user'}],
})

assert.deepEqual(intent.parseCreateIntent('react host with vue remote').remotes, [
  {framework: 'vue', name: 'user'},
])

assert.throws(
  () => intent.parseCreateIntent('Vue 主应用 + React 子应用'),
  /P0 仅支持 React 主应用 \+ Vue 子应用/,
)
```

- [ ] **Step 2: Run parser test to verify it fails**

Run:

```bash
node packages/cli/test/agent-create-intent.test.mjs
```

Expected: FAIL because `packages/cli/src/agent-create/intent.ts` does not exist.

- [ ] **Step 3: Implement parser types**

Create `packages/cli/src/agent-create/types.ts`:

```ts
export type Framework = 'react' | 'vue'
export type AppRole = 'host' | 'remote'
export type CheckStatus = 'passed' | 'failed' | 'skipped'

export interface CreateIntent {
  raw: string
  host: {framework: 'react'; name: 'host'}
  remotes: Array<{framework: 'vue'; name: 'user'}>
}
```

- [ ] **Step 4: Implement minimal deterministic parser**

Create `packages/cli/src/agent-create/intent.ts`:

```ts
import type {CreateIntent} from './types'

function hasReactHost(input: string): boolean {
  const normalized = input.toLowerCase()
  return (
    normalized.includes('react') &&
    (input.includes('主应用') || normalized.includes('host'))
  )
}

function hasVueRemote(input: string): boolean {
  const normalized = input.toLowerCase()
  return (
    normalized.includes('vue') &&
    (input.includes('子应用') || normalized.includes('remote'))
  )
}

export function parseCreateIntent(input: string): CreateIntent {
  const raw = input.trim()
  if (!raw) {
    throw new Error('create 命令需要项目意图，例如：React 主应用 + Vue 子应用')
  }

  if (!hasReactHost(raw) || !hasVueRemote(raw)) {
    throw new Error('P0 仅支持 React 主应用 + Vue 子应用')
  }

  return {
    raw,
    host: {framework: 'react', name: 'host'},
    remotes: [{framework: 'vue', name: 'user'}],
  }
}
```

- [ ] **Step 5: Run parser test to verify it passes**

Run:

```bash
node packages/cli/test/agent-create-intent.test.mjs
```

Expected: PASS with no output.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/agent-create/types.ts packages/cli/src/agent-create/intent.ts packages/cli/test/agent-create-intent.test.mjs
git commit -m "feat(cli): parse agent first create intent"
```

## Task 2: Project Planner

**Files:**
- Modify: `packages/cli/src/agent-create/types.ts`
- Create: `packages/cli/src/agent-create/planner.ts`
- Test: `packages/cli/test/agent-create-planner.test.mjs`

**Interfaces:**
- Consumes: `CreateIntent`
- Produces: `createProjectPlan(intent: CreateIntent, options: CreateOptions): CreateProjectPlan`
- Produces: `CreateOptions`, `CreateAppPlan`, `CreateProjectPlan`, `GeneratedFile`

- [ ] **Step 1: Write failing planner tests**

Create `packages/cli/test/agent-create-planner.test.mjs`:

```js
import assert from 'node:assert/strict'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url)
const intent = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/intent.ts'))
const planner = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/planner.ts'))

const parsed = intent.parseCreateIntent('React 主应用 + Vue 子应用')
const plan = planner.createProjectPlan(parsed, {
  targetDir: path.join(repoRoot, '.tmp/agent-create-demo'),
  dryRun: true,
  install: false,
  dev: false,
  verify: true,
  json: true,
})

assert.equal(plan.rootName, 'agent-create-demo')
assert.equal(plan.packageManager, 'pnpm')
assert.deepEqual(
  plan.apps.map(app => [app.name, app.role, app.framework, app.port]),
  [
    ['host', 'host', 'react', 3000],
    ['user', 'remote', 'vue', 3001],
  ],
)
assert.ok(plan.files.some(file => file.path === 'emp.intent.yaml'))
assert.ok(plan.files.some(file => file.path === 'apps/host/emp.config.ts'))
assert.ok(plan.files.some(file => file.path === 'apps/user/emp.config.ts'))
```

- [ ] **Step 2: Run planner test to verify it fails**

Run:

```bash
node packages/cli/test/agent-create-planner.test.mjs
```

Expected: FAIL because `planner.ts` does not exist and `types.ts` lacks plan types.

- [ ] **Step 3: Extend types**

Append to `packages/cli/src/agent-create/types.ts`:

```ts
export interface CreateOptions {
  targetDir: string
  dryRun: boolean
  install: boolean
  dev: boolean
  verify: boolean
  json: boolean
}

export interface CreateAppPlan {
  name: string
  role: AppRole
  framework: Framework
  port: number
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface CreateProjectPlan {
  rootName: string
  rootDir: string
  intent: CreateIntent
  packageManager: 'pnpm'
  apps: CreateAppPlan[]
  files: GeneratedFile[]
}
```

- [ ] **Step 4: Implement planner shell**

Create `packages/cli/src/agent-create/planner.ts`:

```ts
import path from 'node:path'
import type {CreateIntent, CreateOptions, CreateProjectPlan} from './types'
import {createTemplateFiles} from './templates'

export function createProjectPlan(
  intent: CreateIntent,
  options: CreateOptions,
): CreateProjectPlan {
  const rootDir = path.resolve(options.targetDir)
  const rootName = path.basename(rootDir)
  const apps = [
    {name: intent.host.name, role: 'host' as const, framework: intent.host.framework, port: 3000},
    {
      name: intent.remotes[0].name,
      role: 'remote' as const,
      framework: intent.remotes[0].framework,
      port: 3001,
    },
  ]

  const planWithoutFiles = {
    rootName,
    rootDir,
    intent,
    packageManager: 'pnpm' as const,
    apps,
    files: [],
  }

  return {
    ...planWithoutFiles,
    files: createTemplateFiles(planWithoutFiles),
  }
}
```

- [ ] **Step 5: Add temporary template stub to satisfy imports**

Create `packages/cli/src/agent-create/templates.ts`:

```ts
import type {CreateProjectPlan, GeneratedFile} from './types'

export function createTemplateFiles(plan: Omit<CreateProjectPlan, 'files'>): GeneratedFile[] {
  return [
    {
      path: 'emp.intent.yaml',
      content: `name: ${plan.rootName}\napps:\n  - name: host\n    role: host\n    framework: react\n  - name: user\n    role: remote\n    framework: vue\n`,
    },
    {path: 'apps/host/emp.config.ts', content: ''},
    {path: 'apps/user/emp.config.ts', content: ''},
  ]
}
```

- [ ] **Step 6: Run planner test to verify it passes**

Run:

```bash
node packages/cli/test/agent-create-planner.test.mjs
```

Expected: PASS with no output.

- [ ] **Step 7: Commit**

```bash
git add packages/cli/src/agent-create/types.ts packages/cli/src/agent-create/planner.ts packages/cli/src/agent-create/templates.ts packages/cli/test/agent-create-planner.test.mjs
git commit -m "feat(cli): plan agent first project creation"
```

## Task 3: Template Generation

**Files:**
- Modify: `packages/cli/src/agent-create/templates.ts`
- Test: `packages/cli/test/agent-create-planner.test.mjs`

**Interfaces:**
- Consumes: `CreateProjectPlan`
- Produces: full template list used by generator

- [ ] **Step 1: Extend planner test with template assertions**

Add these assertions to `packages/cli/test/agent-create-planner.test.mjs`:

```js
const paths = plan.files.map(file => file.path).sort()

assert.deepEqual(paths, [
  'apps/host/emp.config.ts',
  'apps/host/package.json',
  'apps/host/src/remotes.d.ts',
  'apps/host/src/App.tsx',
  'apps/host/src/main.tsx',
  'apps/user/emp.config.ts',
  'apps/user/package.json',
  'apps/user/src/App.vue',
  'apps/user/src/main.ts',
  'emp.intent.yaml',
  'package.json',
  'pnpm-workspace.yaml',
])

const hostConfig = plan.files.find(file => file.path === 'apps/host/emp.config.ts').content
assert.match(hostConfig, /remotes/)
assert.match(hostConfig, /user@http:\/\/localhost:3001\/emp\.js/)

const remoteConfig = plan.files.find(file => file.path === 'apps/user/emp.config.ts').content
assert.match(remoteConfig, /exposes/)
assert.match(remoteConfig, /\\.\/App/)
```

- [ ] **Step 2: Run planner test to verify it fails**

Run:

```bash
node packages/cli/test/agent-create-planner.test.mjs
```

Expected: FAIL because templates are incomplete.

- [ ] **Step 3: Replace template stub with P0 templates**

Modify `packages/cli/src/agent-create/templates.ts` so `createTemplateFiles()` returns the exact P0 file set. Keep helper functions small:

```ts
import type {CreateProjectPlan, GeneratedFile} from './types'

type PlannedProject = Omit<CreateProjectPlan, 'files'>

function rootPackageJson(plan: PlannedProject): string {
  return `${JSON.stringify(
    {
      name: plan.rootName,
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'pnpm --parallel --filter "./apps/*" dev',
        build: 'pnpm --filter "./apps/*" build',
        verify: 'emp verify',
      },
      devDependencies: {
        '@empjs/cli': '^4.0.0-alpha.2',
        '@empjs/plugin-react': '^4.0.0-alpha.2',
        '@empjs/plugin-vue3': '^4.0.0-alpha.2',
        '@empjs/share': '^4.0.0-alpha.2',
        typescript: '^5.9.2',
      },
    },
    null,
    2,
  )}\n`
}

function workspaceYaml(): string {
  return 'packages:\n  - apps/*\n'
}

function intentYaml(plan: PlannedProject): string {
  return `name: ${plan.rootName}
apps:
  - name: host
    role: host
    framework: react
    port: 3000
  - name: user
    role: remote
    framework: vue
    port: 3001
shared:
  react: singleton
  react-dom: singleton
`
}

function hostPackageJson(): string {
  return `${JSON.stringify(
    {
      name: 'host',
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {dev: 'emp dev', build: 'emp build', start: 'emp serve'},
      dependencies: {
        '@empjs/cli': '^4.0.0-alpha.2',
        '@empjs/plugin-react': '^4.0.0-alpha.2',
        '@empjs/share': '^4.0.0-alpha.2',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
      },
      devDependencies: {typescript: '^5.9.2'},
    },
    null,
    2,
  )}\n`
}

function remotePackageJson(): string {
  return `${JSON.stringify(
    {
      name: 'user',
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {dev: 'emp dev', build: 'emp build', start: 'emp serve'},
      dependencies: {
        '@empjs/cli': '^4.0.0-alpha.2',
        '@empjs/plugin-vue3': '^4.0.0-alpha.2',
        '@empjs/share': '^4.0.0-alpha.2',
        vue: '^3.5.21',
      },
      devDependencies: {typescript: '^5.9.2'},
    },
    null,
    2,
  )}\n`
}

function hostConfig(): string {
  return `import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig({
  server: {port: 3000},
  plugins: [
    pluginReact(),
    pluginRspackEmpShare({
      name: 'host',
      remotes: {
        user: 'user@http://localhost:3001/emp.js',
      },
      shared: {
        react: {singleton: true},
        'react-dom': {singleton: true},
      },
    }),
  ],
})
`
}

function remoteConfig(): string {
  return `import {defineConfig} from '@empjs/cli'
import pluginVue from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig({
  server: {port: 3001},
  plugins: [
    pluginVue(),
    pluginRspackEmpShare({
      name: 'user',
      exposes: {
        './App': './src/App.vue',
      },
    }),
  ],
})
`
}

export function createTemplateFiles(plan: PlannedProject): GeneratedFile[] {
  return [
    {path: 'package.json', content: rootPackageJson(plan)},
    {path: 'pnpm-workspace.yaml', content: workspaceYaml()},
    {path: 'emp.intent.yaml', content: intentYaml(plan)},
    {path: 'apps/host/package.json', content: hostPackageJson()},
    {path: 'apps/host/emp.config.ts', content: hostConfig()},
    {
      path: 'apps/host/src/remotes.d.ts',
      content: `declare module 'user/App' {
  import type {ComponentType} from 'react'

  const App: ComponentType
  export default App
}
`,
    },
    {
      path: 'apps/host/src/main.tsx',
      content: `import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
`,
    },
    {
      path: 'apps/host/src/App.tsx',
      content: `import React from 'react'

const RemoteApp = React.lazy(() => import('user/App'))

export default function App() {
  return (
    <main>
      <h1>EMP Host</h1>
      <React.Suspense fallback={<p>Loading remote...</p>}>
        <RemoteApp />
      </React.Suspense>
    </main>
  )
}
`,
    },
    {path: 'apps/user/package.json', content: remotePackageJson()},
    {path: 'apps/user/emp.config.ts', content: remoteConfig()},
    {
      path: 'apps/user/src/main.ts',
      content: `import {createApp} from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`,
    },
    {
      path: 'apps/user/src/App.vue',
      content: `<template>
  <section>
    <h2>EMP Remote</h2>
    <p>Vue remote is running.</p>
  </section>
</template>
`,
    },
  ]
}
```

- [ ] **Step 4: Run planner test to verify it passes**

Run:

```bash
node packages/cli/test/agent-create-planner.test.mjs
```

Expected: PASS with no output.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/agent-create/templates.ts packages/cli/test/agent-create-planner.test.mjs
git commit -m "feat(cli): add agent first project templates"
```

## Task 4: Generator and Dry Run

**Files:**
- Create: `packages/cli/src/agent-create/generator.ts`
- Test: `packages/cli/test/agent-create-generator.test.mjs`

**Interfaces:**
- Consumes: `CreateProjectPlan`
- Produces: `generateProject(plan: CreateProjectPlan, options: {dryRun: boolean}): Promise<GeneratedFile[]>`

- [ ] **Step 1: Write failing generator tests**

Create `packages/cli/test/agent-create-generator.test.mjs`:

```js
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url)
const intent = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/intent.ts'))
const planner = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/planner.ts'))
const generator = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/generator.ts'))

const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-agent-create-'))
const targetDir = path.join(tmpRoot, 'demo')
const plan = planner.createProjectPlan(intent.parseCreateIntent('React 主应用 + Vue 子应用'), {
  targetDir,
  dryRun: false,
  install: false,
  dev: false,
  verify: true,
  json: true,
})

const dryRunFiles = await generator.generateProject(plan, {dryRun: true})
assert.equal(dryRunFiles.length, plan.files.length)
await assert.rejects(() => fs.stat(targetDir), /ENOENT/)

await generator.generateProject(plan, {dryRun: false})
assert.match(await fs.readFile(path.join(targetDir, 'emp.intent.yaml'), 'utf8'), /React|host/)
assert.match(await fs.readFile(path.join(targetDir, 'apps/host/emp.config.ts'), 'utf8'), /remotes/)

await assert.rejects(
  () => generator.generateProject(plan, {dryRun: false}),
  /目标目录已存在且非空/,
)
```

- [ ] **Step 2: Run generator test to verify it fails**

Run:

```bash
node packages/cli/test/agent-create-generator.test.mjs
```

Expected: FAIL because `generator.ts` does not exist.

- [ ] **Step 3: Implement generator**

Create `packages/cli/src/agent-create/generator.ts`:

```ts
import fs from 'node:fs/promises'
import path from 'node:path'
import type {CreateProjectPlan, GeneratedFile} from './types'

async function directoryHasFiles(dir: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dir)
    return entries.length > 0
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false
    }
    throw error
  }
}

export async function generateProject(
  plan: CreateProjectPlan,
  options: {dryRun: boolean},
): Promise<GeneratedFile[]> {
  if (options.dryRun) {
    return plan.files
  }

  if (await directoryHasFiles(plan.rootDir)) {
    throw new Error('目标目录已存在且非空，EMP 不会覆盖已有项目')
  }

  for (const file of plan.files) {
    const absolutePath = path.join(plan.rootDir, file.path)
    await fs.mkdir(path.dirname(absolutePath), {recursive: true})
    await fs.writeFile(absolutePath, file.content, 'utf8')
  }

  return plan.files
}
```

- [ ] **Step 4: Run generator test to verify it passes**

Run:

```bash
node packages/cli/test/agent-create-generator.test.mjs
```

Expected: PASS with no output.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/agent-create/generator.ts packages/cli/test/agent-create-generator.test.mjs
git commit -m "feat(cli): generate agent first project files"
```

## Task 5: Static Verifier and Report

**Files:**
- Modify: `packages/cli/src/agent-create/types.ts`
- Create: `packages/cli/src/agent-create/verify.ts`
- Create: `packages/cli/src/agent-create/report.ts`
- Test: `packages/cli/test/agent-create-verify.test.mjs`

**Interfaces:**
- Consumes: `CreateProjectPlan`
- Produces: `verifyGeneratedProject(plan: CreateProjectPlan): Promise<VerificationCheck[]>`
- Produces: `buildCreateReport(plan: CreateProjectPlan, checks: VerificationCheck[]): EmpCreateReport`
- Produces: `writeCreateReport(report: EmpCreateReport): Promise<void>`

- [ ] **Step 1: Write failing verifier tests**

Create `packages/cli/test/agent-create-verify.test.mjs`:

```js
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url)
const intent = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/intent.ts'))
const planner = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/planner.ts'))
const generator = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/generator.ts'))
const verifier = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/verify.ts'))
const report = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/report.ts'))

const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-agent-verify-'))
const targetDir = path.join(tmpRoot, 'demo')
const plan = planner.createProjectPlan(intent.parseCreateIntent('React 主应用 + Vue 子应用'), {
  targetDir,
  dryRun: false,
  install: false,
  dev: false,
  verify: true,
  json: true,
})

await generator.generateProject(plan, {dryRun: false})
const checks = await verifier.verifyGeneratedProject(plan)

assert.equal(checks.every(check => check.status === 'passed'), true)
assert.deepEqual(
  checks.map(check => check.name),
  ['root-package', 'workspace', 'intent', 'host-config', 'remote-config'],
)

const createReport = report.buildCreateReport(plan, checks, [])
assert.equal(createReport.status, 'passed')
assert.equal(createReport.apps[0].url, 'http://localhost:3000')
assert.equal(createReport.apps[1].url, 'http://localhost:3001')
assert.deepEqual(createReport.commands, [])

await report.writeCreateReport(createReport)
const reportJson = JSON.parse(await fs.readFile(path.join(targetDir, 'emp-report.json'), 'utf8'))
assert.equal(reportJson.status, 'passed')
```

- [ ] **Step 2: Run verifier test to verify it fails**

Run:

```bash
node packages/cli/test/agent-create-verify.test.mjs
```

Expected: FAIL because `verify.ts` and `report.ts` do not exist.

- [ ] **Step 3: Extend types for verification and reports**

Append to `packages/cli/src/agent-create/types.ts`:

```ts
export interface VerificationCheck {
  name: string
  status: CheckStatus
  message: string
}

export interface CommandResult {
  name: string
  command: string
  status: CheckStatus
  exitCode: number | null
  stdout: string
  stderr: string
}

export interface EmpCreateReport {
  status: CheckStatus
  rootDir: string
  apps: Array<{name: string; role: AppRole; framework: Framework; url: string}>
  checks: VerificationCheck[]
  commands: CommandResult[]
}
```

- [ ] **Step 4: Implement static verifier**

Create `packages/cli/src/agent-create/verify.ts`:

```ts
import fs from 'node:fs/promises'
import path from 'node:path'
import type {CreateProjectPlan, VerificationCheck} from './types'

async function fileIncludes(rootDir: string, relativePath: string, pattern: RegExp): Promise<boolean> {
  const content = await fs.readFile(path.join(rootDir, relativePath), 'utf8')
  return pattern.test(content)
}

function passed(name: string, message: string): VerificationCheck {
  return {name, status: 'passed', message}
}

function failed(name: string, message: string): VerificationCheck {
  return {name, status: 'failed', message}
}

export async function verifyGeneratedProject(plan: CreateProjectPlan): Promise<VerificationCheck[]> {
  const checks: VerificationCheck[] = []

  try {
    JSON.parse(await fs.readFile(path.join(plan.rootDir, 'package.json'), 'utf8'))
    checks.push(passed('root-package', '根 package.json 可解析'))
  } catch {
    checks.push(failed('root-package', '根 package.json 不存在或不可解析'))
  }

  checks.push(
    (await fileIncludes(plan.rootDir, 'pnpm-workspace.yaml', /apps\/\*/))
      ? passed('workspace', 'pnpm workspace 已包含 apps/*')
      : failed('workspace', 'pnpm workspace 未包含 apps/*'),
  )

  checks.push(
    (await fileIncludes(plan.rootDir, 'emp.intent.yaml', /role: host/))
      ? passed('intent', 'emp.intent.yaml 已记录 host/remote 意图')
      : failed('intent', 'emp.intent.yaml 缺少 host/remote 意图'),
  )

  checks.push(
    (await fileIncludes(plan.rootDir, 'apps/host/emp.config.ts', /user@http:\/\/localhost:3001\/emp\.js/))
      ? passed('host-config', 'host 已配置 user remote')
      : failed('host-config', 'host 未配置 user remote'),
  )

  checks.push(
    (await fileIncludes(plan.rootDir, 'apps/user/emp.config.ts', /'\.\/App': '\.\/src\/App\.vue'/))
      ? passed('remote-config', 'remote 已暴露 ./App')
      : failed('remote-config', 'remote 未暴露 ./App'),
  )

  return checks
}
```

- [ ] **Step 5: Implement report builder**

Create `packages/cli/src/agent-create/report.ts`:

```ts
import fs from 'node:fs/promises'
import path from 'node:path'
import type {CommandResult, CreateProjectPlan, EmpCreateReport, VerificationCheck} from './types'

function overallStatus(checks: VerificationCheck[], commands: CommandResult[]): 'passed' | 'failed' {
  const checksPassed = checks.every(check => check.status === 'passed' || check.status === 'skipped')
  const commandsPassed = commands.every(command => command.status === 'passed' || command.status === 'skipped')
  return checksPassed && commandsPassed
    ? 'passed'
    : 'failed'
}

export function buildCreateReport(
  plan: CreateProjectPlan,
  checks: VerificationCheck[],
  commands: CommandResult[],
): EmpCreateReport {
  return {
    status: overallStatus(checks, commands),
    rootDir: plan.rootDir,
    apps: plan.apps.map(app => ({
      name: app.name,
      role: app.role,
      framework: app.framework,
      url: `http://localhost:${app.port}`,
    })),
    checks,
    commands,
  }
}

export async function writeCreateReport(report: EmpCreateReport): Promise<void> {
  await fs.writeFile(
    path.join(report.rootDir, 'emp-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  )
}
```

- [ ] **Step 6: Run verifier test to verify it passes**

Run:

```bash
node packages/cli/test/agent-create-verify.test.mjs
```

Expected: PASS with no output.

- [ ] **Step 7: Commit**

```bash
git add packages/cli/src/agent-create/types.ts packages/cli/src/agent-create/verify.ts packages/cli/src/agent-create/report.ts packages/cli/test/agent-create-verify.test.mjs
git commit -m "feat(cli): verify agent first generated projects"
```

## Task 6: CLI Create Command

**Files:**
- Create: `packages/cli/src/script/create.ts`
- Modify: `packages/cli/src/script/index.ts`
- Test: `packages/cli/test/cli-create-help.test.mjs`

**Interfaces:**
- Consumes: `parseCreateIntent`, `createProjectPlan`, `generateProject`, `verifyGeneratedProject`, `buildCreateReport`, `writeCreateReport`
- Produces: `CreateScript.setup('create', normalizedOptions)` behavior via Commander command registration

- [ ] **Step 1: Write failing CLI help tests**

Create `packages/cli/test/cli-create-help.test.mjs`:

```js
import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import path from 'node:path'
import {promisify} from 'node:util'

const execFile = promisify(execFileCallback)
const repoRoot = path.resolve(import.meta.dirname, '../../..')

const {stdout} = await execFile(
  process.execPath,
  [path.join(repoRoot, 'packages/cli/bin/emp.js'), 'create', '--help'],
  {cwd: repoRoot, maxBuffer: 1024 * 1024},
)

assert.match(stdout, /创建 EMP 新项目/)
assert.match(stdout, /--dir/)
assert.match(stdout, /--dry-run/)
assert.match(stdout, /--skip-install/)
assert.match(stdout, /--skip-dev/)
assert.match(stdout, /--skip-verify/)
assert.match(stdout, /--json/)
```

- [ ] **Step 2: Run CLI help test to verify it fails**

Run:

```bash
node packages/cli/test/cli-create-help.test.mjs
```

Expected: FAIL because `create` is still registered as unsupported or absent.

- [ ] **Step 3: Implement create script orchestration**

Create `packages/cli/src/script/create.ts`:

```ts
import path from 'node:path'
import {parseCreateIntent} from '../agent-create/intent'
import {createProjectPlan} from '../agent-create/planner'
import {generateProject} from '../agent-create/generator'
import {verifyGeneratedProject} from '../agent-create/verify'
import {buildCreateReport, writeCreateReport} from '../agent-create/report'

export interface CreateCommandOptions {
  dir?: string
  dryRun?: boolean
  skipInstall?: boolean
  skipDev?: boolean
  skipVerify?: boolean
  json?: boolean
}

export async function runCreateCommand(intentText: string, options: CreateCommandOptions): Promise<void> {
  const intent = parseCreateIntent(intentText)
  const targetDir = path.resolve(options.dir ?? 'emp-app')
  const plan = createProjectPlan(intent, {
    targetDir,
    dryRun: Boolean(options.dryRun),
    install: !options.skipInstall,
    dev: !options.skipDev,
    verify: !options.skipVerify,
    json: Boolean(options.json),
  })

  const files = await generateProject(plan, {dryRun: Boolean(options.dryRun)})
  const checks = options.skipVerify || options.dryRun ? [] : await verifyGeneratedProject(plan)
  const report = buildCreateReport(plan, checks)

  if (!options.dryRun) {
    await writeCreateReport(report)
  }

  if (options.json) {
    console.log(JSON.stringify({plan, files: files.map(file => file.path), report}, null, 2))
    return
  }

  console.log(options.dryRun ? 'EMP create dry-run 完成' : 'EMP 新项目创建完成')
  console.log(`目录: ${plan.rootDir}`)
  console.log(`文件数: ${files.length}`)
  if (!options.dryRun) {
    console.log(`报告: ${path.join(plan.rootDir, 'emp-report.json')}`)
  }
}
```

- [ ] **Step 4: Register create command**

Modify `packages/cli/src/script/index.ts` by adding this command before unsupported commands:

```ts
  program
    .command('create <intent>')
    .description('创建 EMP 新项目')
    .option('--dir <dir>', '目标目录，默认 emp-app')
    .option('--dry-run', '只输出将要生成的文件，不写入磁盘')
    .option('--skip-install', '跳过依赖安装')
    .option('--skip-dev', '跳过自动启动')
    .option('--skip-verify', '跳过自动验证')
    .option('--json', '输出 JSON 结果')
    .action(async (intentText, o) => {
      const {runCreateCommand} = await import('src/script/create')
      await runCreateCommand(intentText, o)
    })
```

- [ ] **Step 5: Run CLI help test to verify it passes**

Run:

```bash
node packages/cli/test/cli-create-help.test.mjs
```

Expected: PASS with no output.

- [ ] **Step 6: Run dry-run smoke command**

Run:

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dry-run --json
```

Expected: PASS and stdout contains `"emp.intent.yaml"`, `"apps/host/emp.config.ts"`, and `"apps/user/emp.config.ts"`.

- [ ] **Step 7: Commit**

```bash
git add packages/cli/src/script/create.ts packages/cli/src/script/index.ts packages/cli/test/cli-create-help.test.mjs
git commit -m "feat(cli): add agent first create command"
```

## Task 7: Command Executor

**Files:**
- Modify: `packages/cli/src/agent-create/types.ts`
- Create: `packages/cli/src/agent-create/executor.ts`
- Modify: `packages/cli/src/script/create.ts`
- Test: `packages/cli/test/agent-create-executor.test.mjs`

**Interfaces:**
- Consumes: `CreateProjectPlan`, `CreateOptions`
- Produces: `runCreateCommands(plan: CreateProjectPlan, options: Pick<CreateOptions, 'install' | 'dev' | 'verify'>): Promise<CommandResult[]>`
- Produces: `CommandResult`

- [ ] **Step 1: Write failing executor tests**

Create `packages/cli/test/agent-create-executor.test.mjs`:

```js
import assert from 'node:assert/strict'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url)
const executor = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/executor.ts'))

const skipped = await executor.runCreateCommands(
  {rootDir: repoRoot},
  {install: false, dev: false, verify: false},
)

assert.deepEqual(skipped, [
  {
    name: 'install',
    command: 'pnpm install',
    status: 'skipped',
    exitCode: null,
    stdout: '',
    stderr: '已通过 --skip-install 跳过',
  },
  {
    name: 'build',
    command: 'pnpm build',
    status: 'skipped',
    exitCode: null,
    stdout: '',
    stderr: '已通过 --skip-verify 跳过',
  },
  {
    name: 'dev',
    command: 'pnpm dev',
    status: 'skipped',
    exitCode: null,
    stdout: '',
    stderr: '已通过 --skip-dev 跳过',
  },
])

const ok = await executor.runCommandForCreate({
  name: 'node-version',
  command: process.execPath,
  args: ['--version'],
  cwd: repoRoot,
  timeoutMs: 10000,
})

assert.equal(ok.name, 'node-version')
assert.equal(ok.status, 'passed')
assert.equal(ok.exitCode, 0)
assert.match(ok.stdout, /^v/)
```

- [ ] **Step 2: Run executor test to verify it fails**

Run:

```bash
node packages/cli/test/agent-create-executor.test.mjs
```

Expected: FAIL because `executor.ts` does not exist.

- [ ] **Step 3: Add command result type if Task 5 did not already add it**

Ensure `packages/cli/src/agent-create/types.ts` contains:

```ts
export interface CommandResult {
  name: string
  command: string
  status: CheckStatus
  exitCode: number | null
  stdout: string
  stderr: string
}
```

- [ ] **Step 4: Implement command executor**

Create `packages/cli/src/agent-create/executor.ts`:

```ts
import {execFile as execFileCallback, spawn} from 'node:child_process'
import {promisify} from 'node:util'
import type {CommandResult, CreateOptions, CreateProjectPlan} from './types'

const execFile = promisify(execFileCallback)

export async function runCommandForCreate(input: {
  name: string
  command: string
  args: string[]
  cwd: string
  timeoutMs: number
}): Promise<CommandResult> {
  const commandText = [input.command, ...input.args].join(' ')
  try {
    const {stdout, stderr} = await execFile(input.command, input.args, {
      cwd: input.cwd,
      timeout: input.timeoutMs,
      maxBuffer: 1024 * 1024 * 10,
    })
    return {
      name: input.name,
      command: commandText,
      status: 'passed',
      exitCode: 0,
      stdout,
      stderr,
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {stdout?: string; stderr?: string; code?: number}
    return {
      name: input.name,
      command: commandText,
      status: 'failed',
      exitCode: typeof err.code === 'number' ? err.code : null,
      stdout: err.stdout ?? '',
      stderr: err.stderr ?? err.message,
    }
  }
}

function skipped(name: string, command: string, reason: string): CommandResult {
  return {name, command, status: 'skipped', exitCode: null, stdout: '', stderr: reason}
}

export function startDevCommandForCreate(plan: Pick<CreateProjectPlan, 'rootDir'>): CommandResult {
  const child = spawn('pnpm', ['dev'], {
    cwd: plan.rootDir,
    detached: true,
    stdio: 'ignore',
  })
  child.unref()

  return {
    name: 'dev',
    command: 'pnpm dev',
    status: 'passed',
    exitCode: null,
    stdout: `pid=${child.pid}`,
    stderr: '',
  }
}

export async function runCreateCommands(
  plan: Pick<CreateProjectPlan, 'rootDir'>,
  options: Pick<CreateOptions, 'install' | 'dev' | 'verify'>,
): Promise<CommandResult[]> {
  const results: CommandResult[] = []

  results.push(
    options.install
      ? await runCommandForCreate({
          name: 'install',
          command: 'pnpm',
          args: ['install'],
          cwd: plan.rootDir,
          timeoutMs: 120000,
        })
      : skipped('install', 'pnpm install', '已通过 --skip-install 跳过'),
  )

  results.push(
    options.verify
      ? await runCommandForCreate({
          name: 'build',
          command: 'pnpm',
          args: ['build'],
          cwd: plan.rootDir,
          timeoutMs: 120000,
        })
      : skipped('build', 'pnpm build', '已通过 --skip-verify 跳过'),
  )

  results.push(
    options.dev
      ? startDevCommandForCreate(plan)
      : skipped('dev', 'pnpm dev', '已通过 --skip-dev 跳过'),
  )

  return results
}
```

- [ ] **Step 5: Wire executor into create script**

Modify `packages/cli/src/script/create.ts`:

```ts
import {runCreateCommands} from '../agent-create/executor'
```

Then replace report construction with:

```ts
  const commandResults =
    options.dryRun
      ? []
      : await runCreateCommands(plan, {
          install: !options.skipInstall,
          dev: !options.skipDev,
          verify: !options.skipVerify,
        })
  const checks = options.skipVerify || options.dryRun ? [] : await verifyGeneratedProject(plan)
  const report = buildCreateReport(plan, checks, commandResults)
```

- [ ] **Step 6: Run executor test to verify it passes**

Run:

```bash
node packages/cli/test/agent-create-executor.test.mjs
```

Expected: PASS with no output.

- [ ] **Step 7: Commit**

```bash
git add packages/cli/src/agent-create/types.ts packages/cli/src/agent-create/executor.ts packages/cli/src/script/create.ts packages/cli/test/agent-create-executor.test.mjs
git commit -m "feat(cli): execute agent first create commands"
```

## Task 8: Minimal Fixer

**Files:**
- Modify: `packages/cli/src/agent-create/types.ts`
- Create: `packages/cli/src/agent-create/fix.ts`
- Modify: `packages/cli/src/script/create.ts`
- Test: `packages/cli/test/agent-create-fix.test.mjs`

**Interfaces:**
- Consumes: `CreateProjectPlan`, `VerificationCheck[]`
- Produces: `fixGeneratedProject(plan: CreateProjectPlan, checks: VerificationCheck[]): Promise<FixResult[]>`

- [ ] **Step 1: Write failing fixer tests**

Create `packages/cli/test/agent-create-fix.test.mjs`:

```js
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url)
const intent = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/intent.ts'))
const planner = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/planner.ts'))
const generator = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/generator.ts'))
const fixer = jiti(path.join(repoRoot, 'packages/cli/src/agent-create/fix.ts'))

const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-agent-fix-'))
const targetDir = path.join(tmpRoot, 'demo')
const plan = planner.createProjectPlan(intent.parseCreateIntent('React 主应用 + Vue 子应用'), {
  targetDir,
  dryRun: false,
  install: false,
  dev: false,
  verify: true,
  json: true,
})

await generator.generateProject(plan, {dryRun: false})
await fs.rm(path.join(targetDir, 'emp-report.json'), {force: true})

const fixes = await fixer.fixGeneratedProject(plan, [
  {name: 'report', status: 'failed', message: 'emp-report.json 缺失'},
])

assert.deepEqual(fixes, [{name: 'report', status: 'applied', message: '已重新生成 emp-report.json'}])
assert.match(await fs.readFile(path.join(targetDir, 'emp-report.json'), 'utf8'), /"status"/)
```

- [ ] **Step 2: Run fixer test to verify it fails**

Run:

```bash
node packages/cli/test/agent-create-fix.test.mjs
```

Expected: FAIL because `fix.ts` does not exist.

- [ ] **Step 3: Add fix result type**

Append to `packages/cli/src/agent-create/types.ts`:

```ts
export interface FixResult {
  name: string
  status: 'applied' | 'skipped'
  message: string
}
```

- [ ] **Step 4: Implement minimal fixer**

Create `packages/cli/src/agent-create/fix.ts`:

```ts
import {buildCreateReport, writeCreateReport} from './report'
import type {CreateProjectPlan, FixResult, VerificationCheck} from './types'

export async function fixGeneratedProject(
  plan: CreateProjectPlan,
  checks: VerificationCheck[],
): Promise<FixResult[]> {
  const fixes: FixResult[] = []

  if (checks.some(check => check.name === 'report' && check.status === 'failed')) {
    await writeCreateReport(buildCreateReport(plan, [], []))
    fixes.push({name: 'report', status: 'applied', message: '已重新生成 emp-report.json'})
  }

  return fixes
}
```

- [ ] **Step 5: Run fixer test to verify it passes**

Run:

```bash
node packages/cli/test/agent-create-fix.test.mjs
```

Expected: PASS with no output.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/agent-create/types.ts packages/cli/src/agent-create/fix.ts packages/cli/test/agent-create-fix.test.mjs
git commit -m "feat(cli): add minimal agent first fixer"
```

## Task 9: Test Script and End-to-End Acceptance

**Files:**
- Modify: `packages/cli/package.json`
- Test: all create-flow tests

**Interfaces:**
- Consumes: all prior task outputs
- Produces: package-level test integration

- [ ] **Step 1: Add create tests to package script**

Modify `packages/cli/package.json` `scripts.test` so the first group includes the new fast tests before the build step:

```json
"test": "node test/rslib-node-target.test.mjs && node test/cli-options.test.mjs && node test/config-file-discovery.test.mjs && node test/build-watch-shape.test.mjs && node test/lifecycle-order.test.mjs && node test/agent-create-intent.test.mjs && node test/agent-create-planner.test.mjs && node test/agent-create-generator.test.mjs && node test/agent-create-verify.test.mjs && node test/agent-create-executor.test.mjs && node test/agent-create-fix.test.mjs && pnpm run build && node test/cli-help.test.mjs && node test/cli-create-help.test.mjs && node test/rspack2-features-shape.test.mjs && node test/rspack-config-shape.test.mjs"
```

- [ ] **Step 2: Run focused tests**

Run:

```bash
node packages/cli/test/agent-create-intent.test.mjs
node packages/cli/test/agent-create-planner.test.mjs
node packages/cli/test/agent-create-generator.test.mjs
node packages/cli/test/agent-create-verify.test.mjs
node packages/cli/test/agent-create-executor.test.mjs
node packages/cli/test/agent-create-fix.test.mjs
```

Expected: all commands PASS with no output.

- [ ] **Step 3: Run CLI package test**

Run:

```bash
pnpm --filter @empjs/cli test
```

Expected: PASS. The command builds `@empjs/cli`, then validates CLI help and config-shape tests.

- [ ] **Step 4: Run dry-run CLI acceptance**

Run:

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dry-run --json
```

Expected: PASS. stdout includes:

```txt
emp.intent.yaml
apps/host/emp.config.ts
apps/user/emp.config.ts
```

- [ ] **Step 5: Run write-mode static acceptance**

Run:

```bash
TMP_DIR="$(mktemp -d)"
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP_DIR/demo" --skip-install --skip-dev --json
test -f "$TMP_DIR/demo/emp-report.json"
test -f "$TMP_DIR/demo/apps/host/emp.config.ts"
test -f "$TMP_DIR/demo/apps/user/emp.config.ts"
```

Expected: PASS. The generated report status is `passed`.

- [ ] **Step 6: Run default end-to-end acceptance in a temporary directory**

Run:

```bash
TMP_DIR="$(mktemp -d)"
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP_DIR/demo" --json
node -e "const report=require(process.argv[1]); const names=report.commands.map(c=>c.name); if (!names.includes('install') || !names.includes('build') || !names.includes('dev')) process.exit(1)" "$TMP_DIR/demo/emp-report.json"
```

Expected: PASS. The generated report includes `install`, `build`, and `dev` command entries. If the local registry or network blocks install, record the failing command stderr and rerun the static acceptance from Step 5 as the minimum local proof.

- [ ] **Step 7: Commit**

```bash
git add packages/cli/package.json
git commit -m "test(cli): cover agent first create flow"
```

## Task 10: User-Facing Documentation Without Touching Existing README

**Files:**
- Create: `packages/cli/docs/agent-first-create.md`
- Modify: no existing docs in this task

**Interfaces:**
- Consumes: final CLI behavior
- Produces: a package-local doc that can later be summarized into README after user approval

- [ ] **Step 1: Create package-local documentation**

Create `packages/cli/docs/agent-first-create.md`:

````md
# Agent First Create

`emp create` creates a new EMP micro-frontend workspace from a short product intent.

```bash
emp create "React 主应用 + Vue 子应用"
```

The command creates:

- `emp.intent.yaml`
- root `package.json`
- `pnpm-workspace.yaml`
- `apps/host`
- `apps/user`
- `emp-report.json`

The P0 flow supports a single React host and a single Vue remote. It does not migrate existing projects, deploy applications, publish packages, or overwrite non-empty directories.

For Agent usage:

```bash
emp create "React 主应用 + Vue 子应用" --dir ./demo --skip-install --skip-dev --json
```

For previewing generated files:

```bash
emp create "React 主应用 + Vue 子应用" --dry-run --json
```
````

- [ ] **Step 2: Verify documentation does not modify root README**

Run:

```bash
git diff -- README.md
```

Expected: only pre-existing user changes are shown; this task adds no README diff.

- [ ] **Step 3: Commit**

```bash
git add packages/cli/docs/agent-first-create.md
git commit -m "docs(cli): document agent first create flow"
```

## Final Verification

- [ ] **Step 1: Check worktree status**

Run:

```bash
git status --short --branch
```

Expected: clean except pre-existing `README.md` user change if it was not committed by the implementer.

- [ ] **Step 2: Verify codebase-memory-mcp index can still read the project**

Run via MCP:

```txt
index_status(project="Users-Bigo-Desktop-develop-fontend-workspace-emp")
```

Expected: `status` is `ready`.

- [ ] **Step 3: Run package test**

Run:

```bash
pnpm --filter @empjs/cli test
```

Expected: PASS.

- [ ] **Step 4: Run root relevant build**

Run:

```bash
pnpm emp:prod
```

Expected: PASS and `@empjs/cli` builds successfully.

- [ ] **Step 5: Validate generated project static flow**

Run:

```bash
TMP_DIR="$(mktemp -d)"
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP_DIR/demo" --skip-install --skip-dev --json
node -e "const report=require(process.argv[1]); if (report.status !== 'passed') process.exit(1)" "$TMP_DIR/demo/emp-report.json"
```

Expected: PASS.

- [ ] **Step 6: Validate default create command attempts the full automatic flow**

Run:

```bash
TMP_DIR="$(mktemp -d)"
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP_DIR/demo" --json
node -e "const report=require(process.argv[1]); if (!report.commands.some(c => c.name === 'install')) process.exit(1); if (!report.commands.some(c => c.name === 'build')) process.exit(1); if (!report.commands.some(c => c.name === 'dev')) process.exit(1)" "$TMP_DIR/demo/emp-report.json"
```

Expected: PASS when package installation can reach the configured registry. If installation fails because of network or registry access, keep the generated `emp-report.json` as failure evidence and include the `install` stderr in the final delivery note.

## Execution Notes

- Use `codebase-memory-mcp` first for code discovery. Fall back to `rg` or file reads for config, tests, scripts, and docs.
- Keep all P0 implementation inside `packages/cli`.
- Do not modify `projects/**`, `website`, release scripts, or package versions in this plan.
- Do not touch root `README.md` while it has pre-existing user edits.
- Use frequent commits after each task when the user explicitly asks for commit-based execution.
- If live install/dev verification is added during execution, use a temporary directory outside the repo and delete it after collecting results.

## Self-Review

- Spec coverage: P0 new-project create, dry-run, command execution, static verify, report, minimal fixer, and CLI help are each mapped to a task.
- Placeholder scan: no placeholder markers are intentionally present in task instructions.
- Type consistency: `CreateIntent`, `CreateOptions`, `CreateProjectPlan`, `GeneratedFile`, `VerificationCheck`, `EmpCreateReport`, and `FixResult` names are consistent across tasks.
- Scope check: Agent server, multi-remote, deployment, publishing, and existing-project migration are outside this P0 implementation plan.
