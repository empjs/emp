# EMP Alpha.3 Release And CI Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Release EMP `4.0.0-alpha.3`, sync `v4` to GitHub, publish npm packages through the repository publish workflow, prove CI is usable from a clean runner, and leave a concrete next-step plan.

**Architecture:** Keep release scope inside the existing internal package release automation. Fix the clean-CI failure at the root verification command instead of relying on local `dist/` artifacts. Use local dry-run gates before push, then use GitHub Actions for real CI and Trusted Publisher npm publish because local `npm whoami` is unauthorized.

**Tech Stack:** Node.js `^20.19.0 || >=22.12.0`, pnpm `10.33.0`, GitHub Actions, npm Trusted Publisher workflow, existing EMP release scripts.

## Global Constraints

- 默认中文沟通；说明、进度同步、评审意见与问题反馈均优先中文。
- 开始任务前确认 live checkout，不沿用历史 workflow 假设。
- 不覆盖用户已有改动；当前任务只改 release/CI/计划相关文件。
- 包管理默认使用 `pnpm@10.33.0`，遵守根 `packageManager` 与 `engines`。
- `projects/**` 和 `website` 不进入发布包范围。
- `@empjs/cdn-*`、`@empjs/lib-*` 保持独立版本线，不改版本。
- CI workflow 只做验证，不配置 npm publish 权限或 token。
- 发布脚本必须支持 dry-run，真实 publish 必须有显式确认参数。
- 本机 `npm whoami` 401 时不走本机直发；真实 npm 发布走 `.github/workflows/publish.yml`。

---

### Task 1: Preflight And Clean-CI Root Cause

**Files:**
- Read: `AGENTS.md`
- Read: `skills/emp-workflow/SKILL.md`
- Read: `.github/workflows/ci.yml`
- Read: `.github/workflows/publish.yml`
- Read: `package.json`
- Read: `scripts/emp-workflow-check.mjs`

**Interfaces:**
- Consumes: `git status --short --branch`, `codex mcp list`, codebase-memory-mcp `index_status`, `gh run view`.
- Produces: confirmed root cause for failed remote CI.

- [x] **Step 1: Confirm live checkout**

Run:

```bash
git status --short --branch
codex mcp list
```

Expected: current branch is `v4`, worktree starts clean, `codebase-memory-mcp` is enabled.

- [x] **Step 2: Confirm code graph index**

Run:

```text
index_status(project="Users-Bigo-Desktop-develop-fontend-workspace-emp")
```

Expected: status is `ready`.

- [x] **Step 3: Read failed CI logs**

Run:

```bash
gh run view 28146237405 --repo empjs/emp --log-failed
```

Expected: failure is `Cannot find module ... packages/cli/node_modules/@empjs/chain/dist/index.js` during `pnpm ci:verify`.

### Task 2: TDD Fix For Clean CI Verification

**Files:**
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `pnpm workflow:check` guards that `test:cli` builds `@empjs/chain` before `@empjs/cli` tests.
- Produces: `test:cli` can run from a clean checkout without relying on stale local `dist/`.

- [x] **Step 1: Write the failing workflow rule**

Add a check in `scripts/emp-workflow-check.mjs`:

```js
const testCli = pkg.scripts?.['test:cli'] ?? ''
if (!testCli.includes('pnpm --filter @empjs/chain build')) {
  failures.push('package.json test:cli must build @empjs/chain before @empjs/cli tests for clean CI')
}
if (
  testCli.includes('pnpm --filter @empjs/cli test') &&
  testCli.indexOf('pnpm --filter @empjs/chain build') > testCli.indexOf('pnpm --filter @empjs/cli test')
) {
  failures.push('package.json test:cli builds @empjs/chain after @empjs/cli tests')
}
```

- [x] **Step 2: Verify RED**

Run:

```bash
pnpm workflow:check
```

Expected: FAIL with `package.json test:cli must build @empjs/chain before @empjs/cli tests for clean CI`.

- [x] **Step 3: Implement minimal fix**

Update `package.json`:

```json
"test:cli": "pnpm --filter @empjs/chain build && pnpm --filter @empjs/cli test && pnpm --filter @empjs/cli test:real"
```

- [x] **Step 4: Verify GREEN**

Run:

```bash
pnpm workflow:check
pnpm test:cli
pnpm ci:verify
```

Expected: all pass.

### Task 3: Prepare `4.0.0-alpha.3`

**Files:**
- Modify: `package.json`
- Modify: `packages/*/package.json` for internal release packages only
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: `node scripts/release.mjs version 4.0.0-alpha.3`
- Consumes: `node scripts/release.mjs changelog --version 4.0.0-alpha.3 --date 2026-06-25 --tag alpha --registry npm`
- Produces: root and 19 internal packages aligned to `4.0.0-alpha.3`.

