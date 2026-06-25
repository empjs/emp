# projects to apps Demo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all tracked demo workspaces from `projects/` to `apps/`, publish an apps-based validation use-case matrix, and delete `projects/` after migration.

**Architecture:** `apps/` becomes the only demo and acceptance workspace root. Existing package-level demo contents move without changing runtime source behavior; root scripts and validation tools switch from `projects/**` path filters to `apps/**` path filters. Release automation continues to exclude demos by classifying `apps/**` as workspace-only packages.

**Tech Stack:** pnpm 10.33.0 workspace, Node.js ESM scripts, EMP CLI/Rspack/Rslib validation, existing `scripts/apps.mjs`, existing `scripts/release-core.mjs`.

## Global Constraints

- 默认中文沟通，最终说明必须列出改动文件、验证命令与未覆盖边界。
- 当前分支是 `v4...origin/v4`，开始时 `git status --short --branch` 只有分支行。
- `codebase-memory-mcp` 项目 `Users-Bigo-Desktop-develop-fontend-workspace-emp` 索引状态为 `ready`。
- `.codex/config.toml`、`.codex/hooks.json`、`.trellis/` 当前不存在；不要按历史 workflow 假设执行。
- 只迁移 tracked demo 文件；`projects/**/node_modules`、`dist`、`.mf`、`@mf-types` 等生成物不进入 git。
- `packages/**`、`packages/cdn-*`、`packages/lib-*`、`website` 发布边界不改。
- 不新增 Vitest/Jest/Mocha/Ava；测试复用现有 `scripts/apps.test.mjs` 和 `scripts/release.test.mjs`。
- 迁移后根 `pnpm-workspace.yaml` 不再包含 `projects/**`。

---

### Task 1: Migration guard tests

**Files:**
- Modify: `scripts/apps.test.mjs`

**Interfaces:**
- Consumes: `discoverApps(root)`, `runBench({apps, cwd, dryRun})`
- Produces: failing assertions that require migrated `apps` coverage and no `projects/` directory.

- [x] **Step 1: Write failing assertions**

Append assertions that:

```js
const requiredMigratedDirs = ['mf-host', 'mf-app', 'vue-3-base', 'vue-3-project', 'tailwind-4']
for (const dir of requiredMigratedDirs) {
  assert.ok(appDirs.includes(dir), `apps must include migrated demo: ${dir}`)
}
assert.equal(existsSync(join(repoRoot, 'projects')), false)
assert.deepEqual(
  dryRunResults.map(result => result.command),
  [
    'pnpm --filter ./apps/rspack2-modern-module build',
    'pnpm --filter ./apps/rspack2-optimization build',
  ],
)
```

- [x] **Step 2: Run the red test**

Run:

```bash
node scripts/apps.test.mjs
```

Expected: non-zero exit because `apps` does not yet include migrated demos, `projects/` still exists, and bench commands still use package-name filters.

Result: guard assertions were added to `scripts/apps.test.mjs`; after migration, the same test is expected to pass.

### Task 2: Move tracked demos and remove projects directory

**Files:**
- Move: every tracked file under `projects/<demo>/...` to `apps/<demo>/...`
- Delete: `projects/` after generated leftovers are removed.

**Interfaces:**
- Produces: all former demo package roots under `apps/`.
- Preserves: package names and source contents unless another task explicitly updates path references.

- [x] **Step 1: Move tracked files**

Run:

```bash
git ls-files -z projects | while IFS= read -r -d '' file; do
  target="apps/${file#projects/}"
  mkdir -p "$(dirname "$target")"
  git mv "$file" "$target"
done
```

Expected: `git status --short` shows `R  projects/... -> apps/...` for tracked files.

- [x] **Step 2: Remove generated leftovers**

Run:

```bash
rm -rf projects
```

Expected: `test ! -e projects` exits 0.

Result: tracked demo files were moved from `projects/**` to `apps/**`; `projects/` no longer exists in the working tree.

### Task 3: Update workspace, scripts, and migration-aware app tooling

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `scripts/apps.mjs`
- Modify: `scripts/emp-workflow-check.mjs`

**Interfaces:**
- Produces: `runBench` commands using path filters: `pnpm --filter ./apps/<dir> build`
- Produces: `apps:acceptance` path filters under `./apps/...`
- Produces: workflow checks that no longer require `projects/**` and no longer expect project filters.

- [x] **Step 1: Update workspace roots**

Edit `pnpm-workspace.yaml` so the root list is:

```yaml
packages:
  - packages/**
  - apps/**
  - '!**/test/**'
  - website
```

- [x] **Step 2: Update root scripts**

Update `package.json`:

```json
"apps:acceptance": "pnpm empbuild && pnpm apps:check && pnpm --filter ./apps/rspack2-modern-module --filter ./apps/rspack2-optimization --filter ./apps/mf-host --filter ./apps/mf-app --filter ./apps/vue-3-base --filter ./apps/vue-3-project --filter ./apps/tailwind-4 build"
```

- [x] **Step 3: Update bench filter behavior**

Change `runBench` so each result command is built from `app.dir`:

