# Ponytail High Confidence Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete high-confidence dead code, duplicated docs, empty placeholders, and unused dependencies found by the Ponytail audit without changing public compatibility surfaces that need separate API review.

**Architecture:** Keep this cleanup boring: remove files that are unreferenced by CodeGraph and `rg`, flatten only catalog metadata that exists for already-retired apps, and leave medium-risk API or build-template consolidation items untouched. The current branch is `v4`, and the first push before this plan was verified with `git push origin v4` returning `Everything up-to-date`.

**Tech Stack:** TypeScript, Vue, React, Rslib, Rstest, pnpm 10.33.0 via `corepack pnpm`, CodeGraph.

## Global Constraints

- Default communication and final delivery are Chinese.
- Current live checkout is authoritative; do not rely on old workflow assumptions.
- Use CodeGraph first for cross-package code discovery; use `rg`, `find`, and direct reads for scripts, configs, docs, and string literals.
- Do not modify `packages/cdn-*` or `packages/lib-*` version lines or release scope in this plan.
- Do not change `.github/workflows/publish.yml`.
- Do not commit generated output, local cache, `dist`, `output`, `coverage`, `.codegraph`, `.turbo`, `.rslib`, `.rspack-cache`, or `node_modules`.
- Use `corepack pnpm`, not bare `pnpm`, for repository verification.
- Before final commit/push, run at least `corepack pnpm workflow:check`, `git diff --check`, and tests matching the changed files; run broader gates when dependency or package metadata changes.
- Medium-risk audit candidates are out of scope for this plan: static-server rewrite, PostCSS/LightningCSS API removal, adapter API collapse, CDN/lib config helper extraction, app deletion, root Rstest wrapper deletion, and package runner migration.

---

### Task 1: Delete Unreferenced CLI Server Sidecars

**Files:**
- Delete: `packages/cli/src/helper/hmr/client.ts`
- Delete: `packages/cli/src/helper/hmr/config.ts`
- Delete: `packages/cli/src/helper/hmr/index.ts`
- Delete: `packages/cli/src/helper/hmr/overlay.ts`
- Delete: `packages/cli/src/helper/hmr/process-update.ts`
- Delete: `packages/cli/src/helper/hono.ts`
- Delete: `packages/cli/src/server/express/dev.ts`
- Delete: `packages/cli/src/server/express/prod.ts`
- Delete: `packages/cli/src/server/hono/dev.ts`
- Delete: `packages/cli/src/server/hono/devServer/devMiddleware.ts`
- Delete: `packages/cli/src/server/hono/prod.ts`
- Modify: `packages/cli/src/server/index.ts`

**Interfaces:**
- Consumes: current `packages/cli/src/server/connect/dev.ts` and `packages/cli/src/server/connect/prod.ts` exports.
- Produces: server index that exports only connect `DevServer` and `ProdServer` without comments pointing to deleted Hono files.

- [x] **Step 1: Verify no inbound references**

Run:
```bash
rg -n "helper/hmr|from 'src/helper/hmr|helper/hono|server/express|server/hono" packages apps scripts test docs website package.json -g '!node_modules' -g '!dist' -g '!output'
```
Expected: no live imports. Comments in `packages/cli/src/server/index.ts` may appear before deletion.

- [x] **Step 2: Delete the sidecar files and remove stale commented exports**

Delete the listed files and leave `packages/cli/src/server/index.ts` as:
```ts
import {DevServer} from './connect/dev'
import {ProdServer} from './connect/prod'
export {DevServer, ProdServer}
```

- [x] **Step 3: Verify CLI package build/test coverage**

Run:
```bash
corepack pnpm --filter @empjs/cli test
corepack pnpm test:cli
```
Expected: exit 0.

### Task 2: Delete Unreferenced Runtime And Polyfill Sidecars

