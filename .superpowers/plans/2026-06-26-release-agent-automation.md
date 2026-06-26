# Release Agent Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build release automation that publishes only changed internal packages for beta-style prereleases, publishes the full internal set for release/latest promotion, and gives agents a deterministic finish command that runs local verification, commits, and pushes.

**Architecture:** Keep release package discovery in `scripts/release-core.mjs`, and keep the CLI orchestration in `scripts/release.mjs`. Add a separate `scripts/agent-finish.mjs` command for agent completion so CI/push policy is not mixed into npm publish logic. GitHub Actions stays the remote executor: CI verifies pushes, Publish performs dry-run or real publish with explicit inputs.

**Tech Stack:** Node.js ESM scripts, pnpm 10.33.0 via Corepack, Rstest, GitHub Actions, npm trusted publishing.

## Global Constraints

- Default communication and workflow docs remain Chinese where existing files use Chinese.
- Do not add another test runner; all new automated coverage uses Rstest.
- `apps/**` and `website` must never become publish packages.
- `@empjs/cdn-*` and `@empjs/lib-*` stay independent unless explicitly selected in future work; this plan must not publish them.
- `latest` / `release` / non-prerelease promotion publishes the full explicit 19-package internal set.
- `beta` / `alpha` / `rc` prerelease publishing may publish only changed internal packages when a base ref is supplied.
- Real publish must still require explicit confirmation through existing `--yes` or workflow dry-run=false path.
- Agent finish automation must run local checks before commit/push and must not force-push.
- Workflow changes must not introduce `NODE_AUTH_TOKEN`, raw `npm publish` in CI, or publish actions into `.github/workflows/ci.yml`.
- Before push, run `pnpm workflow:check`, `pnpm test:rules`, `pnpm ci:verify`, `git diff --check`, and a dry-run of the new commands.

---

### Task 1: Release Selection Policy

**Files:**
- Modify: `scripts/release-core.mjs`
- Modify: `scripts/release.mjs`
- Modify: `scripts/release.rules.test.ts`

**Interfaces:**
- Produces: `resolveReleaseSelection(plan, options)` returning `{packages, mode, changedFiles}`.
- Produces CLI flags: `--changed-since <ref>` and `--force-all`.
- Consumes: existing `createReleasePlan`, `buildPublishCommands`, and `buildPackCommands`.

- [ ] **Step 1: Add failing Rstest coverage**

Add tests proving:

```ts
expect(resolveReleaseSelection(plan, {tag: 'beta', changedFiles: ['packages/cli/src/index.ts']})).toMatchObject({
  mode: 'changed',
})
expect(resolveReleaseSelection(plan, {tag: 'latest', changedFiles: ['packages/cli/src/index.ts']})).toMatchObject({
  mode: 'all',
})
expect(resolveReleaseSelection(plan, {tag: 'beta', changedFiles: ['apps/demo/src/App.tsx']}).packages).toEqual([])
```

Run:

```bash
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm test:rules
```

Expected: FAIL because `resolveReleaseSelection` and the new flags do not exist.

- [ ] **Step 2: Implement selection helpers**

In `scripts/release-core.mjs`, export:

```js
export const isUnifiedReleaseTag = (tag, version) => {
  const normalizedTag = String(tag ?? '').trim()
  if (normalizedTag === 'latest' || normalizedTag === 'release') return true
  return Boolean(version && !/-/.test(version))
}
```

Add a helper that maps changed files under an internal package directory to that package and ignores `apps/**`, `website`, `packages/cdn-*`, and `packages/lib-*`.

- [ ] **Step 3: Thread selection into publish/pack commands**

Change `buildPublishCommands` and `buildPackCommands` to accept `packages` from `resolveReleaseSelection` while preserving existing `--package <name>` behavior.

- [ ] **Step 4: Add CLI changed-file collection**

In `scripts/release.mjs`, add `--changed-since <ref>` and use:

```bash
git diff --name-only <ref>...HEAD
```

If `--changed-since` is omitted, current behavior stays full internal set.

- [ ] **Step 5: Verify**

Run:

```bash
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm test:rules
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm release:check
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm release:publish:dry -- --tag beta --changed-since HEAD~1 --skip-build
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm release:publish:dry -- --tag latest --changed-since HEAD~1 --skip-build
```

Expected: tests pass; beta changed-since may narrow packages; latest changed-since prints all 19 internal packages.

### Task 2: Publish Workflow Inputs

