# Rstest Browser MF Watch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start Rstest Browser Mode watch UI for the MF app and run a real browser-side MF smoke test.

**Architecture:** Re-enable the Browser Mode dependency surface that was previously removed, but keep the test browser-only so Node server code is not bundled into the client runner. Reuse the already running MF services at `localhost:6001`, `localhost:6002`, and `localhost:2100`, and make the test assert rendered content plus a real click state change.

**Tech Stack:** `pnpm@10.33.0`, `@rstest/core@0.10.6`, `@rstest/browser@0.10.6`, `playwright@1.61.1`, Rstest Browser Mode, EMP MF demo.

## Global Constraints

- Use Chinese for status and final reporting.
- Use `corepack pnpm`, not global `pnpm`.
- Preserve unrelated dirty changes.
- Do not put Node server startup/import logic inside browser-mode test files.
- Browser Mode requires `@rstest/browser` and Playwright provider in the current Rstest version.
- Use the exact requested test command shape: `corepack pnpm exec rstest watch --browser --browser.headless=false`.

---

### Task 1: Restore Browser Mode Dependencies

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: root `@rstest/core@0.10.6`.
- Produces: install tree where `corepack pnpm exec rstest watch --browser --browser.headless=false` can start.

- [x] **Step 1: Add Browser Mode dependencies**

Run: `corepack pnpm add -Dw @rstest/browser@0.10.6 playwright@1.61.1`

Expected: root `package.json` includes `@rstest/browser` and `playwright`.

- [x] **Step 2: Install Chromium browser binary**

Run: `corepack pnpm exec playwright install chromium`

Expected: command exits 0.

### Task 2: Add Browser-Side MF Smoke

**Files:**
- Create: `test/apps.mf-browser.browser.ts`

**Interfaces:**
- Consumes: running `http://localhost:6002/` page.
- Produces: a browser-mode test file with no Node built-in imports, plus a local container helper that keeps Rstest UI and proxies the MF app under `/container-static/mf-app/`.

- [x] **Step 1: Create browser-only test**

Create `test/apps.mf-browser.browser.ts` with a browser-only iframe smoke test. The iframe loads `/container-static/mf-app/`, which is proxied to the live `mf-app` dev server.

```ts
import {expect, rstest, test} from '@rstest/core'

test('mf-app renders mf-host remote through emp-share runtime', async () => {
  // Loads the live mf-app page in the Rstest Browser origin, then asserts content and click behavior.
})
```

- [x] **Step 2: Add MF container helper**

Create `scripts/rstest-browser-mf-container.mjs` to serve the Rstest Browser UI and proxy `/container-static/mf-app/` to `http://localhost:6002/`.

- [x] **Step 3: Verify source has no Node imports**

Run: `rg -n "node:|from 'node|require\\(" test/apps.mf-browser.browser.ts`

Expected: no matches.

### Task 3: Start Browser Mode Watch

**Files:**
- Read: browser UI at Rstest Browser Mode port.

**Interfaces:**
- Consumes: `test/apps.mf-browser.browser.ts`, running MF app, installed Browser Mode deps.
- Produces: visible Rstest Browser Runner UI.

- [x] **Step 1: Start MF container helper**

Run: `node scripts/rstest-browser-mf-container.mjs`

Expected: `http://localhost:51203/` serves the Rstest container and proxies `mf-app`.

- [x] **Step 2: Run requested watch command**

Run: `RSTEST_CONTAINER_DEV_SERVER=http://localhost:51203/ corepack pnpm exec rstest watch --browser --browser.headless=false`

Expected: command keeps running, prints Browser Mode URL, and reports `1 passed`.

- [x] **Step 3: Open the Browser Mode UI**

Open: `http://localhost:4000/`

Expected: Rstest Browser UI lists `test/apps.mf-browser.browser.ts`.

- [x] **Step 4: Verify page result**

Use the in-app browser to inspect the runner page.

Expected: the test is visible and shows `1 PASSED / 0 FAILED`.
