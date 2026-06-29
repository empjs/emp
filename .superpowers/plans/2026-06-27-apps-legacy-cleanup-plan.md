# Apps Legacy Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shrink `apps/**` from the current legacy-heavy portfolio to the smallest real acceptance surface that still proves EMP v4 build, Module Federation, Vue 3, Tailwind v4, React 19, and library runtime support.

**Architecture:** Keep `scripts/apps.mjs` as the discovery and structural validation entry. Make `scripts/apps.catalog.mjs` the authoritative app portfolio contract, with Rstest rules proving the target surface and deletion candidates. Execute deletion in small batches after root scripts, docs, and acceptance tests no longer reference removed apps.

**Tech Stack:** Node.js `^20.19.0 || >=22.12.0`, `pnpm@10.33.0`, `@rstest/core@0.10.6`, Playwright through existing Rstest MF browser smoke, existing EMP CLI/Rspack/Rslib build scripts.

## Execution Result

- Status: completed on 2026-06-29.
- Report: `.superpowers/reports/2026-06-29-apps-legacy-cleanup-report.html`.
- Apps result: 49 package-bearing apps reduced to 13 retained apps.
- Verification result: `workflow:check`, `ci:verify`, `apps:acceptance`, `test:library-output`, `git diff --check`, HTML link check, and `codegraph sync . && codegraph status .` passed.
- Additional fix discovered by acceptance: `packages/lib-react-17` and `packages/lib-vue-2` now emit package metadata-compatible `runtime.d.ts` and `runtime.d.cts` declaration files.

## Global Constraints

- Communication and review output stay Chinese by default.
- Work from the current `v4` checkout and re-run `git status --short --branch` before each deletion batch.
- Current live discovery uses CodeGraph, not `codebase-memory-mcp`: `codex mcp list` does not include `codebase-memory-mcp`, `codegraph sync .` succeeded, and `codegraph status .` is up to date.
- Do not delete an app while `package.json`, `.github/workflows/**`, `scripts/**`, package README, or website docs still reference it as a runnable command.
- Default acceptance remains small: only `rspack2-modern-module`, `rspack2-optimization`, `mf-host`, `mf-app`, `vue-3-base`, `vue-3-project`, `tailwind-4`, and `react-19-tanstack`.
- Module Federation default real test stays one paired browser path: `@empjs/share` runtime + `mf-host` + `mf-app`.
- Tailwind default support keeps v4 only. Tailwind v2/v3 app demos are legacy cleanup candidates, not default acceptance projects.
- `unpkg-demo` / `unpkg-lib` style library output scenarios must be covered by existing Rslib/CDN package smoke before app deletion is final.
- `apps/**` and `website` remain excluded from release packages.
- New or updated tests use Rstest. Do not add new `node:test`, Vitest, Jest, Mocha, or browser scripts outside the unified root test entry.
- Do not submit generated files, caches, local indexes, `node_modules/`, `dist/`, `output/`, `.codegraph/`, `.turbo/`, `.rslib/`, or `.rspack-cache/`.

## Current Live Audit

- Branch: `v4...origin/v4`.
- Workspace app count: 49 package-bearing directories under `apps/**`.
- Default real acceptance apps: 8.
- Existing compat-only groups in `scripts/apps.catalog.mjs`: 25 apps.
- Uncataloged old apps: 16 apps.
- `MERGE_CANDIDATES` is currently empty, so cleanup intent is not enforced by tests.
- Existing Rstest coverage already includes:
  - `scripts/apps.rules.test.ts`
  - `scripts/apps.acceptance.test.ts`
  - `scripts/apps.mf-browser.test.ts`
  - `scripts/library-output.smoke.test.ts`
- Existing `scripts/library-output.smoke.test.ts` already builds representative Rslib/CDN packages and serves runtime assets over HTTP, so it is the replacement path for old library/unpkg app demos.

## Target Portfolio

Default acceptance remains 8 apps:

| Capability | Keep |
| --- | --- |
| Rspack 2 baseline | `rspack2-modern-module` |
| Rspack optimization | `rspack2-optimization` |
| React Module Federation browser path | `mf-host`, `mf-app` |
| Vue 3 app acceptance | `vue-3-base`, `vue-3-project` |
| Tailwind default | `tailwind-4` |
| React 19 router/query | `react-19-tanstack` |

Physical `apps/**` target after cleanup is at most 13 directories:

| Layer | Apps |
| --- | --- |
| Default acceptance | `rspack2-modern-module`, `rspack2-optimization`, `mf-host`, `mf-app`, `vue-3-base`, `vue-3-project`, `tailwind-4`, `react-19-tanstack` |
| Compat canary | `vue-2-base`, `vue-2-project`, `adapter-host`, `adapter-app` |
| Manual comprehensive sample | `demo` |

Everything else must either move to package-level Rstest/Rslib smoke coverage or be deleted.

## Task 1: Make The Catalog Enforce The Cleanup Target

