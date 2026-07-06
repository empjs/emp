# Release Acceptance HTML Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成一个可复跑的 EMP v4 发布验收 HTML 凭证，每次运行发布验收命令后记录真实测试状态、测试矩阵和新增覆盖入口。

**Architecture:** 新增 `scripts/release-acceptance-report.mjs` 作为唯一生成器，默认执行发布前本地 gates 并写出自包含 HTML 到 `.release/acceptance/index.html`。报告数据从 `scripts/root-test-targets.mjs`、`package.json`、git 元信息和命令执行结果动态生成，新增 root/browser 测试只要登记到 root targets 就会自动出现在报告矩阵。`workflow:check` 和 `test:rules` 增加约束，防止脚本入口、报告生成器和测试目标漂移。

**Tech Stack:** Node.js ESM、`child_process.spawn`、`@rstest/core`、自包含 HTML/CSS、现有 `corepack pnpm` 脚本。

## Global Constraints

- 默认中文输出；最终说明真实验证结果和未覆盖边界。
- 不提交生成物、缓存或本地输出；验收 HTML 默认写入已忽略的 `.release/acceptance/index.html`。
- 不把浏览器 E2E 塞进默认 `apps:acceptance`；浏览器 lane 在报告中可显式运行或记录为未执行。
- 新增测试必须纳入 `scripts/root-test-targets.mjs`，并由 `workflow:check` 保护。
- 发布验收相关改动至少验证 `workflow:check`、`test:rules`、`release:check`、`ci:verify` 和 `empbuild`。

---

### Task 1: Report Contract Tests

**Files:**
- Create: `test/release-acceptance-report.test.ts`
- Modify: `scripts/root-test-targets.mjs`

**Interfaces:**
- Consumes: `ROOT_TEST_TARGETS`、`ROOT_BROWSER_TEST_TARGETS`
- Produces: `release-acceptance-report` root test coverage

- [x] **Step 1: Write the failing test**

Add tests that import `../scripts/release-acceptance-report.mjs` and assert:
- the model includes root/browser target counts from `root-test-targets.mjs`
- generated HTML contains Chinese title, command status, matrix, new coverage and uncovered boundary sections
- a failing required command makes overall status `failed`

- [x] **Step 2: Run test to verify it fails**

Run: `node scripts/run-root-test.mjs rules -- --testNamePattern "release acceptance report"`
Expected: FAIL because `scripts/release-acceptance-report.mjs` does not exist yet.

### Task 2: Report Generator And Script Entry

**Files:**
- Create: `scripts/release-acceptance-report.mjs`
- Modify: `package.json`
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**
- Produces: `DEFAULT_ACCEPTANCE_COMMANDS`, `buildAcceptanceReportModel`, `renderAcceptanceReportHtml`, `writeAcceptanceReport`, CLI `node scripts/release-acceptance-report.mjs`
- CLI options: `--out <file>`, `--dry-run`, `--include-browser`, `--skip-command <id>`

- [x] **Step 1: Implement generator**

The generator runs command specs sequentially, records `passed` / `failed` / `skipped`, duration, log excerpt, exit code and required/optional status, then writes one self-contained HTML file.

- [x] **Step 2: Add root script**

Add package script:

```json
"release:acceptance": "node scripts/release-acceptance-report.mjs"
```

- [x] **Step 3: Guard script ordering**

Update `test/toolchain.rules.test.ts` so root script order includes `release:acceptance` near release scripts.

### Task 3: Workflow Guard And Documentation Contract

**Files:**
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: `docs/testing/apps-feature-test-matrix.md`

**Interfaces:**
- Consumes: package script and generator text
- Produces: workflow guard failures when report entry drifts

- [x] **Step 1: Add workflow checks**

Require:
- `scripts/release-acceptance-report.mjs` exists
- `package.json` has `release:acceptance`
- generator imports `ROOT_TEST_TARGETS` and `ROOT_BROWSER_TEST_TARGETS`
- generator writes `.release/acceptance/index.html`

- [x] **Step 2: Document release credential usage**

Add a short section to `docs/testing/apps-feature-test-matrix.md` describing `corepack pnpm release:acceptance` and `--include-browser`.

### Task 4: Verification And Push

**Files:**
- No new source files beyond Tasks 1-3

**Interfaces:**
- Produces: committed and pushed `v4`

- [x] **Step 1: Generate report preview**

Run: `corepack pnpm release:acceptance -- --dry-run`
Expected: writes `.release/acceptance/index.html`.

- [x] **Step 2: Verify browser rendering**

Open the generated HTML locally, capture desktop/mobile screenshots, compare against the concept and inspect via `view_image`.

- [x] **Step 3: Run gates**

Run:
- `corepack pnpm workflow:check`
- `node scripts/run-root-test.mjs rules -- --testNamePattern "release acceptance report"`
- `node scripts/run-root-test.mjs rules`
- `corepack pnpm release:check`
- `corepack pnpm ci:verify`
- `corepack pnpm empbuild`
- `git diff --check`

- [ ] **Step 4: Commit and push**

Stage only task files, run `git diff --cached --check`, commit with `feat: add release acceptance html report`, push `v4`, and verify `origin/v4` equals local HEAD.
