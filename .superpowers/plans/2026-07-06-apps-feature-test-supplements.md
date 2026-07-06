# Apps Feature Test Supplements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the missing P1 apps test coverage from `docs/testing/apps-feature-test-matrix.md` and push the verified change to `origin/v4`.

**Architecture:** Keep the current apps acceptance topology: build and artifact assertions stay in `apps/test/apps.acceptance.test.ts`, browser coverage stays in per-app `apps/<app>/test/browser/*.browser.ts`, and root target registration stays in `scripts/root-test-targets.mjs`. The change promotes `rspack2-modern-module` from build-only to browser-smoke and tightens existing build assertions for MF/Vue manifests, demo multi-entry output, and Rspack optimization chunks.

**Tech Stack:** Node `^20.19.0 || >=22.12.0`, `corepack pnpm@10.33.0`, Rstest, Rstest Browser Mode, EMP CLI app builds, Module Federation manifest JSON.

## Global Constraints

- Default communication and final report are Chinese.
- Do not restore retired apps such as `tailwind-2`, `tailwind-3`, `tailwind-demo`, `daisyui-demo`, or `shadcn-ui`.
- Do not add dependencies or rewrite `pnpm-lock.yaml`.
- Use Rstest and existing root scripts only.
- Preserve `apps/**` as examples/acceptance projects and keep them out of release package scope.
- Before commit and push, run `corepack pnpm workflow:check`, relevant Rstest targets, `corepack pnpm ci:verify`, `corepack pnpm empbuild`, `git diff --check`, and `git diff --cached --check`.

---

### Task 1: Promote `rspack2-modern-module` To Browser Smoke

**Files:**
- Modify: `apps/test/apps.browser-coverage.test.ts`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `apps/test-support/browser/frame.ts`
- Modify: `scripts/apps-browser-harness.mjs`
- Modify: `apps/rspack2-modern-module/src/index.ts`
- Create: `apps/rspack2-modern-module/test/browser/smoke.browser.ts`

**Interfaces:**
- Consumes: `ROOT_BROWSER_TEST_TARGETS` and app browser helper alias `@empjs/test-support/browser/frame`.
- Produces: one browser smoke file for `rspack2-modern-module`, registered in the `apps-browser` lane, with the app registered in the browser harness and rendering its modern-module marker into the DOM.

- [x] Change the coverage matrix expectation so `rspack2-modern-module` is `browser-smoke`.
- [x] Register `apps/rspack2-modern-module/test/browser/smoke.browser.ts` in `scripts/root-test-targets.mjs`.
- [x] Run `node scripts/run-root-test.mjs rules` before creating the new browser file and confirm it fails because the file is missing.
- [x] Add the browser test that loads `rspack2-modern-module` and asserts `rspack2 modern module ready`.
- [x] Register `rspack2-modern-module` in the app path helper and browser harness service/build list.
- [x] Attempt the new browser test before changing `src/index.ts`; the run was blocked by an unrelated existing `:3001` service before reaching the app, so the missing DOM append was verified by the `apps-single` build-artifact red check.
- [x] Render the `rspack2 modern module ready` marker from `src/index.ts`.
- [x] Run `node scripts/run-root-test.mjs rules` and confirm it passes.

### Task 2: Tighten Build Artifact Assertions

**Files:**
- Modify: `apps/test/apps.acceptance.test.ts`

**Interfaces:**
- Consumes: build output under `apps/<app>/dist` after each real app build.
- Produces: artifact assertions for demo multi-entry/splitChunks, Rspack optimization chunks, MF host exposes, MF app remotes, Vue 3 base exposes, Vue 3 project remotes, and React route generation.

- [x] Add JSON and file-list helpers to read generated manifests and dist files.
- [x] Add assertions for `demo` output: `info.html`, `proxy-test.html`, `work/index.html`, `lib-react`, `lib-antd`, `lib-common`, and `proxy-test` JS assets.
- [x] Add assertions for `rspack2-modern-module`: generated JS contains `rspack2 modern module ready`.
- [x] Add assertions for `rspack2-optimization`: at least one async chunk JS exists, one entry JS exists, CSS output exists, and built JS contains `pure-value` while excluding `unused-call`.
- [x] Add assertions for `mf-host` exposes: `./App`, `./CountComp`, `./Section`, remote entry `emp.js`, build name `mf-host`.
- [x] Add assertions for `mf-app` remote: `mfHost` remote entry points to port `6001/emp.json`, exposes remain empty.
- [x] Add assertions for `vue-3-base` exposes: `./ButtonComponent`, `./TableComponent`, `./JSXComponent`, `./TsxScript`, `./Antd`, `./Home`, `./PiniaCount`.
- [x] Add assertions for `vue-3-project` remotes: expected `vue3Base` modules and `9301/emp.js` entry.
- [x] Add assertion for `react-19-tanstack`: generated route tree includes `/router-lab` and `$id`.
- [x] Run `node scripts/run-root-test.mjs apps-single` and confirm it passes.

### Task 3: Update Matrix Documentation

**Files:**
- Modify: `docs/testing/apps-feature-test-matrix.md`

**Interfaces:**
- Consumes: completed Tasks 1-2.
- Produces: a Chinese matrix reflecting the new coverage status and remaining P2 risks.

- [x] Update `rspack2-modern-module` from build-only to browser-smoke.
- [x] Mark MF/Vue manifest/expose and demo multi-entry/splitChunks as covered.
- [x] Keep retired Tailwind 2/3 and UI demos out of scope.

### Task 4: Verification, Commit, And Push

**Files:**
- All files above.

**Steps:**
- [x] Run `corepack pnpm workflow:check`.
- [x] Run `node scripts/run-root-test.mjs rules`.
- [x] Run `node scripts/run-root-test.mjs apps-single`.
- [x] Run `APPS_BROWSER_SERVICE_FILTER=rspack2-modern-module EMP_BROWSER_SCOPE=apps corepack pnpm exec rstest run --config rstest.config.ts --browser --browser.name chromium --testNamePattern "rspack2 modern module"`.
- [x] Run `EMP_BROWSER_SCOPE=apps corepack pnpm exec rstest list --config rstest.config.ts --browser --browser.name chromium`.
- [x] Run `corepack pnpm ci:verify`.
- [x] Run `corepack pnpm empbuild`.
- [x] Run `git diff --check`.
- [x] Stage only this task's files and run `git diff --cached --check`.
- [ ] Commit with a conventional test-focused message.
- [ ] Push to `origin/v4`.
- [ ] Confirm local branch is in sync with `origin/v4`.
