# TS7 Rspack Latest Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 EMP v4 的 TypeScript 7 / Rspack latest 依赖闭环收口，并按当前可安全更新项优化 CLI 与 emp-share；明确 TS type checker 继续走 Rspack 原生插件链路，保证工具链规则测试、包验证和构建验证都能覆盖当前版本线。

**Architecture:** 以 npm registry 的 latest 为事实来源，先用规则测试锁定依赖契约，再更新 manifest 与 lockfile。`typescript-mf` 保留为 Module Federation DTS 兼容别名，不作为业务项目 TS 版本声明。EMP CLI 直接维护 Rspack chain，因此 type check 集成继续使用 `ts-checker-rspack-plugin`，不引入 Rsbuild wrapper。

**Tech Stack:** pnpm 10.33.0、TypeScript 7.0.2、Rspack 2.1.3、Rsbuild 2.1.5、Rslib 0.23.2、Module Federation 2.7.0、Rstest 0.11.1、ts-checker-rspack-plugin 1.5.2。

## Global Constraints

- 默认分支为 `v4`，开始和提交前都必须确认 `git status --short --branch`。
- 包管理命令统一使用 `corepack pnpm`。
- `@typescript/native-preview` 不得重新引入。
- `typescript-mf` 保留 `npm:typescript@5.9.3`，只用于当前 Module Federation DTS 兼容 patch。
- Rspack 系列 direct dependencies 只升级到 npm `latest`，不使用 `next` 或 `rc`。
- TypeScript type checker 选型固定为 `ts-checker-rspack-plugin` direct dependency：当前 Rspack 官方 TypeScript 文档和 Rspack 2.1 TS7 公告均指向该插件。
- 不引入 `@rsbuild/plugin-type-check`：它适用于 Rsbuild 项目，内部仍包装 `ts-checker-rspack-plugin`，并额外要求 `@rsbuild/core` peer，不符合 EMP CLI 当前直接编排 Rspack chain 的结构。
- 不使用 `fork-ts-checker-webpack-plugin`：它是 webpack peer 路线，只作为历史兼容参考，不作为 Rspack 2 / TS7 默认选项。
- 测试 runner 不能通过 transitive dependency 带回旧 `@rsbuild/core@2.0.x` 或 `@rspack/core@2.0.x`。
- 本轮只纳入 patch/minor 且可由现有测试覆盖的 CLI / `emp-share` 更新；`webpack-bundle-analyzer@5`、Vue 2/3 生态大版本和 `packages/lib-*` 独立版本线不混入本轮。
- 修改 package manifest 或 lockfile 后必须运行 `corepack pnpm install --lockfile-only` 或等价 install，并验证 `test:toolchain`、CLI/share 包测试、`test:ts7:packages`、`empbuild`、`workflow:check`。

---

## Type Checker Selection

- Selected: `ts-checker-rspack-plugin@1.5.2`。它是 Rspack 官方当前文档推荐的 type-checker 插件，peer 覆盖 `@rspack/core` `^1.0.0 || ^2.0.0` 和 `@typescript/native-preview` `^7.0.0-0`，匹配本轮 Rspack 2.1 / TS7 验证目标。
- Not selected: `@rsbuild/plugin-type-check@1.5.0`。仅在未来 EMP 引入 Rsbuild 驱动的配置层时再评估；当前 CLI 直接使用 Rspack chain，使用 wrapper 会增加一层非必要依赖。
- Not selected: `fork-ts-checker-webpack-plugin@9.1.0`。它的 peer 是 webpack 5，不作为 Rspack 2.1 方案。

## CLI And emp-share Optimization Scope

- CLI safe update set: `@rstest/core@0.11.1`、`@rsdoctor/rspack-plugin@1.5.18`、`cors@2.8.6`、`fs-extra@11.3.6`、`html-webpack-plugin@5.6.7`、`ts-checker-rspack-plugin@1.5.2`、`@vue/tsconfig@0.9.1`。
- `emp-share` safe update set: 保持 Module Federation 2.7.0 全量对齐，并把 dev-only `@swc/core` 提升到 `^1.15.43`。
- Deferred: `webpack-bundle-analyzer@5.3.0` 是 major，虽满足当前 Node engine，但需要额外验证动态 import、stats 生成、CLI analyze UI 和类型包兼容后再升级。
- Deferred: `packages/lib-*` 的 Module Federation 1.x/0.x runtime 线属于独立版本线，不纳入 EMP v4 主线依赖闭环。

---

### Task 1: Version Contract Test And Manifest Updates

