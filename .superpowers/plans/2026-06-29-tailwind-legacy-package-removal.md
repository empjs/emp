# Tailwind Legacy Package Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `@empjs/plugin-tailwindcss2` and `@empjs/plugin-tailwindcss3` from the EMP v4 workspace while preserving migration guidance through the v4 Tailwind plugin and explicit PostCSS compatibility path.

**Architecture:** `@empjs/plugin-tailwindcss` remains the only Tailwind v4 default package and continues to use `@tailwindcss/webpack` without PostCSS. Tailwind 2/3 package names are removed from release, build preset, docs, and workspace package scope. Projects that truly need old Tailwind PostCSS semantics use `@empjs/plugin-postcss` explicitly instead of separate `plugin-tailwindcss2/3` packages.

**Tech Stack:** TypeScript, Rstest, Rslib, EMP release scripts, `corepack pnpm@10.33.0`, CodeGraph.

## Global Constraints

- 默认中文沟通，先给结果，再给必要依据。
- 当前工作区是 `/Users/Bigo/Desktop/develop/fontend-workspace/emp`，分支 `v4...origin/v4`。
- 包管理必须使用 `corepack pnpm`，目标版本为 `pnpm@10.33.0`。
- 代码发现优先使用当前 CodeGraph 流程；配置、脚本、文档和字符串搜索可回退 `rg` / 文件读取。
- 不修改 `apps/**` 示例源码；只更新真实验收测试和文档说明。
- 不修改 `packages/cdn-*`、`packages/lib-*`、`.github/workflows/publish.yml`。
- `@empjs/plugin-tailwindcss` 默认链路不得重新引入 `postcss-loader`、`@tailwindcss/postcss`、`postcss-import`、`postcss-preset-env` 或 `autoprefixer`。
- Tailwind 2/3 兼容说明必须指向显式 PostCSS 路径，不再推荐独立 `@empjs/plugin-tailwindcss2` / `@empjs/plugin-tailwindcss3` 包。

---

### Task 1: Add Failing Rules For Removing Legacy Tailwind Packages

**Files:**
- Modify: `scripts/release.rules.test.ts`
- Modify: `scripts/apps.acceptance.test.ts`

**Interfaces:**
- Consumes: current release plan from `createReleasePlan(repoRoot)`.
- Produces: test failures while legacy package directories and release entries still exist.

- [x] **Step 1: Update release set expectation**

Remove `@empjs/plugin-tailwindcss2` and `@empjs/plugin-tailwindcss3` from the expected `plan.internalPackages.map(pkg => pkg.name)` list, and change the expected length from `19` to `17`.

- [x] **Step 2: Add workspace absence assertion**

Add an assertion that `plan.packages.map(pkg => pkg.name)` does not contain either legacy package name.

- [x] **Step 3: Strengthen app acceptance package check**

Keep the `tailwind-4` assertions that forbid `@empjs/plugin-tailwindcss2` and `@empjs/plugin-tailwindcss3` in the demo package.

- [x] **Step 4: Verify RED**

Run:

```bash
corepack pnpm test:rules
```

Expected before implementation: FAIL because the release plan still includes the legacy package names.

---

### Task 2: Remove Legacy Packages From Workspace And Automation

**Files:**
- Delete: `packages/plugin-tailwindcss2/**`
- Delete: `packages/plugin-tailwindcss3/**`
- Modify: `scripts/release-core.mjs`
- Modify: `scripts/check-rslib-presets.mjs`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces: package discovery no longer sees legacy Tailwind packages.
- Produces: Rslib preset check no longer expects removed config files.

- [x] **Step 1: Remove release package names**

Delete `@empjs/plugin-tailwindcss2` and `@empjs/plugin-tailwindcss3` from `INTERNAL_RELEASE_PACKAGES`.

- [x] **Step 2: Remove Rslib preset entries**

Delete `packages/plugin-tailwindcss2/rslib.config.ts` and `packages/plugin-tailwindcss3/rslib.config.ts` from `nodeEsmPackages`.

- [x] **Step 3: Delete legacy package source trees**

Delete:

```text
packages/plugin-tailwindcss2/
packages/plugin-tailwindcss3/
```

- [x] **Step 4: Refresh lockfile**