- [x] **Step 1: Update internal versions**

Run:

```bash
pnpm release:version 4.0.0-alpha.3
```

Expected: root package and 19 internal package manifests update to `4.0.0-alpha.3`; CDN and legacy runtime packages stay unchanged.

- [x] **Step 2: Update changelog**

Run:

```bash
pnpm release:changelog --version 4.0.0-alpha.3 --date 2026-06-25 --tag alpha --registry npm
```

Expected: `CHANGELOG.md` has a new top entry for `4.0.0-alpha.3`.

- [x] **Step 3: Verify release scope**

Run:

```bash
pnpm release:check
```

Expected: 19 internal packages, 10 independent packages, no release validation errors.

### Task 4: Local Release Gates

**Files:**
- Verify only.

**Interfaces:**
- Consumes: all previous changes.
- Produces: local evidence before commit/push/publish.

- [x] **Step 1: Run local verification**

Run:

```bash
git diff --check
pnpm workflow:check
pnpm test:rules
pnpm release:check
pnpm ci:verify
pnpm empbuild
pnpm release:publish:dry -- --skip-build
```

Expected: every command exits 0. Dry-run prints publish commands for `4.0.0-alpha.3` and does not publish.

- [x] **Step 2: Confirm CI workflow publish safety**

Run:

```bash
rg -n "NODE_AUTH_TOKEN|npm publish|release:publish" .github/workflows/ci.yml
```

Expected: no matches and exit code 1.

### Task 5: Commit And Sync Code

**Files:**
- Commit all intentional release/CI/plan files.

**Interfaces:**
- Produces: commit `chore(release): prepare 4.0.0-alpha.3`.
- Produces: `origin/v4` updated.

- [ ] **Step 1: Inspect and stage scoped changes**

Run:

```bash
git status --short
git diff --stat
```

Expected: only release/CI/plan/changelog files are changed.

- [ ] **Step 2: Commit**

Run:

```bash
git add package.json CHANGELOG.md scripts/emp-workflow-check.mjs .superpowers/plans/2026-06-25-alpha3-release-ci-plan.md packages/*/package.json
git commit -m "chore(release): prepare 4.0.0-alpha.3"
```

Expected: commit succeeds.

- [ ] **Step 3: Push**

Run:

```bash
git push origin v4
```

Expected: `origin/v4` advances to the new commit.

### Task 6: Verify Remote CI And Publish npm

**Files:**
- Remote GitHub Actions only.

**Interfaces:**
- Consumes: `gh run list`, `gh run watch`, `gh workflow run`.
- Produces: passing CI run and publish workflow result.

- [ ] **Step 1: Watch CI for pushed commit**

Run:

```bash
gh run list --repo empjs/emp --branch v4 --limit 5
gh run watch <ci-run-id> --repo empjs/emp --exit-status
```

Expected: CI run for the new commit completes successfully.

- [ ] **Step 2: Trigger publish workflow**

Run:

```bash
gh workflow run Publish --repo empjs/emp --ref v4 -f dry_run=false -f package=
```

Expected: workflow dispatch is accepted.

- [ ] **Step 3: Watch publish workflow**

Run:

```bash
gh run list --repo empjs/emp --workflow Publish --limit 5
gh run watch <publish-run-id> --repo empjs/emp --exit-status
```

Expected: publish workflow completes successfully.

- [ ] **Step 4: Verify npm dist-tags**

Run:

```bash
npm view @empjs/cli dist-tags --json
npm view @empjs/share dist-tags --json
```

Expected: both show `"alpha": "4.0.0-alpha.3"`.

### Task 7: Next-Step Plan

**Files:**
- Create: `.superpowers/plans/2026-06-25-v4-next-after-alpha3.md`

**Interfaces:**
- Produces: concrete next plan after alpha.3.

- [ ] **Step 1: Write next plan**

Create a concise plan covering:

- migrate remaining Node legacy tests into root real-test matrix or document exceptions
- add apps acceptance builds to CI
- resolve CDN `DefinePlugin process.env.NODE_ENV` warnings
- update consumer migration docs for alpha users
- define beta readiness gates

- [ ] **Step 2: Validate documentation changes**

Run:

```bash
git diff --check
pnpm workflow:check
```

Expected: pass.

## Self-Review

- Spec coverage: alpha.3 versioning, code sync, npm publish, CI verification, and next-step planning all map to a task.
- Placeholder scan: this plan contains no `TBD`, `TODO`, or deferred implementation marker.
- Type consistency: root scripts, release scripts, GitHub workflow names, and validation commands match the current checkout.
