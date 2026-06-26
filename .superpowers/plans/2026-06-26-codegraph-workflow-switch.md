# CodeGraph Workflow Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch the EMP repository workflow back to CodeGraph as the default code-discovery and impact-analysis tool, while removing current-project reliance on `codebase-memory-mcp`.

**Architecture:** The workflow source of truth is `AGENTS.md`, backed by the repo-local `skills/emp-workflow` Skill and the deterministic `pnpm workflow:check` gate. The change adds an automated guard that requires CodeGraph-first instructions and forbids `codebase-memory-mcp` as a default workflow dependency; if the old MCP recreates the current project index, remove its Codex MCP registration and delete only the current EMP cache DB.

**Tech Stack:** CodeGraph CLI, Node.js workflow guard script, Codex repo-local Skill files, Superpowers plan files.

## Global Constraints

- Default communication and workflow documentation remain Chinese where the repository already uses Chinese guidance.
- Keep changes scoped to workflow files: `AGENTS.md`, `.superpowers/plans/`, `skills/emp-workflow/`, and `scripts/emp-workflow-check.mjs`.
- Do not touch existing beta release/package changes in the dirty worktree.
- Do not commit generated outputs or local indexes such as `.codegraph/`.
- Validate with `pnpm workflow:check`, `git diff --check`, and `skill-creator` quick validation for `skills/emp-workflow`.

---

### Task 1: Add Workflow Guard

**Files:**
- Modify: `scripts/emp-workflow-check.mjs`

**Interfaces:**
- Consumes: existing `pnpm workflow:check` root script.
- Produces: workflow validation failures when `AGENTS.md` or `skills/emp-workflow/SKILL.md` no longer declare CodeGraph as the default code-discovery tool, or when they still declare `codebase-memory-mcp` as the default.

- [ ] **Step 1: Add assertions to the workflow check**

Add checks that require:

```text
CodeGraph 优先级
codegraph sync .
codegraph status .
codegraph affected
codegraph node
codegraph explore
```

and forbid `codebase-memory-mcp` in `AGENTS.md` and `skills/emp-workflow/SKILL.md`.

- [ ] **Step 2: Run the gate and confirm it fails before documentation updates**

Run:

```bash
pnpm workflow:check
```

Expected: FAIL because `AGENTS.md` and `skills/emp-workflow/SKILL.md` still contain `codebase-memory-mcp`.

### Task 2: Update Workflow Instructions

**Files:**
- Modify: `AGENTS.md`
- Modify: `skills/emp-workflow/SKILL.md`
- Modify: `skills/emp-workflow/references/change-matrix.md`

**Interfaces:**
- Consumes: Task 1 guard expectations.
- Produces: CodeGraph-first workflow with `codebase-memory-mcp` limited to no default role in this repository.

- [ ] **Step 1: Update `AGENTS.md`**

Replace the `codebase-memory-mcp` default discovery section with CodeGraph commands:

```text
codegraph sync .
codegraph status .
codegraph query
codegraph node
codegraph callers / callees
codegraph affected
codegraph explore
```

- [ ] **Step 2: Update repo-local Skill**

Update `skills/emp-workflow/SKILL.md` so EMP agents check CodeGraph status and use CodeGraph for code discovery before file search.

- [ ] **Step 3: Update the change matrix**

Keep `.codegraph/` in forbidden caches and remove `.codebase-memory/` from the expected local workflow surface.

### Task 3: Clean Current Project MCP Index

**Files:**
- No repository file edits.

**Interfaces:**
- Consumes: current `codebase-memory-mcp` indexed project name `Users-Bigo-Desktop-develop-fontend-workspace-emp`.
- Produces: current project removed from the `codebase-memory-mcp` index where tooling permits; if the index is recreated by the MCP registration, remove the Codex MCP entry and delete the current EMP cache DB only.

- [ ] **Step 1: Inspect CLI support**

Run:

```bash
codebase-memory-mcp --help
```

- [ ] **Step 2: Remove only the current EMP project index if supported**

Use the project-scoped delete capability first. If the index reappears because the MCP registration recreates it, run:

```bash
codex mcp remove codebase-memory-mcp
rm -f /Users/Bigo/.cache/codebase-memory-mcp/Users-Bigo-Desktop-develop-fontend-workspace-emp.db*
```

Expected: `codex mcp list` no longer contains `codebase-memory-mcp`, and the current EMP project no longer appears in `codebase-memory-mcp cli list_projects`.

### Task 4: Verify

**Files:**
- No additional edits.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: verified workflow switch.

- [ ] **Step 1: Validate the Skill**

Run:

```bash
python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/emp-workflow
```

- [ ] **Step 2: Validate the workflow gate**

Run:

```bash
pnpm workflow:check
```

- [ ] **Step 3: Validate whitespace and current CodeGraph state**

Run:

```bash
git diff --check
codegraph status .
```

Expected: workflow checks pass, diff whitespace check exits 0, and CodeGraph reports an up-to-date index after `codegraph sync .`.