**Files:**
- Modify: `.github/workflows/publish.yml`
- Modify: `scripts/release.rules.test.ts`

**Interfaces:**
- Consumes: Task 1 CLI flags.
- Produces workflow inputs: `changed_since`, `force_all`.

- [ ] **Step 1: Add failing workflow rule**

Add a Rstest assertion that `publish.yml` exposes `changed_since` and `force_all`, and passes `--changed-since "$CHANGED_SINCE"` and `--force-all` to both dry-run and real publish commands when supplied.

- [ ] **Step 2: Update workflow**

Add workflow dispatch inputs:

```yaml
changed_since:
  description: Base ref for changed-package publishing.
  required: false
  type: string
  default: ''
force_all:
  description: Publish all internal packages even when changed_since is set.
  required: false
  type: boolean
  default: false
```

Resolve them into environment variables, validate `changed_since` only contains safe ref characters, and append arguments in both publish steps.

- [ ] **Step 3: Verify**

Run:

```bash
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm test:rules
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm workflow:check
git diff --check
```

Expected: all pass and CI workflow still contains no publish commands.

### Task 3: Agent Finish Automation

**Files:**
- Create: `scripts/agent-finish.mjs`
- Modify: `package.json`
- Modify: `scripts/release.rules.test.ts`

**Interfaces:**
- Produces CLI: `pnpm agent:finish -- --message "<commit message>" [--push] [--dry-run]`.
- Consumes: `git status --short`, `pnpm ci:verify`, `git diff --check`, `git add`, `git commit`, `git push`.

- [ ] **Step 1: Add failing Rstest coverage**

Add tests asserting:

```ts
const rootPackage = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8'))
expect(rootPackage.scripts['agent:finish']).toBe('node scripts/agent-finish.mjs')
const source = await readFile(join(repoRoot, 'scripts/agent-finish.mjs'), 'utf8')
expect(source).toMatch(/pnpm ci:verify/)
expect(source).toMatch(/git diff --check/)
expect(source).toMatch(/git push/)
expect(source).not.toMatch(/--force/)
```

Run:

```bash
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm test:rules
```

Expected: FAIL because script and package entry do not exist.

- [ ] **Step 2: Implement dry-run first**

Create `scripts/agent-finish.mjs` with:

```bash
pnpm agent:finish -- --message "..." --dry-run
```

It prints the exact commands it would run:

```bash
pnpm ci:verify
git diff --check
git add -A
git commit -m "<message>"
git push origin <current-branch>
```

- [ ] **Step 3: Implement real mode**

Real mode must:

1. Reject main/master unless `--allow-protected-branch` is supplied.
2. Reject missing `--message`.
3. Run `pnpm ci:verify`.
4. Run `git diff --check`.
5. Commit only when there are staged or unstaged changes.
6. Push only when `--push` is present.
7. Never use force push.

- [ ] **Step 4: Verify**

Run:

```bash
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm test:rules
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm agent:finish -- --message "test automation dry run" --dry-run --push
```

Expected: tests pass; dry-run prints CI, diff check, commit, and non-force push commands without changing git state.

### Task 4: Final Verification And Push

**Files:**
- All modified files from Tasks 1-3.

**Interfaces:**
- Consumes: completed tasks.
- Produces: pushed `v4` branch with remote CI green.

- [ ] **Step 1: Run local gates**

Run:

```bash
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm test:rules
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm ci:verify
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm release:publish:dry -- --tag beta --changed-since HEAD~1 --skip-build
PATH=/Users/Bigo/Library/pnpm:$PATH pnpm release:publish:dry -- --tag latest --changed-since HEAD~1 --skip-build
git diff --check
```

- [ ] **Step 2: Commit and push**

Run:

```bash
git add .github/workflows/publish.yml package.json scripts/release-core.mjs scripts/release.mjs scripts/release.rules.test.ts scripts/agent-finish.mjs .superpowers/plans/2026-06-26-release-agent-automation.md
git commit -m "feat(release): automate changed publish and agent finish"
git push origin v4
```

- [ ] **Step 3: Remote verification**

Wait for the latest `v4` CI run to complete with `verify`, `build`, and `apps` success.

- [ ] **Step 4: Stop criteria**

Stop only after:

- The changed-package dry-run and latest full-set dry-run both pass locally.
- `agent:finish --dry-run --push` proves the finish workflow.
- The commit is pushed to `origin/v4`.
- Remote CI is green for the pushed commit.
