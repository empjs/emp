# EMP Federation Fox Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Rebuild the EMP website homepage from the federation-fox design direction, unify the nav logo, export transparent IP logo assets, and replace the README logo without touching package release scope.

**Architecture:** Treat the design image as a brand-system reference, not as a final screenshot asset. Generate project-bound transparent PNG assets from the approved federation-fox artwork, use Rspress native home frontmatter for content, and add a thin global theme stylesheet through `globalStyles` for brand color and homepage polish.

**Tech Stack:** Rspress 2, MDX frontmatter home page, TypeScript config, PNG RGBA assets, Rstest rule checks, `corepack pnpm`.

## Global Constraints

- Default communication and final reporting are in Chinese.
- Do not touch unrelated dirty files or package release scope.
- Use CodeGraph only as status confirmation for this docs/assets/config task; source facts come from local file reads and build output.
- `website` is a documentation/acceptance site, not npm publish scope.
- Add or modify only task-related files: README, website config/home/theme, website rule tests, docs/public assets, and the plan.
- Use transparent PNG assets for the mascot system and avoid embedding the low-resolution screenshot directly.
- Verification must include a failing rule check before implementation, then passing rule check, website build, and `git diff --check`.

---

### Task 1: Add Brand-System Rule Coverage

**Files:**
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: current website config, home frontmatter, README, and logo asset paths.
- Produces: rule expectations for federation-fox assets, compact nav logo, custom theme stylesheet, and rebuilt homepage content.

- [x] **Step 1: Update the website rule test for new brand requirements**

Add expectations that:
- `website/rspress.config.ts` uses `globalStyles: path.join(__dirname, 'docs/theme.css')`.
- `icon`, `logo.light`, and `logo.dark` point to `/emp-federation-fox-compact.png`.
- `website/docs/zh/index.mdx` references `/emp-federation-fox-full.png`, uses federation-fox copy, and keeps Rspress home frontmatter.
- `README.md` references `docs/assets/emp-federation-fox-full.png`.
- full, compact, monochrome, and outline PNG assets exist in both `docs/assets` and `website/docs/public`, are RGBA, and have transparent corners.

- [x] **Step 2: Run the focused rule check and confirm RED**

Run: `corepack pnpm exec rstest run test/website.rules.test.ts`

Expected before implementation: FAIL because the new federation-fox assets, config references, README image, and theme CSS do not exist yet.

### Task 2: Export Transparent Federation-Fox Assets

**Files:**
- Create: `docs/assets/emp-federation-fox-full.png`
- Create: `docs/assets/emp-federation-fox-compact.png`
- Create: `docs/assets/emp-federation-fox-monochrome.png`
- Create: `docs/assets/emp-federation-fox-outline.png`
- Create: `website/docs/public/emp-federation-fox-full.png`
- Create: `website/docs/public/emp-federation-fox-compact.png`
- Create: `website/docs/public/emp-federation-fox-monochrome.png`
- Create: `website/docs/public/emp-federation-fox-outline.png`

**Interfaces:**
- Consumes: `tmp/imagegen/emp-federation-fox-transparent.png` and `tmp/imagegen/emp-federation-fox-compact-transparent.png`.
- Produces: transparent 512x512 PNG assets for README and website references.

- [x] **Step 1: Generate resized full and compact PNGs**

Use local image processing to resize the approved transparent source images to 512x512 RGBA PNGs while preserving transparency.

- [x] **Step 2: Generate monochrome and outline PNGs**

Derive monochrome and outline variants from the compact transparent source so all four variants share the same silhouette and transparent background.

- [x] **Step 3: Copy the final PNGs to website public assets**

Keep `docs/assets` and `website/docs/public` synchronized for the four federation-fox files.

### Task 3: Rebuild Homepage and README Around Federation Fox

**Files:**
- Modify: `README.md`
- Modify: `website/rspress.config.ts`
- Modify: `website/docs/zh/index.mdx`
- Create: `website/docs/theme.css`

**Interfaces:**
- Consumes: four federation-fox PNG assets from Task 2.
- Produces: README and Rspress homepage that use the full mascot in hero/README and compact mark in nav/icon.

- [x] **Step 1: Update README logo and top positioning copy**

Replace `docs/assets/emp-v4-logo.png` with `docs/assets/emp-federation-fox-full.png` and update the short top copy to mention the federation-fox brand system while keeping existing dynamic badges.

- [x] **Step 2: Update Rspress config logo and theme stylesheet**

Set `icon`, `logo.light`, and `logo.dark` to `/emp-federation-fox-compact.png`, and add `globalStyles: path.join(__dirname, 'docs/theme.css')`.

- [x] **Step 3: Rebuild homepage frontmatter content**

Keep `pageType: 'home'`; update hero, tagline, actions, and eight feature cards to match the homepage design direction: full mascot hero, module federation, Rspack 2, ESM, TS 7, plugin ecosystem, Agent-First, and release evidence.

- [x] **Step 4: Add theme CSS**

Add a small Rspress theme stylesheet for brand tokens, homepage hero treatment, action buttons, feature cards, and dark-mode-safe colors without ejecting the theme.

### Task 4: Verify and Inspect

**Files:**
- All files modified by Tasks 1-3.

**Interfaces:**
- Consumes: updated files and generated assets.
- Produces: verification evidence for final report.

- [x] **Step 1: Run focused rules**

Run: `corepack pnpm exec rstest run test/website.rules.test.ts`

Expected: PASS.

- [x] **Step 2: Run website build**

Run: `corepack pnpm --dir website build`

Expected: PASS.

- [x] **Step 3: Run diff whitespace check**

Run: `git diff --check`

Expected: no output and exit 0.

- [x] **Step 4: Review git status and diff scope**

Run: `git status --short` and inspect the diff to confirm only planned files plus `tmp/imagegen` are changed or created, and no package release files are touched.
