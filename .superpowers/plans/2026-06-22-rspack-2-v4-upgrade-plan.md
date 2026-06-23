# EMP v4 Rspack 2 升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> Subagent dispatch must follow `.superpowers/subagents.md`; this plan's constraints below are binding additions for the EMP v4 / Rspack 2 migration.

**Goal:** 将 EMP 升级到 v4 大版本线，统一 Node `^20.19.0 || >=22.12.0` / pnpm 10 基线，迁移到 Rspack 2 和官方 Module Federation 2.x，同时保留 CJS 兼容出口。

**Architecture:** 先用 manifest 和 lockfile 迁移建立 v4 依赖基线，再在 `@empjs/share` 内部用薄 adapter 切换官方 Module Federation Rspack 插件。CLI 和 React 插件只做 Rspack 2 必需兼容修正，最后用核心包构建、示例构建、ESM/CJS 双入口验证收口。

**Tech Stack:** Node `^20.19.0 || >=22.12.0`, pnpm `10.x`, TypeScript, Rslib, Rspack 2, `@module-federation/rspack`, `@module-federation/runtime`, `@module-federation/sdk`.

## Global Constraints

- EMP v4 是这次迁移的大版本线。
- 开发环境和发布包 engines 统一要求 Node `^20.19.0 || >=22.12.0`。
- 根工程 pnpm 统一到 `10.x`。
- `@empjs/cli` 升级到 Rspack 2 兼容依赖。
- `@empjs/share` 移除 `@empjs/module-federation-rspack` fork 依赖。
- `@empjs/share` 迁移到官方 Module Federation 2.x Rspack 集成。
- 保持现有 `pluginRspackEmpShare(...)` 用户侧 API 不变。
- v4 保留 CJS 兼容出口。
- v4 不做全仓 ESM-only。
- 不重构整个 `@empjs/chain` API。
- 验证矩阵必须覆盖 package 声明、lockfile 和实际安装树，避免三者不一致。

## Subagent Dispatch Constraints

- 遵循 `.superpowers/subagents.md` 的项目级 subagent 调用规则。
- Codex 主控制器保留任务拆分、上下文裁剪、冲突裁决、review gate 和最终 Go / No-Go 判断。
- `gpt-5.4-mini` 只用于边界明确但需要代码理解的小型实现、局部 bugfix 和任务级审阅。
- `gpt-5.3-codex-spark` 只用于机械修改、检索、命令执行、文档同步和重复性验证。
- 不把架构裁决、跨包 API 取舍、依赖入口选择、ESM-only / CJS 兼容取舍、最终整体验收下放给轻量子 agent。
- 每个 subagent brief 必须写清模型、修改范围、验证命令、禁止项和遇到 API 选型或范围扩大时返回 `NEEDS_CONTEXT` 的停止条件。
- Reviewer 的 global constraints block 必须从本 plan 的 `Global Constraints` 和本节复制绑定要求，不从会话历史或临时总结推断。

---

## File Structure

**核心配置和版本文件**

- Modify: `package.json`  
  负责根 workspace 版本、`packageManager`、Node/pnpm engines。
- Modify: `packages/*/package.json`  
  负责主发布面 v4 版本、所有发布包 Node engines、Rspack 2 / Module Federation 2.x 依赖。
- Modify: `pnpm-lock.yaml`  
  由 `pnpm install --lockfile-only` 或 `pnpm install` 生成，负责锁定依赖树。

**`@empjs/share` 迁移文件**

- Modify: `packages/emp-share/src/helper/rspack.ts`  
  负责导出官方 Module Federation Rspack 插件。
- Create: `packages/emp-share/src/helper/resolvePackageExport.ts`  
  负责 Node 20.19+ / 22.12+ ESM package export 路径解析。
- Modify: `packages/emp-share/src/plugins/rspack/share.ts`  
  负责用解析 helper 替换 `forceRemotes` 的 `require.resolve('@empjs/share/forceRemote')`。
- Modify: `packages/emp-share/src/plugins/rspack/types.ts`  
  负责继续基于 `ModuleFederationPlugin` 推导 EMP share 插件类型。

**Rspack 2 兼容文件**

- Modify: `packages/plugin-react/src/index.ts`  
  负责 React refresh 插件路径解析在 Rspack 2 pure ESM 下仍可用。
- Modify: `packages/plugin-react/src/global.d.ts`  
  负责 `@rspack/plugin-react-refresh` 类型声明与 v2 导出兼容。
- Modify: `packages/cli/src/store/rspack/common.ts`  
  负责审计 Rspack 2 `experiments`、`resolve.tsConfig`、`lazyCompilation` 等配置。
- Modify: `packages/cli/src/store/rspack/plugin.ts`  
  负责审计 CSS minimizer、Rsdoctor、TsChecker、`EsmLibraryPlugin` 等插件兼容。
- Modify: `packages/cli/src/types/config.ts`  
  负责在依赖升级后保持相关类型可编译。

**验证和文档**

- Read: `.superpowers/specs/2026-06-22-rspack-2-v4-upgrade-design.md`  
  默认不修改；如果实现证明 spec 判断错误，暂停实施并先更新设计或计划。
