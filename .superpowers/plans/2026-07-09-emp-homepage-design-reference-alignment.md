# EMP Homepage Design Reference Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the EMP Rspress homepage more closely with the Rspack light/dark reference by making the mascot, hero copy, background, and feature band read as one integrated system.

**Architecture:** Keep Rspress 2 native homepage frontmatter as the content contract, keep the current Chinese-default bilingual navigation, and concentrate visual refinement in `website/docs/theme.css`. Rule tests define the centered hero, integrated light/dark background, mascot treatment, and feature-band visibility before CSS implementation.

**Tech Stack:** Rspress 2, MDX frontmatter, CSS global styles, Rstest, Playwright/browser screenshot verification.

## Global Constraints

- Default communication is Chinese.
- Do not modify package release scope, package versions, or lockfile.
- Use existing federation-fox PNG assets; do not embed the screenshot reference as a site asset.
- Keep homepage links valid against existing docs pages.
- Do not reintroduce the removed `高性能 · 零妥协` / `High performance · Zero compromise` badge.
- Verification must include RED focused rule test, GREEN focused rule test, website build, `git diff --check`, and rendered desktop/mobile QA evidence.

---

### Task 1: Lock Integrated Reference Rules

**Files:**
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: current homepage MDX, current `theme.css`, and the Rspack light/dark screenshots.
- Produces: failing rule expectations for centered hero composition, mascot-first layout, integrated wave background, dark-mode background parity, and feature-band overlap.

- [x] **Step 1: Add rule expectations**

Add assertions that the stylesheet contains `--emp-hero-wave-light`, `--emp-hero-wave-dark`, `--emp-hero-spark-layer`, `--emp-hero-mascot-aura`, `grid-template-columns: minmax(0, 1fr)`, `justify-items: center`, `text-align: center`, `grid-row: 1`, `margin-top: -58px`, and no `.rp-home-hero__image::before`.

- [x] **Step 2: Confirm RED**

Run: `corepack pnpm exec rstest run test/website.rules.test.ts`

Expected: FAIL because the current homepage still uses the split hero and framed right-side mascot treatment.

### Task 2: Implement Integrated Hero CSS

**Files:**
- Modify: `website/docs/theme.css`

**Interfaces:**
- Consumes: native Rspress homepage class names and existing EMP fox assets.
- Produces: centered mascot-first hero, light/dark wave backgrounds, smaller integrated mascot, centered copy/actions, and feature cards peeking into the hero.

- [x] **Step 1: Replace hero background tokens**

Define light/dark wave and spark layers that match the reference without adding new assets.

- [x] **Step 2: Restyle hero layout**

Make the hero a centered single-column composition, place the mascot above the brand copy, remove the angled image frame, and keep responsive mobile layout stable.

- [x] **Step 3: Pull feature cards upward**

Use a controlled negative margin on the feature band so the next section is visible in the first viewport and visually tied to the hero background.

### Task 3: Verify and QA

**Files:**
- Verify: `test/website.rules.test.ts`, `website/docs/theme.css`, `website/docs/zh/index.mdx`, `website/docs/en/index.mdx`

**Interfaces:**
- Consumes: built website and rendered local preview.
- Produces: test/build evidence plus desktop and mobile screenshots.

- [x] **Step 1: Run focused rules**

Run: `corepack pnpm exec rstest run test/website.rules.test.ts`

Expected: PASS.

- [x] **Step 2: Run website build**

Run: `corepack pnpm --dir website build`

Expected: PASS.

- [x] **Step 3: Capture rendered QA**

Use Browser plugin if available; if invocation fails, use Playwright fallback with the exact reason. Verify page identity, nonblank content, no console errors, no badge text, no horizontal overflow, and desktop/mobile screenshots.

- [x] **Step 4: Run whitespace and status checks**

Run: `git diff --check` and `git status --short --branch`.
