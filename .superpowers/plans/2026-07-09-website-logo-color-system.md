# Website Logo Color System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the EMP v4 website color system with the new EMP Federation Fox logo across light and dark Rspress themes.

**Architecture:** Keep the existing Rspress v2 home frontmatter and global `theme.css` override model. Consolidate logo-derived colors into CSS tokens, map those tokens into Rspress theme variables for light/dark mode, and protect the behavior with existing website rules.

**Tech Stack:** Rspress v2, CSS custom properties, Rstest website rules, Playwright/browser visual verification.

## Global Constraints

- Preserve existing uncommitted website copy/layout work and build on it.
- Do not replace Rspress with a custom app shell.
- Keep light and dark themes driven by `:root` and `:root.dark` CSS variables.
- Use the new EMP Federation Fox logo palette: orange/gold, cyan, electric blue, and deep navy.
- Do not stage or commit unrelated dirty files unless explicitly requested.

---

### Task 1: Encode Logo Palette In Website Rules

**Files:**
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: `website/docs/theme.css`.
- Produces: rule assertions for logo-aligned light/dark tokens and Rspress theme variables.

- [x] **Step 1: Add assertions for logo color tokens**

In the theme stylesheet test, assert the following markers exist:

```ts
expect(theme).toContain('--emp-logo-gold: #ffd84d')
expect(theme).toContain('--emp-logo-orange: #f97316')
expect(theme).toContain('--emp-logo-cyan: #22d3ee')
expect(theme).toContain('--emp-logo-blue: #0ea5e9')
expect(theme).toContain('--emp-logo-navy: #061225')
expect(theme).toContain('--emp-page-bg: #f6fbff')
expect(theme).toContain('--emp-page-bg: #030712')
expect(theme).toContain('--rp-c-bg: #f6fbff')
expect(theme).toContain('--rp-c-bg: #030712')
```

- [x] **Step 2: Run the rule test to verify it fails before implementation**

Run:

```bash
corepack pnpm test:rules
```

Expected: FAIL until `website/docs/theme.css` contains the logo-aligned tokens.

### Task 2: Update Rspress Theme Color Tokens

**Files:**
- Modify: `website/docs/theme.css`

**Interfaces:**
- Produces: light/dark CSS tokens consumed by existing Rspress selectors.

- [x] **Step 1: Replace base palette tokens**

Update `:root` tokens to use logo-aligned palette:

```css
--emp-logo-gold: #ffd84d;
--emp-logo-orange: #f97316;
--emp-logo-cyan: #22d3ee;
--emp-logo-blue: #0ea5e9;
--emp-logo-navy: #061225;
--emp-page-bg: #f6fbff;
--rp-c-bg: #f6fbff;
```

- [x] **Step 2: Replace dark mode palette tokens**

Update `:root.dark` tokens to use deep navy and cyan/amber contrast:

```css
--emp-page-bg: #030712;
--rp-c-bg: #030712;
--rp-c-bg-soft: #071426;
--rp-c-bg-mute: #0b1f35;
```

- [x] **Step 3: Keep Rspress selectors intact**

Do not rename Rspress selectors such as `.rp-nav`, `.rp-home-hero`, or `.rp-home-feature`; only update tokens and token-driven declarations.

### Task 3: Verify Website Theme

**Files:**
- Test: `test/website.rules.test.ts`
- Test: `website/docs/theme.css`

**Interfaces:**
- Produces: verified website build and browser screenshots.

- [x] **Step 1: Run focused verification**

Run:

```bash
corepack pnpm test:rules
corepack pnpm --dir website build
git diff --check -- website/docs/theme.css test/website.rules.test.ts .superpowers/plans/2026-07-09-website-logo-color-system.md
```

Expected: PASS.

- [x] **Step 2: Run browser visual smoke**

Serve `website/doc_build` locally and capture screenshots for:

```text
http://127.0.0.1:<port>/
http://127.0.0.1:<port>/?theme=dark
```

Expected: the hero, nav, feature cards, and logo remain visible in light and dark modes without overlap.
