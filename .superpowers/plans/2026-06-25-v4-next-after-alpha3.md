# EMP V4 Next Plan After Alpha.3

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move EMP v4 from `4.0.0-alpha.3` to beta readiness by hardening clean-runner validation, closing publish and build warnings, and preparing consumer-facing migration evidence.

**Architecture:** Keep the root verification pipeline as the single acceptance entry. Add clean-runner coverage for package tests, selected app builds, release automation, and browser-facing examples without expanding publish scope beyond the 19 internal v4 packages. Treat warning cleanup and migration docs as beta gates because they affect adoption confidence even when alpha.3 is already published.

**Tech Stack:** Node.js `^20.19.0 || >=22.12.0`, pnpm `10.33.0`, Rstest, Rslib, Rspack, Module Federation, GitHub Actions, npm Trusted Publisher workflow.

## Global Constraints

- Default communication is Chinese, but plan files may use English for stable command and task wording.
- Preserve user changes and keep each task scoped to its listed files.
- Keep `projects/**` and `website` out of release package scope unless a task explicitly validates examples.
- Keep `@empjs/cdn-*` and `@empjs/lib-*` on independent version lines unless a release-scope task explicitly changes them.
- Do not add npm publish credentials to CI. Publishing remains in `.github/workflows/publish.yml` with OIDC.
- New tests should run through the root verification matrix instead of creating a second independent runner.
- Every beta gate must have a command, a clean-runner signal, or a documented exception.

---

### Task 1: Stabilize Clean-Runner Package Tests

**Files:**
- Modify: `package.json`
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: package-level `package.json` files only where tests import built `dist/`

**Interfaces:**
- Produces: package tests that build their required dist files before execution.
- Produces: workflow guards that fail before CI when a new dist-dependent package test omits its build step.

- [x] **Step 1: Inventory dist-dependent tests**

Run:

```bash
rg -n "dist/|\\.\\./dist|node_modules/@empjs/.*/dist" packages --glob 'packages/**/test/**' --glob 'packages/**/tests/**'
```

Expected: every dist-dependent test is mapped to the package script that builds it.

Result: found 7 dist references across `packages/cli`, `packages/emp-chain`, `packages/emp-share`, and `packages/plugin-react`. The original zsh glob form was replaced with stable `rg --glob` filters.

- [x] **Step 2: Add missing package-level build prerequisites**

Update only affected package scripts so `pnpm --filter <package> test` is self-contained from a clean checkout.

Expected: package tests do not rely on root script ordering or stale local artifacts.

Result: no additional package script change was required. Existing package scripts already build before dist-dependent tests.

- [x] **Step 3: Extend workflow guard**

Update `scripts/emp-workflow-check.mjs` to catch newly identified dist-dependent test scripts that do not build first.

Expected: `pnpm workflow:check` fails before implementation and passes after package scripts are fixed.

Result: existing workflow guards already cover `test:cli`, `packages/emp-share`, `packages/emp-chain`, and `packages/plugin-react`.

- [x] **Step 4: Validate**

Run:

```bash
pnpm workflow:check
pnpm ci:verify
```

Expected: both pass locally and on GitHub Actions.

Result: `pnpm workflow:check` and `pnpm ci:verify` passed locally after the inventory and plan command correction.

### Task 2: Add App Acceptance Builds To CI

