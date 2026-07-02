# Rspack Latest Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 EMP v4 的直接 Rspack 依赖收敛到 2026-07-03 实时 npm latest，并保持现有真实测试和发布门禁通过。

**Architecture:** 升级范围收敛在 `@empjs/cli` 的 Rspack 运行时依赖、`@empjs/plugin-react` 的 React Refresh peer 依赖和根级工具链规则测试。先用版本断言制造 red，再更新 manifest 和 lockfile，最后通过 CLI/package/CI/build gate 证明升级没有破坏 Rspack 运行链路。

**Tech Stack:** Node `^20.19.0 || >=22.12.0`、`corepack pnpm@10.33.0`、`@rspack/core@2.1.2`、`@rspack/dev-server@2.1.0`、`@rspack/plugin-react-refresh@2.0.2`、Rslib、Rstest。

## Global Constraints

- 默认中文沟通，最终说明真实验证结果和未覆盖边界。
- 不修改 `apps/**`、`website`、`packages/cdn-*`、`packages/lib-*`。
- 不覆盖当前工作区已有未提交改动，继续基于当前 `v4` checkout 叠加。
- `pnpm-lock.yaml` 只因依赖解析变化而更新。
- 不提交、不 push，除非用户后续明确要求。

---

### Task 1: 写入 Rspack latest 版本断言

**Files:**
- Modify: `test/toolchain.rules.test.ts`
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`
- Read: `packages/cli/package.json`
- Read: `packages/plugin-react/package.json`

**Interfaces:**
- Consumes: npm 实时版本查询结果：`@rspack/core -> 2.1.2`、`@rspack/dev-server -> 2.1.0`、`@rspack/plugin-react-refresh -> 2.0.2`。
- Produces: 工具链规则测试会在旧 `@rspack/core@2.1.1` 上失败。

- [ ] **Step 1: Write the failing test**

Update `test/toolchain.rules.test.ts` in the `cli depends on Rspack 2.1 and TS7-aware checker` test:

```ts
expect(cliPkg.dependencies['@rspack/core']).toBe('2.1.2')
expect(cliPkg.dependencies['@rspack/dev-server']).toBe('^2.1.0')
```

Add package-react coverage in the same test:

```ts
const reactPkg = readJson('packages/plugin-react/package.json')
expect(reactPkg.dependencies['@rspack/plugin-react-refresh']).toBe('^2.0.0')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm test:toolchain`

Expected: FAIL because `packages/cli/package.json` still declares `@rspack/core: "2.1.1"`.

- [ ] **Step 3: Update CLI runtime version assertion after dependency resolution**

Update `packages/cli/test/rspack2-features-shape.test.mjs`:

```js
assert.equal(rspack.rspackVersion, '2.1.2')
```

Run: `node packages/cli/test/rspack2-features-shape.test.mjs`

Expected: PASS after Task 2 updates `@rspack/core` to `2.1.2`.

### Task 2: 更新 manifest 与 lockfile

**Files:**
- Modify: `packages/cli/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: Task 1 的目标版本断言。
- Produces: `@empjs/cli` 直接依赖 `@rspack/core@2.1.2`，lockfile 中 EMP CLI peer graph 绑定到 `@rspack/core@2.1.2`，dev-server 保持 `2.1.0`。

- [ ] **Step 1: Update dependency declaration**

Set `packages/cli/package.json`:

```json
"@rspack/core": "2.1.2",
"@rspack/dev-server": "^2.1.0"
```

Keep `packages/plugin-react/package.json` unchanged unless npm publishes a newer compatible `@rspack/plugin-react-refresh`; current latest is `2.0.2`, and the existing `^2.0.0` range resolves to it.

- [ ] **Step 2: Refresh lockfile**

Run: `corepack pnpm install --lockfile-only`

Expected: `pnpm-lock.yaml` updates direct `@empjs/cli` Rspack peer graph to `@rspack/core@2.1.2`; dev-server remains `2.1.0`.

### Task 3: 验证 Rspack 运行链路

**Files:**
- Read: all files changed by Task 1 and Task 2.

**Interfaces:**
- Consumes: updated manifest and lockfile.
- Produces: fresh verification evidence for package tests, CLI tests, CI verification and full EMP build.

- [ ] **Step 1: Run version resolution checks**

Run:

```bash
corepack pnpm --filter @empjs/cli list @rspack/core @rspack/dev-server --depth 0
corepack pnpm --filter @empjs/plugin-react list @rspack/plugin-react-refresh --depth 0
corepack pnpm --filter @empjs/cli exec node --input-type=module --eval "import {rspackVersion} from '@rspack/core'; console.log(rspackVersion)"
```

Expected: CLI lists `@rspack/core 2.1.2`, `@rspack/dev-server 2.1.0`; plugin-react lists `@rspack/plugin-react-refresh 2.0.2`; node prints `2.1.2`.

- [ ] **Step 2: Run local gates**

Run:

```bash
corepack pnpm test:toolchain
corepack pnpm test:cli
corepack pnpm test:packages
corepack pnpm ci:verify
corepack pnpm empbuild
git diff --check
```

Expected: all commands exit 0.
