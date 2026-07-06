# EMP v4 Acceptance Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the release acceptance HTML as a shadcn-style dashboard with sidebar navigation, KPI cards, charted command distribution, evidence tables, and the README EMP v4 logo.

**Architecture:** Keep the report self-contained in `scripts/release-acceptance-report.mjs`; do not initialize shadcn or import runtime components because this repository is reported by `shadcn info` as `framework=Manual`, `config=null`, and `components=[]`. Translate shadcn component composition into static semantic HTML sections: Sidebar, Card, Badge, Progress, Chart, and Table.

**Tech Stack:** Node ESM script, Rstest rules test, self-contained HTML/CSS, README logo embedded as a data URI, Playwright for visual verification.

## Global Constraints

- Use Chinese copy in the generated report.
- Do not add `components.json`, shadcn UI source files, Tailwind config, or runtime dependencies.
- Keep `.release/acceptance/index.html` generated and untracked.
- Preserve `docs/assets/emp-v4-logo.png` as the report logo source.
- Keep the page self-contained and script-free.
- Use `corepack pnpm` for package commands.
- Verify with `node scripts/run-root-test.mjs rules`, `corepack pnpm workflow:check`, `git diff --check`, `corepack pnpm release:acceptance -- --dry-run`, and browser layout checks.

---

### Task 1: Dashboard Contract Test

**Files:**
- Modify: `test/release-acceptance-report.test.ts`
- Read: `scripts/release-acceptance-report.mjs`

**Interfaces:**
- Consumes: `renderAcceptanceReportHtml(model)`
- Produces: test assertions that require dashboard landmarks and remove dependence on the old ledger frame

- [ ] **Step 1: Write the failing test**

```ts
expect(html).toContain('class="acceptance-dashboard"')
expect(html).toContain('class="dashboard-sidebar"')
expect(html).toContain('class="dashboard-shell"')
expect(html).toContain('class="dashboard-grid"')
expect(html).toContain('class="metric-card"')
expect(html).toContain('class="chart-card"')
expect(html).toContain('class="command-distribution"')
expect(html).toContain('class="dashboard-table command-table"')
expect(html).toContain('class="dashboard-table artifact-table"')
expect(html).toContain('class="release-badge')
expect(html).toContain('aria-label="命令结果分布"')
expect(html).toContain('Release Command Center')
expect(html).not.toContain('class="release-ledger"')
expect(html).not.toContain('class="gate-strip"')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/run-root-test.mjs rules -- --testNamePattern "renders a self-contained Chinese HTML credential|builds the release credential model"`

Expected: FAIL because `acceptance-dashboard`, `dashboard-sidebar`, and `command-distribution` are not rendered by the current implementation.

### Task 2: Static shadcn Dashboard HTML

**Files:**
- Modify: `scripts/release-acceptance-report.mjs`
- Test: `test/release-acceptance-report.test.ts`

**Interfaces:**
- Consumes: `model.commandSummary`, `model.commandResults`, `model.coverageSummary`, `model.metadata`, `model.brandLogo`
- Produces: `renderAcceptanceReportHtml(model)` with dashboard layout classes asserted by Task 1

- [ ] **Step 1: Replace old ledger CSS and markup**

Implement the page root as:

```html
<main class="acceptance-dashboard">
  <aside class="dashboard-sidebar">...</aside>
  <section class="dashboard-shell">...</section>
</main>
```

Use static component analogues:

```html
<article class="metric-card">...</article>
<article class="chart-card">...</article>
<table class="dashboard-table command-table">...</table>
<span class="release-badge release-badge-failed">失败</span>
```

- [ ] **Step 2: Add chart helpers**

Add helper functions that derive command distribution widths from `summary.total` and render a no-script SVG or stacked bar:

```js
const percentage = total === 0 ? 0 : Math.round((value / total) * 100)
```

- [ ] **Step 3: Run target tests**

Run: `node scripts/run-root-test.mjs rules -- --testNamePattern "renders a self-contained Chinese HTML credential|builds the release credential model"`

Expected: PASS.

### Task 3: Report Generation and Browser Verification

**Files:**
- Generate only: `.release/acceptance/index.html`
- Read only: `.release/acceptance/index.html`

**Interfaces:**
- Consumes: `runAcceptanceReportCli({ argv: ['--', '--dry-run'] })`
- Produces: self-contained local HTML at `.release/acceptance/index.html`

- [ ] **Step 1: Generate dry-run report**

Run: `corepack pnpm release:acceptance -- --dry-run`

Expected: exit 0, output file `.release/acceptance/index.html`, overall status `未执行`.

- [ ] **Step 2: Verify layout in browser**

Use Playwright against `file:///Users/Bigo/Desktop/develop/fontend-workspace/emp/.release/acceptance/index.html`.

Expected checks:

```js
logoVisible === true
logoIsDataUri === true
desktopOverflow === false
mobileOverflow === false
dashboardSidebarVisible === true
chartVisible === true
```

### Task 4: Repo Gates and Push Closure

**Files:**
- Stage only files changed for this redesign if pushing is still intended by the active request chain.

**Interfaces:**
- Consumes: working tree diff
- Produces: verified local closure and optional pushed commit

- [ ] **Step 1: Run repo checks**

Run:

```bash
node scripts/run-root-test.mjs rules
corepack pnpm workflow:check
git diff --check
codegraph sync . && codegraph status .
```

Expected: all exit 0.

- [ ] **Step 2: Commit and push if no new visual correction is requested**

Run:

```bash
git status --short --branch
git add -- scripts/release-acceptance-report.mjs test/release-acceptance-report.test.ts .superpowers/plans/2026-07-06-acceptance-dashboard-redesign.md
git diff --cached --check
git commit -m "style: redesign acceptance report dashboard"
git push origin v4
```

Expected: push succeeds on branch `v4`.
