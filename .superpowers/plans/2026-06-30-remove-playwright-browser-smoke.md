# Remove Playwright Browser Smoke Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the root Playwright dependency and the MF browser smoke target that requires it.

**Architecture:** Treat this as removing a no-longer-wanted browser E2E lane rather than replacing it with Rstest Browser Mode. Keep the remaining real app acceptance coverage through `test:apps:single`, `apps:check`, `empbuild`, and `test:library-output`. Update root test target metadata, workflow guard, CI, and rule tests so the repository contract no longer references Playwright or `test:apps:mf`.

**Tech Stack:** `pnpm@10.33.0`, `@rstest/core@0.10.6`, GitHub Actions, root `scripts/run-root-test.mjs` / `scripts/root-test-targets.mjs` / `scripts/emp-workflow-check.mjs`.

## Global Constraints

- Default communication and final reporting must be in Chinese.
- Preserve unrelated dirty changes already present in `apps/demo/package.json` and `pnpm-lock.yaml`.
- Do not modify `apps/**`, `website`, `packages/cdn-*`, or `packages/lib-*`.
- Use `corepack pnpm`, not bare global `pnpm`, for repo commands.
- Do not add `@rstest/browser`; without Playwright it has no runnable provider in `@rstest/core@0.10.6`.
- CI workflow must not introduce `NODE_AUTH_TOKEN`, `npm publish`, or `release:publish`.
- Because this removes browser E2E coverage, final delivery must explicitly call out that MF browser smoke coverage is removed.

---

### Task 1: Add Removal Guards

**Files:**
- Modify: `test/apps.rules.test.ts`
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**
- Consumes: current root `package.json`, `.github/workflows/ci.yml`, `scripts/root-test-targets.mjs`.
- Produces: failing Rstest rules that define the desired no-Playwright contract.

- [x] **Step 1: Replace CI Playwright rule with no-Playwright rule**

In `test/apps.rules.test.ts`, replace the existing `CI apps job installs Playwright Chromium before browser acceptance` test with a test that asserts root devDependencies do not include `playwright`, CI does not run `pnpm exec playwright install --with-deps chromium`, `apps:acceptance` does not run `pnpm test:apps:mf`, and `scripts/root-test-targets.mjs` does not mention `apps-mf` or `test/apps.mf-browser.test.ts`.

- [x] **Step 2: Update root script ordering expectation**

In `test/toolchain.rules.test.ts`, remove `test:apps:mf` from the expected `Object.keys(pkg.scripts)` array and update the `apps:acceptance` expected command so it no longer includes `corepack pnpm test:apps:mf`.

- [x] **Step 3: Verify RED**

Run: `corepack pnpm test:rules -- --reporter dot`

Expected: FAIL because `package.json`, CI, and root target metadata still reference Playwright and `test:apps:mf`.

### Task 2: Remove Playwright Lane

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `.github/workflows/ci.yml`
- Modify: `apps/README.md`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `scripts/emp-workflow-check.mjs`
- Delete: `test/apps.mf-browser.test.ts`

**Interfaces:**
- Consumes: Task 1 failing rules.
- Produces: repository config with no Playwright dependency and no MF browser smoke target.

- [x] **Step 1: Remove root Playwright dependency**

Run: `corepack pnpm remove -Dw playwright`

Expected: root `package.json` no longer contains `playwright`; `pnpm-lock.yaml` removes the root importer entry for `playwright`.

- [x] **Step 2: Remove root MF browser target**

Update `scripts/root-test-targets.mjs` by deleting the `['apps-mf', ['test/apps.mf-browser.test.ts']]` target and the `'test:apps:mf': 'apps-mf'` package script mapping.

- [x] **Step 3: Remove root package script references**

Update `package.json` by deleting the `test:apps:mf` script and removing `corepack pnpm test:apps:mf &&` from `apps:acceptance`.

- [x] **Step 4: Remove CI Playwright install**

Delete the `Install Playwright Chromium` step from `.github/workflows/ci.yml`.

- [x] **Step 5: Remove obsolete browser smoke file**

Delete `test/apps.mf-browser.test.ts`.

- [x] **Step 6: Update workflow guard**

Update `scripts/emp-workflow-check.mjs` so it no longer requires `pnpm test:apps:mf`, and instead fails if `apps:acceptance` still includes `pnpm test:apps:mf`.

- [x] **Step 7: Remove stale app matrix docs**

Update `apps/README.md` so the React Module Federation row no longer documents the deleted `pnpm test:apps:mf` command or claims browser smoke coverage.

### Task 3: Verify Removal

**Files:**
- Read: all changed files.

**Interfaces:**
- Consumes: Task 2 implementation.
- Produces: verification evidence for no-Playwright contract.

- [x] **Step 1: Verify rules pass**

Run: `corepack pnpm test:rules -- --reporter dot`

Expected: PASS.

- [x] **Step 2: Verify workflow guard passes**

Run: `corepack pnpm workflow:check`

Expected: PASS.

- [x] **Step 3: Verify package graph no longer has Playwright**

Run: `corepack pnpm why playwright`

Expected: no dependency tree for `playwright`.

- [x] **Step 4: Verify no source references remain**

Run: `rg -n "playwright|@playwright|chromium\\.launch|test:apps:mf|apps-mf|apps\\.mf-browser|pnpm exec playwright" -S . --glob '!node_modules' --glob '!.git' --glob '!.codegraph' --glob '!dist' --glob '!output' --glob '!coverage'`

Expected: no matches except historical plan text if the plan is intentionally kept.

- [x] **Step 5: Verify diff formatting**

Run: `git diff --check`

Expected: no output and exit code 0.

- [x] **Step 6: Verify full local CI gate**

Run: `corepack pnpm ci:verify`

Expected: PASS.
