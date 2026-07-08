# TypeScript 7 Stable Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the EMP v4 workspace from TypeScript 7 RC to the current TypeScript 7 stable release and commit the verified result.

**Architecture:** Keep TypeScript as the single root compiler baseline for packages and the Rspress website, while preserving the existing `typescript-mf` compatibility alias for Module Federation DTS tooling. Treat `typescript@7.0.2` as the stable source of truth because npm registry `latest` resolves to `7.0.2` on 2026-07-09.

**Tech Stack:** pnpm 10.33.0, TypeScript 7.0.2, Rstest, Rspress v2, Rslib, Rspack, Module Federation DTS tooling.

## Global Constraints

- Do not touch unrelated dirty files: `scripts/release-acceptance-report.mjs`, `test/release-acceptance-report.test.ts`, existing `.superpowers/plans/*` files, and generated logo assets unless the user explicitly asks.
- Keep `typescript-mf` pinned to `npm:typescript@5.9.3`; it remains the compatibility alias used by `patches/@module-federation__dts-plugin@2.6.0.patch`.
- Do not reintroduce `@typescript/native-preview` or any `tsgo` script; this task upgrades the `typescript` package to stable TS7, not the native preview path.
- Use `corepack pnpm` for package operations.
- Before commit, run `git status --short --branch`, stage only this task's files, and run `git diff --cached --check`.
- The final commit must include only the TS7 stable upgrade scope and must preserve existing unrelated workspace changes.

---

### Task 1: Lock Rules to TypeScript 7 Stable

**Files:**
- Modify: `test/toolchain.rules.test.ts`
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: current root and website package manifests.
- Produces: failing rules that require `typescript@7.0.2`, `typescript@7.0.2` dlx scripts, and stable TypeScript wording.

- [x] **Step 1: Write failing rule expectations**

Change toolchain rules to expect:

```typescript
expect(pkg.devDependencies.typescript).toBe('7.0.2')
expect(pkg.scripts['test:ts7']).toContain('typescript@7.0.2')
expect(pkg.scripts['test:ts7:packages']).toContain('typescript@7.0.2')
expect(readme).toContain('TypeScript 7 stable')
expect(readme).not.toContain('TypeScript 7 RC')
```

Change website rules to expect:

```typescript
expect(allDeps.typescript).toBe('7.0.2')
expect(parsed.frontmatter.description).toContain('TypeScript 7 stable')
expect(home).not.toContain('TypeScript 7 RC')
```

- [x] **Step 2: Run rules to verify RED**

Run:

```bash
corepack pnpm exec rstest run --config rstest.config.ts test/toolchain.rules.test.ts test/website.rules.test.ts
```

Expected: FAIL because manifests and docs still contain `7.0.1-rc` / `TypeScript 7 RC`.

### Task 2: Upgrade Package Manifests and Stable Script Surface

**Files:**
- Modify: `package.json`
- Modify: `website/package.json`

**Interfaces:**
- Consumes: npm registry fact that `typescript@latest` is `7.0.2`.
- Produces: root and website package manifests that pin stable TypeScript and run TS7 checks with `typescript@7.0.2`.

- [x] **Step 1: Update dependency pins**

Set:

```json
"typescript": "7.0.2"
```

in both root `devDependencies` and `website/package.json` `devDependencies`.

- [x] **Step 2: Update TS7 scripts**

Replace every `typescript@7.0.1-rc` in root `scripts.test:ts7` and `scripts.test:ts7:packages` with:

```text
typescript@7.0.2
```

- [x] **Step 3: Refresh lockfile**

Run:

```bash
corepack pnpm install --lockfile-only
```

Expected: `pnpm-lock.yaml` resolves TypeScript and platform packages to `7.0.2` and keeps `typescript-mf` at `5.9.3`.

### Task 3: Update README and Website Copy

**Files:**
- Modify: `README.md`
- Modify: `website/docs/zh/index.mdx`

**Interfaces:**
- Consumes: stable TS7 manifest updates.
- Produces: public copy that no longer describes the project as RC-based.

- [x] **Step 1: Replace RC wording with stable wording**

Use these exact public phrases:

```markdown
TypeScript 7 stable
TS 7 稳定类型基线
```

Keep existing Chinese positioning and do not expand README into a tutorial.

- [x] **Step 2: Verify copy through rule tests**

Run:

```bash
corepack pnpm exec rstest run --config rstest.config.ts test/toolchain.rules.test.ts test/website.rules.test.ts
```

Expected: PASS.

### Task 4: Acceptance Verification and Commit

**Files:**
- Modify: `pnpm-lock.yaml`
- Commit staged task files only.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: a verified git commit for the TS7 stable upgrade.

- [x] **Step 1: Run targeted TS7 package gate**

Run:

```bash
corepack pnpm test:ts7:packages
```

Expected: PASS under `typescript@7.0.2`.

- [x] **Step 2: Run full local acceptance gates**

Run:

```bash
corepack pnpm ci:verify
corepack pnpm empbuild
git diff --check
```

Expected: all commands exit 0.

- [x] **Step 3: Stage only TS7 stable files**

Run:

```bash
git status --short --branch
git add package.json website/package.json pnpm-lock.yaml README.md website/docs/zh/index.mdx test/toolchain.rules.test.ts test/website.rules.test.ts .superpowers/plans/2026-07-09-typescript-7-stable.md
git diff --cached --check
git diff --cached --stat
```

Expected: staged files are limited to this task.

- [ ] **Step 4: Commit**

Run:

```bash
git commit -m "chore: upgrade to typescript 7 stable"
```

Expected: commit succeeds on `v4-rsbuild`.

## Self-Review

- Spec coverage: dependency upgrade, script upgrade, docs/website wording, lockfile refresh, acceptance verification, and commit are covered.
- Placeholder scan: no `TBD`, `TODO`, or undefined implementation steps.
- Type consistency: every expected version is `7.0.2`; the compatibility alias remains `typescript-mf`.
