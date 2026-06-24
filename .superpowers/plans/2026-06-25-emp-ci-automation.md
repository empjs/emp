# EMP CI Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a project-level CI automation layer that enforces the current real-test and build checks without changing publish behavior.

**Architecture:** `AGENTS.md` remains the rule source for humans and agents. `package.json` exposes a single local verification command, and `.github/workflows/ci.yml` runs that command plus the real package build on PR, branch push, and manual dispatch.

**Tech Stack:** GitHub Actions, Node 24, `pnpm@10.33.0`, existing CLI Rstest scripts, existing Node rules/package tests, existing release automation, existing Rslib preset check, existing EMP build scripts.

## Global Constraints

- 默认中文沟通；先给结果，再给必要依据。
- 当前 workspace 原地执行，不新建 worktree；不要回滚用户已有改动。
- 包管理固定使用 `pnpm@10.33.0`，遵守根 `packageManager` 与 `engines`。
- CI 只能验证，不发布；npm publish 权限和 token 只属于 `.github/workflows/publish.yml`。
- 新增自动化必须复用当前已有测试和 release 脚本，不引入第二套测试 runner；历史 Node 测试只作为待迁移遗留被根入口编排。
- 自动化规则写入 `AGENTS.md`，计划与设计文档写入 `.superpowers/**`。

---

## Task 1: Root CI Verification Command

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `pnpm test:packages`, `pnpm test:rules`, `pnpm ci:verify`
- Consumes: `pnpm test:cli`, package `test` scripts, `scripts/release.test.mjs`, `scripts/apps.test.mjs`, `pnpm release:check`, `pnpm check:rslib-presets`

- [ ] Add root test orchestration scripts:

```json
"test:packages": "pnpm --filter @empjs/share test && pnpm --filter @empjs/chain test && pnpm --filter @empjs/plugin-react test",
"test:rules": "node --test scripts/release.test.mjs && node scripts/apps.test.mjs",
"ci:verify": "pnpm test:cli && pnpm test:packages && pnpm test:rules && pnpm release:check && pnpm check:rslib-presets"
```

- [ ] Run `pnpm ci:verify`.
- [ ] Expected result: command exits 0 after CLI, package, rules, release check, and Rslib preset check pass.

## Task 2: GitHub Actions CI Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: root `ci:verify` and `empbuild` scripts.
- Produces: PR / push / manual CI gates named `verify` and `build`.

- [ ] Create `.github/workflows/ci.yml` with:
  - `pull_request` trigger for `main` and `v4`
  - `push` trigger for `main` and `v4`
  - `workflow_dispatch`
  - read-only `contents` permission
  - concurrency that cancels stale CI runs for the same ref
  - `verify` job running `pnpm ci:verify`
  - `build` job running `pnpm empbuild`

- [ ] Keep setup commands aligned with publish workflow:

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

- [ ] Do not configure npm registry auth or publish tokens in this workflow.

## Task 3: AGENTS Automation Matrix

**Files:**
- Modify: `AGENTS.md`

**Interfaces:**
- Produces: durable rules for when to run `pnpm ci:verify`, scoped real tests, release checks, and build checks.

- [ ] Add a `统一真实测试策略` section and an `自动化运行规则` section before the plan-format rules.
- [ ] State that `pnpm ci:verify` is the default local and CI verification gate.
- [ ] State that PR / push CI must run `pnpm ci:verify` and `pnpm empbuild`.
- [ ] State that workflow changes must be verified with `pnpm ci:verify` and `git diff --check`.
- [ ] State that release automation changes must run `pnpm test:rules` and `pnpm release:check`.
- [ ] State that package or build-affecting changes must run `pnpm empbuild`, or explicitly report why it was not run.

## Task 4: Verification

**Files:**
- Verify only.

**Interfaces:**
- Consumes: Tasks 1-3 deliverables.
- Produces: final pass/fail report.

- [ ] Run `pnpm ci:verify`.
- [ ] Run `pnpm empbuild`.
- [ ] Run `git diff --check`.
- [ ] Run `rg -n "NODE_AUTH_TOKEN|npm publish|release:publish" .github/workflows/ci.yml` and confirm no output.
- [ ] Run `git status --short --branch` and report existing unrelated or pre-existing dirty files without reverting them.
