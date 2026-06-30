# Post-PONYTAIL EMP Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the EMP agent workflow around Superpowers v6, CodeGraph, and an explicit Should-Not-Do gate after removing PONYTAIL as a plugin dependency.

**Architecture:** Keep `AGENTS.md` as the human-facing source of truth, `skills/emp-workflow/` as the reusable agent guide, and `scripts/emp-workflow-check.mjs` as the deterministic guard. Add only one new workflow concept: a lightweight Should-Not-Do gate before planning or subagent execution, so Superpowers does not formalize work that should be skipped.

**Tech Stack:** Markdown, Node.js ESM, Superpowers v6, CodeGraph CLI, pnpm 10.33.0 via `corepack pnpm`.

## Global Constraints

- Default communication and workflow documentation remain Chinese where the repository already uses Chinese guidance.
- Current branch is `v4`; preserve user changes and do not rewrite unrelated files.
- PONYTAIL is no longer an installed plugin or workflow dependency.
- Use CodeGraph for code discovery, then `rg` / direct reads for scripts, docs, configs, and literal strings.
- Do not create or continue `docs/superpowers/**`.
- Keep long-lived plans in `.superpowers/plans/` and long-lived specs in `.superpowers/specs/`.
- Do not modify `apps/**`, `website/**`, `packages/cdn-*`, `packages/lib-*`, `.github/workflows/publish.yml`, or `pnpm-lock.yaml` for this workflow replanning unless explicitly requested.
- Use `corepack pnpm`, not global `pnpm`, for repository verification commands.
- Workflow or documentation-only changes require `git diff --check` and `corepack pnpm workflow:check`.

---

### Task 1: Document The No-PONYTAIL Workflow Boundary

**Files:**
- Modify: `AGENTS.md`
- Modify: `skills/emp-workflow/SKILL.md`
- Modify: `skills/emp-workflow/references/change-matrix.md`

**Interfaces:**
- Consumes: current EMP workflow sections in `AGENTS.md`.
- Produces: workflow text that names Superpowers v6 and CodeGraph as the active workflow stack and states that PONYTAIL is not required.

- [ ] **Step 1: Add a short workflow stack section to `AGENTS.md`**

Add a concise section near the current Superpowers / CodeGraph workflow text:

```markdown
## Active Workflow Stack

- CodeGraph handles code discovery and impact analysis.
- Superpowers v6 handles planning, subagent execution, review gates, and verification.
- PONYTAIL is not a workflow dependency; do not require PONYTAIL skills, hooks, marketplace entries, cache, or plugin data for EMP work.
- For deletion or simplification work, use the Should-Not-Do gate first, then normal Superpowers planning only when the task is worth doing.
```

- [ ] **Step 2: Mirror the same boundary in `skills/emp-workflow/SKILL.md`**

Add this under `## Core Flow` before implementation steps:

```markdown
0. Run the Should-Not-Do gate for workflow, cleanup, refactor, and automation requests:
   - Is there a real user, release, CI, or test need?
   - Is the request already covered by existing code, platform behavior, or documentation?
   - Is doing nothing or deleting safer than adding a new layer?
   - If the answer is No-Go, report the reason and stop before planning.
```

Also add:

```markdown
PONYTAIL is not required for this repository workflow. Do not depend on PONYTAIL plugin state, hooks, or skills.
```

- [ ] **Step 3: Update `change-matrix.md` with validation ownership**

Add a workflow-only row:

```markdown
For Should-Not-Do gate or workflow-boundary documentation:

- `git diff --check`
- `corepack pnpm workflow:check`
- confirm `codex plugin list` has no `ponytail@ponytail` entry when the change claims PONYTAIL is absent
```

### Task 2: Add A Deterministic Workflow Guard

**Files:**
- Modify: `scripts/emp-workflow-check.mjs`

**Interfaces:**
- Consumes: `AGENTS.md`, `skills/emp-workflow/SKILL.md`, and current `pnpm workflow:check`.
- Produces: a failing gate when EMP workflow docs reintroduce PONYTAIL as a required dependency or remove the Should-Not-Do gate.

- [ ] **Step 1: Add required text checks**

Extend the existing workflow check with exact text requirements:

```js
for (const file of ['AGENTS.md', 'skills/emp-workflow/SKILL.md']) {
  requireText(file, 'Should-Not-Do')
  requireText(file, 'PONYTAIL is not')
}
```

Expected before Task 1 lands: `corepack pnpm workflow:check` fails with missing text.

- [ ] **Step 2: Keep the existing `codebase-memory-mcp` guard**

Do not remove the current guard:

```js
for (const file of ['AGENTS.md', 'skills/emp-workflow/SKILL.md']) {
  requireNoPattern(file, /codebase-memory-mcp/)
}
```

Expected: EMP remains CodeGraph-first.

- [ ] **Step 3: Run the guard**

Run:

```bash
corepack pnpm workflow:check
```

Expected after Task 1 lands: pass.

### Task 3: Preserve Superpowers Subagent Boundaries

**Files:**
- Modify: `.superpowers/subagents.md`

**Interfaces:**
- Consumes: existing subagent policy.
- Produces: explicit routing for Should-Not-Do decisions.

- [ ] **Step 1: Add a decision ownership bullet**

Under `## 调用入口`, add:

```markdown
- Should-Not-Do / Go-No-Go 判断由 Codex 主控制器保留；subagent 可以收集证据，但不能自行把 No-Go 改成执行计划。
```

- [ ] **Step 2: Add a brief requirement**

Under `## Brief 要求`, add:

```markdown
- 清理、重构、自动化类任务的 brief 必须写清 Should-Not-Do gate 的结论：`GO`、`NO-GO` 或 `NEEDS_CONTEXT`。
```

- [ ] **Step 3: Verify no extra workflow artifact type was created**

Run:

```bash
find docs/superpowers -maxdepth 1 -type f
```

Expected: command fails because `docs/superpowers` does not exist, or prints nothing if a historical empty directory exists. Do not create it.

### Task 4: Verify And Publish The Workflow Replan

**Files:**
- Verify: `AGENTS.md`
- Verify: `skills/emp-workflow/SKILL.md`
- Verify: `skills/emp-workflow/references/change-matrix.md`
- Verify: `scripts/emp-workflow-check.mjs`
- Verify: `.superpowers/subagents.md`

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: one scoped workflow commit on `v4`.

- [ ] **Step 1: Verify plugin state**

Run:

```bash
codex plugin list | rg -n "ponytail|PONYTAIL" || true
codex plugin marketplace list | rg -n "ponytail|PONYTAIL" || true
find /Users/Bigo/.codex \( -path '/Users/Bigo/.codex/memories' -o -path '/Users/Bigo/.codex/sessions' \) -prune -o \( -iname '*ponytail*' -o -path '*/ponytail/*' \) -print
```

Expected: no output from all three commands.

- [ ] **Step 2: Validate repo workflow**

Run:

```bash
git diff --check
corepack pnpm workflow:check
```

Expected: both pass.

- [ ] **Step 3: Commit and push**

Run:

```bash
git add AGENTS.md skills/emp-workflow/SKILL.md skills/emp-workflow/references/change-matrix.md scripts/emp-workflow-check.mjs .superpowers/subagents.md .superpowers/plans/2026-06-30-post-ponytail-workflow.md
git diff --cached --check
git commit -m "docs: plan post-ponytail workflow"
git push origin v4
git fetch origin v4
git rev-parse HEAD
git rev-parse origin/v4
```

Expected: cached diff check exits 0, push succeeds, and `HEAD` equals `origin/v4`.
