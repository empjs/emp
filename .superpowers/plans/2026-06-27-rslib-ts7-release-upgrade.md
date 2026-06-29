# Rslib TS7 Release Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the workspace to the Rslib release that officially supports TypeScript 7 declaration generation and remove the now-obsolete Rslib-only TypeScript 6 workaround.

**Architecture:** Keep root `typescript@7.0.1-rc` as the canonical TypeScript version. Move `@rslib/core` to `0.23.1`, rely on `rsbuild-plugin-dts@0.23.1`, and delete only the Rslib patch plus `typescript-rslib` alias. Preserve the Module Federation DTS patch and `typescript-mf` alias because that package has not been verified as TS7-compatible.

**Tech Stack:** pnpm 10.33.0, Rslib 0.23.1, rsbuild-plugin-dts 0.23.1, TypeScript 7.0.1-rc, @typescript/native-preview 7.0.0-dev.20260624.1.

## Global Constraints

- Do not modify `apps/**` or `website`.
- Do not remove `typescript-mf` or `patches/@module-federation__dts-plugin@2.6.0.patch`.
- Keep `typescript@7.0.1-rc` as the root TypeScript package.
- Remove `typescript-rslib` and `patches/rsbuild-plugin-dts.patch` only after installing `@rslib/core@0.23.1`.
- Validate with package-manager state, TypeScript/Rslib gates, and diff hygiene.

---

### Task 1: Upgrade Rslib and Remove Rslib DTS Workaround

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`
- Delete: `patches/rsbuild-plugin-dts.patch`

**Interfaces:**
- Consumes: npm `@rslib/core@0.23.1` and `rsbuild-plugin-dts@0.23.1`.
- Produces: lockfile where `@rslib/core` resolves to `0.23.1` and no `typescript-rslib` package or `rsbuild-plugin-dts` patch remains.

- [x] **Step 1: Update dependency declarations**

Set root `devDependencies["@rslib/core"]` to `^0.23.1`, delete `devDependencies["typescript-rslib"]`, and remove `patchedDependencies["rsbuild-plugin-dts"]`.

- [x] **Step 2: Delete obsolete patch**

Delete `patches/rsbuild-plugin-dts.patch`.

- [x] **Step 3: Refresh lockfile and install tree**

Run: `corepack pnpm install`
Expected: exit 0, lockfile updated to `@rslib/core@0.23.1` and `rsbuild-plugin-dts@0.23.1`.

- [x] **Step 4: Verify dependency graph**

Run: `corepack pnpm ls @rslib/core rsbuild-plugin-dts typescript typescript-rslib --depth 0 --json`
Expected: `@rslib/core` is `0.23.1`, root `typescript` is `7.0.1-rc`, and `typescript-rslib` is absent.

- [x] **Step 5: Run relevant gates**

Run: `corepack pnpm test:ts7:packages`
Expected: exit 0.

Run: `corepack pnpm test:tsgo`
Expected: exit 0.

Run: `corepack pnpm check:rslib-presets`
Expected: exit 0.

- [x] **Step 6: Diff hygiene**

Run: `git diff --check`
Expected: no output, exit 0.
