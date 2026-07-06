# Remove Native Preview Toolchain Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the unused `@typescript/native-preview` dependency and its `tsgo` CI gate from the active EMP v4 toolchain.

**Architecture:** Treat this as a root toolchain cleanup, not a runtime change. The active validation contract keeps TypeScript 7 `tsc` coverage through `test:ts7:packages`, while removing the native-preview-only script and dependency from package metadata, rules tests, and the lockfile.

**Tech Stack:** Node `^20.19.0 || >=22.12.0`, `corepack pnpm@10.33.0`, Rstest, TypeScript `7.0.1-rc`.

## Global Constraints

- Preserve existing browser alias changes and include them only in the final task commit requested by the user; do not revert them.
- Do not edit historical plans under `.superpowers/plans/*` except this new execution plan.
- Do not remove `typescript@7.0.1-rc` or the `test:ts7:packages` gate.
- Update `pnpm-lock.yaml` only through pnpm lockfile resolution after package metadata changes.
- Verify with `node scripts/run-root-test.mjs toolchain`, `corepack pnpm workflow:check`, `corepack pnpm ci:verify`, and `git diff --check`.

---

### Task 1: Update Toolchain Contract Test

**Files:**
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**
- Consumes: root `package.json` scripts and devDependencies.
- Produces: a failing rule until `@typescript/native-preview` and `test:tsgo` are removed from active metadata.

- [x] Change the root script list expectation so `test:tsgo` is no longer required.
- [x] Change the TypeScript toolchain test to assert `@typescript/native-preview` and `test:tsgo` are absent, while `typescript@7.0.1-rc`, `test:ts7:prepare`, and `test:ts7` remain pinned.
- [x] Run `node scripts/run-root-test.mjs toolchain` and confirm it fails against the current package metadata.

### Task 2: Remove Active Package Metadata And Lockfile Entries

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: the failing contract from Task 1.
- Produces: active root metadata without the native-preview dependency or `test:tsgo` script.

- [x] Remove `test:tsgo` from `package.json`.
- [x] Remove `corepack pnpm test:tsgo` from `ci:verify`.
- [x] Remove `@typescript/native-preview` from root `devDependencies`.
- [x] Run `corepack pnpm install --lockfile-only` to regenerate `pnpm-lock.yaml`.
- [x] Run `node scripts/run-root-test.mjs toolchain` and confirm it passes.

### Task 3: Verify Cleanup

**Files:**
- All modified files from Tasks 1 and 2.

**Interfaces:**
- Consumes: updated package metadata and lockfile.
- Produces: verified local cleanup ready for review.

- [x] Run `rg -n "@typescript/native-preview|test:tsgo|tsgo" package.json pnpm-lock.yaml test scripts packages .github --glob '!dist' --glob '!output'` and confirm no active package/script references remain. `pnpm-lock.yaml` may still contain upstream optional peer declaration names, but must not contain a resolved `@typescript/native-preview@7.0.0-dev...` package instance.
- [x] Run `corepack pnpm workflow:check`.
- [x] Run `corepack pnpm ci:verify`.
- [x] Run `git diff --check`.
- [x] Report that existing browser alias changes are part of the final requested commit scope.