- Create: no extra long-lived scripts.  
  所有计划里的 Node checks 默认用 inline `node <<'NODE'` 执行。

---

### Task 1: v4 版本和工具链基线

**Files:**
- Modify: `package.json`
- Modify: `packages/adapter-react/package.json`
- Modify: `packages/biome-config/package.json`
- Modify: `packages/bridge-react/package.json`
- Modify: `packages/bridge-vue2/package.json`
- Modify: `packages/bridge-vue3/package.json`
- Modify: `packages/cdn-react-17/package.json`
- Modify: `packages/cdn-react-18/package.json`
- Modify: `packages/cdn-react-19/package.json`
- Modify: `packages/cdn-react-19-tanstack-router/package.json`
- Modify: `packages/cdn-react-wouter/package.json`
- Modify: `packages/cdn-vue-2/package.json`
- Modify: `packages/cdn-vue-3/package.json`
- Modify: `packages/cdn-vue-router-pinia/package.json`
- Modify: `packages/cli/package.json`
- Modify: `packages/emp-chain/package.json`
- Modify: `packages/emp-polyfill/package.json`
- Modify: `packages/emp-share/package.json`
- Modify: `packages/eslint-config-react/package.json`
- Modify: `packages/lib-react-17/package.json`
- Modify: `packages/lib-vue-2/package.json`
- Modify: `packages/plugin-lightningcss/package.json`
- Modify: `packages/plugin-postcss/package.json`
- Modify: `packages/plugin-react/package.json`
- Modify: `packages/plugin-stylus/package.json`
- Modify: `packages/plugin-tailwindcss/package.json`
- Modify: `packages/plugin-tailwindcss2/package.json`
- Modify: `packages/plugin-tailwindcss3/package.json`
- Modify: `packages/plugin-vue2/package.json`
- Modify: `packages/plugin-vue3/package.json`

**Interfaces:**
- Consumes: approved spec `.superpowers/specs/2026-06-22-rspack-2-v4-upgrade-design.md`
- Produces: main release package manifests declare version `4.0.0`; CDN/lib variant packages keep their existing semantic versions; all `@empjs/*` package manifests declare Node engine `^20.19.0 || >=22.12.0`.

- [ ] **Step 1: Run the failing baseline check**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const path = require('node:path')

const root = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const packageFiles = fs
  .readdirSync('packages')
  .map(name => path.join('packages', name, 'package.json'))
  .filter(file => fs.existsSync(file))

const keepOwnVersionDirs = new Set([
  'packages/cdn-react-17/package.json',
  'packages/cdn-react-18/package.json',
  'packages/cdn-react-19/package.json',
  'packages/cdn-react-19-tanstack-router/package.json',
  'packages/cdn-react-wouter/package.json',
  'packages/cdn-vue-2/package.json',
  'packages/cdn-vue-3/package.json',
  'packages/cdn-vue-router-pinia/package.json',
  'packages/lib-react-17/package.json',
  'packages/lib-vue-2/package.json',
])

const failures = []

if (root.version !== '4.0.0') failures.push(`package.json version expected 4.0.0, got ${root.version}`)
if (root.packageManager !== 'pnpm@10.33.0') {
  failures.push(`package.json packageManager expected pnpm@10.33.0, got ${root.packageManager}`)
}
if (root.engines?.node !== '^20.19.0 || >=22.12.0') failures.push(`root node engine expected ^20.19.0 || >=22.12.0`)
if (root.engines?.pnpm !== '10.x') failures.push(`root pnpm engine expected 10.x`)