**Files:**
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`
- Modify: app build scripts only if an existing app lacks a reusable root entry

**Interfaces:**
- Produces: a bounded app acceptance command that proves v4 packages work in representative projects.
- Produces: CI coverage for the selected app acceptance command.

- [x] **Step 1: Select representative apps**

Run:

```bash
pnpm list -r --depth -1
rg -n "\"build\"|\"dev\"|\"test\"" projects apps examples package.json
```

Expected: choose the smallest set that covers CLI creation output, React, Vue, Module Federation, and Tailwind integration.

Result: selected 7 bounded builds: `apps/rspack2-modern-module`, `apps/rspack2-optimization`, `projects/mf-host`, `projects/mf-app`, `projects/vue-3-base`, `projects/vue-3-project`, and `projects/tailwind-4`.

- [x] **Step 2: Create root acceptance script**

Add a root script such as `test:apps` or `apps:check` that runs only deterministic builds or smoke checks.

Expected: the script is bounded enough for CI and does not publish, serve indefinitely, or depend on local caches.

Result: added `apps:acceptance`, which first runs the complete `pnpm empbuild`, then runs `apps:check`, and then runs the selected path-filtered build set. The full package build is required because clean CI runners do not have package `dist/` outputs before app builds, and selected examples can depend on any workspace plugin package.

- [x] **Step 3: Wire CI**

Add the app acceptance script to CI after `pnpm ci:verify` or as a separate job with the same Node and pnpm setup.

Expected: push CI proves both package verification and representative app builds.

Result: added a dedicated CI `apps` job that runs `pnpm apps:acceptance`.

- [x] **Step 4: Validate**

Run:

```bash
pnpm workflow:check
pnpm ci:verify
pnpm apps:acceptance
```

Expected: all pass locally, then remote CI passes on `v4`.

Result: local `pnpm workflow:check`, `pnpm ci:verify`, `pnpm apps:acceptance`, and `git diff --check` passed. First remote run `28159210423` proved the app job needed package dist outputs before app builds. Follow-up runs `28159386049`, `28159517415`, and `28159690192` showed that maintaining a hand-picked package prerequisite list is brittle, so `apps:acceptance` now reuses the complete package build gate. Remote run `28159924701` passed with `verify`, `build`, and `apps` all green. `projects/vue-3-base` still emits an MF DTS warning and asset-size warning but exits 0.

### Task 3: Remove Beta-Blocking Build Warnings

**Files:**
- Modify: `packages/cdn-*/**` only for `DefinePlugin process.env.NODE_ENV` warning fixes
- Modify: `packages/plugin-tailwindcss/**` only for `postcss-import` external warning fixes
- Modify: related tests or fixtures if warnings become assertions

**Interfaces:**
- Produces: `pnpm empbuild` output without known beta-blocking warnings.
- Produces: warning regression checks where practical.

- [x] **Step 1: Capture warning baseline**

Run:

```bash
pnpm empbuild
```

Expected: baseline includes only the current CDN `DefinePlugin process.env.NODE_ENV` conflicts and `plugin-tailwindcss` `postcss-import` external warning.

Result: baseline `pnpm empbuild` reproduced CDN `DefinePlugin process.env.NODE_ENV` conflicts in all 8 `packages/cdn-*` builds. The previously suspected `packages/plugin-tailwindcss` `postcss-import` external warning did not reproduce in the current checkout.

- [x] **Step 2: Fix CDN define conflicts**

Normalize environment definition ownership in the affected CDN packages.

Expected: no duplicated or conflicting `process.env.NODE_ENV` definitions during build.

Result: aligned each CDN lib's Rspack `mode` and `optimization.nodeEnv` with its development/production output env, so the explicit `source.define['process.env.NODE_ENV']` no longer conflicts with Rspack defaults.

- [x] **Step 3: Fix Tailwind external warning**

Resolve the `postcss-import` external type warning without changing runtime semantics for Tailwind users.

Expected: `packages/plugin-tailwindcss` builds without the external warning.

Result: no code change was needed because the `postcss-import` external warning was not present in the captured baseline or follow-up `empbuild` logs.

- [x] **Step 4: Validate**

Run:

```bash
pnpm empbuild
pnpm ci:verify
```

Expected: both pass and the known warning baseline is cleared.

Result: `pnpm empbuild`, `pnpm ci:verify`, `pnpm apps:acceptance`, and `git diff --check` all passed locally. Log scans for `Build warning`, `DefinePlugin`, `Conflicting values`, `postcss-import`, and `external` returned no matches for the package build and CI verification logs. `pnpm apps:acceptance` still reports the previously documented `projects/vue-3-base` Module Federation DTS warning and asset-size warning, but it exits 0 and is outside this CDN package warning cleanup.

### Task 4: Prepare Alpha Consumer Migration Evidence

**Files:**
- Modify: `CHANGELOG.md`
- Modify: relevant docs under the existing documentation structure
- Modify: example configuration files only when needed for verified migration steps

**Interfaces:**
- Produces: consumer-facing guidance for alpha users.
- Produces: verified commands that prove the migration guidance works.

- [ ] **Step 1: Document supported alpha path**

Cover Node and pnpm baselines, Rspack 2 expectations, Module Federation behavior, `empRuntime.version`, and the agent-first `emp create` flow.

Expected: a user can identify whether to install `@empjs/*@alpha` and which package lines remain independent.

- [ ] **Step 2: Add command evidence**

Run and record:

```bash
pnpm release:check
pnpm ci:verify
pnpm empbuild
```

Expected: migration notes point to current verified commands, not assumptions.

- [ ] **Step 3: Validate docs**

Run:

```bash
git diff --check
pnpm workflow:check
```

Expected: docs are format-clean and workflow rules still pass.

### Task 5: Define Beta Readiness Gate

**Files:**
- Modify: `.superpowers/plans/2026-06-25-v4-next-after-alpha3.md`
- Modify: release checklist docs if an existing checklist already owns beta criteria

**Interfaces:**
- Produces: a beta gate that maintainers can execute before cutting `4.0.0-beta.0`.

- [ ] **Step 1: Consolidate gate commands**

Use this minimum gate:

```bash
git diff --check
pnpm workflow:check
pnpm test:rules
pnpm release:check
pnpm ci:verify
pnpm empbuild
pnpm release:publish:dry -- --skip-build
```

Expected: the beta gate includes both local and remote verification requirements.

- [ ] **Step 2: Add remote requirements**

Require a green push CI run and a successful publish workflow dry-run before any beta real publish.

Expected: beta cannot ship from local-only evidence.

- [ ] **Step 3: Add npm verification requirements**

Require `npm view` checks for all internal packages and representative sample install checks.

Expected: beta verification proves registry state after publish.

## Self-Review

- Spec coverage: clean CI, app acceptance, warning cleanup, migration evidence, and beta gates are all represented.
- Placeholder scan: this plan contains no deferred placeholder wording.
- Scope check: release package scope remains the 19 internal v4 packages unless a future task explicitly changes it.