**Files:**
- Modify: `scripts/apps.catalog.mjs`
- Modify: `scripts/apps.rules.test.ts`

**Interfaces:**
- Produces `TARGET_APP_DIRS: string[]` containing the 13-directory physical target.
- Produces `REMOVE_CANDIDATES: Record<string, string[]>` grouped by deletion batch.
- Keeps `DEFAULT_APP_ACCEPTANCE` unchanged at 8 apps.

- [x] **Step 1: Add failing rules**

Add Rstest assertions in `scripts/apps.rules.test.ts`:

```ts
expect(DEFAULT_APP_ACCEPTANCE).toEqual([
  'rspack2-modern-module',
  'rspack2-optimization',
  'mf-host',
  'mf-app',
  'vue-3-base',
  'vue-3-project',
  'tailwind-4',
  'react-19-tanstack',
])
expect(TARGET_APP_DIRS).toHaveLength(13)
expect(REMOVE_CANDIDATES['batch-1-uncataloged']).toEqual([
  'app-and-host',
  'daisyui-demo',
  'local-build-remote-dev-demo',
  'mf-split-chunk',
  'mf-v3-host',
  'old-func-demo',
  'react-19-runtime',
  'react-router-demo',
  'shadcn-ui',
  'vue-3-with-vue-2',
])
expect(REMOVE_CANDIDATES['batch-2-root-script-cleanup']).toEqual([
  'esm-react-app',
  'esm-react-host',
  'react-eager-app',
  'react-eager-host',
  'react-wouter',
  'unpkg-demo',
])
```

- [x] **Step 2: Run RED**

Run:

```bash
corepack pnpm@10.33.0 test:rules
```

Expected: fails because `TARGET_APP_DIRS` and `REMOVE_CANDIDATES` do not exist.

- [x] **Step 3: Add catalog exports**

Add `TARGET_APP_DIRS` and `REMOVE_CANDIDATES` to `scripts/apps.catalog.mjs`. Keep `DEFAULT_APP_ACCEPTANCE` unchanged.

- [x] **Step 4: Run GREEN**

Run:

```bash
corepack pnpm@10.33.0 test:rules
```

Expected: passes and proves the cleanup target is now machine-readable.

## Task 2: Clean Root Scripts Before Directory Deletion

**Files:**
- Modify: `package.json`
- Modify: `scripts/apps.rules.test.ts`

**Interfaces:**
- Produces root scripts that reference only target apps or package-level Rslib/CDN smoke targets.
- Removes or rewrites stale commands for `esm-react-*`, `react-eager-*`, `react-wouter`, and `unpkg-demo`.

- [x] **Step 1: Add failing stale-reference rule**

Add a Rstest rule that reads root `package.json` scripts and fails if any script references a `REMOVE_CANDIDATES` app.

- [x] **Step 2: Run RED**

Run:

```bash
corepack pnpm@10.33.0 test:rules
```

Expected: fails on current root scripts such as `esm`, `esm:prod`, `eager`, and `cloudflare:mf-esm`.

- [x] **Step 3: Rewrite scripts**

Remove stale demo commands that are not release gates. Keep `mf`, `mf:prod`, `vue`, `vue:prod`, and `cloudflare:mf-vue3`. Keep `vue2` and `vue2:prod` only because `vue-2-base` and `vue-2-project` remain compat canaries.

- [x] **Step 4: Run GREEN**

Run:

```bash
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 apps:check
```

Expected: both pass before deleting directories.

## Task 3: Delete The First Uncataloged Old App Batch

**Files:**
- Delete: `apps/app-and-host/**`
- Delete: `apps/daisyui-demo/**`
- Delete: `apps/local-build-remote-dev-demo/**`
- Delete: `apps/mf-split-chunk/**`
- Delete: `apps/mf-v3-host/**`
- Delete: `apps/old-func-demo/**`
- Delete: `apps/react-19-runtime/**`
- Delete: `apps/react-router-demo/**`
- Delete: `apps/shadcn-ui/**`
- Delete: `apps/vue-3-with-vue-2/**`
- Modify: `scripts/apps.catalog.mjs`
- Modify: `scripts/apps.rules.test.ts`

**Interfaces:**
- Removes apps with no default acceptance role, no target compat role, and no required root script after Task 2.
- Keeps deletion grouped so failures point to a small set of directories.

- [x] **Step 1: Delete batch 1 directories**

Remove the 10 directories listed above.

- [x] **Step 2: Move the batch to completed catalog state**

Update `REMOVE_CANDIDATES` so batch 1 is either removed from active candidates or marked as completed through a `REMOVED_APP_DIRS` export checked by tests.

- [x] **Step 3: Verify**

Run:

```bash
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 apps:check
corepack pnpm@10.33.0 test:apps:single
```

Expected: all pass. `test:apps:single` still builds only the 8 default real acceptance apps.

## Task 4: Replace Library/Unpkg/Esm/Eager/Wouter Old Apps With Existing Package Smoke

