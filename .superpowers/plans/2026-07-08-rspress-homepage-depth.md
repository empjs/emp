# Rspress Homepage Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前过于简洁的 EMP v4 Rspress 首页升级为中文产品官网级入口，保留文档站可维护性。

**Architecture:** 首页仍使用 Rspress Markdown，复杂版式通过原生 HTML 区块表达。视觉样式通过 Rspress v2 插件 `globalStyles` 挂载 `website/docs/styles/home.css`，不恢复旧 theme、不引入 Tailwind 或 React 组件。规则测试锁定首页必须包含产品叙事、指标、架构流、场景入口和发布验收入口。

**Tech Stack:** Rspress v2.0.16、Markdown raw HTML、CSS、Rstest。

## Global Constraints

- 默认中文文档，只维护 `website/docs/zh`。
- 不恢复 `website/theme`、`website/config`、`tailwind.config.js`、`postcss.config.js`。
- 不新增运行时依赖，不引入 Tailwind、Framer Motion、Ant Design 或自定义 React 组件。
- 首页视觉必须使用现有 `emp-v4-logo.png`，并保持 Rspress 默认导航、搜索、LLMS 输出。
- 不修改 `packages/**`、`apps/**`、发布脚本和当前未提交的发布验收报告文件。

---

### Task 1: 锁定首页深度要求

**Files:**
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: `website/docs/zh/index.md` and `website/rspress.config.ts`.
- Produces: Failing rules that require deeper homepage content and global style registration.

- [ ] **Step 1: Write the failing test**

Add assertions that the homepage contains:
- `class="emp-home"`
- `data-section="hero"`
- `data-section="metrics"`
- `data-section="architecture"`
- `data-section="journeys"`
- `data-section="release"`
- `Rspack 2`
- `Module Federation 2`
- `7 个插件包`
- `26 篇中文文档`

Add assertions that config registers `docs/styles/home.css` through `globalStyles`.

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/website.rules.test.ts`

Expected: FAIL because the current homepage has no `emp-home` layout and the config does not register global styles.

### Task 2: 实现官网级首页和样式

**Files:**
- Modify: `website/rspress.config.ts`
- Modify: `website/docs/zh/index.md`
- Create: `website/docs/styles/home.css`

**Interfaces:**
- Consumes: Task 1 rule expectations.
- Produces: A richer Chinese homepage with product positioning, metrics, architecture flow, scenario routes and release proof.

- [ ] **Step 1: Register global CSS**

Add an inline Rspress plugin in `website/rspress.config.ts`:

```ts
const homepageDesignPlugin = () => ({
  name: 'emp-homepage-design',
  globalStyles: path.join(__dirname, 'docs/styles/home.css'),
})
```

Append it to `plugins` after `pluginSitemap(...)`.

- [ ] **Step 2: Replace the homepage body**

Use `website/docs/zh/index.md` to provide a structured homepage:
- hero banner with EMP v4 logo, primary copy and command block
- metric strip for documents, plugin packages, example apps and release gates
- architecture flow for CLI, Share, Plugins and Acceptance
- scenario journey cards that link to existing docs
- release proof section with gate checklist and artifact links

- [ ] **Step 3: Add CSS**

Create `website/docs/styles/home.css` with:
- widened homepage content container
- distinctive restrained industrial/editorial visual direction
- responsive grid layouts
- accessible focus and hover states
- no dependency on external fonts or images beyond `/emp-v4-logo.png`

### Task 3: Verify and refresh preview

**Files:**
- Verify only.

**Interfaces:**
- Consumes: Task 2 implementation.
- Produces: Passing tests, successful Rspress build and refreshed local preview.

- [ ] **Step 1: Run targeted rules**

Run: `corepack pnpm exec rstest run --config rstest.config.ts test/website.rules.test.ts`

Expected: PASS.

- [ ] **Step 2: Run website build**

Run: `corepack pnpm website:build`

Expected: PASS and emits `website/doc_build/index.html`, `llms.txt`, `sitemap.xml`.

- [ ] **Step 3: Run repository gates for this scope**

Run:

```bash
corepack pnpm test:rules
git diff --check
```

Expected: both commands exit 0.

- [ ] **Step 4: Restart local preview**

Restart tmux session `emp-website-4174` to serve `website/doc_build` and verify:

```bash
curl -I http://127.0.0.1:4174/
curl -s http://127.0.0.1:4174/ | rg 'emp-home|EMP v4'
```

Expected: homepage returns 200 and contains the richer homepage marker.
