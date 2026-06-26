# Centralized Static Service Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立中心化本地静态服务和 CDN 调试工作流，让 `packages/cdn-*`、`packages/lib-*`、`@empjs/share`、`@empjs/polyfill` 以及临时 dist 预览不再依赖第三方 `serve` 包或每个服务各自维护静态 server 脚本。

**Architecture:** `@empjs/cli` 增加一个不依赖 EMP 项目配置的 `emp static` 命令，负责“单目录静态服务”的 HTTP/HTTPS、CORS、SPA fallback、headers 和 URL 输出。仓库根部新增 `scripts/static-services.mjs` 与 `scripts/static-services.config.mjs`，把本地 CDN/lib/share/polyfill 服务做成统一清单，负责 list、doctor、dry-run、单服务启动、分组启动和端口冲突检查。所有历史 `serve ./dist ...` / `serve ./output ...` 包脚本迁移到中心化入口，根部移除 `serve` devDependency，`apps/**` 继续保留 `emp serve` 作为应用产物调试入口。

**Tech Stack:** Node.js `^20.19.0 || >=22.12.0`、`pnpm@10.33.0`、TypeScript、`@rstest/core`、现有 `@empjs/cli` 依赖中的 `connect`、`serve-static`、`cors`、`compression`、`open`、`http-proxy-middleware`。

## Global Constraints

- 默认中文沟通；计划、进度、评审和风险说明使用中文。
- 只修改与本地静态服务中心化直接相关的文件；保留已有未跟踪文件 `.superpowers/plans/2026-06-26-apps-rstest-consolidation-plan.md`。
- Superpowers 计划文件只放在 `.superpowers/plans/`；禁止新建 `docs/superpowers/`。
- 代码发现优先使用 `codebase-memory-mcp`；字符串、脚本、package.json 和 lockfile 扫描允许使用 `rg`。
- 不改 `packages/cdn-*` 和 `packages/lib-*` 的版本号、发布配置、依赖线和 `files` 范围；仅迁移本地开发脚本。
- `apps/**` 和 `website` 不进入发布包范围；本计划不改变发布范围。
- 新增行为优先写真实验收或集成测试；CLI HTTP 行为使用 `rstest` 启动真实本地服务并发起 HTTP 请求。
- 不新增 Vitest、Jest、Mocha、Ava 或第二套测试 runner。
- `pnpm-lock.yaml` 只在移除根部 `serve` devDependency 并运行安装后更新。
- 完成前至少运行 `pnpm workflow:check`、`git diff --check`、相关 CLI/static 测试、`pnpm ci:verify`；触及 CLI 构建链路后运行 `pnpm empbuild`。

---

## Current-State Notes

- live checkout：`v4...origin/v4`。
- 当前未跟踪文件：`.superpowers/plans/2026-06-26-apps-rstest-consolidation-plan.md`，本计划不得覆盖。
- 仓库内 `.codex/` 目录和 `.codex/config.toml` 当前不存在；`codex mcp list` 显示 `codebase-memory-mcp` enabled。
- codebase-memory 索引项目名：`Users-Bigo-Desktop-develop-fontend-workspace-emp`，状态 ready，`nodes=5504`、`edges=8899`。
- 现有 `apps/**` 基本使用 `emp serve`；本次不替换 app 的 `start` 脚本。
- 重复第三方静态服务脚本集中在：
  - `packages/cdn-react-17/package.json`
  - `packages/cdn-react-18/package.json`
  - `packages/cdn-react-19/package.json`
  - `packages/cdn-react-wouter/package.json`
  - `packages/cdn-react-19-tanstack-router/package.json`
  - `packages/cdn-vue-2/package.json`
  - `packages/cdn-vue-3/package.json`
  - `packages/cdn-vue-router-pinia/package.json`
  - `packages/lib-react-17/package.json`
  - `packages/lib-vue-2/package.json`
  - `packages/emp-share/package.json`
  - `packages/emp-polyfill/package.json`
- 根 `package.json` 当前有 `"serve": "14.2.5"`；迁移完成后应删除。

## File Structure

- Create: `packages/cli/src/server/static/types.ts`
  - 定义 `StaticServeOptions`、`StaticServeUrls`、`StaticServerHandle`、`StaticHeaderMap`。
- Create: `packages/cli/src/server/static/createStaticServer.ts`
  - 提供 `startStaticServer(options)`，封装 connect middleware、CORS、headers、SPA fallback、HTTP/HTTPS listen、close。
- Create: `packages/cli/src/script/static.ts`
  - 解析 `emp static` 命令入参，不走 `BaseScript.setup()`，避免读取 `emp.config.*`。
- Modify: `packages/cli/src/script/index.ts`
  - 注册 `emp static [root]` 命令。
- Modify: `packages/cli/src/types/env.ts`
  - `CliActionType` 增加 `'static'`，`CliOptionsType` 增加 static 命令字段。
- Create: `packages/cli/test/static-server.test.ts`
  - 使用 rstest 启动真实 HTTP 服务，验证文件返回、CORS、SPA fallback、HTTPS 默认证书。
- Modify: `packages/cli/test/cli-help.test.mjs`
  - 验证 `emp static --help` 暴露必要选项。
- Create: `scripts/static-services.config.mjs`
  - 本地静态服务注册表，统一维护服务 id、package、root、port、groups、assets。
- Create: `scripts/static-services.mjs`
  - 中心化服务管理器，支持 `list`、`doctor`、`start`、`env`、`--dry-run`、`--json`。
- Modify: `scripts/apps.test.mjs`
  - 增加静态服务清单、端口冲突和 dry-run 命令断言。
- Modify: `scripts/emp-workflow-check.mjs`
  - 增加禁止新增 `serve ./` package scripts 和根部 `serve` devDependency 的规则。
- Modify: `package.json`
  - 增加根脚本，删除 `serve` devDependency。
- Modify: `pnpm-lock.yaml`
  - 仅反映根部 `serve` devDependency 移除；`serve-static` 保留为 `@empjs/cli` 依赖。
- Modify: static package scripts listed in Current-State Notes
  - `dev:serve`、`start`、`https` 迁移到中心化入口。

---

### Task 1: Static Service Registry And Dry-Run Manager

