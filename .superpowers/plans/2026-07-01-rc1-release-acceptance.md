# EMP rc.1 Release Acceptance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前 `v4` 分支推进到 `4.0.0-rc.1` 可验收状态，补齐 release 级真实测试与门禁，并完成本地和远端验收。

**Architecture:** 以根 `rstest`、真实 CLI、真实 package pack/install、真实 apps/browser 验收为主线；发布动作只验证 dry-run 和产物，不执行真实 `npm publish`。主控制器负责版本/发布取舍和最终 go/no-go，subagent 并行处理互不重叠的审计、补测和 review。

**Tech Stack:** Node `^20.19.0 || >=22.12.0`、pnpm `10.33.0`、Rstest `0.10.6`、Playwright Chromium、Rspack/Rslib、Module Federation、GitHub Actions。

## Global Constraints

- 默认中文沟通，先给结果，再给必要依据。
- 计划、执行记录、review package 放在 `.superpowers/` 下。
- 不直接执行真实 `npm publish`；只允许 `release:publish:dry` 和本地 tarball/consumer smoke。
- 新增测试使用 `rstest` 或根脚本编排；不引入 Vitest、Jest、Mocha、Ava。
- 真实测试优先覆盖 CLI、Rspack/Rslib、Module Federation、运行时、示例 app、产物文件、HTTP 服务和浏览器行为。
- `apps/**` 和 `website` 不进入统一发布包范围。
- `@empjs/cdn-*` 和 `@empjs/lib-*` 保持独立版本线。
- 改动测试、测试配置、CI 或 release 脚本后必须运行相关测试、`corepack pnpm ci:verify`、`corepack pnpm empbuild`。
- 完成前必须运行 `corepack pnpm exec rstest watch --browser --browser.headless=false` 的 headed 初始全量用例，并在首轮通过后退出。
- push 前必须重查 `git status --short --branch`、`git diff --cached --check`，只 stage 本任务文件。

---

## File Structure

- Modify: `package.json` - root version、rc.1 验收脚本和 CI 入口。
- Modify: `packages/*/package.json` for internal release set only - 将 17 个统一发布包对齐到 `4.0.0-rc.1`。
- Modify: `scripts/release-core.mjs` - 从 prerelease version 推导默认 dist-tag，并保留显式 `--tag` 覆盖。
- Modify: `scripts/release.mjs` - CLI 默认 tag 改为使用 release plan 的版本推导。
- Modify: `test/release.rules.test.ts` - 覆盖 rc.1 tag 推导、publish dry-run、版本范围和 publish workflow。
- Create: `scripts/rc1-consumer-smoke.mjs` - 在临时目录 pack 关键包、安装到外部 consumer、执行 package exports/import/bin 烟测。
- Create: `test/release-rc1.acceptance.test.ts` - 通过 `rstest` 调用 `scripts/rc1-consumer-smoke.mjs`，让 rc.1 consumer smoke 纳入根测试体系。
- Modify: `scripts/root-test-targets.mjs` - 增加 `release-rc1` target。
- Modify: `.github/workflows/ci.yml` - `verify` job 覆盖 Node `20.19.0`、`22.12.0`、`24`，`build`/`apps` 保持 Node 24。
- Modify as needed after audit: `test/apps/browser/**`、`packages/cli/test/real/**`、`packages/emp-share/test/**` - 只补真实交互或发布风险缺口。
- Create/Modify: `.superpowers/sdd/*` - subagent brief、report、review package 和进度 ledger。

## Task 1: rc.1 Release Contract

**Files:**
- Modify: `package.json`
- Modify: `packages/adapter-react/package.json`
- Modify: `packages/biome-config/package.json`
- Modify: `packages/bridge-react/package.json`
- Modify: `packages/bridge-vue2/package.json`
- Modify: `packages/bridge-vue3/package.json`
- Modify: `packages/cli/package.json`
- Modify: `packages/emp-chain/package.json`
- Modify: `packages/emp-polyfill/package.json`
- Modify: `packages/emp-share/package.json`
- Modify: `packages/eslint-config-react/package.json`
- Modify: `packages/plugin-lightningcss/package.json`
- Modify: `packages/plugin-postcss/package.json`
- Modify: `packages/plugin-react/package.json`
- Modify: `packages/plugin-stylus/package.json`
- Modify: `packages/plugin-tailwindcss/package.json`
- Modify: `packages/plugin-vue2/package.json`
- Modify: `packages/plugin-vue3/package.json`
- Modify: `scripts/release-core.mjs`
- Modify: `scripts/release.mjs`
- Modify: `test/release.rules.test.ts`

