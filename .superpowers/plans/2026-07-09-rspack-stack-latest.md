# Rspack Stack Latest Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 EMP v4 的 Rspack 生态直接依赖升级到 npm `latest` dist-tag，并通过真实规则、TS7、构建和文档站验收。

**Architecture:** 以 manifest 作为唯一写入入口，先用规则测试锁定目标版本，再执行 `corepack pnpm install` 更新 lockfile 和 patch 解析结果。Module Federation Rspack 2.7.0 会带入 `@module-federation/dts-plugin@2.7.0`，因此同步迁移 TS7 兼容 patch，避免 DTS 运行时重新回到原生 `typescript`。

**Tech Stack:** pnpm 10.33.0, Rspack 2.1.3, Rsbuild 2.1.x, Rslib 0.23.2, Rspress 2.0.17, Module Federation 2.7.0, TypeScript 7.0.2, Rstest.

## Global Constraints

- 只修改本次依赖升级相关文件，保留现有用户脏改。
- 依赖版本以 2026-07-09 通过 `corepack pnpm view <pkg> version dist-tags --json` 查到的 npm `latest` 为准。
- 直接升级：`@rspack/core@2.1.3`, `@rspack/plugin-react-refresh@^2.0.2`, `@rslib/core@^0.23.2`, `@rspress/core@^2.0.17`, `@rspress/plugin-sitemap@^2.0.17`, `@module-federation/{rspack,runtime,runtime-tools,sdk}@^2.7.0`。
- 保持不变：`@rspack/dev-server@^2.1.0`, `@rsdoctor/rspack-plugin@1.5.17`, `ts-checker-rspack-plugin@^1.5.1`，因为当前已是 npm `latest`。
- `pnpm-workspace.yaml` 只能保留当前有效的 `@module-federation/dts-plugin` patch，不保留过期 2.6.0 patch 入口。
- 验收必须覆盖 `test:toolchain`、`test:ts7:packages`、`ci:verify`、`empbuild`、`website:build` 和 `git diff --check`。

---

### Task 1: 规则测试红灯

**Files:**
- Modify: `test/toolchain.rules.test.ts`
- Modify: `test/website.rules.test.ts`
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`
- Modify: `packages/emp-share/test/module-federation-deps.test.mjs`

**Interfaces:**
- Consumes: 当前 package manifests 和 lockfile。
- Produces: 明确断言本轮目标版本的规则测试。

- [x] **Step 1: 更新规则测试期望到目标 latest**

将 Rspack、Rslib、Rspress、Module Federation 和 patch 文件断言更新到 Global Constraints 中列出的目标版本。

- [x] **Step 2: 运行规则测试确认红灯**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/toolchain.rules.test.ts test/website.rules.test.ts`

Expected: FAIL，失败点应指向 package manifest、lockfile 或 patch 仍停留在旧版本。

### Task 2: manifest 和 patch 升级

**Files:**
- Modify: `package.json`
- Modify: `packages/cli/package.json`
- Modify: `packages/plugin-react/package.json`
- Modify: `packages/rslib-presets/package.json`
- Modify: `packages/emp-share/package.json`
- Modify: `website/package.json`
- Modify: `pnpm-workspace.yaml`
- Delete: `patches/@module-federation__dts-plugin@2.6.0.patch`
- Create: `patches/@module-federation__dts-plugin@2.7.0.patch`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: Task 1 的失败规则。
- Produces: 与 npm `latest` 对齐的 manifests、有效 lockfile 和 2.7.0 DTS patch。

- [x] **Step 1: 更新 manifests**

将直接依赖更新为 Global Constraints 中的目标版本；不新增当前仓库未直接使用的 `@rsbuild/core`。

- [x] **Step 2: 迁移 Module Federation DTS patch**

把 `pnpm-workspace.yaml` 的 patched dependency 从 `@module-federation/dts-plugin@2.6.0` 改为 `@module-federation/dts-plugin@2.7.0`，新 patch 仍只把 DTS 产物中的 `typescript` import/require 改为 `typescript-mf`。

- [x] **Step 3: 安装并刷新 lockfile**

Run: `corepack pnpm install`

Expected: exit 0；`pnpm-lock.yaml` 中 Rspack/Rslib/Rspress/MF 相关解析版本更新到目标版本。

### Task 3: 验收与提交

**Files:**
- Verify all files changed by Task 1 and Task 2.

**Interfaces:**
- Consumes: 已更新的 manifests、patch 和 lockfile。
- Produces: 可提交的 scoped diff。

- [x] **Step 1: 规则和针对性测试**

Run:
`corepack pnpm test:toolchain`
`corepack pnpm --filter @empjs/share test`
`corepack pnpm --filter @empjs/cli test:real`

Expected: all exit 0。

- [x] **Step 2: 全量本地验收**

Run:
`corepack pnpm test:ts7:packages`
`corepack pnpm ci:verify`
`corepack pnpm empbuild`
`corepack pnpm website:build`
`git diff --check`

Expected: all exit 0。

- [x] **Step 3: scoped commit**

Run:
`git status --short --branch`
`git add <only task files>`
`git diff --cached --check`
`git commit -m "chore: upgrade rspack stack to latest"`

Expected: commit created without staging unrelated release acceptance or logo changes.