**Files:**
- Delete: `packages/emp-share/src/runtime/index.pre.version.ts`
- Delete: `packages/emp-share/src/runtime/sdk-prev.ts`
- Delete: `packages/emp-share/src/library/wSdk.ts`
- Delete: `packages/emp-share/src/library/sdkPolyfill.ts`
- Delete: `packages/emp-polyfill/core-build.js`
- Delete: `packages/emp-polyfill/src/full.ts`
- Delete: `packages/emp-polyfill/src/stable.ts`
- Delete: `packages/emp-polyfill/src/actual.ts`
- Delete: `packages/emp-polyfill/src/stage2.ts`
- Delete: `packages/emp-polyfill/src/null.ts`
- Modify: `packages/emp-polyfill/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: `packages/emp-share/rslib.config.ts` entries for current runtime/sdk/library output.
- Consumes: `packages/emp-polyfill/rslib.config.ts` entries `61`, `c71`, and `es`.
- Produces: package metadata without unused `core-js-builder`, `core-js-bundle`, and `core-js-pure`.

- [x] **Step 1: Verify no inbound references**

Run:
```bash
rg -n "index\\.pre\\.version|sdk-prev|wSdk|sdkPolyfill|core-build|src/full|src/stable|src/actual|src/stage2|src/null" packages apps scripts test docs website package.json -g '!node_modules' -g '!dist' -g '!output'
```
Expected: no live references outside the files being deleted.

- [x] **Step 2: Delete sidecar files and remove unused dependencies**

Remove these dependency keys from `packages/emp-polyfill/package.json`:
```json
"core-js-builder": "^3.45.1",
"core-js-bundle": "^3.45.1",
"core-js-pure": "^3.45.1"
```

- [x] **Step 3: Refresh lockfile**

Run:
```bash
corepack pnpm install --lockfile-only
```
Expected: exit 0 and `pnpm-lock.yaml` no longer has package dependency entries for those three removed direct dependencies under `packages/emp-polyfill`.

- [x] **Step 4: Verify package builds/tests**

Run:
```bash
corepack pnpm --filter @empjs/share test
corepack pnpm --filter @empjs/polyfill build
corepack pnpm test:library-output
```
Expected: exit 0.

### Task 3: Delete Backup, Dead Scripts, Duplicate Docs, And Empty Placeholders

**Files:**
- Delete: `packages/bridge-vue2/backup/index.ts`
- Delete: `scripts/agent-finish.mjs`
- Delete: `scripts/tsconfig-modernize.mjs`
- Delete: `scripts/rslib-presets.mjs`
- Delete: `apps/demo/PROXY_CONFIG_UPDATE.md`
- Delete: `apps/demo/PROXY_TEST.md`
- Delete: `apps/demo/README_PROXY_TEST.md`
- Delete: `apps/demo/PROXY_TEST_SUMMARY.md`
- Delete: `apps/demo/PROXY_QUICKSTART.md`
- Delete: `apps/adapter-app/README.md`
- Delete: `website/docs/zh/plugin/tool/share.mdx`
- Delete: `website/docs/zh/hello.md`
- Delete: `website/docs/zh/api/index.md`
- Delete: `website/docs/zh/api/_meta.json`
- Delete: `website/docs/zh/guide/optimize/productVolume.mdx`
- Delete: `website/docs/zh/guide/optimize/_meta.json`
- Modify: `package.json`
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**
- Consumes: direct git commands for commit/push instead of `agent:finish`.
- Consumes: `website/docs/zh/emp/share.mdx` as the remaining `@empjs/share` doc page.
- Produces: root package scripts and toolchain test expectations without `agent:finish`.

- [x] **Step 1: Verify files are not required by package scripts or docs nav**

Run:
```bash
rg -n "agent:finish|tsconfig-modernize|scripts/rslib-presets\\.mjs|PROXY_CONFIG_UPDATE|PROXY_TEST|README_PROXY_TEST|PROXY_TEST_SUMMARY|PROXY_QUICKSTART|plugin/tool/share|zh/hello|guide/optimize/productVolume|zh/api/index" . -g '!node_modules' -g '!dist' -g '!output'
```
Expected: only files being deleted and tests that need update should appear.

- [x] **Step 2: Delete listed files and remove `agent:finish` script**

Remove this script key from root `package.json`:
```json
"agent:finish": "node scripts/agent-finish.mjs"
```
Update `test/toolchain.rules.test.ts` so the expected root scripts no longer include `agent:finish`.

- [x] **Step 3: Verify docs/toolchain rules**

Run:
```bash
corepack pnpm test:toolchain
corepack pnpm workflow:check
```
Expected: exit 0.

### Task 4: Flatten Retired Apps Catalog Metadata

**Files:**
- Modify: `scripts/apps.catalog.mjs`
- Modify: `test/apps.rules.test.ts`
- Modify: `apps/README.md`

**Interfaces:**
- Consumes: existing retired app directory names from `REMOVE_CANDIDATES`.
- Produces: `RETIRED_APP_DIRS` as a single sorted list for stale script/doc checks.

- [x] **Step 1: Replace batch-only metadata with one list**

In `scripts/apps.catalog.mjs`, replace `COMPAT_APP_GROUPS`, `REMOVE_CANDIDATES`, and empty `MERGE_CANDIDATES` with:
```js
export const RETIRED_APP_DIRS = [
  'adapter-vue2-host',
  'adapter-vue3-host',
  'app-and-host',
  'auto-pages',
  'daisyui-demo',
  'emp-window-demo',
  'es5-import-demo',
  'esm-react-app',
  'esm-react-host',
  'local-build-remote-dev-demo',
  'mf-split-chunk',
  'mf-v3-host',
  'mobile-vw-rem',
  'old-func-demo',
  'pixi-js-demo',
  'proxy-demo',
  'react-16-adapter-18',
  'react-18-runtime',
  'react-19-runtime',
  'react-eager-app',
  'react-eager-host',
  'react-router-demo',
  'react-wouter',
  'rtHost',
  'rtLayout',
  'rtProvider',
  'runtime-18-app',
  'runtime-18-host',
  'shadcn-ui',
  'tailwind-2',
  'tailwind-3',
  'unpkg-demo',
  'vue-2-element',
  'vue-2-stylus',
  'vue-3-with-vue-2',
  'vue3-in-vue2',
]
```

- [x] **Step 2: Update rules tests**

In `test/apps.rules.test.ts`, import `RETIRED_APP_DIRS` instead of removed exports. Keep these checks:
```ts
expect(RETIRED_APP_DIRS).toEqual([...RETIRED_APP_DIRS].sort())
expect(RETIRED_APP_DIRS.every(dir => !appDirs.includes(dir))).toBe(true)
```
Use `RETIRED_APP_DIRS` for stale root script and public doc reference checks.

- [x] **Step 3: Trim `apps/README.md` compat packs**

Remove rows that recommend already retired app directories. Keep the retained app surface and local static commands.

- [x] **Step 4: Verify apps rules**

Run:
```bash
corepack pnpm test:rules
corepack pnpm apps:check
```
Expected: exit 0.

### Task 5: Final Verification, Commit, And Push

**Files:**
- Verify all files changed by Tasks 1-4.

**Interfaces:**
- Consumes: changed source, docs, tests, package metadata, and lockfile.
- Produces: one scoped cleanup commit on `v4`, pushed to `origin/v4`.

- [x] **Step 1: Run final gates**

Run:
```bash
corepack pnpm workflow:check
corepack pnpm ci:verify
corepack pnpm empbuild
corepack pnpm apps:acceptance
git diff --check
```
Expected: all exit 0.

- [x] **Step 2: Inspect scoped diff**

Run:
```bash
git status --short
git diff --stat
git diff -- package.json packages/emp-polyfill/package.json pnpm-lock.yaml
```
Expected: only files from this plan changed; dependency diff only removes unused polyfill direct dependencies.

- [x] **Step 3: Commit and push**

Run:
```bash
git add -- .superpowers/plans/2026-06-29-ponytail-high-confidence-cleanup.md package.json pnpm-lock.yaml apps/README.md scripts/apps.catalog.mjs test/apps.rules.test.ts test/toolchain.rules.test.ts packages/cli/src/server/index.ts packages/emp-polyfill/package.json
git add -u -- packages/cli/src/helper/hmr packages/cli/src/helper/hono.ts packages/cli/src/server/express packages/cli/src/server/hono packages/emp-share/src/runtime/index.pre.version.ts packages/emp-share/src/runtime/sdk-prev.ts packages/emp-share/src/library/wSdk.ts packages/emp-share/src/library/sdkPolyfill.ts packages/emp-polyfill/core-build.js packages/emp-polyfill/src/full.ts packages/emp-polyfill/src/stable.ts packages/emp-polyfill/src/actual.ts packages/emp-polyfill/src/stage2.ts packages/emp-polyfill/src/null.ts packages/bridge-vue2/backup scripts/agent-finish.mjs scripts/tsconfig-modernize.mjs scripts/rslib-presets.mjs apps/demo/PROXY_CONFIG_UPDATE.md apps/demo/PROXY_TEST.md apps/demo/README_PROXY_TEST.md apps/demo/PROXY_TEST_SUMMARY.md apps/demo/PROXY_QUICKSTART.md apps/adapter-app/README.md website/docs/zh/plugin/tool/share.mdx website/docs/zh/hello.md website/docs/zh/api/index.md website/docs/zh/api/_meta.json website/docs/zh/guide/optimize/productVolume.mdx website/docs/zh/guide/optimize/_meta.json
git diff --cached --check
git commit -m "chore: remove high-confidence dead code"
git push origin v4
git fetch origin v4
git rev-parse HEAD
git rev-parse origin/v4
```
Expected: cached diff check exits 0, commit succeeds, push succeeds, and `HEAD` equals `origin/v4`.
