# Rslib Preset Workspace Alias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace relative `../../scripts/rslib-presets.mjs` imports in package `rslib.config.ts` files with a stable private workspace alias `@empjs/rslib-presets`.

**Architecture:** Add a private workspace package under `packages/rslib-presets` that exports `defineNodeEsmConfig`. Keep `scripts/rslib-presets.mjs` as a compatibility re-export so older local references still resolve during migration. Update the preset guard to enforce the workspace alias in the 9 Node ESM package configs.

**Tech Stack:** Node ESM, Rslib, pnpm workspace package resolution, Rstest-backed script guards, CodeGraph.

## Global Constraints

- 默认中文沟通，先给结果，再给必要依据。
- 当前工作区是 `/Users/Bigo/Desktop/develop/fontend-workspace/emp`，分支 `v4...origin/v4`，存在上一轮 Tailwind/PostCSS 未提交改动，必须保留并基于现状继续。
- 包管理必须使用 `corepack pnpm`，目标版本为 `pnpm@10.33.0`。
- 代码发现优先使用当前 CodeGraph 流程；配置、脚本、文档和字符串搜索可回退 `rg` / 文件读取。
- 不修改 `apps/**` 示例源码、`packages/cdn-*`、`packages/lib-*`、`.github/workflows/publish.yml`。
- `packages/rslib-presets` 必须是私有 workspace 包，不进入内部发布包集合。
- `scripts/rslib-presets.mjs` 保留为 re-export 兼容入口，但新的 `rslib.config.ts` 必须统一使用 `@empjs/rslib-presets`。

---

### Task 1: Add Failing Guard For Workspace Alias

**Files:**
- Modify: `scripts/check-rslib-presets.mjs`

**Interfaces:**
- Consumes: 9 Node ESM package `rslib.config.ts` files.
- Produces: failing check while configs still use the relative script import.

- [x] **Step 1: Change required import string**

Set the expected import to:

```js
"from '@empjs/rslib-presets'"
```

Update the error text to mention `@empjs/rslib-presets`.

- [x] **Step 2: Keep duplicate preset guard**

Continue rejecting local `node22Syntax`, `nodeSyntax`, and `esmShims` constants.

- [x] **Step 3: Verify RED**

Run:

```bash
corepack pnpm check:rslib-presets
```

Expected before implementation: FAIL for all 9 package configs because they still import `../../scripts/rslib-presets.mjs`.

---

### Task 2: Add Private Workspace Preset Package

**Files:**
- Create: `packages/rslib-presets/package.json`
- Create: `packages/rslib-presets/index.mjs`
- Modify: `scripts/rslib-presets.mjs`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces: package `@empjs/rslib-presets` with named export `defineNodeEsmConfig(options?: object)`.
- Preserves: old `scripts/rslib-presets.mjs` import path as a re-export.

- [x] **Step 1: Create private package manifest**

Create `packages/rslib-presets/package.json`:

```json
{
  "name": "@empjs/rslib-presets",
  "version": "4.0.0-beta.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./index.mjs"
  },
  "dependencies": {
    "@rslib/core": "^0.23.1"
  }
}
```

- [x] **Step 2: Move preset implementation into package**

Create `packages/rslib-presets/index.mjs` with the existing `defineNodeEsmConfig` implementation.

- [x] **Step 3: Preserve old script entry**

Replace `scripts/rslib-presets.mjs` with:

```js
export {defineNodeEsmConfig} from '@empjs/rslib-presets'
```

- [x] **Step 4: Add root devDependency**

Add:

```json
"@empjs/rslib-presets": "workspace:*"
```

to root `devDependencies`, so Node can resolve the alias from package config files during monorepo builds.

- [x] **Step 5: Refresh lockfile**

Run:

```bash
corepack pnpm install --lockfile-only
```

---

### Task 3: Migrate Rslib Config Imports

**Files:**
- Modify: `packages/cli/rslib.config.ts`
- Modify: `packages/emp-chain/rslib.config.ts`
- Modify: `packages/plugin-lightningcss/rslib.config.ts`
- Modify: `packages/plugin-postcss/rslib.config.ts`
- Modify: `packages/plugin-react/rslib.config.ts`
- Modify: `packages/plugin-stylus/rslib.config.ts`
- Modify: `packages/plugin-tailwindcss/rslib.config.ts`
- Modify: `packages/plugin-vue2/rslib.config.ts`
- Modify: `packages/plugin-vue3/rslib.config.ts`

**Interfaces:**
- Consumes: `@empjs/rslib-presets`.
- Produces: stable alias imports independent of relative directory depth.

- [x] **Step 1: Replace import specifier**

Change:

```ts
import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'
```

to:

```ts
import {defineNodeEsmConfig} from '@empjs/rslib-presets'
```

- [x] **Step 2: Verify GREEN**

Run:

```bash
corepack pnpm check:rslib-presets
```

Expected: pass.

---

### Task 4: Final Verification

**Files:**
- Read: changed files

**Interfaces:**
- Produces: final verification record.

- [x] **Step 1: Targeted builds**

Run:

```bash
corepack pnpm --filter @empjs/plugin-tailwindcss build
corepack pnpm --filter @empjs/cli build
```

- [x] **Step 2: Repository gates**

Run:

```bash
corepack pnpm check:rslib-presets
corepack pnpm release:check
corepack pnpm test:toolchain
corepack pnpm empbuild
corepack pnpm ci:verify
git diff --check
codegraph affected scripts/check-rslib-presets.mjs packages/rslib-presets/index.mjs packages/plugin-tailwindcss/rslib.config.ts
```

- [x] **Step 3: Record execution**

Append actual RED/GREEN and verification results under `## Execution Record`.

## Execution Record

- RED：`corepack pnpm check:rslib-presets` 失败，9 个 Node ESM `rslib.config.ts` 都仍使用 `../../scripts/rslib-presets.mjs`。
- 新增私有包：`packages/rslib-presets` 提供 `@empjs/rslib-presets`，根 `devDependencies` 增加 `@empjs/rslib-presets: workspace:*`。
- 兼容入口：`scripts/rslib-presets.mjs` 改为 re-export `@empjs/rslib-presets`，`node -e "import('./scripts/rslib-presets.mjs')..."` 验证通过。
- GREEN：9 个 `rslib.config.ts` 均改为 `from '@empjs/rslib-presets'`，`corepack pnpm check:rslib-presets` 通过。
- 依赖链接：首次目标构建因 `node_modules` 未链接新 workspace 包失败；运行 `corepack pnpm install` 后 `node_modules/@empjs/rslib-presets` 存在，目标构建通过。
- 目标构建：`corepack pnpm --filter @empjs/plugin-tailwindcss build` 和 `corepack pnpm --filter @empjs/cli build` 通过。
- 仓库验证：`corepack pnpm release:check` 通过，`@empjs/rslib-presets` 作为 private workspace 包未进入 17 个内部发布包；`corepack pnpm empbuild` 通过；`corepack pnpm ci:verify` 通过；`git diff --check` 通过。
- CodeGraph：`codegraph affected scripts/check-rslib-presets.mjs packages/rslib-presets/index.mjs packages/plugin-tailwindcss/rslib.config.ts` 未发现受影响测试文件；实际验证已覆盖构建和仓库 gates。