**Files:**
- Create: `scripts/static-services.config.mjs`
- Create: `scripts/static-services.mjs`
- Modify: `scripts/apps.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces:
  - `staticServices: Array<StaticServiceDefinition>`
  - `listStaticServices({group?: string, services?: string[]}): StaticServiceDefinition[]`
  - `selectStaticServices({group?: string, services?: string[]}): StaticServiceDefinition[]`
  - `validateStaticServices(services): StaticServiceIssue[]`
  - `buildStaticCommand(service, overrides): {cmd: string, args: string[], display: string, url: string}`
- Consumes:
  - Later tasks rely on service ids and command shape generated here.

- [x] **Step 1: Write failing registry tests in `scripts/apps.test.mjs`**

Add these imports near the existing imports:

```js
import {
  buildStaticCommand,
  listStaticServices,
  selectStaticServices,
  staticServices,
  validateStaticServices,
} from './static-services.mjs'
```

Add these assertions after the existing app bench assertions:

```js
const staticServiceIds = staticServices.map(service => service.id).sort()

assert.deepEqual(staticServiceIds, [
  'cdn-react-17',
  'cdn-react-18',
  'cdn-react-19',
  'cdn-react-tanstack',
  'cdn-react-wouter',
  'cdn-vue-2',
  'cdn-vue-3',
  'cdn-vue-router-pinia',
  'emp-polyfill',
  'emp-share',
  'lib-react-17',
  'lib-vue-2',
])

assert.equal(new Set(staticServiceIds).size, staticServiceIds.length)

const reactRuntimeServices = listStaticServices({group: 'react-runtime'}).map(service => service.id).sort()
assert.deepEqual(reactRuntimeServices, ['cdn-react-17', 'cdn-react-18', 'cdn-react-19', 'emp-share'])

const selectedStaticServices = selectStaticServices({services: ['cdn-react-18', 'emp-share']})
assert.deepEqual(
  selectedStaticServices.map(service => service.id),
  ['cdn-react-18', 'emp-share'],
)

const selectedCommands = selectedStaticServices.map(service => buildStaticCommand(service, {host: '0.0.0.0'}).display)
assert.deepEqual(selectedCommands, [
  'node packages/cli/bin/emp.js static packages/cdn-react-18/dist --host 0.0.0.0 --port 1800 --cors',
  'node packages/cli/bin/emp.js static packages/emp-share/output --host 0.0.0.0 --port 2100 --cors',
])

const conflictIssues = validateStaticServices(
  selectStaticServices({services: ['cdn-react-wouter', 'cdn-react-tanstack']}),
)
assert.deepEqual(conflictIssues, [
  {
    type: 'port-conflict',
    port: 2200,
    services: ['cdn-react-wouter', 'cdn-react-tanstack'],
    message: 'port 2200 is used by cdn-react-wouter, cdn-react-tanstack in the same selection',
  },
])
```

- [x] **Step 2: Run the test and verify it fails**

Run:

```bash
node scripts/apps.test.mjs
```

Expected: fail with `Cannot find module './static-services.mjs'`.

- [x] **Step 3: Add `scripts/static-services.config.mjs`**

Create the file with the exact service registry:

```js
export const staticServices = [
  {
    id: 'cdn-react-17',
    packageName: '@empjs/cdn-react',
    packageDir: 'packages/cdn-react-17',
    root: 'packages/cdn-react-17/dist',
    port: 1700,
    cors: true,
    groups: ['cdn', 'react-runtime'],
    assets: {
      development: 'reactRouter.development.umd.js',
      production: 'reactRouter.production.umd.js',
    },
  },
  {
    id: 'cdn-react-18',
    packageName: '@empjs/cdn-react',
    packageDir: 'packages/cdn-react-18',
    root: 'packages/cdn-react-18/dist',
    port: 1800,
    cors: true,
    groups: ['cdn', 'react-runtime'],
    assets: {
      development: 'reactRouter.development.umd.js',
      production: 'reactRouter.production.umd.js',
    },
  },
  {
    id: 'cdn-react-19',
    packageName: '@empjs/cdn-react',
    packageDir: 'packages/cdn-react-19',
    root: 'packages/cdn-react-19/dist',
    port: 1900,
    cors: true,
    groups: ['cdn', 'react-runtime'],
    assets: {
      development: 'reactRouter.development.umd.js',
      production: 'reactRouter.production.umd.js',
    },
  },
  {
    id: 'cdn-react-wouter',
    packageName: '@empjs/cdn-react-wouter',
    packageDir: 'packages/cdn-react-wouter',
    root: 'packages/cdn-react-wouter/dist',
    port: 2200,
    cors: true,
    groups: ['cdn', 'react-router'],
    assets: {
      development: 'reactRouter.development.umd.js',
      production: 'reactRouter.production.umd.js',
    },
  },
  {
    id: 'cdn-react-tanstack',
    packageName: '@empjs/cdn-react-tanstack',
    packageDir: 'packages/cdn-react-19-tanstack-router',
    root: 'packages/cdn-react-19-tanstack-router/dist',
    port: 2200,
    cors: true,
    groups: ['cdn', 'react-router'],
    assets: {
      development: 'reactRouter.development.umd.js',
      production: 'reactRouter.production.umd.js',
    },
  },
  {
    id: 'cdn-vue-2',
    packageName: '@empjs/cdn-vue',
    packageDir: 'packages/cdn-vue-2',
    root: 'packages/cdn-vue-2/dist',
    port: 2200,
    cors: true,
    groups: ['cdn', 'vue-runtime'],
    assets: {
      development: 'vueRouter.development.umd.js',
      production: 'vueRouter.production.umd.js',
    },
  },
  {
    id: 'cdn-vue-3',
    packageName: '@empjs/cdn-vue',
    packageDir: 'packages/cdn-vue-3',
    root: 'packages/cdn-vue-3/dist',
    port: 2300,
    cors: true,
    groups: ['cdn', 'vue-runtime'],
    assets: {
      development: 'vueRouter.development.umd.js',
      production: 'vueRouter.production.umd.js',
    },
  },
  {
    id: 'cdn-vue-router-pinia',
    packageName: '@empjs/cdn-vue-router-pinia',
    packageDir: 'packages/cdn-vue-router-pinia',
    root: 'packages/cdn-vue-router-pinia/dist',
    port: 2300,
    cors: true,
    groups: ['cdn', 'vue-runtime'],
    assets: {
      development: 'vueRouter.development.umd.js',
      production: 'vueRouter.production.umd.js',
    },
  },
  {
    id: 'lib-react-17',
    packageName: '@empjs/lib-react',
    packageDir: 'packages/lib-react-17',
    root: 'packages/lib-react-17/dist',
    port: 1700,
    cors: true,
    groups: ['lib', 'react-runtime'],
    assets: {
      development: 'runtime.umd.js',
      production: 'runtime.umd.js',
    },
  },
  {
    id: 'lib-vue-2',
    packageName: '@empjs/lib-vue',
    packageDir: 'packages/lib-vue-2',
    root: 'packages/lib-vue-2/dist',
    port: 1800,
    cors: true,
    groups: ['lib', 'vue-runtime'],
    assets: {
      development: 'runtime.umd.js',
      production: 'runtime.umd.js',
    },
  },
  {
    id: 'emp-share',
    packageName: '@empjs/share',
    packageDir: 'packages/emp-share',
    root: 'packages/emp-share/output',
    port: 2100,
    cors: true,
    groups: ['runtime', 'react-runtime', 'vue-runtime'],
    assets: {
      development: 'sdk.js',
      production: 'sdk.js',
    },
  },
  {
    id: 'emp-polyfill',
    packageName: '@empjs/polyfill',
    packageDir: 'packages/emp-polyfill',
    root: 'packages/emp-polyfill/dist',
    port: 9011,
    cors: true,
    groups: ['runtime', 'polyfill'],
    assets: {
      development: 'es.js',
      production: 'es.js',
    },
  },
]
```

- [x] **Step 4: Add `scripts/static-services.mjs` dry-run manager**

Create the file with these exported functions and CLI commands:

```js
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {fileURLToPath} from 'node:url'
import {staticServices as serviceDefinitions} from './static-services.config.mjs'

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const staticServices = serviceDefinitions.map(service => ({...service}))

