# Rspack 2.1 + TS7 Unified Tsconfig Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship one EMP `4.0.0-beta.1` line that upgrades Rspack to `2.1.0`, adopts the latest available TypeScript 7 toolchain, and minimizes tracked tsconfig files by routing package and app configs through shared baselines.

**Architecture:** Treat this as a toolchain migration, not only a dependency bump. Rspack remains the TS/TSX transpilation path through `builtin:swc-loader`; TypeScript 7 is introduced for `tsc`/`tsserver` through `typescript@7.0.1-rc` and for native `tsgo` preflight through `@typescript/native-preview@7.0.0-dev.20260624.1`. Package tsconfigs converge on a minimal shared base plus explicit Rslib bundler / NodeNext build baselines, published app tsconfigs converge on `@empjs/cli/tsconfig/react` or `@empjs/cli/tsconfig/vue`, and per-project configs keep only include roots plus real aliases or plugins that cannot be inherited.

**Tech Stack:** Node `^20.19.0 || >=22.12.0`, `corepack pnpm@10.33.0`, Rspack `2.1.0`, `typescript@7.0.1-rc`, `@typescript/native-preview@7.0.0-dev.20260624.1`, `ts-checker-rspack-plugin@1.5.1`, Rslib `0.23.0`, Module Federation `2.6.0`, Rstest.

## Global Constraints

- 沟通、进度同步和最终交付默认使用中文。
- 当前分支必须保持 `v4`，开始执行前确认 `git status --short --branch` 是 `## v4...origin/v4` 或只包含本计划产生的变更。
- 计划和执行记录统一放在 `.superpowers/`；不要创建或继续使用 `docs/superpowers/`。
- 跨文件代码发现先使用 CodeGraph：执行 `codegraph sync .`，再执行 `codegraph status .`。配置、字符串、JSONC、package 元数据可用 `rg` / Node 脚本 fallback，并在报告中说明。
- 统一使用 `corepack pnpm ...`；不要用裸 `pnpm`，本机裸 `pnpm` 可能不是仓库要求的 `10.x`。
- `TS7 最新版` 在本计划中固定为两条线：`typescript@7.0.1-rc` 提供 `tsc`，`@typescript/native-preview@7.0.0-dev.20260624.1` 提供 `tsgo`。执行当天必须重新运行 `npm view`，如果 registry 出现更新，使用当天最新 TS7 prerelease/native-preview 版本并同步更新本计划里的期望值。
- 不使用 `pnpm.overrides`、`packageExtensions` 或 `peerDependencyRules.ignoreMissing` 静默掩盖 Rslib / Module Federation / Vue / ESLint 的 TS7 peer 风险。安装产生的 peer warning 必须记录在 changelog Known Issues，除非对应上游已发布 TS7-compatible peer。
- Rslib 和 Module Federation 的声明生成工具当前会在运行时加载 TypeScript Compiler API，且还不兼容 TS7 package exports；本次采用 pnpm patch 显式重定向到各自 peer 支持的 compatibility alias：`typescript-rslib@npm:typescript@6.0.3` 和 `typescript-mf@npm:typescript@5.9.3`。这不是 TS7 peer suppression，根 `typescript` 仍保持 `7.0.1-rc`，且风险必须写入 changelog Known Issues。
- tsconfig 迁移必须移除所有 tracked tsconfig 里的 `compilerOptions.baseUrl`，并移除 `moduleResolution: "node"` / `"node10"`。如果某个文件无法迁移，必须在同一任务中写出保留原因和验证证据。
- tsconfig 最小化原则：能继承就继承；package configs 默认继承 `../tsconfig.rslib-bundler.json`，确实需要 NodeNext 语义的包继承 `../tsconfig.rslib-nodenext.json`；apps 默认继承 `@empjs/cli/tsconfig/react` 或 `@empjs/cli/tsconfig/vue`；子配置只保留 `compilerOptions.paths` 中真实需要的别名、`types`、`plugins`、`include` 或构建输出字段。
- TypeScript `paths` 不会深度合并；任何子配置只要声明自己的 `paths`，就必须显式保留所需的默认映射，例如 `src/*` 和 `* -> @mf-types/*`。
- 发布范围限定为 `corepack pnpm release:check` 报告的 19 个内部 `@empjs/*` 包；不得发布 `apps/**`、`website`、`@empjs/cdn-*`、`@empjs/lib-*`。
- `packages/cdn-*` 和 `packages/lib-*` 可以做 TS7 tsconfig 兼容迁移，但不得改版本线、发布配置或依赖线，除非验证证明构建必须改。
- 真实 publish 前必须通过：`corepack pnpm workflow:check`、`corepack pnpm ci:verify`、`corepack pnpm empbuild`、`corepack pnpm apps:acceptance`、`corepack pnpm release:publish:dry -- --force-all`、`git diff --check`。

