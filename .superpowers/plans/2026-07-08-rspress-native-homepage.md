# Rspress Native Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 EMP v4 官网首页从自定义 HTML/CSS 首页纠偏为 Rspress v2 原生 Home Page 内容规范。

**Architecture:** 首页内容使用 Rspress frontmatter 的 `pageType: home`、`hero` 和 `features` 表达。移除 `emp-home` 原生 HTML 区块、全局 CSS 插件和 `website/docs/styles/home.css`，保持 Rspress 默认主题和文档内容模型。

**Tech Stack:** Rspress v2.0.16、Markdown frontmatter、Rstest。

## Global Constraints

- 首页内容规范以 Rspress v2 官方 Home Page 为准。
- 不使用自定义 HomeLayout、不恢复 `website/theme`，不新增 React 组件。
- 不使用原生 HTML 大区块承载首页内容。
- 不新增 Tailwind、Framer Motion、Ant Design 等依赖。
- 保留中文文档、logo、llms、sitemap 和既有导航。
- 不触碰当前发布验收报告脏改。

---

### Task 1: 规则测试改为约束 Rspress 原生 Home Page

**Files:**
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: `website/docs/zh/index.mdx` and `website/rspress.config.ts`.
- Produces: Rules requiring Rspress frontmatter homepage and rejecting custom HTML/CSS scaffolding.

- [x] **Step 1: Write the failing test**

Require `index.mdx` to contain `pageType: home`, `hero:`, `features:`, `image:`, `actions:` and at least six `features` entries.

Reject `class="emp-home"`, `data-section=`, `<section`, `<article`, and `website/docs/styles/home.css`.

- [x] **Step 2: Run the targeted test**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/website.rules.test.ts`

Expected: FAIL before implementation because the current homepage is custom HTML/CSS.

### Task 2: Convert homepage to native Rspress content

**Files:**
- Delete: `website/docs/zh/index.md`
- Add: `website/docs/zh/index.mdx`
- Modify: `website/rspress.config.ts`
- Delete: `website/docs/styles/home.css`

**Interfaces:**
- Consumes: Task 1 rule expectations.
- Produces: Native Rspress home page using frontmatter only.

- [x] **Step 1: Remove custom style plugin**

Delete `homepageDesignPlugin` and remove it from `plugins`.

- [x] **Step 2: Replace homepage content**

Use frontmatter:

```yaml
pageType: home
title: EMP v4
titleSuffix: Rspack 2 驱动的微前端工程工具
hero:
  name: EMP v4
  text: Rspack 2 驱动的微前端工程工具
  tagline: ...
  image:
    src: /emp-v4-logo.png
    alt: EMP v4
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start.html
features:
  - title: ...
```

- [x] **Step 3: Delete custom CSS**

Remove `website/docs/styles/home.css`.

### Task 3: Verify and refresh preview

**Files:**
- Verify only.

**Interfaces:**
- Consumes: Task 2 implementation.
- Produces: Passing tests, successful Rspress build and refreshed local preview.

- [x] **Step 1: Run website rules**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/website.rules.test.ts`

Expected: PASS.

- [x] **Step 2: Build website**

Run: `corepack pnpm website:build`

Expected: PASS.

- [x] **Step 3: Run scoped gates**

Run:

```bash
corepack pnpm test:rules
corepack pnpm workflow:check
git diff --check
```

Expected: PASS.

- [x] **Step 4: Refresh local preview**

Restart tmux session `emp-website-4174` and verify `http://127.0.0.1:4174/` returns 200.