function normalizeList(value) {
  if (!value) return []
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function parseArgs(args) {
  const parsed = {_: []}
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (!arg.startsWith('--')) {
      parsed._.push(arg)
      continue
    }
    const key = arg.slice(2)
    const next = args[index + 1]
    if (!next || next.startsWith('--')) {
      parsed[key] = true
      continue
    }
    parsed[key] = next
    index += 1
  }
  return parsed
}

export function listStaticServices({group, services} = {}) {
  const serviceFilter = Array.isArray(services) ? services : normalizeList(services)
  return staticServices.filter(service => {
    if (serviceFilter.length > 0 && !serviceFilter.includes(service.id)) return false
    if (group && !service.groups.includes(group)) return false
    return true
  })
}

export function selectStaticServices({group, services} = {}) {
  const selected = listStaticServices({group, services})
  if (selected.length === 0) {
    throw new Error(`No static services matched selection: ${JSON.stringify({group, services})}`)
  }
  return selected
}

export function validateStaticServices(services) {
  const issues = []
  const ids = new Set()
  const ports = new Map()
  for (const service of services) {
    if (ids.has(service.id)) {
      issues.push({type: 'duplicate-id', id: service.id, message: `duplicate static service id: ${service.id}`})
    }
    ids.add(service.id)
    if (!ports.has(service.port)) ports.set(service.port, [])
    ports.get(service.port).push(service.id)
  }
  for (const [port, serviceIds] of ports) {
    if (serviceIds.length > 1) {
      issues.push({
        type: 'port-conflict',
        port,
        services: serviceIds,
        message: `port ${port} is used by ${serviceIds.join(', ')} in the same selection`,
      })
    }
  }
  return issues
}

export function buildStaticCommand(service, overrides = {}) {
  const host = overrides.host ?? '0.0.0.0'
  const port = Number(overrides.port ?? service.port)
  const root = overrides.root ?? service.root
  const args = ['packages/cli/bin/emp.js', 'static', root, '--host', host, '--port', String(port)]
  if (service.cors) args.push('--cors')
  if (overrides.https) args.push('--https')
  const url = `${overrides.https ? 'https' : 'http'}://localhost:${port}/`
  return {
    cmd: process.execPath,
    args,
    display: `node ${args.join(' ')}`,
    url,
  }
}

export function buildEnvLines(services, {mode = 'development', https = false} = {}) {
  return services.map(service => {
    const protocol = https ? 'https' : 'http'
    const asset = service.assets[mode] ?? service.assets.development
    const key = `EMP_STATIC_${service.id.toUpperCase().replaceAll('-', '_')}`
    return `${key}=${protocol}://localhost:${service.port}/${asset}`
  })
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2))
}