**Interfaces:**
- Produces: `defaultReleaseTagForVersion(version: string): string` exported from `scripts/release-core.mjs`.
- Produces: root and internal package versions all equal `4.0.0-rc.1`.
- Consumes: existing `createReleasePlan`, `validateReleasePlan`, `buildPublishCommands`, `renderChangelogEntry`.

- [ ] **Step 1: Write failing release tests**

Add tests in `test/release.rules.test.ts` asserting:

```ts
expect(defaultReleaseTagForVersion('4.0.0-rc.1')).toBe('rc')
expect(defaultReleaseTagForVersion('4.0.0-beta.1')).toBe('beta')
expect(defaultReleaseTagForVersion('4.0.0')).toBe('latest')
```

Also assert the current repository root version is `4.0.0-rc.1`, all `plan.internalPackages` match it, `plan.independentPackages` do not match it by requirement, and `node scripts/release.mjs publish --dry-run --skip-build --package @empjs/cli` prints `--tag rc`.

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm test:rules`

Expected: FAIL because `defaultReleaseTagForVersion` does not exist and current version is still `4.0.0-beta.1`.

- [ ] **Step 3: Implement rc.1 contract**

Run: `node scripts/release.mjs version 4.0.0-rc.1`

Then add `defaultReleaseTagForVersion` to `scripts/release-core.mjs` and make `scripts/release.mjs` use it when neither `RELEASE_TAG` nor `--tag` is provided. Preserve explicit `--tag beta`, `--tag alpha`, `--tag latest`, and `RELEASE_TAG`.

- [ ] **Step 4: Verify GREEN**

Run: `corepack pnpm test:rules`

Expected: PASS, including rc.1 default tag and release scope tests.

## Task 2: External Consumer Tarball Smoke

**Files:**
- Create: `scripts/rc1-consumer-smoke.mjs`
- Create: `test/release-rc1.acceptance.test.ts`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `package.json`
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**
- Produces: CLI command `corepack pnpm test:release:rc1`.
- Produces: root target `node scripts/run-root-test.mjs release-rc1`.
- Consumes: package build outputs generated by `corepack pnpm empbuild`.

- [ ] **Step 1: Write failing Rstest wrapper and script contract test**

`test/release-rc1.acceptance.test.ts` must spawn:

```ts
await execFile(process.execPath, ['scripts/rc1-consumer-smoke.mjs'], {cwd: repoRoot, timeout: 240000})
```

`test/toolchain.rules.test.ts` must assert `package.json` contains `test:release:rc1` and `scripts/root-test-targets.mjs` exposes `release-rc1`.

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm test:release:rc1`

Expected: FAIL because `scripts/rc1-consumer-smoke.mjs` and the script target do not exist.

- [ ] **Step 3: Implement consumer smoke**

`scripts/rc1-consumer-smoke.mjs` must:

```text
1. Create a temp directory under os.tmpdir().
2. Pack @empjs/chain, @empjs/share, @empjs/plugin-react, and @empjs/cli into a temp pack directory with `pnpm --filter <name> pack --pack-destination <dir>`.
3. Extract each tarball package.json and fail if any dependency/devDependency/peerDependency still uses `workspace:`.
4. Create a temp consumer package with `type: module`.
5. Install the packed tarballs plus their public npm dependencies through `corepack pnpm@10.33.0 add <tarballs>`.
6. Run a Node smoke file that imports `@empjs/share`, `@empjs/share/mfRuntime`, `@empjs/share/rspack`, `@empjs/chain`, and `@empjs/plugin-react`.
7. Execute `node node_modules/@empjs/cli/bin/emp.js --help` and assert the output contains EMP CLI help text.
8. Remove the temp directory in a `finally` block unless `EMP_KEEP_RC1_SMOKE=1`.
```

- [ ] **Step 4: Verify GREEN**

Run: `corepack pnpm test:release:rc1`

