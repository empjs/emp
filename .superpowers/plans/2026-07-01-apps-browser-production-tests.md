# Apps Browser Production Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the current single EMP apps browser test file into per-app browser test directories and deepen every case from smoke-level checks into production-line real interaction coverage.

**Architecture:** Browser tests move from `test/apps.browser.browser.ts` into `test/apps/browser/<app>/*.browser.ts`, with shared iframe, DOM, form, and demo API helpers in `test/apps/browser/support/`. The root Rstest browser lane keeps one command (`pnpm exec rstest watch --browser --browser.headless=false`) while listing per-app files clearly in the browser UI.

**Tech Stack:** Rstest `0.10.6`, Rstest Browser Mode, Playwright Chromium provider, EMP static/dev services from `scripts/apps-browser-harness.mjs`, Module Federation runtime, Vue 2, Vue 3, React 19, Tailwind 4, Rspack 2.

## Global Constraints

- Default communication and reports are Chinese.
- Plans and SDD artifacts live under `.superpowers/`; do not create `docs/superpowers/`.
- Preserve existing dirty user/task changes; do not revert unrelated files.
- Use `corepack pnpm` for repo scripts; the exact user watch command can run with pnpm `10.33.0` on PATH.
- New browser tests must use Rstest Browser Mode; do not add Vitest/Jest/Mocha/Ava.
- Tests must exercise real app pages, real builds, real HTTP service behavior, real Module Federation remotes, and real browser interactions.
- Do not commit, stage, push, or create PR unless explicitly requested.
- Keep `apps/**` as examples/acceptance projects only; package release scope must not change.

---

### Task 1: Browser Test Topology And Shared Support

**Files:**
- Create: `test/apps/browser/support/frame.ts`
- Create: `test/apps/browser/support/demo-api.ts`
- Modify: `rstest.config.ts`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: `test/apps.rules.test.ts`

**Interfaces:**
- Produces `appPaths`, `type AppName`, `loadAppFrame(app, route?)`, `navigateFrame(frame, app, route)`, `removeFrame(frame)`, `expectFrameText(frame, matcher, timeout?)`, `expectNoFrameworkOverlay(frame)`, `expectInputValue(frame, selector, value)`, `checkInput(frame, selector)`, `clickButton(frame, matcher)`, `clickLink(frame, matcher)`, `clickText(frame, matcher)`, `fillByPlaceholder(frame, placeholder, value)`, `expectResultCard(frame, endpoint, expected)`.
- Produces `rewriteDemoApiFetch(frame)` for `demo` proxy page tests.
- Browser include glob becomes `test/apps/browser/**/*.browser.ts`.

- [ ] **Step 1: Write RED topology guard**

Add expectations in `test/apps.rules.test.ts`:

```ts
expect(rstestConfig).toContain("test/apps/browser/**/*.browser.ts")
expect(rootTestTargets).toContain("test/apps/browser/mf-app/remote.browser.ts")
expect(rootTestTargets).not.toContain("test/apps.browser.browser.ts")
expect(workflowGuard).toContain("test/apps/browser")
```

- [ ] **Step 2: Run RED**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/apps.rules.test.ts --reporter dot`

Expected: FAIL because config still points at `test/apps.browser.browser.ts`.

- [ ] **Step 3: Extract helpers**

Move iframe/helper code from `test/apps.browser.browser.ts` into `test/apps/browser/support/frame.ts` and demo fetch rewriting into `test/apps/browser/support/demo-api.ts`.

- [ ] **Step 4: Update browser target discovery**

Change `rstest.config.ts` browser include and force rerun triggers to `test/apps/browser/**/*.browser.ts`; change `scripts/root-test-targets.mjs` to enumerate per-app browser files; keep workflow check requiring every `*.browser.ts` under `test/apps/browser/` to be listed.

- [ ] **Step 5: Run GREEN topology guard**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/apps.rules.test.ts --reporter dot`

Expected: PASS.

### Task 2: React And Module Federation Production Tests

**Files:**
- Create: `test/apps/browser/adapter-host/smoke.browser.ts`
- Create: `test/apps/browser/mf-host/mobx.browser.ts`
- Create: `test/apps/browser/mf-app/remote.browser.ts`
- Create: `test/apps/browser/react-19-tanstack/react19.browser.ts`

**Interfaces:**
- Consumes helpers from `test/apps/browser/support/frame.ts`.
- Produces app-specific tests that replace equivalent cases from `test/apps.browser.browser.ts`.

- [ ] **Step 1: Write RED by moving imports to missing files**

Reference new file paths in `scripts/root-test-targets.mjs` before creating the files.

Run: `corepack pnpm workflow:check`

Expected: FAIL with missing browser test files.

- [ ] **Step 2: Add MF and React test files**

Create tests with production-line assertions:
- `adapter-host`: not blank, no framework overlay, root text, React version pattern, exposed app shell exists.
- `mf-host`: host text, MobX count starts at `0`, button click updates button and visible store count to `1`.
- `mf-app`: remote `mfHost/App` text, remote props text, local app text, remote count increments.
- `react-19-tanstack`: React 19 route, action state form saves exact input, optimistic list adds item, deferred/transition filters produce `Matched: 11`, router lab path opens Alice and route param is `alice`.

- [ ] **Step 3: Run targeted GREEN**

