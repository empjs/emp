# EMP Rspress v2 Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the EMP website as a Chinese-only Rspress v2 documentation site, replacing the old website implementation while keeping the content grounded in the current repository.

**Architecture:** The `website/` workspace becomes a minimal Rspress v2 project powered by `@rspress/core` and declarative navigation. The root README remains a short product page; detailed usage, migration, plugin, examples, and release-gate documentation move into `website/docs/zh/**`. Old Rspress 1.x theme code, Tailwind 3 configuration, generated build output, and obsolete assets are removed instead of migrated.

**Tech Stack:** Rspress v2.0.16, React 19-compatible Rspress defaults, TypeScript, Rstest, pnpm 10.33.0, declarative `_nav.json` / `_meta.json`, `llms: true`.

## Global Constraints

- Use Chinese documentation only; do not create `website/docs/en/**`.
- Use `@rspress/core` v2.0.16 and `@rspress/plugin-sitemap` v2.0.16; do not keep `rspress` 1.x or `rspress-plugin-sitemap`.
- Do not keep Tailwind 3, `tailwind.config.js`, `postcss.config.js`, old `website/theme/**`, or old custom theme dependencies for the rebuilt docs site.
- Keep existing unrelated dirty files untouched: `scripts/release-acceptance-report.mjs`, `test/release-acceptance-report.test.ts`, and existing untracked `.superpowers/plans/**`.
- `website` remains a workspace/example/docs site and must not enter release package scope.
- Prefer current repository facts over old website prose: `README.md`, `package.json`, `packages/**/package.json`, `packages/**/README.md`, `packages/cli/docs/**`, `apps/README.md`, `docs/testing/apps-feature-test-matrix.md`, and `docs/v4-alpha-migration.md`.
- The root script typo `offical:*` can remain as compatibility aliases, but new canonical scripts must be `website:*`.
- Generated output and local installs must not be committed: `website/doc_build/`, `website/node_modules/`, `dist/`, `coverage/`.
- Verification must include `corepack pnpm test:rules`, `corepack pnpm website:build`, `corepack pnpm workflow:check`, and `git diff --check`; run broader gates if dependency or workspace changes make them necessary.

---

### Task 1: Plan, Rules, and Acceptance Guard

**Files:**
- Create: `.superpowers/plans/2026-07-07-rspress-v2-website-rebuild.md`
- Create: `test/website.rules.test.ts`
- Modify: `scripts/root-test-targets.mjs`

**Interfaces:**
- Consumes: current `website/package.json`, `website/rspress.config.ts`, root `package.json`.
- Produces: a root `rules` target that fails until the website is rebuilt to Rspress v2.

- [ ] **Step 1: Write the failing website rules test**

Create `test/website.rules.test.ts` with assertions for:
- package name `@empjs/website`
- `@rspress/core` and `@rspress/plugin-sitemap` at `^2.0.16`
- no `rspress`, `rspress-plugin-sitemap`, `tailwindcss`, `antd`, `framer-motion`, `rsfamily-nav-icon`, or `react-intersection-observer`
- root `website:*` scripts and compatibility `offical:*` aliases filter `@empjs/website`
- `website/rspress.config.ts` imports from `@rspress/core`, has `llms: true`, `lang: 'zh'`, and does not define programmatic `nav` or `sidebar`
- `website/docs/zh/_nav.json` exists, `website/docs/en` does not exist
- old theme and Tailwind config files are gone

- [ ] **Step 2: Add the test to the rules target**

Update `scripts/root-test-targets.mjs` so `test/website.rules.test.ts` is included in the `rules` target.

