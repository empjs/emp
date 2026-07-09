# Rspack 2.1 Feature Defaults RC2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Adopt selected Rspack 2.1 new features in EMP, split default-enabled versus manual opt-in behavior, and prepare `4.0.0-rc.2` release metadata.

**Architecture:** Extend the existing `build.rspack` escape hatch instead of adding one-off top-level switches. Enable low-risk Rspack 2.1 defaults in EMP-generated configs: `module.parser.javascript.createRequire` and persistent-cache cleanup defaults. Keep semantic/experimental features manual: `experiments.sourceImport` is exposed through `build.rspack.experiments`. Use existing release scripts for version alignment and changelog preparation; do not run real publish.

**Tech Stack:** Rspack 2.1.3, TypeScript, Rstest/Node fixture tests, EMP release scripts, `corepack pnpm`.

## Global Constraints

- Default communication and final reporting are in Chinese.
- Do not overwrite unrelated dirty website files or `tmp/`.
- Do not add new dependencies.
- Default-enabled features must be low risk and overridable.
- Manual opt-in features must be reachable through existing `build.rspack` config.
- Prepare RC metadata for `4.0.0-rc.2`; do not run real npm publish unless explicitly requested.

---

### Task 1: Add Rspack 2.1 Feature Tests

**Files:**
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`

**Interfaces:**
- Consumes: built `packages/cli/dist/index.js`.
- Produces: assertions for default `createRequire`, default cache cleanup, manual `sourceImport`, and `maxVersions`.

- [x] **Step 1: Add failing assertions**

Add expectations:

```js
assert.equal(config.module.parser.javascript.createRequire, true)
assert.equal(config.cache.maxAge, 7 * 24 * 60 * 60)
assert.equal(config.cache.maxVersions, 3)
assert.equal(config.experiments.sourceImport, true)
```

- [x] **Step 2: Run RED check**

Run: `node packages/cli/test/rspack2-features-shape.test.mjs`

Expected: FAIL before implementation because `createRequire`, cache cleanup defaults, and `sourceImport` are not wired.

### Task 2: Implement Default and Manual Rspack 2.1 Features

**Files:**
- Modify: `packages/cli/src/types/config.ts`
- Modify: `packages/cli/src/store/rspack/common.ts`
- Modify: `packages/cli/src/store/rspack/module.ts`
- Modify: `website/docs/zh/config/build.md`

**Interfaces:**
- Consumes: `build.rspack.experiments.sourceImport`, `build.rspack.parser.javascript.createRequire`, and `cache.maxAge/maxVersions`.
- Produces: EMP configs with default `createRequire: true`, default persistent-cache cleanup, and manual `sourceImport`.

- [x] **Step 1: Extend config types**

Allow `sourceImport` in `build.rspack.experiments`, and allow `createRequire` in `build.rspack.parser.javascript`.

- [x] **Step 2: Add default cache cleanup**

When EMP cache is persistent and user did not override cache object values, set:

```ts
maxAge: 7 * 24 * 60 * 60
maxVersions: 3
```

- [x] **Step 3: Add default createRequire parsing**

Set `module.parser.javascript.createRequire` to `true` before user parser overrides.

- [x] **Step 4: Document default and manual startup**

Update build docs with:
- 默认启用：`createRequire` parsing and persistent cache cleanup.
- 手动启用：`sourceImport` via `build.rspack.experiments.sourceImport`.

### Task 3: Prepare RC2 Release Metadata

**Files:**
- Modify: `package.json`
- Modify: internal release package manifests under `packages/**/package.json`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: release automation `node scripts/release.mjs version` and `changelog`.
- Produces: `4.0.0-rc.2` aligned core package manifests and changelog entry.

- [x] **Step 1: Apply version**

Run: `node scripts/release.mjs version 4.0.0-rc.2`

Expected: root and 17 internal packages align to `4.0.0-rc.2`.

- [x] **Step 2: Add changelog entry**

Run: `node scripts/release.mjs changelog --version 4.0.0-rc.2 --tag rc`

Then edit the generated entry to mention Rspack 2.1 defaults, CircularCheck opt-in, and RC2 validation.

### Task 4: Verify Release Readiness

**Files:**
- All files modified by Tasks 1-3.

**Interfaces:**
- Produces: local release readiness evidence.

- [x] **Step 1: Run focused and package tests**

Run:

```bash
corepack pnpm --filter @empjs/cli build
node packages/cli/test/rspack2-features-shape.test.mjs
node packages/cli/test/rspack-config-shape.test.mjs
corepack pnpm test:cli
```

Expected: PASS.

- [x] **Step 2: Run release checks**

Run:

```bash
corepack pnpm release:check
corepack pnpm release:publish:dry -- --skip-build --force-all
```

Expected: PASS and print dry-run publish commands for core packages only.

- [x] **Step 3: Run build and whitespace checks**

Run:

```bash
corepack pnpm empbuild
git diff --check
```

Expected: PASS.