Run: `corepack pnpm test:apps:browser -- test/apps/browser/adapter-host/smoke.browser.ts test/apps/browser/mf-host/mobx.browser.ts test/apps/browser/mf-app/remote.browser.ts test/apps/browser/react-19-tanstack/react19.browser.ts`

Expected: PASS for all listed tests.

### Task 3: Vue 2 And Vue 3 Production Tests

**Files:**
- Create: `test/apps/browser/vue-2-base/interactive.browser.ts`
- Create: `test/apps/browser/vue-2-project/remote.browser.ts`
- Create: `test/apps/browser/vue-3-base/interactive.browser.ts`
- Create: `test/apps/browser/vue-3-project/remote.browser.ts`

**Interfaces:**
- Consumes helpers from `test/apps/browser/support/frame.ts`.
- Produces app-specific Vue tests that replace equivalent cases from `test/apps.browser.browser.ts`.

- [ ] **Step 1: Write RED by registering missing Vue files**

Reference the four Vue file paths in `scripts/root-test-targets.mjs`.

Run: `corepack pnpm workflow:check`

Expected: FAIL with missing Vue browser test files.

- [ ] **Step 2: Add Vue test files**

Create tests with production-line assertions:
- `vue-3-base`: page identity, no error overlay, local Ant Design list text, local `add` click changes `value: 1`, Pinia button changes base count to `1`.
- `vue-3-project`: project shell text, remote Pinia component text, remote Pinia increment, host-home route navigation, return to project home.
- `vue-2-base`: table/content render, Vuex count click changes to `1`, base content toggle reveals remote-ready content, composition button changes both counts.
- `vue-2-project`: project text, remote table row, Vuex remote count, base content toggle, remote composition count.

- [ ] **Step 3: Run targeted GREEN**

Run: `corepack pnpm test:apps:browser -- test/apps/browser/vue-3-base/interactive.browser.ts test/apps/browser/vue-3-project/remote.browser.ts test/apps/browser/vue-2-base/interactive.browser.ts test/apps/browser/vue-2-project/remote.browser.ts`

Expected: PASS for all listed tests.

### Task 4: Demo, Tailwind, Rspack, And Coverage Matrix

**Files:**
- Create: `test/apps/browser/demo/proxy.browser.ts`
- Create: `test/apps/browser/tailwind-4/product-form.browser.ts`
- Create: `test/apps/browser/rspack2-optimization/chunk.browser.ts`
- Modify: `test/apps.browser-coverage.test.ts`
- Delete: `test/apps.browser.browser.ts`

**Interfaces:**
- Consumes helpers from `test/apps/browser/support/frame.ts` and `test/apps/browser/support/demo-api.ts`.
- Coverage matrix must prove every `browser-interactive` or `browser-smoke` app has a registered browser test file.

- [ ] **Step 1: Write RED coverage guard**

Update `test/apps.browser-coverage.test.ts` to assert every browser-covered app has at least one path in `ROOT_BROWSER_TEST_TARGETS`.

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/apps.browser-coverage.test.ts --reporter dot`

Expected: FAIL until all new app files are present and old single file is removed.

- [ ] **Step 2: Add remaining app tests**

Create tests with production-line assertions:
- `demo`: shell load, React 19 form save, proxy page runs all base API calls, delay call, error response, POST echo response card.
- `tailwind-4`: product image/text shell, radio `xl` is checked after interaction, add-to-bag keeps product form stable.
- `rspack2-optimization`: page not blank, no overlay, dynamic chunk output `pure-value` appears.

- [ ] **Step 3: Delete old single browser file**

Remove `test/apps.browser.browser.ts` after every app case has a replacement file.

- [ ] **Step 4: Run coverage GREEN**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/apps.browser-coverage.test.ts test/apps.rules.test.ts --reporter dot`

Expected: PASS.

### Task 5: Full Browser Lane And Repo Verification

**Files:**
- Modify only files from Tasks 1-4 if verification exposes issues.

**Interfaces:**
- Consumes the complete split browser test suite.
- Produces final evidence for user acceptance.

- [ ] **Step 1: List browser tests**

Run: `corepack pnpm exec rstest list --config rstest.config.ts --browser --browser.headless=false`

Expected: output lists per-app files under `test/apps/browser/<app>/`.

- [ ] **Step 2: Run full browser suite**

Run: `corepack pnpm test:apps:browser`

Expected: all browser files pass.

- [ ] **Step 3: Run exact watch command for acceptance**

Run with pnpm 10 on PATH: `PATH=/Users/Bigo/Library/pnpm:$PATH pnpm exec rstest watch --browser --browser.headless=false`

Expected: initial browser watch cycle passes, then waits for file changes.

- [ ] **Step 4: Run repo guards**

Run:

```bash
corepack pnpm workflow:check
corepack pnpm exec rstest run --config rstest.config.ts test/apps.rules.test.ts test/apps.browser-coverage.test.ts test/toolchain.rules.test.ts --reporter dot
corepack pnpm ci:verify
git diff --check
```

Expected: all pass.

- [ ] **Step 5: Stop browser watch and clean ports**

Run:

```bash
lsof -tiTCP:51203 -tiTCP:7701 -tiTCP:6001 -tiTCP:6002 -tiTCP:9001 -tiTCP:9002 -tiTCP:9301 -tiTCP:9302 -tiTCP:1992 -tiTCP:8000 -tiTCP:8104 -tiTCP:8102 -tiTCP:2100 -tiTCP:3001 -sTCP:LISTEN | xargs -r kill
```

Expected: no test ports remain listening.