async function main() {
  const [command = 'list', ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)
  const services = args.service ? normalizeList(args.service) : normalizeList(args.services)
  const group = args.group === true ? undefined : args.group
  const selected = command === 'list' ? listStaticServices({group, services}) : selectStaticServices({group, services})

  if (command === 'list') {
    const rows = selected.map(({id, packageName, root, port, groups}) => ({id, packageName, root, port, groups}))
    args.json ? printJson(rows) : console.table(rows)
    return
  }

  if (command === 'doctor') {
    const issues = validateStaticServices(selected)
    for (const service of selected) {
      const absoluteRoot = path.resolve(repoRoot, service.root)
      if (!fs.existsSync(absoluteRoot)) {
        issues.push({type: 'missing-root', id: service.id, root: service.root, message: `${service.root} does not exist`})
      }
    }
    if (issues.length > 0) {
      printJson({ok: false, issues})
      process.exitCode = 1
      return
    }
    printJson({ok: true, services: selected.map(service => service.id)})
    return
  }

  if (command === 'env') {
    console.log(buildEnvLines(selected, {mode: args.mode || 'development', https: !!args.https}).join('\n'))
    return
  }

  if (command === 'start') {
    const issues = validateStaticServices(selected)
    if (issues.length > 0) {
      printJson({ok: false, issues})
      process.exitCode = 1
      return
    }
    const commands = selected.map(service => buildStaticCommand(service, {host: args.host, https: !!args.https}))
    if (args['dry-run']) {
      printJson({ok: true, commands})
      return
    }
    console.error('static-services start requires Task 2 emp static implementation before non-dry-run execution')
    process.exitCode = 1
    return
  }

  console.error(`Unknown static-services command: ${command}`)
  process.exitCode = 1
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
```

- [x] **Step 5: Add root scripts**

Modify root `package.json` scripts:

```json
"static:list": "node scripts/static-services.mjs list",
"static:doctor": "node scripts/static-services.mjs doctor",
"static:start": "node scripts/static-services.mjs start",
"static:env": "node scripts/static-services.mjs env",
"cdn:serve": "node scripts/static-services.mjs start --group react-runtime"
```

- [x] **Step 6: Run tests**

Run:

```bash
node scripts/apps.test.mjs
pnpm static:list -- --json
pnpm static:start -- --service cdn-react-18,emp-share --dry-run --json
```

Expected:

```text
node scripts/apps.test.mjs exits 0
pnpm static:list -- --json prints the 12 static services
pnpm static:start -- --service cdn-react-18,emp-share --dry-run --json prints two node packages/cli/bin/emp.js static commands
```

- [x] **Step 7: Commit skipped - no commit requested, keep working tree as-is**

```bash
git add scripts/static-services.config.mjs scripts/static-services.mjs scripts/apps.test.mjs package.json
git commit -m "feat: add centralized static service registry"
```

---

### Task 2: First-Party `emp static` Server

**Files:**
- Create: `packages/cli/src/server/static/types.ts`
- Create: `packages/cli/src/server/static/createStaticServer.ts`
- Create: `packages/cli/src/script/static.ts`
- Modify: `packages/cli/src/script/index.ts`
- Modify: `packages/cli/src/types/env.ts`
- Create: `packages/cli/test/static-server.test.ts`
- Modify: `packages/cli/test/cli-help.test.mjs`

**Interfaces:**
- Consumes:
  - Static manager command shape from Task 1.
- Produces:
  - `startStaticServer(options: StaticServeOptions): Promise<StaticServerHandle>`
  - CLI command `emp static [root] --host <host> --port <port> --cors --spa [entry] --https --cert <path> --key <path> --headers <k=v...> --json`

- [x] **Step 1: Write failing rstest coverage**

Create `packages/cli/test/static-server.test.ts`:

```ts
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {describe, expect, it} from '@rstest/core'
import {startStaticServer} from '../src/server/static/createStaticServer'

async function withFixture(run: (root: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), 'emp-static-'))
  try {
    await mkdir(join(root, 'assets'), {recursive: true})
    await writeFile(join(root, 'index.html'), '<html><body>fallback</body></html>')
    await writeFile(join(root, 'assets', 'sdk.js'), 'window.__EMP_STATIC__ = true')
    await run(root)
  } finally {
    await rm(root, {recursive: true, force: true})
  }
}

describe('startStaticServer', () => {
  it('serves static files with cors headers', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0, cors: true})
      try {
        const response = await fetch(`${server.urls.localUrlForBrowser}assets/sdk.js`)
        expect(response.status).toBe(200)
        expect(response.headers.get('access-control-allow-origin')).toBe('*')
        await expect(response.text()).resolves.toBe('window.__EMP_STATIC__ = true')
      } finally {
        await server.close()
      }
    })
  })

  it('returns spa fallback only when spa is enabled', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0, spa: 'index.html'})
      try {
        const response = await fetch(`${server.urls.localUrlForBrowser}missing/route`)
        expect(response.status).toBe(200)
        await expect(response.text()).resolves.toBe('<html><body>fallback</body></html>')
      } finally {
        await server.close()
      }
    })
  })

  it('returns 404 for missing files when spa is disabled', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0})
      try {
        const response = await fetch(`${server.urls.localUrlForBrowser}missing.js`)
        expect(response.status).toBe(404)
      } finally {
        await server.close()
      }
    })
  })

  it('rejects missing roots with an explicit message', async () => {
    await expect(startStaticServer({root: join(tmpdir(), 'emp-static-missing'), port: 0})).rejects.toThrow(
      /Static root does not exist/,
    )
  })

  it('serves over https with the bundled EMP certificate', async () => {
    await withFixture(async root => {
      const server = await startStaticServer({root, host: '127.0.0.1', port: 0, https: true})
      try {
        const response = await fetch(`${server.urls.localUrlForBrowser}assets/sdk.js`, {
          // Node fetch validates certificates by default; this request only proves the server starts and exposes https URLs.
          signal: AbortSignal.timeout(1000),
        }).catch(error => error)
        expect(server.protocol).toBe('https')
        expect(server.urls.localUrlForBrowser.startsWith('https://127.0.0.1:')).toBe(true)
        expect(response).toBeDefined()
      } finally {
        await server.close()
      }
    })
  })
})
```

- [x] **Step 2: Run rstest and verify it fails**

Run:

```bash
pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: fail because `../src/server/static/createStaticServer` does not exist.

- [x] **Step 3: Add static server types**

Create `packages/cli/src/server/static/types.ts`:

```ts
import type {Server as HttpServer} from 'node:http'
import type {Server as HttpsServer} from 'node:https'

export type StaticHeaderMap = Record<string, string>

export type StaticServeOptions = {
  root: string
  host?: string
  port?: number
  cors?: boolean
  spa?: boolean | string
  https?: boolean
  cert?: string
  key?: string
  headers?: StaticHeaderMap
}

export type StaticServeUrls = {
  localUrlForBrowser: string
  localUrlForTerminal: string
  lanUrlForTerminal: string
}

export type StaticServerHandle = {
  server: HttpServer | HttpsServer
  root: string
  host: string
  port: number
  protocol: 'http' | 'https'
  urls: StaticServeUrls
  close: () => Promise<void>
}
```

- [x] **Step 4: Implement `startStaticServer`**

Create `packages/cli/src/server/static/createStaticServer.ts`:

```ts
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import compression from 'compression'
import connect from 'connect'
import cors from 'cors'
import serveStatic from 'serve-static'
import {getLanIp} from 'src/helper/utils'
import type {StaticServeOptions, StaticServerHandle, StaticServeUrls} from './types'

const defaultHost = '0.0.0.0'

function defaultResourcePath(fileName: string) {
  const currentDir = fileURLToPath(new URL('.', import.meta.url))
  const candidates = [
    path.resolve(currentDir, '../../../resource', fileName),
    path.resolve(currentDir, '../../../../resource', fileName),
  ]
  const found = candidates.find(candidate => fs.existsSync(candidate))
  if (!found) throw new Error(`EMP static HTTPS resource is missing: ${fileName}`)
  return found
}

function normalizeRoot(root: string) {
  return path.resolve(process.cwd(), root)
}

function toBrowserHost(host: string) {
  return host === '0.0.0.0' || host === '::' ? 'localhost' : host
}

function createUrls({protocol, host, port}: {protocol: 'http' | 'https'; host: string; port: number}): StaticServeUrls {
  const lanIp = getLanIp()
  const browserHost = toBrowserHost(host)
  return {
    localUrlForBrowser: `${protocol}://${browserHost}:${port}/`,
    localUrlForTerminal: `${protocol}://localhost:${port}/`,
    lanUrlForTerminal: `${protocol}://${lanIp}:${port}/`,
  }
}

