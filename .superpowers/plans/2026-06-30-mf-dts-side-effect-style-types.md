# MF DTS Side Effect Style Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. This is a sequential debugging fix; do not dispatch subagents because root-cause analysis and verification share the same generated DTS artifact.

**Goal:** Fix `pnpm mf` DTS generation so `mf-host` can emit federated types when exposed components import plain CSS or preprocessor styles for side effects.

**Architecture:** Keep the fix in the shared EMP TypeScript baseline exposed by `@empjs/cli/tsconfig/react`, because the generated Module Federation DTS tsconfig extends app tsconfigs and inherits `@empjs/cli/types/react`. Add one real TS7 compile regression that mirrors the generated DTS failure, then add plain style module declarations beside the existing CSS module declarations.

**Tech Stack:** Rstest, TypeScript 7.0.1-rc, `@empjs/cli` shared type declarations, Module Federation DTS generated tsconfig.

## Global Constraints

- Use `corepack pnpm` for repo commands.
- Preserve unrelated existing changes in `apps/demo/package.json`, `pnpm-lock.yaml`, and `.superpowers/plans/2026-06-30-rspack-2-1-1-rsdoctor-upgrade.md`.
- Do not modify `apps/**` source files for this fix unless the shared baseline approach fails under verification.
- Do not commit generated artifacts, caches, `.codegraph/`, `dist/`, or `node_modules/`.
- Run a failing test before editing production declarations.
- Verify with the reproduced DTS `tsc --project` command and the related root test target.

---

### Task 1: Add TS7 regression for plain style side-effect imports

**Files:**
- Modify: `test/tsconfig.rules.test.ts`

**Interfaces:**
- Consumes: `@empjs/cli/tsconfig/react` and `@empjs/cli/types/react`.
- Produces: A root `tsconfig` target regression proving side-effect imports of `*.css`, `*.scss`, `*.sass`, `*.less`, and `*.styl` are accepted by the shared app baseline.

- [ ] **Step 1: Write the failing test**

Add a test that creates a temporary app with `index.tsx`, empty style files, and a `tsconfig.json` extending `@empjs/cli/tsconfig/react`. The TS file must import each plain style file for side effects.

- [ ] **Step 2: Run the test to verify RED**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/tsconfig.rules.test.ts --reporter dot`

Expected before the declaration fix: FAIL with `TS2882` for a plain style side-effect import.

- [ ] **Step 3: Do not edit production code until RED is confirmed**

If the test passes before the declaration fix, stop and reassess the test because it is not reproducing the current DTS failure.

### Task 2: Add shared plain style module declarations

**Files:**
- Modify: `packages/cli/types/base/style.d.ts`

**Interfaces:**
- Consumes: The existing `@empjs/cli/types/base` declaration bundle imported by React/Vue app baselines.
- Produces: Ambient declarations for `*.css`, `*.scss`, `*.sass`, `*.less`, and `*.styl`.

- [ ] **Step 1: Implement the minimal declaration fix**

Add plain style declarations near the existing `*.module.*` declarations. Keep existing module CSS declarations unchanged.

- [ ] **Step 2: Run the regression test to verify GREEN**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/tsconfig.rules.test.ts --reporter dot`

Expected after the declaration fix: PASS.

### Task 3: Verify the original Module Federation DTS symptom

**Files:**
- Read-only verification against generated DTS config under `apps/mf-host/node_modules/.federation/`.

**Interfaces:**
- Consumes: The generated DTS tsconfig that previously failed on `apps/mf-host/src/App.tsx`.
- Produces: Evidence that the original `TS2882` repro no longer fails.

- [ ] **Step 1: Re-run the original tsc command**

Run: `npx tsc --project apps/mf-host/node_modules/.federation/tsconfig.8bc14016bc060612f842096e820d4bae.json`

Expected after the declaration fix: exit code 0.

- [ ] **Step 2: Run scoped repository guards**

Run: `corepack pnpm test:tsconfig`

Expected: PASS.

Run: `git diff --check`

Expected: no whitespace errors.
