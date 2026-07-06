# V4 Plugin Runtime Test Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Goal

Close the EMP v4 test coverage gaps identified from upstream `projects/**` by adding tests only for capabilities that still exist in the current v4 plugin/runtime surface, then verify and push the scoped change to `origin/v4`.

## Architecture

The change keeps retired legacy examples out of the app workspace and strengthens existing root test lanes instead of restoring old `projects/**` demos. Historical project directories are cataloged as `TARGET_APP_DIRS` or `RETIRED_APP_DIRS`, current plugin transform behavior is covered by a root plugin test, CLI `autoPages` is covered by a real temporary project build, and `@empjs/share` runtime plugin pass-through is covered in the existing Rspack mock-store tests.

## Tech Stack

- `pnpm@10.33.0` through Corepack.
- Rstest root and package test entrypoints.
- Existing EMP CLI real-project helpers in `packages/cli/test/support/real-project.ts`.
- Existing `@empjs/share` mock Rspack store tests.
- Current plugin packages only: `@empjs/plugin-react`, `@empjs/plugin-vue2`, `@empjs/plugin-vue3`, `@empjs/plugin-tailwindcss`, `@empjs/plugin-lightningcss`, `@empjs/plugin-postcss`, `@empjs/plugin-stylus`.

## Global Constraints

- Do not restore Tailwind 2/3, DaisyUI, shadcn, or other retired demo apps as real v4 test targets.
- Do not introduce Vitest, Jest, Mocha, Ava, or another runner; use Rstest and existing root/package scripts.
- Do not add dependencies or rewrite `pnpm-lock.yaml`.
- Keep `apps/**` and `website` out of release package scope.
- Preserve unrelated user changes; stage only files touched by this task.
- Before commit and push, run `corepack pnpm workflow:check`, relevant test commands, `corepack pnpm ci:verify`, `corepack pnpm empbuild`, `git diff --check`, and `git diff --cached --check`.

## Task 1 - Historical Project Catalog Closure

**Files:**

- Modify: `scripts/apps.catalog.mjs`
- Modify: `apps/test/apps.rules.test.ts`

**Interfaces:**

- Produces: exported `LEGACY_PROJECT_DIRS`, a sorted list of upstream `main/projects` directories used by rules tests.
- Consumes: existing `TARGET_APP_DIRS` and `RETIRED_APP_DIRS`.

- [x] Add `LEGACY_PROJECT_DIRS` to `scripts/apps.catalog.mjs` with the 57 upstream `projects/**` package directories observed from `https://github.com/empjs/emp/tree/main/projects`.
- [x] Add the 10 previously uncataloged historical directories to `RETIRED_APP_DIRS`: `lib-main`, `lib-react`, `react-tanstack`, `tailwind-4-polyfill`, `tailwind-demo`, `tailwindcss-app`, `tailwindcss-host`, `unpkg-lib`, `vue3-app`, `vue3-host`.
- [x] Add an Rstest rule proving every legacy project directory is classified by either `TARGET_APP_DIRS` or `RETIRED_APP_DIRS`.
- [x] Add a rule proving legacy Tailwind 2/3, DaisyUI, and shadcn demos stay retired while current Tailwind coverage remains on `tailwind-4` / `react-19-tanstack`.
- [x] Red check: run `node scripts/run-root-test.mjs rules` before adding the missing retired dirs and confirm the new classification test fails.
- [x] Green check: run `node scripts/run-root-test.mjs rules` after the catalog update and confirm it passes.

## Task 2 - Current Plugin Output Coverage

**Files:**

- Create: `test/plugin-output-coverage.test.ts`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**

- Produces: root `plugins` target includes `test/plugin-output-coverage.test.ts`.
- Consumes: built plugin dist artifacts produced by `corepack pnpm empbuild:plugin` in `test:plugins`.

- [x] Add failing tests for actual `@empjs/plugin-postcss` helper output: `pxtorem` converts `20px` to `2rem` with `rootValue: 10`, and `pxtovw` converts `160px` to `50vw` with `viewportWidth: 320`.
- [x] Add failing tests for actual `@empjs/plugin-lightningcss` visitor output: `px_to_rem` and `px_to_viewport` produce rem/vw CSS through `lightningcss.transform`.
- [x] Keep Tailwind coverage scoped to v4 by asserting the Tailwind plugin package depends on `tailwindcss@4.3.1` / `@tailwindcss/webpack@4.3.1` and no `plugin-tailwindcss2/3` package exists.
- [x] Wire the new test into the root `plugins` target and update the toolchain rule that asserts the target shape.
- [x] Red check: run `node scripts/run-root-test.mjs plugins` before target wiring and confirm the new test is not covered by the `plugins` lane.
- [x] Green check: run `corepack pnpm test:plugins` and confirm it passes.

## Task 3 - CLI Auto Pages Real Build

**Files:**

- Create: `packages/cli/test/real/cli-auto-pages.test.ts`

**Interfaces:**

- Consumes: `createRealProject`, `runCli`, `writeProjectFile`, and `listFiles` from `packages/cli/test/support/real-project.ts`.
- Produces: a real CLI build test covered by `corepack pnpm --filter @empjs/cli test:real`.

- [x] Add a real temporary project with `autoPages: true`, `src/pages/index.ts`, `src/pages/info.ts`, and `src/pages/work/index.ts`.
- [x] Build it through `emp build --clearLog=false`.
- [x] Assert the generated dist contains HTML and JS assets for each discovered page and that the page bundles contain distinct marker strings.
- [x] Red check: run `corepack pnpm --filter @empjs/cli test:real -- cli-auto-pages` before the test can pass and confirm it fails for missing behavior or missing test target.
- [x] Green check: run `corepack pnpm --filter @empjs/cli test:real -- cli-auto-pages` and confirm it passes.

## Task 4 - EMP Share Runtime Plugin Pass-Through

**Files:**

- Modify: `packages/emp-share/test/rspack/plugin-share-config.test.mjs`

**Interfaces:**

- Consumes: existing `runSharePlugin` helper and mock Rspack store.
- Produces: a package test covered by `corepack pnpm --filter @empjs/share test`.

- [x] Add a failing assertion proving user-provided `runtimePlugins` are preserved when `forceRemotes` is absent.
- [x] Add a failing assertion proving user-provided `runtimePlugins` are preserved and `forceRemote` is appended when `forceRemotes` is present.
- [x] Green check: run `corepack pnpm --filter @empjs/share test` and confirm it passes.

## Task 5 - Verification, Commit, Push, And Goal Closure

**Files:**

- All modified files from Tasks 1-4.

**Steps:**

- [x] Run `corepack pnpm workflow:check`.
- [x] Run `corepack pnpm test:plugins`.
- [x] Run `corepack pnpm --filter @empjs/cli test:real`.
- [x] Run `corepack pnpm --filter @empjs/share test`.
- [x] Run `corepack pnpm ci:verify`.
- [x] Run `corepack pnpm empbuild`.
- [x] Run `git diff --check`.
- [x] Stage only this task's files and run `git diff --cached --check`.
- [x] Commit with a conventional test-focused message.
- [x] Push to `origin/v4`.
- [x] Confirm remote parity with `git ls-remote origin refs/heads/v4`.
- [x] Mark the goal complete only after verification and push succeed.