Run:

```bash
corepack pnpm install --lockfile-only
```

- [x] **Step 5: Verify GREEN**

Run:

```bash
corepack pnpm test:rules
corepack pnpm check:rslib-presets
```

Expected: both pass.

---

### Task 3: Update Documentation And Migration Guidance

**Files:**
- Delete: `website/docs/zh/plugin/tool/plugin-tailwindcss2.mdx`
- Delete: `website/docs/zh/plugin/tool/plugin-tailwindcss3.mdx`
- Modify: `website/docs/zh/plugin/tool/plugin-postcss.mdx`
- Modify: `website/docs/zh/guide/basis/tailwind.mdx`
- Modify: `docs/v4-alpha-migration.md`

**Interfaces:**
- Produces: public docs stop recommending removed package names.

- [x] **Step 1: Remove legacy plugin pages**

Delete the two legacy Tailwind plugin docs from website docs.

- [x] **Step 2: Update PostCSS support matrix**

Change Tailwind 2/3 compatibility guidance to explicit `@empjs/plugin-postcss` usage with project-owned Tailwind/PostCSS dependencies.

- [x] **Step 3: Update Tailwind guide compatibility notes**

State that Tailwind v4 should use `@empjs/plugin-tailwindcss`; legacy Tailwind 2/3 projects should migrate to v4 where possible or use `@empjs/plugin-postcss` as an explicit compatibility path.

- [x] **Step 4: Update v4 migration release scope**

Remove legacy package names from the listed core internal packages and update the package count from `19` to `17`.

- [x] **Step 5: Verify docs references**

Run:

```bash
rg -n "@empjs/plugin-tailwindcss2|@empjs/plugin-tailwindcss3|plugin-tailwindcss2|plugin-tailwindcss3" . --glob '!node_modules/**' --glob '!dist/**' --glob '!output/**' --glob '!coverage/**' --glob '!.codegraph/**' --glob '!pnpm-lock.yaml'
```

Expected: no matches except negative assertions in tests, if retained.

---

### Task 4: Final Verification

**Files:**
- Read: changed files

**Interfaces:**
- Produces: final verification package.

- [x] **Step 1: Run targeted verification**

Run:

```bash
corepack pnpm test:rules
corepack pnpm release:check
corepack pnpm check:rslib-presets
corepack pnpm --filter @empjs/plugin-tailwindcss build
corepack pnpm test:apps:single -- --runInBand
```

- [x] **Step 2: Run required build verification**

Run:

```bash
corepack pnpm empbuild
```

- [x] **Step 3: Run repository guards**

Run:

```bash
corepack pnpm workflow:check
git diff --check
codegraph affected scripts/release-core.mjs scripts/release.rules.test.ts packages/plugin-tailwindcss/src/index.ts
```

- [x] **Step 4: Record execution result**

Append actual verification results to this plan under `## Execution Record`.

## Execution Record

- RED：`corepack pnpm test:rules` 失败在 `current repository internal release set stays explicitly bounded`，原因是 release set 仍包含 `@empjs/plugin-tailwindcss2` 和 `@empjs/plugin-tailwindcss3`。
- GREEN：删除两个 legacy 包目录，更新 `scripts/release-core.mjs`、`scripts/check-rslib-presets.mjs`、`scripts/release.rules.test.ts`、文档和 `pnpm-lock.yaml` 后，`corepack pnpm test:rules` 通过。
- 发布范围：`corepack pnpm release:check` 通过，内部包从 19 个收口到 17 个。
- 构建预设：`corepack pnpm check:rslib-presets` 通过，Rslib preset 检查从 11 个包收口到 9 个包。
- Tailwind 验收：`corepack pnpm --filter @empjs/plugin-tailwindcss build` 通过；`corepack pnpm test:apps:single -- --runInBand` 通过，8/8。
- 构建矩阵：`corepack pnpm empbuild` 通过，插件构建范围从 9 个 workspace 包收口到 7 个。
- 仓库验证：`corepack pnpm ci:verify` 通过；首次失败暴露 `scripts/tsconfig.rules.test.ts` 使用 `git ls-files` 读取已删除 tsconfig，已改为只检查当前工作树存在的 tsconfig。