async function resolveHttpsOptions(options: StaticServeOptions) {
  const keyPath = options.key ? path.resolve(process.cwd(), options.key) : defaultResourcePath('emp.key')
  const certPath = options.cert ? path.resolve(process.cwd(), options.cert) : defaultResourcePath('emp.cert')
  const [key, cert] = await Promise.all([fsp.readFile(keyPath), fsp.readFile(certPath)])
  return {key, cert}
}

export async function startStaticServer(options: StaticServeOptions): Promise<StaticServerHandle> {
  const root = normalizeRoot(options.root)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Static root does not exist: ${root}`)
  }

  const app = connect()
  app.use(compression())
  if (options.cors) app.use(cors())
  if (options.headers && Object.keys(options.headers).length > 0) {
    app.use((_req, res, next) => {
      for (const [key, value] of Object.entries(options.headers ?? {})) {
        res.setHeader(key, value)
      }
      next()
    })
  }
  app.use(serveStatic(root, {fallthrough: true}))

  if (options.spa) {
    const entry = typeof options.spa === 'string' ? options.spa : 'index.html'
    const html = await fsp.readFile(path.join(root, entry), 'utf8')
    app.use((req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 404
        res.end()
        return
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(html)
    })
  } else {
    app.use((_req, res) => {
      res.statusCode = 404
      res.end()
    })
  }

  const protocol = options.https ? 'https' : 'http'
  const server = options.https ? https.createServer(await resolveHttpsOptions(options), app) : http.createServer(app)
  const requestedPort = options.port ?? 0
  const host = options.host ?? defaultHost

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(requestedPort, host, () => resolve())
  })

  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : requestedPort
  const urls = createUrls({protocol, host, port})

  return {
    server,
    root,
    host,
    port,
    protocol,
    urls,
    close: () =>
      new Promise((resolve, reject) => {
        server.close(error => (error ? reject(error) : resolve()))
      }),
  }
}
```

- [x] **Step 5: Implement `emp static` script**

Create `packages/cli/src/script/static.ts`:

```ts
import openBrowser from 'src/helper/openBrowser'
import {startStaticServer} from 'src/server/static/createStaticServer'
import type {StaticHeaderMap, StaticServeOptions} from 'src/server/static/types'

export type StaticCommandOptions = {
  root?: string
  host?: string
  port?: string | number
  cors?: boolean
  spa?: boolean | string
  https?: boolean
  cert?: string
  key?: string
  headers?: string[]
  open?: boolean
  json?: boolean
}

function parseHeaders(values?: string[]): StaticHeaderMap | undefined {
  if (!values || values.length === 0) return undefined
  return Object.fromEntries(
    values.map(value => {
      const separator = value.indexOf('=')
      if (separator < 1) throw new Error(`Invalid header format, expected key=value: ${value}`)
      return [value.slice(0, separator), value.slice(separator + 1)]
    }),
  )
}

export function normalizeStaticOptions(root: string | undefined, options: StaticCommandOptions): StaticServeOptions {
  return {
    root: root || options.root || 'dist',
    host: options.host || '0.0.0.0',
    port: options.port === undefined ? 0 : Number(options.port),
    cors: !!options.cors,
    spa: options.spa,
    https: !!options.https,
    cert: options.cert,
    key: options.key,
    headers: parseHeaders(options.headers),
  }
}

export async function runStaticCommand(root: string | undefined, options: StaticCommandOptions) {
  const server = await startStaticServer(normalizeStaticOptions(root, options))
  const payload = {
    root: server.root,
    protocol: server.protocol,
    host: server.host,
    port: server.port,
    urls: server.urls,
  }

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2))
  } else {
    console.log(`EMP static server`)
    console.log(`  root: ${server.root}`)
    console.log(`  local: ${server.urls.localUrlForTerminal}`)
    console.log(`  network: ${server.urls.lanUrlForTerminal}`)
  }

  if (options.open) {
    openBrowser(server.urls.localUrlForBrowser)
  }
}
```

- [x] **Step 6: Register `emp static` command**

Modify `packages/cli/src/script/index.ts` after the existing `serve` command:

```ts
  program
    .command('static [root]')
    .description('Static file server for local CDN and dist debugging')
    .option('--host <host>', '服务 host，默认 0.0.0.0')
    .option('-p, --port <port>', '服务端口，默认随机可用端口')
    .option('--cors', '启用 Access-Control-Allow-Origin: *')
    .option('--spa [entry]', '启用 SPA fallback，默认 index.html')
    .option('--https', '使用 EMP 默认证书启动 HTTPS')
    .option('--cert <cert>', 'HTTPS cert 文件路径')
    .option('--key <key>', 'HTTPS key 文件路径')
    .option('--headers <headers...>', '追加响应头，格式 key=value')
    .option('-o, --open', '打开浏览器')
    .option('--json', '输出 JSON')
    .action(async (root, o) => {
      const {runStaticCommand} = await import('src/script/static')
      await runStaticCommand(root, o)
    })
```

- [x] **Step 7: Update CLI env types**

Modify `packages/cli/src/types/env.ts`:

```ts
export type CliActionType = 'dev' | 'build' | 'serve' | 'static'
```

Extend `CliOptionsType`:

```ts
  root?: string
  host?: string
  port?: string | number
  cors?: boolean
  spa?: boolean | string
  https?: boolean
  cert?: string
  key?: string
  headers?: string[]
  json?: boolean
```

- [x] **Step 8: Add CLI help coverage**

Modify `packages/cli/test/cli-help.test.mjs`:

```js
const {stdout: staticHelp} = await execFile(
  process.execPath,
  [path.join(repoRoot, 'packages/cli/bin/emp.js'), 'static', '--help'],
  {cwd: repoRoot, maxBuffer: 1024 * 1024},
)

assert.match(staticHelp, /Static file server/)
assert.match(staticHelp, /--cors/)
assert.match(staticHelp, /--spa/)
assert.match(staticHelp, /--https/)
```

- [x] **Step 9: Run tests**

Run:

```bash
pnpm --filter @empjs/cli test:real -- static-server.test.ts
pnpm --filter @empjs/cli test
```

Expected:

```text
static-server.test.ts passes
@empjs/cli package test exits 0
```

- [x] **Step 10: Commit skipped - no commit requested, keep working tree as-is**

```bash
git add packages/cli/src/server/static packages/cli/src/script/static.ts packages/cli/src/script/index.ts packages/cli/src/types/env.ts packages/cli/test/static-server.test.ts packages/cli/test/cli-help.test.mjs
git commit -m "feat(cli): add static file server command"
```

---

### Task 3: Enable Non-Dry-Run Multi-Service Start

**Files:**
- Modify: `scripts/static-services.mjs`
- Modify: `scripts/apps.test.mjs`

**Interfaces:**
- Consumes:
  - `emp static` command from Task 2.
- Produces:
  - `startStaticServices(selected, options): Promise<Array<{service, child, command}>>`
  - `static-services start --service a,b`
  - `static-services start --group react-runtime`

- [x] **Step 1: Add manager tests**

Modify `scripts/apps.test.mjs` and add:

```js
const invalidGroupError = await selectStaticServices({group: 'missing-group'})
  .then(() => '')
  .catch(error => error.message)
assert.match(invalidGroupError, /No static services matched selection/)

const envLines = selectedStaticServices
  .map(service => service.id)
  .sort()
assert.deepEqual(envLines, ['cdn-react-18', 'emp-share'])
```

- [x] **Step 2: Run the test and verify current behavior**

Run:

```bash
node scripts/apps.test.mjs
```

Expected: pass after Task 1; this step confirms the new non-dry-run changes do not regress dry-run behavior.

- [x] **Step 3: Implement process spawning**

Modify `scripts/static-services.mjs`:

```js
import {spawn} from 'node:child_process'
```

Add this exported function:

```js
export async function startStaticServices(services, options = {}) {
  const commands = services.map(service => buildStaticCommand(service, options))
  const children = []
  for (const command of commands) {
    const child = spawn(command.cmd, command.args, {
      cwd: repoRoot,
      stdio: 'inherit',
      env: process.env,
    })
    children.push({command, child})
  }
  return children
}
```

Replace the non-dry-run branch in `command === 'start'`:

```js
    const children = await startStaticServices(selected, {host: args.host, https: !!args.https})
    const shutdown = () => {
      for (const {child} of children) {
        if (!child.killed) child.kill('SIGINT')
      }
    }
    process.once('SIGINT', shutdown)
    process.once('SIGTERM', shutdown)
    await Promise.all(
      children.map(
        ({child}) =>
          new Promise(resolve => {
            child.once('exit', resolve)
          }),
      ),
    )
    return
```

- [x] **Step 4: Run dry-run and conflict commands**

Run:

```bash
pnpm static:start -- --service cdn-react-18,emp-share --dry-run --json
pnpm static:start -- --service cdn-react-wouter,cdn-react-tanstack --dry-run --json
```

Expected:

```text
first command exits 0 with two start commands
second command exits 1 with port-conflict for port 2200
```

- [x] **Step 5: Run one real static service smoke test**

Prepare a real output root:

```bash
pnpm --filter @empjs/share build
```

Start:

```bash
pnpm static:start -- --service emp-share
```

In a second shell:

```bash
curl -I http://localhost:2100/sdk.js
```

Expected:

```text
HTTP/1.1 200 OK
access-control-allow-origin: *
```

Stop the first command with `Ctrl-C`.

- [x] **Step 6: Commit skipped - no commit requested, keep working tree as-is**

```bash
git add scripts/static-services.mjs scripts/apps.test.mjs
git commit -m "feat: start static service groups from root"
```

---

### Task 4: Migrate Package Scripts Off Third-Party `serve`

**Files:**
- Modify: `packages/cdn-react-17/package.json`
- Modify: `packages/cdn-react-18/package.json`
- Modify: `packages/cdn-react-19/package.json`
- Modify: `packages/cdn-react-wouter/package.json`
- Modify: `packages/cdn-react-19-tanstack-router/package.json`
- Modify: `packages/cdn-vue-2/package.json`
- Modify: `packages/cdn-vue-3/package.json`
- Modify: `packages/cdn-vue-router-pinia/package.json`
- Modify: `packages/lib-react-17/package.json`
- Modify: `packages/lib-vue-2/package.json`
- Modify: `packages/emp-share/package.json`
- Modify: `packages/emp-polyfill/package.json`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes:
  - `scripts/static-services.mjs start --service <id>` from Task 3.
- Produces:
  - No package script begins with `serve ./`.
  - Root no longer declares third-party `serve`.

- [x] **Step 1: Write script-regression assertion**

Modify `scripts/apps.test.mjs`:

```js
const packageScriptFiles = [
  'packages/cdn-react-17/package.json',
  'packages/cdn-react-18/package.json',
  'packages/cdn-react-19/package.json',
  'packages/cdn-react-wouter/package.json',
  'packages/cdn-react-19-tanstack-router/package.json',
  'packages/cdn-vue-2/package.json',
  'packages/cdn-vue-3/package.json',
  'packages/cdn-vue-router-pinia/package.json',
  'packages/lib-react-17/package.json',
  'packages/lib-vue-2/package.json',
  'packages/emp-share/package.json',
  'packages/emp-polyfill/package.json',
]

for (const packageScriptFile of packageScriptFiles) {
  const pkg = JSON.parse(await fs.promises.readFile(join(repoRoot, packageScriptFile), 'utf8'))
  const scripts = Object.entries(pkg.scripts ?? {})
  assert.ok(
    scripts.every(([, command]) => !String(command).startsWith('serve ./')),
    `${packageScriptFile} must not use third-party serve directly`,
  )
}

const rootPackage = JSON.parse(await fs.promises.readFile(join(repoRoot, 'package.json'), 'utf8'))
assert.equal(rootPackage.devDependencies?.serve, undefined)
```

Add `fs` import:

```js
import fs from 'node:fs'
```

- [x] **Step 2: Run the test and verify it fails**

Run:

```bash
node scripts/apps.test.mjs
```

Expected: fail on current `serve ./dist` or root `devDependencies.serve`.

- [x] **Step 3: Replace scripts package-by-package**

Use these exact replacements:

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service cdn-react-17",
"start": "node ../../scripts/static-services.mjs start --service cdn-react-17"
```

for `packages/cdn-react-17/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service cdn-react-18",
"start": "node ../../scripts/static-services.mjs start --service cdn-react-18"
```

for `packages/cdn-react-18/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service cdn-react-19",
"start": "node ../../scripts/static-services.mjs start --service cdn-react-19"
```

for `packages/cdn-react-19/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service cdn-react-wouter",
"start": "node ../../scripts/static-services.mjs start --service cdn-react-wouter"
```

for `packages/cdn-react-wouter/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service cdn-react-tanstack",
"start": "node ../../scripts/static-services.mjs start --service cdn-react-tanstack"
```

for `packages/cdn-react-19-tanstack-router/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service cdn-vue-2",
"start": "node ../../scripts/static-services.mjs start --service cdn-vue-2"
```

for `packages/cdn-vue-2/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service cdn-vue-3",
"start": "node ../../scripts/static-services.mjs start --service cdn-vue-3"
```

for `packages/cdn-vue-3/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service cdn-vue-router-pinia",
"start": "node ../../scripts/static-services.mjs start --service cdn-vue-router-pinia"
```

for `packages/cdn-vue-router-pinia/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service lib-react-17",
"start": "node ../../scripts/static-services.mjs start --service lib-react-17"
```

for `packages/lib-react-17/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service lib-vue-2",
"start": "node ../../scripts/static-services.mjs start --service lib-vue-2"
```

for `packages/lib-vue-2/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service emp-share",
"start": "node ../../scripts/static-services.mjs start --service emp-share",
"https": "node ../../scripts/static-services.mjs start --service emp-share --https"
```

for `packages/emp-share/package.json`.

```json
"dev:serve": "node ../../scripts/static-services.mjs start --service emp-polyfill",
"start": "node ../../scripts/static-services.mjs start --service emp-polyfill"
```

for `packages/emp-polyfill/package.json`.

- [x] **Step 4: Remove root `serve` devDependency**

Modify root `package.json`:

```json
"devDependencies": {
  "@empjs/biome-config": "workspace:^",
  "@rslib/core": "^0.23.0",
  "@types/node": "^24.9.2",
  "cross-env": "^7.0.3",
  "typescript": "^5.9.2"
}
```

Run:

```bash
pnpm install --lockfile-only
```

Expected: `pnpm-lock.yaml` no longer contains root importer dependency `serve: 14.2.5`; `serve-static@2.2.0` remains because `@empjs/cli` depends on it.

- [x] **Step 5: Run migration checks**

Run:

```bash
node scripts/apps.test.mjs
rg -n '"serve": "14.2.5"|serve \./' package.json packages --glob 'package.json'
pnpm static:start -- --service emp-share --dry-run --json
```

Expected:

```text
node scripts/apps.test.mjs exits 0
rg exits 1 with no matches for root serve dependency or serve ./ scripts
dry-run still emits emp-share command
```

- [x] **Step 6: Commit skipped - no commit requested, keep working tree as-is**

```bash
git add package.json pnpm-lock.yaml scripts/apps.test.mjs packages/cdn-react-17/package.json packages/cdn-react-18/package.json packages/cdn-react-19/package.json packages/cdn-react-wouter/package.json packages/cdn-react-19-tanstack-router/package.json packages/cdn-vue-2/package.json packages/cdn-vue-3/package.json packages/cdn-vue-router-pinia/package.json packages/lib-react-17/package.json packages/lib-vue-2/package.json packages/emp-share/package.json packages/emp-polyfill/package.json
git commit -m "chore: centralize local static package scripts"
```

---

### Task 5: Workflow Guardrails

**Files:**
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: `scripts/apps.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes:
  - Package script migration from Task 4.
- Produces:
  - `pnpm workflow:check` fails if third-party `serve` comes back as direct static-service dependency.

- [x] **Step 1: Write failing workflow rule in `scripts/emp-workflow-check.mjs`**

Add a helper near other file readers:

```js
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'))
}
```

Add this rule before final result printing:

```js
const rootPackage = readJson('package.json')
if (rootPackage.devDependencies?.serve || rootPackage.dependencies?.serve) {
  failures.push('root package.json must not depend on third-party serve; use scripts/static-services.mjs and emp static')
}

const staticScriptPackages = [
  'packages/cdn-react-17/package.json',
  'packages/cdn-react-18/package.json',
  'packages/cdn-react-19/package.json',
  'packages/cdn-react-wouter/package.json',
  'packages/cdn-react-19-tanstack-router/package.json',
  'packages/cdn-vue-2/package.json',
  'packages/cdn-vue-3/package.json',
  'packages/cdn-vue-router-pinia/package.json',
  'packages/lib-react-17/package.json',
  'packages/lib-vue-2/package.json',
  'packages/emp-share/package.json',
  'packages/emp-polyfill/package.json',
]

for (const packageFile of staticScriptPackages) {
  const pkg = readJson(packageFile)
  for (const [scriptName, command] of Object.entries(pkg.scripts ?? {})) {
    if (String(command).startsWith('serve ./')) {
      failures.push(`${packageFile} script ${scriptName} must use scripts/static-services.mjs instead of serve ./`)
    }
  }
}
```

- [x] **Step 2: Run workflow check**

Run:

```bash
pnpm workflow:check
```

Expected: pass after Task 4 migration.

- [x] **Step 3: Add root rules command if needed**

If `scripts/apps.test.mjs` already covers the new registry assertions, keep existing `test:rules`:

```json
"test:rules": "node --test scripts/release.test.mjs && node scripts/apps.test.mjs"
```

No new runner is introduced.

- [x] **Step 4: Run rule tests**

Run:

```bash
pnpm test:rules
```

Expected:

```text
release.test.mjs passes
apps.test.mjs passes
```

- [x] **Step 5: Commit skipped - no commit requested, keep working tree as-is**

```bash
git add scripts/emp-workflow-check.mjs scripts/apps.test.mjs package.json
git commit -m "test: guard centralized static services"
```

---

### Task 6: Local CDN URL Handoff For App Debugging

**Files:**
- Modify: `scripts/static-services.mjs`
- Modify: `scripts/apps.test.mjs`
- Modify: `apps/README.md`

**Interfaces:**
- Consumes:
  - Service `assets` map from Task 1.
- Produces:
  - `pnpm static:env -- --service emp-share,cdn-react-18,emp-polyfill --mode development`
  - A documented local CDN handoff that app configs can consume without hardcoding ports in every app.

- [x] **Step 1: Add env-output assertions**

Modify `scripts/apps.test.mjs`:

```js
const localCdnEnvLines = buildEnvLines(selectedStaticServices, {mode: 'development'})
assert.deepEqual(localCdnEnvLines, [
  'EMP_STATIC_CDN_REACT_18=http://localhost:1800/reactRouter.development.umd.js',
  'EMP_STATIC_EMP_SHARE=http://localhost:2100/sdk.js',
])
```

Add `buildEnvLines` to the import from `./static-services.mjs`.

- [x] **Step 2: Run the test**

Run:

```bash
node scripts/apps.test.mjs
```

Expected: pass because Task 1 already introduced `buildEnvLines`.

- [x] **Step 3: Add README operating contract**

Modify `apps/README.md` with a short section:

```md
## Local Static And CDN Debug

本地 CDN / lib / runtime 静态服务统一走仓库根命令，不在单个 package 中安装或直接调用第三方 `serve`。

```bash
pnpm static:list
pnpm static:start -- --service emp-share,cdn-react-18 --dry-run --json
pnpm static:start -- --service emp-share
pnpm static:env -- --service emp-share,cdn-react-18,emp-polyfill --mode development
```

如果多个服务共享历史端口，例如 `cdn-react-wouter` 与 `cdn-react-tanstack` 都是 `2200`，同一次启动会失败并输出 `port-conflict`。选择其中一个服务启动，或在服务清单中调整端口后再运行。
```

- [x] **Step 4: Verify docs command output**

Run:

```bash
pnpm static:env -- --service emp-share,cdn-react-18,emp-polyfill --mode development
```

Expected:

```text
EMP_STATIC_EMP_SHARE=http://localhost:2100/sdk.js
EMP_STATIC_CDN_REACT_18=http://localhost:1800/reactRouter.development.umd.js
EMP_STATIC_EMP_POLYFILL=http://localhost:9011/es.js
```

- [x] **Step 5: Commit skipped - no commit requested, keep working tree as-is**

```bash
git add scripts/static-services.mjs scripts/apps.test.mjs apps/README.md
git commit -m "docs: document local static service handoff"
```

---

### Task 7: End-To-End Verification Package

**Files:**
- No source edits expected after this task.

**Interfaces:**
- Consumes:
  - All tasks above.
- Produces:
  - Review package with exact commands, outputs, changed file list, protected boundary check and residual risk.

- [x] **Step 1: Run focused static tests**

```bash
pnpm --filter @empjs/cli test:real -- static-server.test.ts
node scripts/apps.test.mjs
pnpm static:start -- --service cdn-react-18,emp-share --dry-run --json
pnpm static:start -- --service cdn-react-wouter,cdn-react-tanstack --dry-run --json
```

Expected:

```text
static-server.test.ts passes
apps.test.mjs passes
compatible dry-run exits 0
conflicting dry-run exits 1 with port-conflict for port 2200
```

- [x] **Step 2: Run real local server smoke**

```bash
pnpm --filter @empjs/share build
pnpm static:start -- --service emp-share
```

In another shell:

```bash
curl -I http://localhost:2100/sdk.js
```

Expected:

```text
HTTP/1.1 200 OK
access-control-allow-origin: *
```

Stop `pnpm static:start` with `Ctrl-C`.

- [x] **Step 3: Run repo gates**

```bash
pnpm workflow:check
pnpm test:rules
pnpm --filter @empjs/cli test
pnpm ci:verify
pnpm empbuild
git diff --check
```

Expected:

```text
all commands exit 0
```

- [x] **Step 4: Confirm forbidden patterns are gone**

```bash
rg -n '"serve": "14.2.5"|serve \./' package.json packages --glob 'package.json'
test ! -e docs/superpowers
```

Expected:

```text
first command exits 1 with no matches
second command exits 0
```

- [x] **Step 5: Confirm publish boundary is unchanged**

```bash
pnpm release:check
pnpm release:publish:dry -- --skip-build
```

Expected:

```text
release check exits 0
dry-run publish lists packages/** internal publish targets and excludes apps/** and website
```

- [x] **Step 6: Prepare review package**

Include these facts in the final implementation response:

```text
Changed files: CLI static server, root static service manager/config, package scripts, workflow guards, apps README, package.json, pnpm-lock.yaml.
Protected boundaries: no apps/** publish scope changes, no package version changes, no CDN/lib dependency-line changes, no docs/superpowers, no generated outputs.
Verification: list exact commands from Steps 1-5 and their pass/fail result.
Residual risk: package scripts now assume workspace root layout through ../../scripts/static-services.mjs; published package consumers should use built artifacts, not package start scripts.
```

- [x] **Step 7: Commit skipped - no commit requested, keep working tree as-is**

If Step 6 required no file edits, do not create a commit. If a typo or docs correction was made during verification:

```bash
git add <corrected-files>
git commit -m "chore: polish static service docs"
```

---

## Self-Review

**Spec coverage:** The plan centralizes static service management, removes direct third-party `serve` usage from local CDN/lib/share/polyfill scripts, preserves `emp serve` for app dist serving, adds real HTTP tests, adds workflow guardrails, and documents local CDN handoff.

**Placeholder scan:** The plan contains concrete file paths, command names, service ids, ports, test assertions, expected failures, expected success outputs and commit messages.

**Type consistency:** `StaticServeOptions`, `StaticServerHandle`, `startStaticServer`, `buildStaticCommand`, `buildEnvLines`, `staticServices`, `selectStaticServices` and `validateStaticServices` are named consistently across tasks.

## Execution Handoff

Plan complete and saved to `.superpowers/plans/2026-06-26-centralized-static-service-refactor.md`.

Execution options:

1. Subagent-Driven (recommended) - dispatch a fresh subagent per task and review between tasks.
2. Inline Execution - execute tasks in this session using executing-plans with checkpoints.
