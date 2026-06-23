# EMP Internal Release Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 EMP v4 增加以内部版本为主的统一版本管理、发布 dry-run/真实发布保护、包范围校验和 changelog 自动化。

**Architecture:** 发布逻辑放在无额外依赖的 Node ESM 脚本中：`scripts/release-core.mjs` 提供可测试的包发现、分类、版本更新、changelog 和命令生成；`scripts/release.mjs` 提供 CLI。根 `package.json` 只挂 pnpm 入口，`.npmrc` 固化 workspace 包管理默认值，`CHANGELOG.md` 作为统一版本发布记录入口。

**Tech Stack:** Node.js ESM, `node:test`, pnpm `10.33.0`, package JSON workspaces, `pnpm --dir <package> publish`.

## Global Constraints

- 默认中文输出。
- Superpowers 工作产物统一放在 `.superpowers/`。
- 根工程保持 `private: true`。
- 包管理默认使用 `pnpm@10.33.0`，遵守根 `packageManager` 与 `engines`。
- `packages/**` 是发布包主范围；`projects/**` 和 `website` 默认视为示例或站点，不进入自动发布。
- 内部统一版本优先覆盖 v4 核心包：`@empjs/cli`、`@empjs/chain`、`@empjs/share`、`@empjs/plugin-*`、`@empjs/bridge-*`、`@empjs/adapter-*`、`@empjs/polyfill`、配置包。
- `@empjs/cdn-*`、`@empjs/lib-*` 这类 CDN / legacy runtime 包默认保持独立版本线，除非用户明确要求纳入统一版本。
- 发布脚本必须支持 dry-run，并且真实 publish 必须有显式确认参数。
- changelog 需要说明版本、发布时间、发布范围、主要变更和验证命令。
- 不修改现有业务代码或 README 内容。

---

### Task 1: Release Core Tests

**Files:**
- Create: `scripts/release.test.mjs`
- Later create: `scripts/release-core.mjs`

**Interfaces:**
- Consumes: `createReleasePlan(rootDir)`, `validateReleasePlan(plan)`, `applyInternalVersion(plan, version)`, `renderChangelogEntry(plan, options)`, `buildPublishCommands(plan, options)`, `prependChangelog(rootDir, entry)`.
- Produces: regression coverage for release scope, version updates, changelog content, and guarded publish commands.

- [ ] **Step 1: Write failing tests**

Create `scripts/release.test.mjs` with temporary workspace fixtures. Assert that internal release packages include core `@empjs/*` packages, exclude `projects/**`, `website`, `@empjs/cdn-*`, and `@empjs/lib-*`; version updates change root/internal packages only; changelog text is Chinese and contains release scope; publish commands are dry-run by default and require `yes: true` for real publish.

- [ ] **Step 2: Verify RED**

Run: `node --test scripts/release.test.mjs`
Expected: FAIL because `scripts/release-core.mjs` does not exist.

### Task 2: Release Core Implementation

**Files:**
- Create: `scripts/release-core.mjs`
- Test: `scripts/release.test.mjs`

**Interfaces:**
- Produces:
  - `createReleasePlan(rootDir): Promise<ReleasePlan>`
  - `validateReleasePlan(plan): string[]`
  - `applyInternalVersion(plan, version): Promise<void>`
  - `renderChangelogEntry(plan, options): string`
  - `prependChangelog(rootDir, entry): Promise<void>`
  - `buildPublishCommands(plan, options): string[][]`

- [ ] **Step 1: Implement package discovery and classification**

Scan `package.json`, `packages/**/package.json`, `projects/**/package.json`, and `website/package.json`. Classify non-private `packages/**` `@empjs/*` packages as `internal` unless their name starts with `@empjs/cdn-` or `@empjs/lib-`; classify those excluded packages as `independent`; classify `projects/**` and `website` as `workspace`.

- [ ] **Step 2: Implement validation**

Validate root privacy, pnpm baseline, internal package version equality with root version, and ensure the publish target contains no `projects/**` or `website`.

- [ ] **Step 3: Implement version and changelog helpers**

`applyInternalVersion` updates root and internal package versions only. `renderChangelogEntry` renders a dated Chinese changelog section. `prependChangelog` prepends under `# Changelog`.

- [ ] **Step 4: Implement guarded command generation**

`buildPublishCommands` generates one `pnpm --dir <dir> publish --tag <tag> --access public --no-git-checks` command per internal package. It appends `--dry-run` when `dryRun` is true and throws if `dryRun` is false without `yes: true`.

### Task 3: Release CLI and Package Manager Defaults

**Files:**
- Create: `scripts/release.mjs`
- Create: `.npmrc`
- Modify: `package.json`

**Interfaces:**
- Produces pnpm commands:
  - `pnpm release:check`
  - `pnpm release:version <version>`
  - `pnpm release:changelog -- --version <version>`
  - `pnpm release:pack`
  - `pnpm release:publish:dry`
  - `pnpm release:publish -- --yes`

- [ ] **Step 1: Implement CLI**

`check` prints the release plan and exits non-zero on validation errors. `version` updates internal versions. `changelog` prepends the generated changelog entry. `pack` runs guarded dry-run pack commands by default. `publish` runs dry-run unless `--yes` is passed for real publish.

- [ ] **Step 2: Add root scripts**

Add release scripts to root `package.json` without removing existing scripts.

- [ ] **Step 3: Add `.npmrc`**

Set workspace-friendly pnpm defaults: `link-workspace-packages=true`, `prefer-workspace-packages=true`, `save-workspace-protocol=true`, `shared-workspace-lockfile=true`.

### Task 4: Changelog

**Files:**
- Create: `CHANGELOG.md`

**Interfaces:**
- Documents current internal release policy and v4.0.0 scope.

- [ ] **Step 1: Add initial changelog**

Create `CHANGELOG.md` with `4.0.0` entry, release date `2026-06-23`, internal release scope, independent package lines, and verification commands.

### Task 5: Verification

**Files:**
- Test: `scripts/release.test.mjs`
- Check: release CLI and diff checks

**Interfaces:**
- Produces evidence for final response.

- [ ] **Step 1: Run unit tests**

Run: `node --test scripts/release.test.mjs`
Expected: all tests pass.

- [ ] **Step 2: Run release check**

Run: `pnpm release:check`
Expected: exits 0, prints internal package count, independent package count, and no validation errors.

- [ ] **Step 3: Run dry-run publish generation**

Run: `pnpm release:publish:dry -- --skip-build`
Expected: exits 0, prints dry-run publish commands, excludes `projects/**`, `website`, `@empjs/cdn-*`, and `@empjs/lib-*`.

- [ ] **Step 4: Run diff hygiene checks**

Run: `git diff --check`
Expected: exits 0.