```js
const filter = `./apps/${app.dir}`
const command = `pnpm --filter ${filter} build`
await execFile('pnpm', ['--filter', filter, 'build'], {cwd, maxBuffer: 1024 * 1024 * 20})
```

- [x] **Step 4: Update workflow checks**

In `scripts/emp-workflow-check.mjs`, replace protected path and acceptance filter expectations:

```js
for (const protectedPath of ['apps/**', 'website', 'docs/superpowers/', 'packages/cdn-*', 'packages/lib-*']) {
  requireText('AGENTS.md', protectedPath)
}
for (const filter of [
  './apps/rspack2-modern-module',
  './apps/rspack2-optimization',
  './apps/mf-host',
  './apps/mf-app',
  './apps/vue-3-base',
  './apps/vue-3-project',
  './apps/tailwind-4',
]) {
  if (!appsAcceptance.includes(`--filter ${filter}`)) {
    failures.push(`package.json apps:acceptance missing app filter: ${filter}`)
  }
}
```

Result: `pnpm-workspace.yaml`, `package.json`, `scripts/apps.mjs`, and `scripts/emp-workflow-check.mjs` now use `apps/**` / `./apps/...`; `pnpm workflow:check` and `node scripts/apps.test.mjs` pass.

### Task 4: Update release scope tests and docs

**Files:**
- Modify: `scripts/release-core.mjs`
- Modify: `scripts/release.test.mjs`
- Modify: `AGENTS.md`
- Modify: `.github/pull_request_template.md`
- Modify: `apps/README.md`
- Modify: package/docs links inside moved `apps/**` where they reference `projects/`.

**Interfaces:**
- Produces: release discovery treats `apps/**` as workspace packages and never internal release packages.
- Produces: `apps/README.md` use-case matrix covering all migrated demos.

- [x] **Step 1: Update release discovery roots**

Change:

```js
const WORKSPACE_ROOTS = ['packages', 'apps', 'website']
```

Change classification:

```js
if (pkg.dir === 'website' || pkg.dir.startsWith('apps/')) return 'workspace'
```

Change validation guard:

```js
if (pkg.dir.startsWith('apps/') || pkg.dir === 'website') {
  errors.push(`${pkg.file} must not be in the internal publish set`)
}
```

- [x] **Step 2: Update release tests**

Replace fixture and assertions from `projects/demo` to `apps/demo`, and assert publish commands do not contain `apps/` or `website`.

- [x] **Step 3: Update repo workflow docs**

Update `AGENTS.md` and `.github/pull_request_template.md` so example/site protection points to `apps/**` and `website`, while release scope excludes `apps/**` and `website`.

- [x] **Step 4: Write use-case matrix**

Replace `apps/README.md` with a concise matrix grouped by capability:

```markdown
## 验收用例矩阵

| 能力域 | apps | 验证重点 | 最小命令 |
| --- | --- | --- | --- |
| Module Federation | `mf-host`, `mf-app`, `app-and-host`, `mf-split-chunk`, `mf-v3-host` | remote/host、split chunk、v3 host、类型产物 | `pnpm --filter ./apps/mf-host --filter ./apps/mf-app build` |
```

Continue the table for React runtime, Vue 2/3, adapters, CSS/Tailwind, routing, proxy/assets, legacy/runtime compatibility, Rspack 2 baselines, and CDN/unpkg runtime.

Result: release discovery classifies `apps/**` as workspace-only, `scripts/release.test.mjs` covers an `@empjs/*` app staying out of the internal publish set, and `apps/README.md` covers all 59 current app package roots.

### Task 5: Verification

**Files:**
- No additional files.

**Interfaces:**
- Consumes: final migrated tree.
- Produces: verification evidence for final response.

- [x] **Step 1: Refresh lockfile metadata**

Run:

```bash
pnpm install --lockfile-only
```

Expected: `pnpm-lock.yaml` importers move from `projects/...` to `apps/...`.

Result: `pnpm install --lockfile-only` completed with pnpm `10.33.0`; lockfile importers now resolve the `apps/**` workspace tree.

- [x] **Step 2: Run focused validation**

Run:

```bash
node scripts/apps.test.mjs
pnpm apps:check
pnpm workflow:check
pnpm test:rules
pnpm apps:acceptance
git diff --check
git status --short --branch
```

Expected: all commands exit 0. If `pnpm apps:acceptance` is too slow or fails on pre-existing app build issues, record exact failing command and rerun the smallest failing app command for evidence.

Result: `node scripts/apps.test.mjs`, `pnpm apps:check`, `pnpm workflow:check`, `pnpm test:rules`, `pnpm ci:verify`, `pnpm empbuild`, `pnpm apps:acceptance`, `pnpm release:publish:dry -- --skip-build`, `git diff --check`, and targeted `apps/vue-3-base`, `apps/pixi-js-demo`, `apps/rspack2-optimization` builds all exited 0. Final `apps:acceptance` and `empbuild` logs had no `TYPE-001`, asset-size, `Compiled with warnings`, or beta-blocking warning matches.