Expected: PASS after package outputs are built.

## Task 3: CI Runtime Matrix and Publish Guard

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `test/release.rules.test.ts`

**Interfaces:**
- Produces: CI `verify` matrix over Node `20.19.0`, `22.12.0`, and `24`.
- Consumes: existing `pnpm ci:verify` and `pnpm empbuild` scripts.

- [ ] **Step 1: Write failing workflow assertions**

In `test/release.rules.test.ts`, assert `.github/workflows/ci.yml` contains a `strategy.matrix.node-version` list with `20.19.0`, `22.12.0`, and `24`, while `build` and `apps` jobs still run Node 24.

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm test:rules`

Expected: FAIL because the CI workflow currently uses Node 24 only for all jobs.

- [ ] **Step 3: Update CI workflow**

Add the Node matrix only to `verify`. Keep `build` and `apps` single-version to control CI time. Do not add npm token, `NODE_AUTH_TOKEN`, `release:publish`, or publish permissions to CI.

- [ ] **Step 4: Verify GREEN**

Run: `corepack pnpm test:rules`

Expected: PASS and publish guard assertions still pass.

## Task 4: CLI, emp-share, and Apps Interaction Deepening

**Files:**
- Modify as needed: `packages/cli/test/real/*.test.ts`
- Modify as needed: `packages/emp-share/test/**/*.mjs`
- Modify as needed: `packages/emp-share/test/browser/*.browser.ts`
- Modify as needed: `test/apps/browser/**/*.browser.ts`
- Modify as needed: `test/apps.browser-coverage.test.ts`

**Interfaces:**
- Produces: additional real tests only where audit identifies release-blocking gaps.
- Consumes: current browser target lists from `scripts/root-test-targets.mjs`.

- [ ] **Step 1: Dispatch parallel audits**

Spawn:

```text
emp-fast audit A: apps/* browser interaction gaps and per-app directory structure.
emp-fast audit B: CLI and emp-share public customization gaps.
emp-deep audit C: rc.1 release go/no-go risks across release scripts, CI, and package exports.
```

- [ ] **Step 2: Convert confirmed gaps into failing tests**

For each accepted gap, add a real Rstest/browser test that fails before implementation. Do not add pure helper-only tests.

- [ ] **Step 3: Implement only required behavior or test harness fixes**

Keep write scopes disjoint. Do not change public API semantics without main-controller approval.

- [ ] **Step 4: Verify focused lanes**

Run the relevant focused commands:

```bash
corepack pnpm test:cli
corepack pnpm test:packages
corepack pnpm test:browser:all
```

Expected: PASS. Browser lane must include all app browser tests and emp-share browser tests.

## Task 5: rc.1 Full Acceptance and Push

**Files:**
- Modify: `.superpowers/sdd/progress.md`
- Git stage only files changed by this plan.

**Interfaces:**
- Produces: pushed `v4` branch with rc.1 acceptance evidence.

- [ ] **Step 1: Run local rc.1 matrix**

Run:

```bash
corepack pnpm workflow:check
corepack pnpm ci:verify
corepack pnpm empbuild
corepack pnpm test:release:rc1
corepack pnpm release:publish:dry -- --skip-build --tag rc --force-all
corepack pnpm test:browser:all
```

Expected: each command exits 0.

- [ ] **Step 2: Run headed browser watch initial full pass**

Run:

```bash
corepack pnpm exec rstest watch --browser --browser.headless=false
```

Expected: initial full run passes all browser test files; terminate watch after the passing run.

- [ ] **Step 3: Pre-push checks**

Run:

```bash
git status --short --branch
git diff --check
git diff --cached --check
```

Expected: no unrelated dirty files; whitespace checks pass.

- [ ] **Step 4: Commit and push**

Commit message:

```text
test: qualify v4 rc1 acceptance
```

Push: `git push origin v4`.

- [ ] **Step 5: Remote CI verification**

Use `gh run list --branch v4 --limit 5` and `gh run watch <run-id> --exit-status` when `gh` is authenticated. If `gh` is unavailable or unauthenticated, record the local command evidence and the exact remote verification blocker.

Expected: latest pushed CI run passes all required jobs, or the blocker is explicitly reported with local rc.1 evidence.