---

## File Structure

- Modify: `package.json` — add TS7 / tsgo scripts and update root TypeScript toolchain devDependencies.
- Modify: `packages/cli/package.json` — upgrade Rspack direct deps and `ts-checker-rspack-plugin`.
- Modify: `pnpm-lock.yaml` — resolve Rspack 2.1, TS7 RC, native-preview, checker plugin, and peer graph.
- Modify: `pnpm-workspace.yaml` and `patches/*` — pin explicit TypeScript compatibility patches for declaration tooling that does not yet support TS7 package exports.
- Modify: `packages/tsconfig.base.json` — package common baseline, TS7-compatible, no `baseUrl`, no paths, no output fields.
- Create: `packages/tsconfig.rslib-bundler.json` — Rslib package build baseline with bundler resolution.
- Create: `packages/tsconfig.rslib-nodenext.json` — package build baseline for packages that require NodeNext.
- Modify: `packages/cli/tsconfig/base.json` — published app baseline, TS7-compatible, no `baseUrl`, no default CSS Modules plugin, with default `src/*` and `@mf-types` mappings.
- Modify: `packages/cli/tsconfig/react.json`, `packages/cli/tsconfig/vue.json` — keep only framework-specific `types` / `jsx`.
- Modify: tracked `packages/**/tsconfig.json` and `apps/**/tsconfig.json` — minimize configs and align extends.
- Create: `scripts/tsconfig-modernize.mjs` — deterministic JSONC-aware tsconfig normalizer for this migration.
- Create: `scripts/tsconfig.rules.test.ts` — regression rules for no `baseUrl`, no node/node10 resolution, and unified extends.
- Create: `scripts/toolchain.rules.test.ts` — regression rules for Rspack 2.1 + TS7 package versions and scripts.
- Modify: `package.json` scripts — add `test:tsconfig`, `test:toolchain`, `test:ts7`, and `test:tsgo`; wire lightweight rules into `ci:verify`.
- Modify: `packages/cli/src/store/index.ts` — add portable type annotation for `public rspack`.
- Modify: `packages/cli/src/types/config.ts` and `packages/cli/test/rspack2-features-shape.test.mjs` — expose and verify Rspack 2.1 options such as `experiments.runtimeMode`.
- Modify: `packages/plugin-react/src/types.ts`, `packages/plugin-react/src/index.ts`, `packages/plugin-react/test/react-refresh-plugin.test.mjs` — expose React Compiler SWC config path.
- Modify: `CHANGELOG.md` — add beta.1 entry with Rspack 2.1, TS7/tsgo, tsconfig unification, validation, and Known Issues.
- Do not modify: `.github/workflows/publish.yml` unless release dry-run proves workflow input routing is broken.

---

### Task 1: Add Toolchain Rule Tests Before Dependency Changes