- [ ] **Step 3: Run red verification**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/website.rules.test.ts`
Expected: FAIL on the current old website because it still uses `@empjs/offical`, `rspress` 1.x, Tailwind 3, and old theme files.

### Task 2: Clean and Rebuild the Rspress v2 Workspace

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Replace: `website/package.json`
- Replace: `website/rspress.config.ts`
- Replace: `website/tsconfig.json`
- Delete: `website/theme/**`
- Delete: `website/config/**`
- Delete: `website/tailwind.config.js`
- Delete: `website/postcss.config.js`
- Delete: `website/README.md`
- Delete local ignored output: `website/doc_build/`

**Interfaces:**
- Consumes: Rspress v2.0.16 package metadata from npm.
- Produces: `corepack pnpm website:build` as the canonical site build command and `offical:*` aliases for compatibility.

- [ ] **Step 1: Remove the old website implementation**

Remove old custom theme/config files and generated `website/doc_build/`. Do not delete `website/docs/**` until replacement docs are ready.

- [ ] **Step 2: Replace package manifest**

Set `website/package.json` to:
- name `@empjs/website`
- private `true`
- scripts `dev`, `build`, `start`
- devDependencies `@rspress/core`, `@rspress/plugin-sitemap`, `typescript`

- [ ] **Step 3: Update root scripts**

Add canonical:
- `website:dev`
- `website:build`
- `website:start`

Keep compatibility:
- `offical:dev`
- `offical:build`
- `offical:start`

All six scripts must filter `@empjs/website`.

- [ ] **Step 4: Replace Rspress config**

Use `defineConfig` from `@rspress/core`, `pluginSitemap` from `@rspress/plugin-sitemap`, `root: path.join(__dirname, 'docs')`, `lang: 'zh'`, `llms: true`, `title: 'EMP v4'`, Chinese description, `/emp-v4-logo.png` as logo/icon, built-in search, GitHub social link, and no programmatic `nav` / `sidebar`.

- [ ] **Step 5: Refresh lockfile**

Run: `corepack pnpm install --lockfile-only`
Expected: lockfile records `@rspress/core@2.0.16` and removes old direct website dependencies.

### Task 3: Rebuild Chinese Content and Navigation

**Files:**
- Replace: `website/docs/zh/index.md`
- Create: `website/docs/zh/_nav.json`
- Create/replace: `website/docs/zh/guide/**`
- Create/replace: `website/docs/zh/core/**`
- Create/replace: `website/docs/zh/plugins/**`
- Create/replace: `website/docs/zh/config/**`
- Create/replace: `website/docs/zh/examples/**`
- Create/replace: `website/docs/zh/migration/**`
- Create/replace: `website/docs/zh/release/**`
- Create/replace: `website/docs/zh/faq/**`
- Replace assets under: `website/docs/public/**`

**Interfaces:**
- Consumes: root README, package READMEs, package manifests, apps matrix, v4 migration guide.
- Produces: Chinese-only Rspress docs with declarative navigation.

- [ ] **Step 1: Prepare assets**

Copy `docs/assets/emp-v4-logo.png` to `website/docs/public/emp-v4-logo.png`. Copy `docs/assets/qq.jpeg` only if the FAQ support page references it.

- [ ] **Step 2: Build declarative navigation**

Create `website/docs/zh/_nav.json` with sections:
- 首页
- 快速开始
- 核心能力
- 插件生态
- 配置参考
- 示例与验收
- 迁移指南
- 发布治理
- FAQ

Each directory must have `_meta.json` that matches existing files and avoids orphan pages.

- [ ] **Step 3: Rewrite content**

Write concise Chinese pages grounded in current code. Do not preserve old outdated Rspress 1.x or EMP 3 prose.

### Task 4: Subagent Content Split

**Files:**
- Agent A owns: `website/docs/zh/index.md`, `website/docs/zh/guide/**`
- Agent B owns: `website/docs/zh/core/**`, `website/docs/zh/config/**`
- Agent C owns: `website/docs/zh/plugins/**`, `website/docs/zh/examples/**`
- Agent D owns: `website/docs/zh/migration/**`, `website/docs/zh/release/**`, `website/docs/zh/faq/**`

**Interfaces:**
- Consumes: Task 3 navigation skeleton.
- Produces: complete Chinese docs without overlapping writes.

- [ ] **Step 1: Dispatch content agents**

Use `emp-fast` / `gpt-5.3-codex-spark` for each content slice. Each brief must forbid touching unrelated dirty files and other agents' directories.

- [ ] **Step 2: Main agent integration**

Review returned content, normalize terminology, ensure links are valid, and remove duplicate or stale claims.

### Task 5: Verification and Release-Readiness Review

**Files:**
- Inspect all changed files.
- Do not touch unrelated dirty files.

**Interfaces:**
- Consumes: all tasks.
- Produces: verified local rebuild and review package.

- [ ] **Step 1: Run targeted rules**

Run: `corepack pnpm test:rules`
Expected: PASS.

- [ ] **Step 2: Build website**

Run: `corepack pnpm website:build`
Expected: PASS and generates `website/doc_build/`, including `llms.txt` and `llms-full.txt`.

- [ ] **Step 3: Run workflow check**

Run: `corepack pnpm workflow:check`
Expected: PASS.

- [ ] **Step 4: Check whitespace and final diff**

Run: `git diff --check`
Expected: no output and exit 0.

- [ ] **Step 5: Completion audit**

Confirm:
- Rspress v2 package and config are current.
- Website docs are Chinese-only.
- Old theme/Tailwind 3 implementation is gone.
- `website` remains excluded from release package scope.
- Unrelated dirty files are preserved.
