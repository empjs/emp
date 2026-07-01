# Rstest Browser Watch All Apps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `pnpm exec rstest watch --browser --browser.headless=false` run the full apps real browser interaction suite, not just the MF smoke file.

**Architecture:** Keep Rstest as the only test runner. Move the full apps interaction assertions into Rstest Browser Mode-compatible tests that run inside the browser container, while a wrapper script prepares real EMP builds and HTTP services before launching the requested watch command. Keep non-browser Rstest lanes separate from browser-only files.

**Tech Stack:** Node.js `^20.19.0 || >=22.12.0`, `pnpm@10.33.0`, `@rstest/core@0.10.6`, `@rstest/browser@0.10.6`, `playwright@1.61.1`, EMP CLI static services, Rstest Browser Mode.

## Global Constraints

- 默认中文沟通，最终说明真实验证结果和未覆盖边界。
- 不覆盖用户已有改动；只修改本任务直接相关文件。
- 新增或重构测试优先使用 `rstest`，不引入第二套 runner。
- 浏览器能力必须纳入统一测试体系，使用 Rstest Browser Mode 或 Playwright 能力，不散落不可复用脚本。
- `apps:acceptance` 不默认塞入长耗时 browser lane；全量 headed watch 使用独立入口。
- 完成前至少运行 `pnpm exec rstest watch --browser --browser.headless=false`，并说明 watch 进程如何停止。

---

### Task 1: Guard Browser Watch Coverage

**Files:**
- Modify: `test/apps.rules.test.ts`
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**
- Consumes: current `rstest.config.ts`, `scripts/run-app-browser-tests.mjs`, `package.json`.
- Produces: failing/passing rule coverage that requires the headed watch path to include the full apps suite.

- [ ] **Step 1: Write the failing rule test**

Add assertions that root browser mode includes `test/apps.browser.browser.ts`, excludes the old MF-only browser file from the main browser target, and exposes `pnpm exec rstest watch --browser --browser.headless=false` through the apps browser runner.

- [ ] **Step 2: Run the focused rules**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/apps.rules.test.ts test/toolchain.rules.test.ts --reporter dot`

Expected before implementation: FAIL because the current config only includes `test/apps.mf-browser.browser.ts` for `--browser`.

### Task 2: Implement Browser Mode Suite and Watch Runner

**Files:**
- Create: `test/apps.browser.browser.ts`
- Modify: `test/apps.browser.test.ts`
- Modify: `rstest.config.ts`
- Modify: `scripts/run-app-browser-tests.mjs`
- Modify: `scripts/rstest-browser-mf-container.mjs`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: real app base URLs from `APPS_BROWSER_BASE_URLS`.
- Produces: browser-mode tests using iframes and DOM events inside the Rstest browser container, plus a runner that can launch either run mode or the exact headed watch command.

- [ ] **Step 1: Move browser assertions to a browser-mode file**

Create `test/apps.browser.browser.ts` with browser-safe helpers:

```ts
import {expect, rstest, test} from '@rstest/core'

const baseUrls = JSON.parse(import.meta.env.APPS_BROWSER_BASE_URLS ?? '{}') as Record<string, string>
```

Use iframe navigation for each app and DOM querying/click/input helpers instead of importing Node or Playwright APIs.

- [ ] **Step 2: Keep Node runner as compatibility launcher**

Update `scripts/run-app-browser-tests.mjs` so default run mode launches:

```bash
corepack pnpm exec rstest run --config rstest.config.ts test/apps.browser.browser.ts --browser --browser.headless=true --reporter dot
```

Add a `--watch-headed` path that launches exactly:

```bash
pnpm exec rstest watch --browser --browser.headless=false
```

after building and starting all real app services.

- [ ] **Step 3: Update Rstest config and workflow guards**

Make `rstest.config.ts` include `test/**/*.browser.ts` when Browser Mode is active, and keep ordinary node tests from including `.browser.ts` files. Update root browser targets and workflow guard to point at `test/apps.browser.browser.ts`.

### Task 3: Verify Requested Command

**Files:**
- Read: all modified task files.

**Interfaces:**
- Consumes: Task 1 and Task 2 outputs.
- Produces: fresh verification evidence.

- [ ] **Step 1: List browser mode tests**

Run: `corepack pnpm exec rstest list --config rstest.config.ts --browser --browser.headless=false`

Expected: lists every test from `test/apps.browser.browser.ts`.

- [ ] **Step 2: Run full non-watch browser suite**

Run: `corepack pnpm test:apps:browser`

Expected: all apps browser tests pass.

- [ ] **Step 3: Run the requested headed watch command**

Run: `corepack pnpm test:apps:browser -- --watch-headed`

Expected: wrapper prepares services and launches `pnpm exec rstest watch --browser --browser.headless=false`; the initial watch run completes with all browser tests passing. Stop the watch process with SIGINT after the green result.

- [ ] **Step 4: Run repository guards**

Run:

```bash
corepack pnpm ci:verify
git diff --check
```

Expected: both pass.
