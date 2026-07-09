# EMP Homepage Responsive Light Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real light homepage skin and a compact mobile presentation that preserves the Federation Fox design system.

**Architecture:** Keep Rspress home frontmatter unchanged and implement the visual variants through `website/docs/theme.css`. Theme colors are driven by CSS variables on `:root` and `:root.dark`; responsive behavior uses existing breakpoints and Rstest rules plus Browser rendered QA.

**Tech Stack:** Rspress v2 home page, CSS custom properties, Rstest website rules, Browser plugin rendered QA.

## Global Constraints

- Only modify `website/docs/theme.css`, `test/website.rules.test.ts`, and this plan file for this task.
- Preserve the current Federation Fox PNG assets and SVG feature icon system.
- Chinese remains the default route `/`; English remains `/en/`.
- No new dependencies, no Tailwind, no generated screenshots committed.
- Validate with `corepack pnpm exec rstest run test/website.rules.test.ts`, `corepack pnpm --dir website build`, Browser desktop/mobile QA, and `git diff --check`.

---

### Task 1: Theme Rules

**Files:**
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: `website/docs/theme.css` as text.
- Produces: static guards for light variables, dark overrides, mobile compact CSS, and feature-section hint behavior.

- [x] **Step 1: Write failing rules**

Add assertions in `theme stylesheet defines federation fox homepage tokens without theme eject` for:

```ts
expect(theme).toContain('--emp-nav-bg: rgba(255, 255, 255, 0.88)')
expect(theme).toContain('--emp-hero-text: #111827')
expect(theme).toContain(':root.dark')
expect(theme).toContain('--emp-nav-bg: rgba(2, 11, 24, 0.92)')
expect(theme).toContain('--emp-mobile-hero-image-size: 210px')
expect(theme).toContain('min-height: 720px')
expect(theme).toContain('html body .rp-home-feature {')
```

- [x] **Step 2: Verify RED**

Run: `corepack pnpm exec rstest run test/website.rules.test.ts`

Expected: FAIL because light/mobile theme variables are missing.

### Task 2: CSS Implementation

**Files:**
- Modify: `website/docs/theme.css`

**Interfaces:**
- Consumes: Rspress class names already used by the homepage.
- Produces: light skin as default, dark skin under `:root.dark`, and compact mobile layout below 768px.

- [x] **Step 1: Add theme variables**

Define default light variables for nav, hero, text, muted copy, feature surface, and mascot frame; override them in `:root.dark` with the current dark design values.

- [x] **Step 2: Replace hard-coded colors**

Replace nav, hero, title, subtitle, tagline, CTA, mascot frame, and feature colors with the variables.

- [x] **Step 3: Add compact mobile layout**

Below 768px, keep the fox visible but reduce the visual height: use `--emp-mobile-hero-image-size: 210px`, a max hero min-height near 720px, tighter actions, smaller title, and no horizontal overflow.

- [x] **Step 4: Verify GREEN**

Run: `corepack pnpm exec rstest run test/website.rules.test.ts`

Expected: PASS.

### Task 3: Build And Render QA

**Files:**
- Modify only if QA finds issues: `website/docs/theme.css`, `test/website.rules.test.ts`

**Interfaces:**
- Consumes: static output under `website/doc_build`.
- Produces: verified desktop light, desktop dark, and mobile light render states.

- [x] **Step 1: Build**

Run: `corepack pnpm --dir website build`

Expected: exit 0.

- [x] **Step 2: Browser QA**

Use Browser plugin to verify:

```text
Desktop light: hero background is light, text is dark, SVG feature icons visible.
Desktop dark: hero background remains dark and close to design draft.
Mobile light 390x844: no horizontal overflow, hero content is compact, feature section starts within the first viewport or close enough to show the next-section transition.
```

- [x] **Step 3: Final checks**

Run:

```bash
git diff --check -- website/docs/theme.css test/website.rules.test.ts .superpowers/plans/2026-07-09-emp-homepage-responsive-light-theme.md
git status --short --branch
```

Expected: diff check passes and status shows only intended tracked files plus known pre-existing untracked files.
