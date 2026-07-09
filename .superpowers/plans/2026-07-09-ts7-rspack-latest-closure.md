# TS7 Rspack Latest Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 EMP v4 的 TypeScript 7 正式版声明补齐到 package 和 CLI 创建模板，并确认 Rspack / Rstest / Rslib / Module Federation 系列依赖均对齐 npm latest。

**Architecture:** 以 npm registry 的 latest 为事实来源，先用规则测试锁定依赖契约，再更新 manifest 与 lockfile。`typescript-mf` 保留为 Module Federation DTS 兼容别名，不作为业务项目 TS 版本声明。

**Tech Stack:** pnpm 10.33.0、TypeScript 7.0.2、Rspack 2.1.3、Rsbuild 2.1.5、Rslib 0.23.2、Module Federation 2.7.0、Rstest 0.11.0。

## Global Constraints

- 默认分支为 `v4`，开始和提交前都必须确认 `git status --short --branch`。
- 包管理命令统一使用 `corepack pnpm`。
- `@typescript/native-preview` 不得重新引入。
- `typescript-mf` 保留 `npm:typescript@5.9.3`，只用于当前 Module Federation DTS 兼容 patch。
- Rspack 系列 direct dependencies 只升级到 npm `latest`，不使用 `next` 或 `rc`。
- 测试 runner 不能通过 transitive dependency 带回旧 `@rsbuild/core@2.0.x` 或 `@rspack/core@2.0.x`。
- 修改 package manifest 或 lockfile 后必须运行 `corepack pnpm install --lockfile-only` 或等价 install，并验证 `corepack pnpm test:toolchain`、`corepack pnpm ci:verify`、`corepack pnpm empbuild`。

---

### Task 1: Lock TS7 And Rspack Latest Contract

**Files:**
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**
- Consumes: current package manifests and `packages/cli/src/agent-create/templates.ts`.
- Produces: a failing rule test that rejects project-facing TypeScript 5 declarations while allowing `typescript-mf`.

- [ ] **Step 1: Write the failing test**

Add assertions in `test/toolchain.rules.test.ts`:

```ts
test('project-facing TypeScript declarations use TS7 stable everywhere', () => {
  const cdnReact17Pkg = readJson('packages/cdn-react-17/package.json')
  const templates = readText('packages/cli/src/agent-create/templates.ts')

  expect(cdnReact17Pkg.devDependencies.typescript).toBe('7.0.2')
  expect(templates).toContain("typescript: '^7.0.2'")
  expect(templates).not.toContain("typescript: '^5.9.2'")
})
```

Also add assertions that the Rstest runner line stays on the latest stack and does not pull the old Rspack tree back into `pnpm-lock.yaml`:

```ts
test('Rstest uses the current Rsbuild and Rspack stack', () => {
  const pkg = readJson('package.json')
  const lockfile = readText('pnpm-lock.yaml')

  expect(pkg.devDependencies['@rstest/core']).toBe('0.11.0')
  expect(pkg.devDependencies['@rstest/browser']).toBe('0.11.0')
  expect(lockfile).toContain('@rsbuild/core@2.1.5')
  expect(lockfile).toContain('@rspack/core@2.1.3')
  expect(lockfile).not.toContain('@rsbuild/core@2.0.15')
  expect(lockfile).not.toContain('@rspack/core@2.0.8')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm test:toolchain`

Expected: FAIL because `packages/cdn-react-17/package.json` still declares `^5.7.2`, CLI templates still declare `^5.9.2`, and `@rstest/*` still resolve through the old Rsbuild/Rspack transitive stack.

- [ ] **Step 3: Update manifests and templates**

Change:
- `packages/cdn-react-17/package.json` `devDependencies.typescript` to `7.0.2`.
- `packages/cli/src/agent-create/templates.ts` generated `typescript` devDependency values to `^7.0.2`.
- Root `package.json` `@rstest/core` and `@rstest/browser` to `0.11.0`.
- `packages/cli/package.json` `@rstest/core` to `0.11.0`.

- [ ] **Step 4: Refresh lockfile**

Run: `corepack pnpm install --lockfile-only`

Expected: exit 0 and `pnpm-lock.yaml` reflects `packages/cdn-react-17` on `typescript@7.0.2`.

- [ ] **Step 5: Run focused verification**

Run: `corepack pnpm test:toolchain`

Expected: PASS, including current Rspack latest assertions:
- `@rspack/core` = `2.1.3`
- `@rspack/dev-server` = `^2.1.0`
- `@rspack/plugin-react-refresh` = `^2.0.2`
- `@rslib/core` = `^0.23.2`
- Module Federation patch = `@module-federation/dts-plugin@2.7.0`
- no `@rsbuild/core@2.0.15` or `@rspack/core@2.0.8` remains in `pnpm-lock.yaml`
- `packages/cli/package.json` uses `@rstest/core@0.11.0`

### Task 2: Repository Verification And Push

**Files:**
- Modify: `pnpm-lock.yaml`
- Modify: `.superpowers/plans/2026-07-09-ts7-rspack-latest-closure.md`

**Interfaces:**
- Consumes: Task 1 updated dependency contract.
- Produces: pushed `v4` commit with real validation evidence.

- [ ] **Step 1: Run full repo verification**

Run:

```bash
corepack pnpm ci:verify
corepack pnpm empbuild
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Stage only scoped files**

Run:

```bash
git add .superpowers/plans/2026-07-09-ts7-rspack-latest-closure.md test/toolchain.rules.test.ts packages/cdn-react-17/package.json packages/cli/src/agent-create/templates.ts pnpm-lock.yaml
git diff --cached --check
```

Expected: cached whitespace check exits 0.

- [ ] **Step 3: Commit and push**

Run:

```bash
git commit -m "chore: complete ts7 and rspack latest closure"
git push origin v4
git rev-parse HEAD
git ls-remote origin refs/heads/v4
```

Expected: push succeeds and local HEAD matches remote `origin/v4`.
