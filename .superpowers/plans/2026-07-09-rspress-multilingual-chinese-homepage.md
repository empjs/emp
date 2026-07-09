# Rspress Multilingual Chinese Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add Rspress v2 multilingual routing with the Chinese homepage as the default route and English under `/en/`.

**Architecture:** Use Rspress locale directories under `website/docs/zh` and `website/docs/en`. Set `lang: 'zh'` with `locales: [{lang:'zh'}, {lang:'en'}]`, so Chinese renders at `/` and English renders at `/en/`; locale-specific nav entries keep links valid in both languages.

**Tech Stack:** Rspress v2.0.17, MDX frontmatter homepage contract, Rstest rules, Playwright/Browser rendered verification.

## Global Constraints

- Only touch website/doc/test files required for multilingual routing.
- Preserve current Federation Fox visual system and transparent PNG assets.
- Preserve existing unrelated dirty work in package, CLI, release, and toolchain files.
- Use `corepack pnpm` for commands.
- Do not commit generated `website/doc_build`, screenshots, `tmp/`, caches, or unrelated dirty files.

---

### Task 1: Multilingual Rules

**Files:**
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: current Rspress config path and frontmatter parsing helper.
- Produces: RED tests requiring `zh` and `en` locale directories, Chinese default homepage, English `/en/` homepage, and locale-specific nav labels.

- [x] **Step 1: Write the failing test**

Add constants for `website/docs/en`, `website/docs/en/index.mdx`, and update the config/homepage/tree tests so they assert:

```ts
expect(config).toContain("lang: 'zh'")
expect(config).toContain("lang: 'zh'")
expect(config).toContain("label: 'English'")
expect(config).toContain("label: '简体中文'")
expect(config).toContain("text: '文档'")
expect(config).toContain("link: '/en/guide/index.html'")
expect(locales).toEqual(['en', 'zh'])
expect(parsedEn.frontmatter.hero?.badge).toBe('High performance · Zero compromise')
expect(parsedZh.frontmatter.hero?.badge).toBe('高性能 · 零妥协')
expect(parsedZh.frontmatter.hero?.text).toBe('联邦前端构建')
expect(parsedZh.frontmatter.hero?.actions?.[0]?.text).toBe('快速开始')
```

- [x] **Step 2: Run test to verify it fails**

Run: `corepack pnpm exec rstest run test/website.rules.test.ts`

Expected: FAIL until config uses `zh` as the default locale and English links use `/en/...`.

### Task 2: Rspress Locale Implementation

**Files:**
- Create: `website/docs/en/**`
- Modify: `website/docs/zh/index.mdx`
- Modify: `website/rspress.config.ts`

**Interfaces:**
- Consumes: Rspress v2 locale directory convention where default `lang` omits the language prefix.
- Produces: Chinese default route `/`, English route `/en/`, Chinese nav, English nav, and localized Chinese homepage frontmatter.

- [x] **Step 1: Create the English locale directory**

Copy `website/docs/zh` to `website/docs/en` to preserve route parity. Keep `website/docs/en/index.mdx` as the English design-reference homepage and update its links to `/en/...`.

- [x] **Step 2: Localize the Chinese homepage**

Update `website/docs/zh/index.mdx` frontmatter:

```yaml
titleSuffix: '联邦前端构建'
hero:
  text: '联邦前端构建'
  badge: '高性能 · 零妥协'
  tagline: '轻松构建、组合并发布微前端应用。极速构建、完整类型、生产可用。'
  actions:
    - text: '快速开始'
    - text: '查看文档'
features:
  - title: 'Module Federation 2'
    details: '原生支持 Module Federation 2，组合微前端时保持高性能。'
```

- [x] **Step 3: Configure locale-aware navigation**

Set `lang: 'zh'`; add top-level `locales` with `简体中文` and `English`; set `themeConfig.locales` with Chinese nav and English nav. Chinese nav links must remain root-relative `/guide/...`; English nav links must use `/en/...`.

- [x] **Step 4: Run test to verify it passes**

Run: `corepack pnpm exec rstest run test/website.rules.test.ts`

Expected: PASS.

### Task 3: Build And Rendered QA

**Files:**
- Modify only if validation finds defects: `website/docs/theme.css`, `website/rspress.config.ts`, locale homepages.

**Interfaces:**
- Consumes: built output in `website/doc_build`.
- Produces: validated root Chinese page and `/en/` English page with language switch.

- [x] **Step 1: Build the website**

Run: `corepack pnpm --dir website build`

Expected: exit 0; no dead-link failure.

- [x] **Step 2: Verify rendered language routes**

Use Browser plugin if available; otherwise use Playwright fallback. Verify:

```text
/: Chinese homepage renders "联邦前端构建"
/en/: English homepage renders "Federated Frontend Build"
language menu contains English and 简体中文
no blank page, no framework overlay, no relevant console errors
```

- [x] **Step 3: Final checks**

Run:

```bash
git diff --check -- website/rspress.config.ts website/docs/en website/docs/zh/index.mdx website/docs/theme.css test/website.rules.test.ts .superpowers/plans/2026-07-09-rspress-multilingual-chinese-homepage.md
git status --short --branch
```

Expected: diff check passes; status shows only intended multilingual files plus pre-existing unrelated dirty work.