**Files:**
- Modify: `test/toolchain.rules.test.ts`
- Modify: `package.json`
- Modify: `packages/cli/package.json`
- Modify: `packages/emp-share/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: package manifests and lockfile.
- Produces: failing then passing rule coverage for Rstest, Rspack 2.1.x, Module Federation 2.7.x, CLI checker/tooling patches and emp-share SWC parity.

- [x] **Step 1: Add failing version contract assertions**

Add assertions in `test/toolchain.rules.test.ts`:

```ts
expect(rootPkg.devDependencies?.['@rstest/core']).toBe('0.11.1')
expect(rootPkg.devDependencies?.['@rstest/browser']).toBe('0.11.1')
expect(cliPkg.dependencies?.['ts-checker-rspack-plugin']).toBe('^1.5.2')
expect(cliPkg.dependencies?.['@rsdoctor/rspack-plugin']).toBe('1.5.18')
expect(empSharePkg.devDependencies?.['@swc/core']).toBe('^1.15.43')
```

Expected first run: `corepack pnpm test:toolchain` fails on stale Rstest, checker, rsdoctor and emp-share SWC declarations before manifest edits.

- [x] **Step 2: Update manifests to current compatible versions**

Apply the scoped package changes:

- root/package CLI test stack to `@rstest/core` / `@rstest/browser` `0.11.1`
- CLI checker/tooling patches: `ts-checker-rspack-plugin` `^1.5.2`, `@rsdoctor/rspack-plugin` `1.5.18`, `cors` `2.8.6`, `fs-extra` `11.3.6`, `html-webpack-plugin` `5.6.7`, `@vue/tsconfig` `^0.9.1`
- keep CLI on direct `ts-checker-rspack-plugin`; official Rspack TypeScript docs recommend it for type checking, while `@rsbuild/plugin-type-check` is Rsbuild-specific wrapping.
- keep `webpack-bundle-analyzer` `4.10.2` for now because `5.3.0` is a major jump requiring independent UI/output validation.
- emp-share SWC patch to `@swc/core` `^1.15.43`

- [x] **Step 3: Refresh lockfile with scoped install**

Run:

```bash
corepack pnpm install --lockfile-only
```

Expected lockfile changes include `@rstest/*@0.11.1`, `@rsdoctor/rspack-plugin@1.5.18`, `ts-checker-rspack-plugin@1.5.2`, `@swc/core@1.15.43`, and importer updates for root / CLI / emp-share.

- [x] **Step 4: Verify focused contract**

Run:

```bash
corepack pnpm test:toolchain
```

Expected: PASS, including current Rspack latest assertions:
- `@rspack/core` = `2.1.3`
- `@rspack/dev-server` = `^2.1.0`
- `@rspack/plugin-react-refresh` = `^2.0.2`
- `ts-checker-rspack-plugin` = `^1.5.2` in `packages/cli/package.json`, resolved as `1.5.2` in `pnpm-lock.yaml`
- `@rslib/core` = `^0.23.2`
- Module Federation patch = `@module-federation/dts-plugin@2.7.0`
- no `@rsbuild/core@2.0.15` or `@rspack/core@2.0.8` remains in `pnpm-lock.yaml`
- `packages/cli/package.json` uses `@rstest/core@0.11.1`
- `packages/emp-share/package.json` uses `@swc/core@^1.15.43`

### Task 2: Repository Verification

**Files:**
- Modify: `test/toolchain.rules.test.ts`
- Modify: `package.json`
- Modify: `packages/cli/package.json`
- Modify: `packages/emp-share/package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `.superpowers/plans/2026-07-09-ts7-rspack-latest-closure.md`

**Interfaces:**
- Consumes: Task 1 updated dependency contract.
- Produces: final validation evidence and keeps the checkout uncommitted unless the user explicitly asks for commit/push.

- [x] **Step 1: Run required verification gates**

Run:

```bash
corepack pnpm test:toolchain
corepack pnpm --filter @empjs/share test
corepack pnpm --filter @empjs/cli test
corepack pnpm test:ts7:packages
corepack pnpm empbuild
corepack pnpm workflow:check
git diff --check -- package.json packages/cli/package.json packages/emp-share/package.json test/toolchain.rules.test.ts pnpm-lock.yaml .superpowers/plans/2026-07-09-ts7-rspack-latest-closure.md
```

Expected: all commands exit 0. Record known peer-warning boundary: `html-webpack-plugin@5.6.7` still declares Rspack `0.x || 1.x`, and Module Federation DTS packages still declare TypeScript `^4 || ^5 || ^6` while this repo uses the TS7 alias strategy.

- [x] **Step 2: Preserve scope**

Keep unrelated website/skill dirty changes out of the lockfile refresh and do not stage, commit or push in this request.