**Files:**
- Create: `scripts/toolchain.rules.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: root `package.json`, `packages/cli/package.json`.
- Produces: `corepack pnpm test:toolchain` failing until dependencies are upgraded.

- [x] **Step 1: Write the failing toolchain rule test**

Create `scripts/toolchain.rules.test.ts`:

```typescript
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {describe, expect, test} from '@rstest/core'

const repoRoot = process.cwd()
const readJson = (file: string) => JSON.parse(readFileSync(join(repoRoot, file), 'utf8'))

describe('toolchain version contract', () => {
  test('root pins TypeScript 7 rc and native tsgo preview', () => {
    const pkg = readJson('package.json')
    expect(pkg.devDependencies.typescript).toBe('7.0.1-rc')
    expect(pkg.devDependencies['@typescript/native-preview']).toBe('7.0.0-dev.20260624.1')
    expect(pkg.scripts['test:ts7']).toBe('corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/cli/tsconfig.json')
    expect(pkg.scripts['test:tsgo']).toBe('corepack pnpm dlx --package @typescript/native-preview@7.0.0-dev.20260624.1 tsgo --noEmit --pretty false --project packages/cli/tsconfig.json')
  })

  test('cli depends on Rspack 2.1 and TS7-aware checker', () => {
    const cliPkg = readJson('packages/cli/package.json')
    expect(cliPkg.dependencies['@rspack/core']).toBe('^2.1.0')
    expect(cliPkg.dependencies['@rspack/dev-server']).toBe('^2.1.0')
    expect(cliPkg.dependencies['@swc/helpers']).toBe('^0.5.23')
    expect(cliPkg.dependencies['ts-checker-rspack-plugin']).toBe('^1.5.1')
  })
})
```

- [x] **Step 2: Add the script entry**

Update root `package.json` scripts:

```json
{
  "scripts": {
    "test:toolchain": "rstest run --config rstest.config.ts scripts/toolchain.rules.test.ts"
  }
}
```

- [x] **Step 3: Verify RED**

Run:

```bash
corepack pnpm test:toolchain
```

Expected:

```text
FAIL scripts/toolchain.rules.test.ts
Expected root TypeScript / native-preview / Rspack dependency assertions to fail because the repository still uses TypeScript 5.9.3 and @rspack/core ^2.0.0.
```

---

### Task 2: Add Tsconfig Rule Tests Before Config Migration

**Files:**
- Create: `scripts/tsconfig.rules.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: all tracked `tsconfig*.json` files from `git ls-files`.
- Produces: `corepack pnpm test:tsconfig` failing until tsconfig migration removes `baseUrl`, removes node/node10 resolution, and aligns extends.

- [x] **Step 1: Write the failing tsconfig rules**

Create `scripts/tsconfig.rules.test.ts`:

```typescript
import {execFileSync} from 'node:child_process'
import {readFileSync} from 'node:fs'
import {describe, expect, test} from '@rstest/core'
import ts from 'typescript'

const trackedTsconfigs = execFileSync('git', ['ls-files'], {encoding: 'utf8'})
  .trim()
  .split('\n')
  .filter(file => /(^|\/)tsconfig[^/]*\.json$/.test(file))

const readTsconfig = (file: string) => {
  const text = readFileSync(file, 'utf8')
  const parsed = ts.parseConfigFileTextToJson(file, text)
  if (parsed.error) {
    throw new Error(`${file}: ${ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n')}`)
  }
  return parsed.config ?? {}
}