**Files:**
- Delete: `apps/esm-react-app/**`
- Delete: `apps/esm-react-host/**`
- Delete: `apps/react-eager-app/**`
- Delete: `apps/react-eager-host/**`
- Delete: `apps/react-wouter/**`
- Delete: `apps/unpkg-demo/**`
- Modify: `scripts/library-output.smoke.test.ts`
- Modify: `scripts/static-services.config.mjs`
- Modify: `scripts/apps.rules.test.ts`

**Interfaces:**
- Keeps library output validation in `scripts/library-output.smoke.test.ts`.
- Keeps React router package output validation in static service smoke instead of app demos.
- Does not add new apps for Rslib.

- [x] **Step 1: Strengthen package smoke if needed**

Ensure `scripts/library-output.smoke.test.ts` covers `cdn-react-wouter`, `cdn-react-tanstack`, and the representative `lib-*` / `emp-share` runtime assets currently replacing app demos.

- [x] **Step 2: Verify replacement coverage**

Run:

```bash
corepack pnpm@10.33.0 test:library-output
```

Expected: passes and serves representative JS assets over HTTP with CORS.

- [x] **Step 3: Delete batch 2 directories**

Remove the 6 directories listed above.

- [x] **Step 4: Verify**

Run:

```bash
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 apps:check
corepack pnpm@10.33.0 test:library-output
```

Expected: all pass, and no root script references deleted apps.

## Task 5: Collapse Compat Groups To The 13-App Physical Target

**Files:**
- Delete: `apps/adapter-vue2-host/**`
- Delete: `apps/adapter-vue3-host/**`
- Delete: `apps/vue3-in-vue2/**`
- Delete: `apps/auto-pages/**`
- Delete: `apps/es5-import-demo/**`
- Delete: `apps/mobile-vw-rem/**`
- Delete: `apps/pixi-js-demo/**`
- Delete: `apps/proxy-demo/**`
- Delete: `apps/emp-window-demo/**`
- Delete: `apps/rtHost/**`
- Delete: `apps/rtLayout/**`
- Delete: `apps/rtProvider/**`
- Delete: `apps/react-16-adapter-18/**`
- Delete: `apps/react-18-runtime/**`
- Delete: `apps/runtime-18-app/**`
- Delete: `apps/runtime-18-host/**`
- Delete: `apps/tailwind-2/**`
- Delete: `apps/tailwind-3/**`
- Delete: `apps/vue-2-element/**`
- Delete: `apps/vue-2-stylus/**`
- Modify: `scripts/apps.catalog.mjs`
- Modify: `scripts/apps.rules.test.ts`
- Modify: `website/docs/zh/**/*.mdx`

**Interfaces:**
- Leaves only `TARGET_APP_DIRS` under `apps/**`.
- Keeps Vue 2 compat through `vue-2-base` and `vue-2-project`.
- Keeps adapter compat through `adapter-host` and `adapter-app`.
- Keeps Tailwind v4 only.

- [x] **Step 1: Add exact target directory test**

Add a Rstest rule:

```ts
expect(appDirs.sort()).toEqual(TARGET_APP_DIRS.toSorted())
```

- [x] **Step 2: Run RED**

Run:

```bash
corepack pnpm@10.33.0 test:rules
```

Expected: fails because old compat directories still exist.

- [x] **Step 3: Delete compat old directories and update docs**

Delete the 20 directories listed above. Update website docs that referenced deleted examples so they point to `tailwind-4`, `vue-2-base` / `vue-2-project`, `vue-3-base` / `vue-3-project`, `mf-host` / `mf-app`, or package-level static service smoke.

- [x] **Step 4: Run GREEN**

Run:

```bash
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 apps:check
corepack pnpm@10.33.0 apps:acceptance
```

Expected: all pass with 13 remaining apps.

## Task 6: Final Release-Quality Verification

**Files:**
- Read: `git diff --stat`
- Read: `git status --short --branch`
- Read: `.github/workflows/ci.yml`

**Interfaces:**
- Produces final evidence that app cleanup did not weaken the beta support gates.

- [x] **Step 1: Run full local gates**

Run:

```bash
corepack pnpm@10.33.0 workflow:check
corepack pnpm@10.33.0 ci:verify
corepack pnpm@10.33.0 empbuild
corepack pnpm@10.33.0 apps:acceptance
git diff --check
```

Expected: all pass.

- [x] **Step 2: Confirm portfolio count**

Run:

```bash
find apps -maxdepth 2 -name package.json -print | wc -l
corepack pnpm@10.33.0 apps:list
```

Expected: exactly 13 app package directories, and the list matches `TARGET_APP_DIRS`.

- [x] **Step 3: Prepare review package**

Summarize:

- deleted app directories by batch;
- replacement tests that cover removed use cases;
- commands run and results;
- any docs links updated;
- remaining risk, especially Vue 2 and adapter compat coverage.