for (const file of packageFiles) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!pkg.name?.startsWith('@empjs/')) continue
  if (!keepOwnVersionDirs.has(file) && pkg.version !== '4.0.0') {
    failures.push(`${file} version expected 4.0.0, got ${pkg.version}`)
  }
  if (pkg.engines?.node !== '^20.19.0 || >=22.12.0') failures.push(`${file} node engine expected ^20.19.0 || >=22.12.0`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('v4 manifest baseline OK')
NODE
```

Expected: FAIL with current versions such as `@empjs/cli` `3.12.4` and root engine `>=18.0.0`. CDN and lib variant package versions are not expected to fail on version, only on Node engine if outdated.

- [ ] **Step 2: Apply the minimal manifest baseline update**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const path = require('node:path')

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

const root = readJson('package.json')
root.version = '4.0.0'
root.packageManager = 'pnpm@10.33.0'
root.engines = {...root.engines, node: '^20.19.0 || >=22.12.0', pnpm: '10.x'}
writeJson('package.json', root)

const keepOwnVersionDirs = new Set([
  'packages/cdn-react-17/package.json',
  'packages/cdn-react-18/package.json',
  'packages/cdn-react-19/package.json',
  'packages/cdn-react-19-tanstack-router/package.json',
  'packages/cdn-react-wouter/package.json',
  'packages/cdn-vue-2/package.json',
  'packages/cdn-vue-3/package.json',
  'packages/cdn-vue-router-pinia/package.json',
  'packages/lib-react-17/package.json',
  'packages/lib-vue-2/package.json',
])

for (const dir of fs.readdirSync('packages')) {
  const file = path.join('packages', dir, 'package.json')
  if (!fs.existsSync(file)) continue
  const pkg = readJson(file)
  if (!pkg.name?.startsWith('@empjs/')) continue
  if (!keepOwnVersionDirs.has(file)) pkg.version = '4.0.0'
  pkg.engines = {...pkg.engines, node: '^20.19.0 || >=22.12.0'}
  writeJson(file, pkg)
}
NODE
```

Expected: main release package manifests are rewritten with `version: "4.0.0"`; CDN/lib variant package versions are preserved; all `@empjs/*` package manifests get Node engine `^20.19.0 || >=22.12.0`.

- [ ] **Step 3: Run baseline check again**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const path = require('node:path')

const root = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const packageFiles = fs
  .readdirSync('packages')
  .map(name => path.join('packages', name, 'package.json'))
  .filter(file => fs.existsSync(file))

const keepOwnVersionDirs = new Set([
  'packages/cdn-react-17/package.json',
  'packages/cdn-react-18/package.json',
  'packages/cdn-react-19/package.json',
  'packages/cdn-react-19-tanstack-router/package.json',
  'packages/cdn-react-wouter/package.json',
  'packages/cdn-vue-2/package.json',
  'packages/cdn-vue-3/package.json',
  'packages/cdn-vue-router-pinia/package.json',
  'packages/lib-react-17/package.json',
  'packages/lib-vue-2/package.json',
])

const failures = []
if (root.version !== '4.0.0') failures.push(`package.json version expected 4.0.0, got ${root.version}`)
if (root.packageManager !== 'pnpm@10.33.0') failures.push(`package.json packageManager expected pnpm@10.33.0`)
if (root.engines?.node !== '^20.19.0 || >=22.12.0') failures.push(`root node engine expected ^20.19.0 || >=22.12.0`)
if (root.engines?.pnpm !== '10.x') failures.push(`root pnpm engine expected 10.x`)

for (const file of packageFiles) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!pkg.name?.startsWith('@empjs/')) continue
  if (!keepOwnVersionDirs.has(file) && pkg.version !== '4.0.0') {
    failures.push(`${file} version expected 4.0.0, got ${pkg.version}`)
  }
  if (pkg.engines?.node !== '^20.19.0 || >=22.12.0') failures.push(`${file} node engine expected ^20.19.0 || >=22.12.0`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('v4 manifest baseline OK')
NODE
```

Expected: PASS and prints `v4 manifest baseline OK`.

- [ ] **Step 4: Record duplicate package names for release awareness**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const path = require('node:path')
const byName = new Map()

for (const dir of fs.readdirSync('packages')) {
  const file = path.join('packages', dir, 'package.json')
  if (!fs.existsSync(file)) continue
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!pkg.name) continue
  const list = byName.get(pkg.name) || []
  list.push(file)
  byName.set(pkg.name, list)
}

for (const [name, files] of byName) {
  if (files.length > 1) console.log(`${name}: ${files.join(', ')}`)
}
NODE
```

Expected: prints known duplicate package-name groups, including `@empjs/cdn-react` and `@empjs/cdn-vue`. Do not block the code upgrade on this check; use it to avoid publishing duplicate package/version combinations blindly.

- [ ] **Step 5: Commit**

Run:

```bash
git add package.json packages/*/package.json
git commit -m "chore: align EMP v4 package baselines"
```

Expected: commit succeeds with only package manifest changes.

---

### Task 2: Rspack 2 和 Module Federation 2.x 依赖迁移

**Files:**
- Modify: `packages/cli/package.json`
- Modify: `packages/emp-share/package.json`
- Modify: `packages/plugin-react/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: Task 1 package manifest baseline.
- Produces: dependency graph where `@rspack/core` is 2.x, `@rspack/dev-server` is 2.x, `@rspack/plugin-react-refresh` is 2.x, and `@empjs/share` no longer depends on `@empjs/module-federation-rspack`.

- [ ] **Step 1: Run failing dependency declaration check**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')

const cli = JSON.parse(fs.readFileSync('packages/cli/package.json', 'utf8'))
const share = JSON.parse(fs.readFileSync('packages/emp-share/package.json', 'utf8'))
const react = JSON.parse(fs.readFileSync('packages/plugin-react/package.json', 'utf8'))
const failures = []

if (cli.dependencies['@rspack/core'] !== '^2.0.0') failures.push('@empjs/cli @rspack/core must be ^2.0.0')
if (cli.dependencies['@rspack/dev-server'] !== '^2.0.0') failures.push('@empjs/cli @rspack/dev-server must be ^2.0.0')
if (react.dependencies['@rspack/plugin-react-refresh'] !== '^2.0.0') {
  failures.push('@empjs/plugin-react @rspack/plugin-react-refresh must be ^2.0.0')
}
if ('@empjs/module-federation-rspack' in share.dependencies) {
  failures.push('@empjs/share must remove @empjs/module-federation-rspack')
}
if (share.dependencies['@module-federation/rspack'] !== '^2.5.1') {
  failures.push('@empjs/share @module-federation/rspack must be ^2.5.1')
}
if (share.dependencies['@module-federation/runtime'] !== '^2.5.1') {
  failures.push('@empjs/share @module-federation/runtime must be ^2.5.1')
}
if (share.dependencies['@module-federation/sdk'] !== '^2.5.1') {
  failures.push('@empjs/share @module-federation/sdk must be ^2.5.1')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('dependency declarations OK')
NODE
```

Expected: FAIL with current Rspack 1.x and fork dependency declarations.

- [ ] **Step 2: Update dependency declarations**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')

function update(file, change) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
  change(pkg)
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`)
}

update('packages/cli/package.json', pkg => {
  pkg.dependencies['@rspack/core'] = '^2.0.0'
  pkg.dependencies['@rspack/dev-server'] = '^2.0.0'
})

update('packages/plugin-react/package.json', pkg => {
  pkg.dependencies['@rspack/plugin-react-refresh'] = '^2.0.0'
})

update('packages/emp-share/package.json', pkg => {
  delete pkg.dependencies['@empjs/module-federation-rspack']
  pkg.dependencies['@module-federation/rspack'] = '^2.5.1'
  pkg.dependencies['@module-federation/runtime'] = '^2.5.1'
  pkg.dependencies['@module-federation/sdk'] = '^2.5.1'
})
NODE
```

Expected: only the three package manifests change.

- [ ] **Step 3: Refresh lockfile**

Run:

```bash
pnpm install --lockfile-only
```

Expected: `pnpm-lock.yaml` updates; no source files change.

- [ ] **Step 4: Verify declarations and installed tree**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const cli = JSON.parse(fs.readFileSync('packages/cli/package.json', 'utf8'))
const share = JSON.parse(fs.readFileSync('packages/emp-share/package.json', 'utf8'))
const react = JSON.parse(fs.readFileSync('packages/plugin-react/package.json', 'utf8'))
const failures = []
if (cli.dependencies['@rspack/core'] !== '^2.0.0') failures.push('@empjs/cli @rspack/core must be ^2.0.0')
if (cli.dependencies['@rspack/dev-server'] !== '^2.0.0') failures.push('@empjs/cli @rspack/dev-server must be ^2.0.0')
if (react.dependencies['@rspack/plugin-react-refresh'] !== '^2.0.0') failures.push('@empjs/plugin-react refresh must be ^2.0.0')
if ('@empjs/module-federation-rspack' in share.dependencies) failures.push('@empjs/share still has fork dependency')
if (share.dependencies['@module-federation/rspack'] !== '^2.5.1') failures.push('@module-federation/rspack must be ^2.5.1')
if (share.dependencies['@module-federation/runtime'] !== '^2.5.1') failures.push('@module-federation/runtime must be ^2.5.1')
if (share.dependencies['@module-federation/sdk'] !== '^2.5.1') failures.push('@module-federation/sdk must be ^2.5.1')
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('dependency declarations OK')
NODE

pnpm list @rspack/core @rspack/dev-server @rspack/plugin-react-refresh --depth 0 --filter @empjs/cli --filter @empjs/plugin-react
pnpm list @module-federation/rspack @module-federation/runtime @module-federation/sdk @empjs/module-federation-rspack --depth 0 --filter @empjs/share
```

Expected: declarations check passes; `pnpm list` shows Rspack 2.x and Module Federation 2.x; `@empjs/module-federation-rspack` is absent from `@empjs/share`.

- [ ] **Step 5: Commit**

Run:

```bash
git add packages/cli/package.json packages/emp-share/package.json packages/plugin-react/package.json pnpm-lock.yaml
git commit -m "chore: upgrade rspack and federation dependencies"
```

Expected: commit succeeds with dependency and lockfile changes.

---

### Task 3: `@empjs/share` 切换官方 Federation Rspack 插件

**Files:**
- Modify: `packages/emp-share/src/helper/rspack.ts`
- Create: `packages/emp-share/src/helper/resolvePackageExport.ts`
- Modify: `packages/emp-share/src/plugins/rspack/share.ts`
- Modify: `packages/emp-share/src/plugins/rspack/types.ts`

**Interfaces:**
- Consumes: Task 2 dependency graph with `@module-federation/rspack`.
- Produces:
  - `ModuleFederationPlugin` exported from `packages/emp-share/src/helper/rspack.ts`.
  - `resolvePackageExport(specifier: string): string` from `packages/emp-share/src/helper/resolvePackageExport.ts`.
  - `pluginRspackEmpShare(...)` external API unchanged.

- [ ] **Step 1: Write failing source assertions**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const rspack = fs.readFileSync('packages/emp-share/src/helper/rspack.ts', 'utf8')
const share = fs.readFileSync('packages/emp-share/src/plugins/rspack/share.ts', 'utf8')
const failures = []

if (!rspack.includes("from '@module-federation/rspack'")) {
  failures.push('rspack helper must import from @module-federation/rspack')
}
if (rspack.includes('@empjs/module-federation-rspack')) {
  failures.push('rspack helper must not reference @empjs/module-federation-rspack')
}
if (!fs.existsSync('packages/emp-share/src/helper/resolvePackageExport.ts')) {
  failures.push('resolvePackageExport helper must exist')
}
if (share.includes("require.resolve('@empjs/share/forceRemote')")) {
  failures.push('share plugin must not call require.resolve for @empjs/share/forceRemote directly')
}
if (!share.includes("resolvePackageExport('@empjs/share/forceRemote')")) {
  failures.push('share plugin must use resolvePackageExport for forceRemote')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('federation source assertions OK')
NODE
```

Expected: FAIL because current helper uses the fork and direct `require.resolve(...)`.

- [ ] **Step 2: Replace `packages/emp-share/src/helper/rspack.ts` content**

Edit `packages/emp-share/src/helper/rspack.ts` to exactly:

```ts
export {ModuleFederationPlugin} from '@module-federation/rspack'
```

Expected: `ModuleFederationPluginOptions = ConstructorParameters<typeof ModuleFederationPlugin>[0]` in `types.ts` still has a concrete source.

- [ ] **Step 3: Add `resolvePackageExport` helper**

Create `packages/emp-share/src/helper/resolvePackageExport.ts` with:

```ts
import {fileURLToPath} from 'node:url'

export function resolvePackageExport(specifier: string): string {
  const resolved = import.meta.resolve(specifier)
  return resolved.startsWith('file:') ? fileURLToPath(resolved) : resolved
}
```

Expected: helper has no package-specific logic and can resolve any package export.

- [ ] **Step 4: Use helper in `share.ts`**

Modify `packages/emp-share/src/plugins/rspack/share.ts`.

Add this import near the other helper imports:

```ts
import {resolvePackageExport} from 'src/helper/resolvePackageExport'
```

Replace:

```ts
op.runtimePlugins?.push(require.resolve('@empjs/share/forceRemote'))
```

with:

```ts
op.runtimePlugins ??= []
op.runtimePlugins.push(resolvePackageExport('@empjs/share/forceRemote'))
```

Expected: `forceRemotes` still pushes the same runtime plugin, but path resolution is ESM-compatible.

- [ ] **Step 5: Run source assertions again**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const rspack = fs.readFileSync('packages/emp-share/src/helper/rspack.ts', 'utf8')
const share = fs.readFileSync('packages/emp-share/src/plugins/rspack/share.ts', 'utf8')
const helper = fs.readFileSync('packages/emp-share/src/helper/resolvePackageExport.ts', 'utf8')
const failures = []
if (!rspack.includes("from '@module-federation/rspack'")) failures.push('rspack helper must import official plugin')
if (rspack.includes('@empjs/module-federation-rspack')) failures.push('fork reference remains')
if (!helper.includes('import.meta.resolve(specifier)')) failures.push('helper must use import.meta.resolve')
if (!helper.includes('fileURLToPath')) failures.push('helper must normalize file URLs')
if (share.includes("require.resolve('@empjs/share/forceRemote')")) failures.push('direct require.resolve remains')
if (!share.includes("resolvePackageExport('@empjs/share/forceRemote')")) failures.push('helper usage missing')
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('federation source assertions OK')
NODE
```

Expected: PASS and prints `federation source assertions OK`.

- [ ] **Step 6: Build `@empjs/share`**

Run:

```bash
pnpm --filter @empjs/share build
```

Expected: PASS.

If TypeScript fails only because `@module-federation/rspack` option types are narrower than current EMP options, replace `packages/emp-share/src/helper/rspack.ts` with this exact compatibility adapter and rerun the same build command:

```ts
import {ModuleFederationPlugin as OfficialModuleFederationPlugin} from '@module-federation/rspack'

export class ModuleFederationPlugin extends OfficialModuleFederationPlugin {
  constructor(options: any) {
    super(options)
  }
}
```

Expected after fallback: `ModuleFederationPluginOptions` remains available to `packages/emp-share/src/plugins/rspack/types.ts`, and `pnpm --filter @empjs/share build` exits 0.

- [ ] **Step 7: Commit**

Run:

```bash
git add packages/emp-share/src/helper/rspack.ts packages/emp-share/src/helper/resolvePackageExport.ts packages/emp-share/src/plugins/rspack/share.ts packages/emp-share/src/plugins/rspack/types.ts
git commit -m "feat(share): use official federation rspack plugin"
```

Expected: commit succeeds with only `@empjs/share` source changes.

---

### Task 4: Rspack 2 CLI 和 React 插件兼容修正

**Files:**
- Modify: `packages/plugin-react/src/index.ts`
- Modify: `packages/plugin-react/src/global.d.ts`
- Modify: `packages/cli/src/store/rspack/common.ts`
- Modify: `packages/cli/src/store/rspack/plugin.ts`
- Modify: `packages/cli/src/types/config.ts`

**Interfaces:**
- Consumes:
  - Task 2 Rspack 2 dependencies.
  - Task 3 official federation plugin.
- Produces:
  - React refresh plugin configured with Rspack 2 package export.
  - CLI config path continues to compile under Rspack 2.

- [ ] **Step 1: Run failing compatibility checks**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const react = fs.readFileSync('packages/plugin-react/src/index.ts', 'utf8')
const common = fs.readFileSync('packages/cli/src/store/rspack/common.ts', 'utf8')
const plugin = fs.readFileSync('packages/cli/src/store/rspack/plugin.ts', 'utf8')
const failures = []

if (react.includes("require.resolve('@rspack/plugin-react-refresh')")) {
  failures.push('plugin-react should not use direct require.resolve for @rspack/plugin-react-refresh')
}
if (!common.includes('resolve.tsConfig = tsConfigPath')) {
  failures.push('common.ts must keep Rspack 1+/2 tsConfig path behavior')
}
if (!plugin.includes('rspack.experiments.EsmLibraryPlugin')) {
  failures.push('plugin.ts must explicitly gate or preserve EsmLibraryPlugin behavior')
}
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('rspack compatibility source assertions OK')
NODE
```

Expected: FAIL on the current direct `require.resolve('@rspack/plugin-react-refresh')`.

- [ ] **Step 2: Update React refresh plugin resolution**

In `packages/plugin-react/src/index.ts`, add the Node URL import at the top:

```ts
import {fileURLToPath} from 'node:url'
```

Add this helper before the default export:

```ts
const resolvePackageExport = (specifier: string) => {
  const resolved = import.meta.resolve(specifier)
  return resolved.startsWith('file:') ? fileURLToPath(resolved) : resolved
}
```

Replace:

```ts
store.chain.plugin('plugin-react-refresh').use(require.resolve('@rspack/plugin-react-refresh'), [op])
```

with:

```ts
store.chain.plugin('plugin-react-refresh').use(resolvePackageExport('@rspack/plugin-react-refresh'), [op])
```

Expected: React refresh still passes a plugin path string to `@empjs/chain`, but resolution no longer depends on injected `require`.

- [ ] **Step 3: Verify React refresh type shim**

Open `packages/plugin-react/src/global.d.ts`.

Keep the current declaration if TypeScript accepts it:

```ts
declare module '@rspack/plugin-react-refresh' {
  export default any
}
```

If build fails because Rspack 2 exports named types only, replace with:

```ts
declare module '@rspack/plugin-react-refresh' {
  const pluginPath: string
  export default pluginPath
}
```

Expected: `pnpm --filter @empjs/plugin-react build` compiles.

- [ ] **Step 4: Gate optional Rspack experiment plugin**

In `packages/cli/src/store/rspack/plugin.ts`, replace the `esmLibraryPlugin()` body with:

```ts
  esmLibraryPlugin() {
    if (!this.store.empConfig.isESM) return
    const EsmLibraryPlugin = rspack.experiments?.EsmLibraryPlugin
    if (!EsmLibraryPlugin) return
    const src = path.resolve(this.store.root, 'src')
    this.store.chain.plugin('esmLibraryPlugin').use(EsmLibraryPlugin, [
      {
        preserveModules: src,
      },
    ])
    this.store.chain.optimization.merge({
      runtimeChunk: true,
    })
  }
```

Expected: Rspack 2 environments without `experiments.EsmLibraryPlugin` do not crash before build config generation.

- [ ] **Step 5: Build CLI and React plugin**

Run:

```bash
pnpm --filter @empjs/plugin-react build
pnpm --filter @empjs/cli build
```

Expected: both builds pass. If `@rsdoctor/rspack-plugin` fails because it is loaded with `require(...)` from ESM output, change `redoctor()` in `packages/cli/src/store/rspack/plugin.ts` to use dynamic import:

```ts
  async redoctor() {
    if (!this.store.empConfig.debug.rsdoctor) return
    const {RsdoctorRspackPlugin} = await import('@rsdoctor/rspack-plugin')
    let op: RsdoctorRspackPluginOptions = {}
    if (typeof this.store.empConfig.debug.rsdoctor === 'object') op = this.store.empConfig.debug.rsdoctor
    this.store.chain.plugin(this.store.chainName.plugin.rsdoctor).use(RsdoctorRspackPlugin, [op])
  }
```

If this fallback is used, also change the call site in `setup()` from `this.redoctor()` to `await this.redoctor()` inside the existing async setup flow.

- [ ] **Step 6: Run compatibility source assertions**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const react = fs.readFileSync('packages/plugin-react/src/index.ts', 'utf8')
const plugin = fs.readFileSync('packages/cli/src/store/rspack/plugin.ts', 'utf8')
const failures = []
if (react.includes("require.resolve('@rspack/plugin-react-refresh')")) failures.push('direct react refresh require.resolve remains')
if (!react.includes("resolvePackageExport('@rspack/plugin-react-refresh')")) failures.push('react refresh helper usage missing')
if (!plugin.includes('const EsmLibraryPlugin = rspack.experiments?.EsmLibraryPlugin')) {
  failures.push('EsmLibraryPlugin must be feature-gated')
}
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('rspack compatibility source assertions OK')
NODE
```

Expected: PASS and prints `rspack compatibility source assertions OK`.

- [ ] **Step 7: Commit**

Run:

```bash
git add packages/plugin-react/src/index.ts packages/plugin-react/src/global.d.ts packages/cli/src/store/rspack/common.ts packages/cli/src/store/rspack/plugin.ts packages/cli/src/types/config.ts
git commit -m "fix: adapt cli and react plugin for rspack 2"
```

Expected: commit succeeds with CLI/plugin source changes.

---

### Task 5: 核心包构建和 CJS 兼容验证

**Files:**
- Test: `packages/emp-chain/dist/index.js`
- Test: `packages/emp-chain/dist/index.cjs`
- Test: `packages/cli/dist/index.js`
- Test: `packages/cli/dist/index.cjs`
- Test: `packages/emp-share/dist/index.js`
- Test: `packages/emp-share/dist/index.cjs`
- Test: `packages/plugin-react/dist/index.js`
- Test: `packages/plugin-react/dist/index.cjs`
- No planned source modifications in this task.

**Interfaces:**
- Consumes: Tasks 1-4.
- Produces: built artifacts for `@empjs/chain`, `@empjs/cli`, `@empjs/share`, `@empjs/plugin-react`; both ESM import and CJS require compatibility remain available.

- [ ] **Step 1: Clean relevant package dist output**

Run:

```bash
rm -rf packages/emp-chain/dist packages/cli/dist packages/emp-share/dist packages/plugin-react/dist
```

Expected: old build artifacts are removed.

- [ ] **Step 2: Build core packages**

Run:

```bash
pnpm --filter @empjs/chain build
pnpm --filter @empjs/cli build
pnpm --filter @empjs/share build
pnpm --filter @empjs/plugin-react build
```

Expected: all commands exit 0.

- [ ] **Step 3: Verify ESM and CJS outputs exist**

Run:

```bash
node <<'NODE'
const fs = require('node:fs')
const required = [
  'packages/emp-chain/dist/index.js',
  'packages/emp-chain/dist/index.cjs',
  'packages/cli/dist/index.js',
  'packages/cli/dist/index.cjs',
  'packages/emp-share/dist/index.js',
  'packages/emp-share/dist/index.cjs',
  'packages/emp-share/dist/rspack.js',
  'packages/emp-share/dist/rspack.cjs',
  'packages/plugin-react/dist/index.js',
  'packages/plugin-react/dist/index.cjs',
]
const missing = required.filter(file => !fs.existsSync(file))
if (missing.length) {
  console.error(`Missing build artifacts:\n${missing.join('\n')}`)
  process.exit(1)
}
console.log('core build artifacts OK')
NODE
```

Expected: PASS and prints `core build artifacts OK`.

- [ ] **Step 4: Verify import and require compatibility**

Run:

```bash
node --input-type=module - <<'NODE'
const cli = await import('./packages/cli/dist/index.js')
const share = await import('./packages/emp-share/dist/index.js')
const react = await import('./packages/plugin-react/dist/index.js')
if (typeof cli.runScript !== 'function') throw new Error('cli.runScript missing')
if (!share.pluginRspackEmpShare && !share.default) throw new Error('share plugin export missing')
if (!react.default) throw new Error('plugin-react default export missing')
console.log('ESM imports OK')
NODE

node <<'NODE'
const cli = require('./packages/cli/dist/index.cjs')
const share = require('./packages/emp-share/dist/index.cjs')
const react = require('./packages/plugin-react/dist/index.cjs')
if (typeof cli.runScript !== 'function') throw new Error('cli.runScript missing')
if (!share.pluginRspackEmpShare && !share.default) throw new Error('share plugin export missing')
if (!react.default && typeof react !== 'function') throw new Error('plugin-react default export missing')
console.log('CJS requires OK')
NODE
```

Expected: both commands pass, proving v4 is ESM-first but not ESM-only.

- [ ] **Step 5: Commit**

Run:

```bash
git status --short
git add packages/emp-chain packages/cli packages/emp-share packages/plugin-react
git commit -m "test: verify core v4 build compatibility"
```

Expected: commit succeeds only if source or config files changed before this validation task. If this task only produced ignored `dist` files, skip the commit and record the build output in the task handoff.

---

### Task 6: Module Federation 示例构建验证

**Files:**
- Test: `projects/mf-host/emp.config.ts`
- Test: `projects/mf-app/emp.config.ts`
- Test: `projects/rtHost/emp.config.ts`
- Test: `projects/rtProvider/emp.config.ts`
- No planned project config modifications. Keep `pluginRspackEmpShare(...)` call sites unchanged.

**Interfaces:**
- Consumes:
  - `pluginRspackEmpShare(...)` unchanged from Task 3.
  - Rspack 2 CLI build compatibility from Task 5.
- Produces: successful builds for two representative Federation pairs.

- [ ] **Step 1: Build `mf-host`**

Run:

```bash
pnpm --filter mf-host build
```

Expected: PASS with exit code 0. If it fails on Module Federation option types, return to Task 3 Step 6 and apply the exact compatibility adapter there; do not change `projects/mf-host/emp.config.ts`.

- [ ] **Step 2: Build `mf-app`**

Run:

```bash
pnpm --filter mf-app build
```

Expected: PASS. Do not change the `pluginRspackEmpShare(...)` call signature in `projects/mf-app/emp.config.ts`.

- [ ] **Step 3: Build `projects/rtHost`**

Run:

```bash
pnpm --filter ./projects/rtHost build
```

Expected: PASS and `forceRemotes` path resolution does not throw.

- [ ] **Step 4: Build `projects/rtProvider`**

Run:

```bash
pnpm --filter ./projects/rtProvider build
```

Expected: PASS. The runtime plugin and external runtime injection remain compatible.

- [ ] **Step 5: Check generated manifests**

Run:

```bash
find projects -path '*/dist/*' \( -name 'emp.json' -o -name 'mf-manifest.json' \) -print
```

Expected: at least one manifest file is present for host/provider builds that enable `manifest: true`.

- [ ] **Step 6: Commit any required source fixes**

Run:

```bash
git status --short
git add packages/emp-share projects/mf-host/emp.config.ts projects/mf-app/emp.config.ts projects/rtHost/emp.config.ts projects/rtProvider/emp.config.ts
git commit -m "fix: validate federation examples on rspack 2"
```

Expected: commit only if source/config changes were required. If all examples pass without changes, skip commit and record the command results.

---

### Task 7: Final dependency and release-surface verification

**Files:**
- Read: `.superpowers/specs/2026-06-22-rspack-2-v4-upgrade-design.md`
- Read: `README.md`
- Read: `packages/cli/README.md`
- Read: `packages/emp-share/README.md`
- No planned documentation modifications. If implementation contradicts docs, stop and create a dedicated documentation task.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: final verified v4 migration state and updated docs only if the implementation differs from the spec.

- [ ] **Step 1: Verify toolchain**

Run:

```bash
node -v
pnpm -v
```

Expected: Node is `^20.19.0 || >=22.12.0`; pnpm is `10.x`.

- [ ] **Step 2: Verify dependency tree**

Run:

```bash
pnpm list @rspack/core @rspack/dev-server @rspack/plugin-react-refresh --depth 0 --filter @empjs/cli --filter @empjs/plugin-react
pnpm list @module-federation/rspack @module-federation/runtime @module-federation/sdk @empjs/module-federation-rspack --depth 0 --filter @empjs/share
```

Expected:

```text
@rspack/core 2.x
@rspack/dev-server 2.x
@rspack/plugin-react-refresh 2.x
@module-federation/rspack 2.x
@module-federation/runtime 2.x
@module-federation/sdk 2.x
```

`@empjs/module-federation-rspack` must not appear under `@empjs/share`.

- [ ] **Step 3: Verify no stale fork source reference remains**

Run:

```bash
rg -n "@empjs/module-federation-rspack|from '@empjs/module-federation-rspack'|require\\('@empjs/module-federation-rspack'\\)" packages pnpm-lock.yaml package.json
```

Expected: no matches.

- [ ] **Step 4: Run core build matrix**

Run:

```bash
pnpm --filter @empjs/chain build
pnpm --filter @empjs/cli build
pnpm --filter @empjs/share build
pnpm --filter @empjs/plugin-react build
```

Expected: all pass.

- [ ] **Step 5: Run example build matrix**

Run:

```bash
pnpm --filter mf-host build
pnpm --filter mf-app build
pnpm --filter ./projects/rtHost build
pnpm --filter ./projects/rtProvider build
```

Expected: all pass.

- [ ] **Step 6: Verify git diff scope**

Run:

```bash
git status --short
git diff --stat HEAD
```

Expected: no unexpected files.

- [ ] **Step 7: Confirm no documentation patch is pending**

Run:

```bash
git diff -- README.md packages/cli/README.md packages/emp-share/README.md .superpowers/specs/2026-06-22-rspack-2-v4-upgrade-design.md
```

Expected: no diff. If this command prints a diff, pause implementation and create a separate docs task before committing documentation changes.

---

## Self-Review

**Spec coverage:**  
The plan covers Node `^20.19.0 || >=22.12.0` and pnpm 10 baseline in Task 1, Rspack 2 dependency migration in Task 2, `@empjs/share` fork removal and official Federation plugin migration in Task 3, Rspack 2 source compatibility in Task 4, CJS compatibility in Task 5, representative Module Federation examples in Task 6, and final package/lockfile/install-tree verification in Task 7.

**Placeholder scan:**  
No placeholder markers or vague test instructions remain. Every task includes exact paths, commands, and expected results.

**Type consistency:**  
The produced helper `resolvePackageExport(specifier: string): string` is consumed by both `@empjs/share` and, locally in Task 4, `@empjs/plugin-react`. The `ModuleFederationPlugin` export remains the type source for `ModuleFederationPluginOptions` in `packages/emp-share/src/plugins/rspack/types.ts`.