describe('TS7-compatible tsconfig contract', () => {
  test('tracked tsconfigs do not use removed TypeScript 7 options', () => {
    const offenders: string[] = []
    for (const file of trackedTsconfigs) {
      const config = readTsconfig(file)
      const compilerOptions = config.compilerOptions ?? {}
      if ('baseUrl' in compilerOptions) offenders.push(`${file}:baseUrl`)
      if (['node', 'node10'].includes(String(compilerOptions.moduleResolution).toLowerCase())) {
        offenders.push(`${file}:moduleResolution=${compilerOptions.moduleResolution}`)
      }
    }
    expect(offenders).toEqual([])
  })

  test('package and app tsconfigs inherit the shared baselines', () => {
    const offenders: string[] = []
    for (const file of trackedTsconfigs) {
      if (file === 'packages/tsconfig.base.json') continue
      const config = readTsconfig(file)
      if (file.startsWith('packages/') && file.endsWith('/tsconfig.json') && !file.includes('/cli/')) {
        if (!['../tsconfig.rslib-bundler.json', '../tsconfig.rslib-nodenext.json'].includes(config.extends)) {
          offenders.push(`${file}:extends=${config.extends}`)
        }
      }
      if (file.startsWith('apps/') && file.endsWith('/tsconfig.json')) {
        if (!['@empjs/cli/tsconfig/react', '@empjs/cli/tsconfig/vue'].includes(config.extends)) {
          offenders.push(`${file}:extends=${config.extends}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  test('app tsconfigs with custom paths keep inherited defaults explicitly', () => {
    const offenders: string[] = []
    for (const file of trackedTsconfigs.filter(file => file.startsWith('apps/'))) {
      const config = readTsconfig(file)
      const paths = config.compilerOptions?.paths
      if (!paths) continue
      if (!paths['src/*']) offenders.push(`${file}:missing src/*`)
      if (!paths['*']) offenders.push(`${file}:missing @mf-types fallback`)
    }
    expect(offenders).toEqual([])
  })
})
```

- [x] **Step 2: Add the script entry**

Update root `package.json` scripts:

```json
{
  "scripts": {
    "test:tsconfig": "rstest run --config rstest.config.ts scripts/tsconfig.rules.test.ts"
  }
}
```

- [x] **Step 3: Verify RED**

Run:

```bash
corepack pnpm test:tsconfig
```

Expected:

```text
FAIL scripts/tsconfig.rules.test.ts
The failure lists current baseUrl and moduleResolution=node offenders, including packages/cli, packages/plugin-react, packages/emp-share, and multiple apps.
```

---

### Task 3: Upgrade Dependencies to Rspack 2.1 + Latest TS7 Toolchain

**Files:**
- Modify: `package.json`
- Modify: `packages/cli/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: registry facts from `npm view`.
- Produces: installed toolchain with `@rspack/core@2.1.0`, `@rspack/dev-server@2.1.0`, `typescript@7.0.1-rc`, `@typescript/native-preview@7.0.0-dev.20260624.1`, `ts-checker-rspack-plugin@1.5.1`.

- [x] **Step 1: Reconfirm registry immediately before install**

Run:

```bash
npm view typescript@rc version bin --json
npm view @typescript/native-preview version bin --json
npm view @rspack/core version dependencies peerDependencies engines --json
npm view @rspack/dev-server version dependencies peerDependencies --json
npm view ts-checker-rspack-plugin version dependencies peerDependencies --json
npm view @rslib/core version peerDependencies --json
npm view @module-federation/rspack version peerDependencies --json
```

Expected on 2026-06-26:

```text
typescript@rc -> 7.0.1-rc
@typescript/native-preview -> 7.0.0-dev.20260624.1
@rspack/core -> 2.1.0
@rspack/dev-server -> 2.1.0
ts-checker-rspack-plugin -> 1.5.1, peer includes @typescript/native-preview ^7.0.0-0
@rslib/core still peers typescript ^5 || ^6
@module-federation/rspack still peers typescript ^4.9.0 || ^5.0.0
```

- [x] **Step 2: Install the explicit toolchain**

Run:

```bash
corepack pnpm add -D typescript@7.0.1-rc @typescript/native-preview@7.0.0-dev.20260624.1
corepack pnpm --filter @empjs/cli add @rspack/core@^2.1.0 @rspack/dev-server@^2.1.0 @swc/helpers@^0.5.23 ts-checker-rspack-plugin@^1.5.1
```

Expected:

```text
pnpm-lock.yaml changes from typescript@5.9.3 to typescript@7.0.1-rc for the root graph.
Peer warnings for @rslib/core and @module-federation/rspack are visible if their peer ranges have not yet added TS7.
No pnpm overrides or peer suppression is added.
```

- [x] **Step 3: Verify GREEN for toolchain rules**

Run:

```bash
corepack pnpm test:toolchain
corepack pnpm list typescript @typescript/native-preview @rspack/core @rspack/dev-server ts-checker-rspack-plugin --depth 0 --recursive
```

Expected:

```text
test:toolchain passes.
@empjs/cli resolves @rspack/core 2.1.0, @rspack/dev-server 2.1.0, ts-checker-rspack-plugin 1.5.1.
Root resolves typescript 7.0.1-rc and @typescript/native-preview 7.0.0-dev.20260624.1.
```

---

### Task 4: Modernize and Minimize Tsconfig Baselines

**Files:**
- Modify: `packages/tsconfig.base.json`
- Create: `packages/tsconfig.rslib-bundler.json`
- Create: `packages/tsconfig.rslib-nodenext.json`
- Modify: `packages/cli/tsconfig/base.json`
- Modify: `packages/cli/tsconfig/react.json`
- Modify: `packages/cli/tsconfig/vue.json`
- Create: `scripts/tsconfig-modernize.mjs`
- Modify: tracked `packages/**/tsconfig.json`
- Modify: tracked `apps/**/tsconfig.json`

**Interfaces:**
- Consumes: `scripts/tsconfig.rules.test.ts` failing offender list.
- Produces: all tracked tsconfig files are TS7-compatible and inherit shared baselines wherever possible.

- [x] **Step 1: Update the package baselines**

`packages/tsconfig.base.json` must become a common baseline with no path or output fields:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "useUnknownInCatchVariables": false,
    "resolveJsonModule": true
  }
}
```

Create `packages/tsconfig.rslib-bundler.json`:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "declaration": true,
    "emitDeclarationOnly": true
  }
}
```

Create `packages/tsconfig.rslib-nodenext.json`:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "emitDeclarationOnly": true
  }
}
```

- [x] **Step 2: Update the published app baseline**

`packages/cli/tsconfig/base.json` must keep only app defaults and no `baseUrl`:

```json
{
  "compilerOptions": {
    "paths": {
      "src/*": ["./src/*"],
      "*": ["./@mf-types/*"]
    },
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": false,
    "noEmit": false,
    "sourceMap": true,
    "jsx": "preserve",
    "verbatimModuleSyntax": true
  }
}
```

`react.json` remains:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "types": ["@empjs/cli/types/react"],
    "jsx": "react-jsx"
  }
}
```

`vue.json` remains:

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "types": ["@empjs/cli/types/vue"]
  }
}
```

- [x] **Step 3: Create the migration script**

Create `scripts/tsconfig-modernize.mjs` with these deterministic rules:

```javascript
import {execFileSync} from 'node:child_process'
import {readFileSync, writeFileSync} from 'node:fs'
import ts from 'typescript'

const files = execFileSync('git', ['ls-files'], {encoding: 'utf8'})
  .trim()
  .split('\n')
  .filter(file => /(^|\/)tsconfig[^/]*\.json$/.test(file))
  .filter(file => file !== 'packages/tsconfig.base.json')

const appExtends = file => (file.includes('vue') ? '@empjs/cli/tsconfig/vue' : '@empjs/cli/tsconfig/react')
const isPackageTsconfig = file => file.startsWith('packages/') && file.endsWith('/tsconfig.json')
const isAppTsconfig = file => file.startsWith('apps/') && file.endsWith('/tsconfig.json')
const usesNodeNext = file => file.includes('/plugin-tailwindcss')

for (const file of files) {
  const parsed = ts.parseConfigFileTextToJson(file, readFileSync(file, 'utf8'))
  if (parsed.error) {
    throw new Error(`${file}: ${ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n')}`)
  }
  const config = parsed.config ?? {}
  const compilerOptions = {...(config.compilerOptions ?? {})}
  delete compilerOptions.baseUrl
  if (['node', 'node10'].includes(String(compilerOptions.moduleResolution).toLowerCase())) {
    compilerOptions.moduleResolution = 'Bundler'
  }
  if (isPackageTsconfig(file) && file !== 'packages/cli/tsconfig.json') {
    config.extends = usesNodeNext(file) ? '../tsconfig.rslib-nodenext.json' : '../tsconfig.rslib-bundler.json'
  }
  if (isAppTsconfig(file)) {
    config.extends = appExtends(file)
  }
  if (compilerOptions.paths && isAppTsconfig(file)) {
    for (const [key, value] of Object.entries(compilerOptions.paths)) {
      compilerOptions.paths[key] = value.map(item => item.startsWith('./') ? item : `./${item}`)
    }
    compilerOptions.paths = {
      'src/*': compilerOptions.paths['src/*'] ?? ['./src/*'],
      '*': compilerOptions.paths['*'] ?? ['./@mf-types/*'],
      ...compilerOptions.paths,
    }
  }
  config.compilerOptions = compilerOptions
  const next = `${JSON.stringify(config, null, 2)}\n`
  writeFileSync(file, next)
}
```

- [x] **Step 4: Run codemod and inspect the diff**

Run:

```bash
node scripts/tsconfig-modernize.mjs
git diff -- packages apps scripts/tsconfig-modernize.mjs | sed -n '1,260p'
```

Expected:

```text
All tracked tsconfig files remove baseUrl.
No tracked tsconfig uses moduleResolution node/node10.
Package tsconfigs now inherit ../tsconfig.rslib-bundler.json or ../tsconfig.rslib-nodenext.json.
App tsconfigs now inherit @empjs/cli/tsconfig/react or @empjs/cli/tsconfig/vue.
```

- [x] **Step 5: Verify GREEN for tsconfig rules**

Run:

```bash
corepack pnpm test:tsconfig
```

Expected:

```text
test:tsconfig passes.
```

---

### Task 5: Fix TS7 Compiler and Rspack 2.1 Config Surface

**Files:**
- Modify: `packages/cli/src/store/index.ts`
- Modify: `packages/cli/src/types/config.ts`
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`
- Modify: `packages/plugin-react/src/types.ts`
- Modify: `packages/plugin-react/src/index.ts`
- Modify: `packages/plugin-react/test/react-refresh-plugin.test.mjs`

**Interfaces:**
- Consumes: upgraded Rspack / TS7 dependency graph and TS7-compatible tsconfigs.
- Produces: portable CLI declarations under TS7, Rspack `runtimeMode` config type support, and React Compiler SWC config support.

- [x] **Step 1: Verify current TS7 failure after config migration**

Run:

```bash
corepack pnpm test:ts7
corepack pnpm test:tsgo
```

Expected before implementation:

```text
At least packages/cli/src/store/index.ts still fails with TS2883 if public rspack has no explicit type annotation.
```

- [x] **Step 2: Fix the portable declaration issue**

In `packages/cli/src/store/index.ts`, change the class field to:

```typescript
public rspack: typeof rspack = rspack
```

- [x] **Step 3: Add Rspack 2.1 shape coverage**

Extend `packages/cli/test/rspack2-features-shape.test.mjs` with a fixture that asserts:

```javascript
assert.equal(config.experiments.runtimeMode, 'single')
assert.equal(config.cache.type, 'persistent')
assert.equal(config.cache.maxAge, 1000 * 60 * 60)
assert.equal(config.cache.maxGenerations, 2)
```

Then update `packages/cli/src/types/config.ts`:

```typescript
experiments?: Pick<NonNullable<RsConfig['experiments']>, 'pureFunctions' | 'deferImport' | 'runtimeMode'>
```

- [x] **Step 4: Add React Compiler shape coverage**

In `packages/plugin-react/test/react-refresh-plugin.test.mjs`, assert that `pluginReact({reactCompiler: {target: '19'}})` writes `jsc.transform.reactCompiler` to both JS and TS `builtin:swc-loader` rules.

Then update `packages/plugin-react/src/types.ts`:

```typescript
export type ReactCompilerOptions = {
  target?: '17' | '18' | '19'
  runtimeModule?: string
}
```

and include `reactCompiler?: ReactCompilerOptions` in `PluginReactConfigType`.

In `packages/plugin-react/src/index.ts`, merge it into SWC transform without changing existing React Refresh behavior:

```typescript
if (config.reactCompiler) {
  transform.reactCompiler = config.reactCompiler
}
```

- [x] **Step 5: Verify GREEN for package-level checks**

Run:

```bash
corepack pnpm --filter @empjs/cli run build
node packages/cli/test/rspack2-features-shape.test.mjs
corepack pnpm --filter @empjs/plugin-react test
corepack pnpm test:ts7
corepack pnpm test:tsgo
```

Expected:

```text
CLI build and shape tests pass.
plugin-react tests pass.
typescript@7.0.1-rc tsc and tsgo native-preview pass for packages/cli/tsconfig.json.
```

---

### Task 6: Expand TS7 Verification Matrix

**Files:**
- Modify: `package.json`
- Modify: `scripts/toolchain.rules.test.ts`
- Modify: `scripts/tsconfig.rules.test.ts`

**Interfaces:**
- Consumes: package-level TS7 fixes.
- Produces: repeatable TS7 / tsgo gates for CLI, plugin-react, emp-share, and emp-chain.

- [x] **Step 1: Add final scripts**

Update root `package.json` scripts:

```json
{
  "scripts": {
    "test:toolchain": "rstest run --config rstest.config.ts scripts/toolchain.rules.test.ts",
    "test:tsconfig": "rstest run --config rstest.config.ts scripts/tsconfig.rules.test.ts",
    "test:ts7": "corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/cli/tsconfig.json",
    "test:ts7:packages": "corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/cli/tsconfig.json && corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/plugin-react/tsconfig.json && corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/emp-share/tsconfig.json && corepack pnpm dlx --package typescript@7.0.1-rc tsc --noEmit --pretty false --project packages/emp-chain/tsconfig.json",
    "test:tsgo": "corepack pnpm dlx --package @typescript/native-preview@7.0.0-dev.20260624.1 tsgo --noEmit --pretty false --project packages/cli/tsconfig.json"
  }
}
```

Add `test:toolchain` and `test:tsconfig` to the beginning of `ci:verify`, before `test:cli`.

- [x] **Step 2: Verify TS7 package matrix**

Run:

```bash
corepack pnpm test:ts7:packages
corepack pnpm test:tsgo
```

Expected:

```text
All listed package tsconfigs pass under TypeScript 7 RC.
tsgo passes for packages/cli/tsconfig.json.
If @empjs/share fails because Module Federation DTS peers are not TS7-ready, record the exact error and fix the smallest local type/config issue before proceeding.
```

- [x] **Step 3: Verify CI fast gate**

Run:

```bash
corepack pnpm ci:verify
```

Expected:

```text
workflow:check, test:toolchain, test:tsconfig, test:cli, test:packages, test:rules, release:check, and check:rslib-presets all pass.
```

---

### Task 7: Release Version, Changelog, and Full Beta Gate

**Files:**
- Modify: `package.json`
- Modify: `packages/*/package.json` for the 19 internal packages selected by `release:check`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: green package/app/toolchain gates.
- Produces: `4.0.0-beta.1` release metadata for the 19 internal packages.

- [x] **Step 1: Confirm beta target is still available**

Run:

```bash
npm view @empjs/cli dist-tags versions --json
corepack pnpm release:check
```

Expected:

```text
@empjs/cli beta dist-tag is 4.0.0-beta.0 and versions does not include 4.0.0-beta.1.
release:check reports 19 internal packages and excludes apps/**, website, @empjs/cdn-*, @empjs/lib-*.
```

- [x] **Step 2: Apply beta.1 version**

Run:

```bash
corepack pnpm release:version 4.0.0-beta.1
corepack pnpm release:check
```

Expected:

```text
Root version: 4.0.0-beta.1.
Internal packages: 19.
Independent packages remain on their own versions.
```

- [x] **Step 3: Update changelog**

Run:

```bash
corepack pnpm release:changelog -- --version 4.0.0-beta.1 --date 2026-06-26 --tag beta
```

Edit the new `CHANGELOG.md` entry so it includes:

```markdown
## What's Changed

### New Features
- feat: upgrade EMP beta toolchain to Rspack 2.1 and TypeScript 7 RC.
- feat: add native `tsgo` preflight through `@typescript/native-preview`.
- feat: expose Rspack 2.1 runtimeMode and React Compiler configuration.

### Refactor
- refactor: minimize tracked tsconfig files and route packages/apps through shared TS7-compatible baselines.

### Test
- test: add toolchain, tsconfig, TS7, and tsgo gates.

## Known Issues
- `@rslib/core@0.23.0` and `@module-federation/rspack@2.6.0` still declare peer ranges that do not include TypeScript 7. This release keeps the warning visible and relies on the green local gates listed below rather than suppressing peers.
```

- [x] **Step 4: Run full beta gate**

Run:

```bash
corepack pnpm workflow:check
corepack pnpm ci:verify
corepack pnpm empbuild
corepack pnpm apps:acceptance
corepack pnpm release:publish:dry -- --force-all
git diff --check
```

Expected:

```text
All commands exit 0.
release:publish:dry prints 19 internal packages and uses --dry-run with dist-tag beta.
No apps/**, website, @empjs/cdn-*, or @empjs/lib-* package is selected for publish.
```

- [x] **Step 5: Commit scoped changes**

Run:

```bash
git status --short
git add package.json pnpm-lock.yaml CHANGELOG.md scripts/toolchain.rules.test.ts scripts/tsconfig.rules.test.ts scripts/tsconfig-modernize.mjs packages/tsconfig.base.json packages/tsconfig.rslib-bundler.json packages/tsconfig.rslib-nodenext.json packages/cli/package.json packages/cli/tsconfig packages/cli/src packages/cli/test packages/plugin-react/src packages/plugin-react/test packages/*/tsconfig.json apps/*/tsconfig.json
git diff --cached --check
git commit -m "feat: upgrade rspack 2.1 and ts7 toolchain"
```

Expected:

```text
Commit contains only this plan's dependency, tsconfig, code, test, and release metadata changes.
```

- [ ] **Step 6: Push and verify remote CI**

Run:

```bash
git push origin v4
gh run list --branch v4 --limit 5
```

Expected:

```text
origin/v4 advances to the new commit.
The pushed commit's CI run starts for verify/build/apps jobs.
Final handoff must report CI run id and status; if still running, report the exact pending run id.
```

---

## Self-Review

- Spec coverage: This plan covers the user's updated requirement to ship Rspack 2.1 and TS7 together, use the latest available TS7 RC/native-preview versions, and minimize tsconfig files by shared references.
- Placeholder scan: No placeholder marker or unspecified command remains in task steps.
- Type consistency: `test:ts7` uses `typescript@7.0.1-rc`; `test:tsgo` uses `@typescript/native-preview@7.0.0-dev.20260624.1`; package and app tsconfig inheritance rules match the Global Constraints.
- Risk statement: The plan intentionally exposes TS7 peer warnings from Rslib and Module Federation instead of hiding them, because those upstream ranges are not yet TS7-compatible on 2026-06-26.
