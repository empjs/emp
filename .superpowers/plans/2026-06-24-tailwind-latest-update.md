# Tailwind Latest Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update Tailwind v4 dependencies in EMP to the latest npm registry version and verify affected packages/projects build.

**Architecture:** Keep version-specific Tailwind 2 and Tailwind 3 plugins unchanged. Update only Tailwind v4 direct dependencies in `@empjs/plugin-tailwindcss` and v4 example projects, then rely on pnpm to refresh transitive Tailwind packages in `pnpm-lock.yaml`.

**Tech Stack:** pnpm 10.33.0, Node.js `^20.19.0 || >=22.12.0`, Tailwind CSS `4.3.1`, `@tailwindcss/postcss` `4.3.1`.

## Global Constraints

- Current checkout is `v4...origin/v4 [ahead 1]`.
- Existing untracked file `.superpowers/plans/2026-06-23-emp-share-version-isolation.md` must not be modified.
- Use `pnpm@10.33.0` from root `packageManager`.
- Do not update `@empjs/plugin-tailwindcss2`, `@empjs/plugin-tailwindcss3`, Tailwind 3 demos, or `website`; they intentionally represent older Tailwind version lines.
- Run real build verification before reporting completion.

---

### Task 1: Update Tailwind v4 Dependencies

**Files:**
- Modify: `packages/plugin-tailwindcss/package.json`
- Modify: `projects/react-19-tanstack/package.json`
- Modify: `projects/react-tanstack/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: npm registry latest versions from `pnpm view tailwindcss version` and `pnpm view @tailwindcss/postcss version`.
- Produces: Direct Tailwind v4 dependency specs updated to `4.3.1`.

- [x] **Step 1: Update dependency specs with pnpm**

Run:

```bash
pnpm --filter @empjs/plugin-tailwindcss add tailwindcss@4.3.1 @tailwindcss/postcss@4.3.1
pnpm --filter ./projects/react-19-tanstack add -D tailwindcss@4.3.1
pnpm --filter ./projects/react-tanstack add -D tailwindcss@4.3.1
```

Expected: `package.json` files and `pnpm-lock.yaml` update without touching Tailwind 2/3 packages.

- [x] **Step 2: Verify resolved versions**

Run:

```bash
pnpm --filter @empjs/plugin-tailwindcss list tailwindcss @tailwindcss/postcss --depth 0
pnpm --filter ./projects/react-19-tanstack list tailwindcss --depth 0
pnpm --filter ./projects/react-tanstack list tailwindcss --depth 0
```

Expected: all listed Tailwind v4 packages resolve to `4.3.1`.

### Task 2: Build Verification

**Files:**
- No source edits expected.

**Interfaces:**
- Consumes: updated dependency tree.
- Produces: evidence that affected package and projects still build.

- [x] **Step 1: Build the updated plugin package**

Run:

```bash
pnpm --filter @empjs/plugin-tailwindcss build
```

Expected: exit code 0.

- [x] **Step 2: Build affected v4 example projects**

Run:

```bash
pnpm --filter ./projects/tailwind-4 build
pnpm --filter ./projects/tailwind-4-polyfill build
pnpm --filter ./projects/daisyui-demo build
pnpm --filter ./projects/tailwindcss-host build
pnpm --filter ./projects/tailwindcss-app build
pnpm --filter ./projects/react-19-tanstack build
pnpm --filter ./projects/react-tanstack build
```

Expected: exit code 0 for each project. Warnings are recorded if present.

### Task 3: Final Diff Review

**Files:**
- Review only files changed by Task 1 and this plan.

**Interfaces:**
- Consumes: git diff and git status.
- Produces: final summary with changed files, verification commands, and remaining risks.

- [x] **Step 1: Check generated side effects**

Run:

```bash
git status --short -- projects/tailwind-4 projects/tailwind-4-polyfill projects/daisyui-demo projects/tailwindcss-host projects/tailwindcss-app projects/react-19-tanstack projects/react-tanstack
```

Expected: no source diffs from project builds. If TanStack route generation changes appear, restore only those generated files.

- [x] **Step 2: Review dependency diff**

Run:

```bash
git diff -- packages/plugin-tailwindcss/package.json projects/react-19-tanstack/package.json projects/react-tanstack/package.json pnpm-lock.yaml .superpowers/plans/2026-06-24-tailwind-latest-update.md
```

Expected: diff only contains planned dependency/version and plan changes.
