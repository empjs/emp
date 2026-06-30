# Codex Workflow Intelligent Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Subagent dispatch must follow `.superpowers/subagents.md`.

**Goal:** Make the EMP Codex workflow reliably route from task intake to CodeGraph discovery, Superpowers planning, subagent dispatch rules, validation, and delivery without relying on implicit discovery.

**Architecture:** `AGENTS.md` remains the human-readable source of truth. Repo-local `.codex/config.toml` enables Codex runtime features, `.codex/hooks.json` provides short trigger reminders, `.superpowers/subagents.md` defines subagent policy, and `scripts/emp-workflow-check.mjs` prevents drift.

**Tech Stack:** Codex repo-local config, Codex hooks JSON, Superpowers plans/subagents, Node.js workflow guard, CodeGraph CLI, pnpm 10.33.0.

## Global Constraints

- Communicate in Chinese by default.
- Keep changes scoped to workflow files only: `AGENTS.md`, `.codex/`, `.superpowers/`, `skills/emp-workflow/`, and `scripts/emp-workflow-check.mjs`.
- Do not touch business code, `apps/**`, `website/**`, `packages/cdn-*`, `packages/lib-*`, `.github/workflows/publish.yml`, or `pnpm-lock.yaml`.
- Keep hooks short; full rules must live in `AGENTS.md`, `skills/emp-workflow/SKILL.md`, and `.superpowers/subagents.md`.
- Validate with `corepack pnpm workflow:check` and `git diff --check`.

---

## Five-Round Workflow Assessment

1. Live checkout and tool state: `AGENTS.md`, MCP list, CodeGraph status, and global hook residue are current; `codebase-memory-mcp` is not active.
2. Trigger gap: `.superpowers/subagents.md` exists but is not a Codex automatic entrypoint, so plan execution can miss it.
3. Runtime gap: repo-local `.codex/` is absent, so this checkout has no project-owned Codex feature/hook layer.
4. Guard gap: `workflow:check` passes but does not enforce `.codex/` or `.superpowers/subagents.md`.
5. Minimal fix: add repo-local Codex config/hooks, wire docs to subagent policy, and extend `workflow:check` so future drift fails fast.
6. Subagent audit fix: add runtime mapping, brief/review templates, read-only CodeGraph exception, hook validation wording, and plan execution status.
7. Worktree cleanup rule: codify `.worktrees/` inventory, dirty-worktree preservation, safe removal, prune, and branch-deletion separation.

### Task 1: Repo-Local Codex Trigger Layer

**Files:**
- Create: `.codex/config.toml`
- Create: `.codex/hooks.json`

**Interfaces:**
- Consumes: Codex repo-local config and hook loading.
- Produces: project-local `hooks`, `goals`, and `multi_agent` feature enablement, agent concurrency, and short workflow reminders.

- [x] **Step 1: Create `.codex/config.toml`**

```toml
[features]
hooks = true
goals = true
multi_agent = true

[agents]
max_threads = 6
```

- [x] **Step 2: Create `.codex/hooks.json`**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "printf '%s\\n' '[EMP workflow] Use AGENTS.md + skills/emp-workflow/SKILL.md. For cross-file code discovery, run codegraph sync/status first. For .superpowers/plans/* execution or any subagent dispatch, read .superpowers/subagents.md and .codex/agents/emp-*.toml. Run corepack pnpm workflow:check for workflow drift.'",
            "async": false
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": ".*(subagent|子代理|派发|\\.superpowers/plans|计划执行|执行计划|codegraph|CodeGraph|提交|commit|push).*",
        "hooks": [
          {
            "type": "command",
            "command": "printf '%s\\n' '[EMP workflow gate] Read AGENTS.md decision matrix. Use CodeGraph for cross-file code discovery, rg for docs/config/literals, commit only on explicit commit/push or release/PR closure, and read .superpowers/subagents.md + .codex/agents/emp-*.toml before subagent dispatch.'",
            "async": false
          }
        ]
      }
    ]
  }
}
```

- [x] **Step 3: Verify hook files are visible**

Run: `test -f .codex/config.toml && test -f .codex/hooks.json`
Expected: exit code 0.

- [x] **Step 4: Create `.codex/agents/emp-*.toml`**

Create three repo-local subagent lanes:
- `emp-fast`: scoped search, CodeGraph lookup, mechanical docs/config, low-risk verification.
- `emp-impl`: bounded implementation with known files, constraints, and validation commands.
- `emp-deep`: read-only architecture, release, dependency, cross-package and final-review judgment.

### Task 2: Document The Trigger Contract

**Files:**
- Modify: `AGENTS.md`
- Modify: `skills/emp-workflow/SKILL.md`
- Modify: `.superpowers/subagents.md`
- Modify: `skills/emp-workflow/references/change-matrix.md`

**Interfaces:**
- Consumes: existing EMP workflow guidance.
- Produces: explicit Codex trigger rules that point plan execution to `.superpowers/subagents.md`.

- [x] **Step 1: Update `AGENTS.md`**

Add a short repo-local Codex trigger section plus a decision matrix for CodeGraph, `rg`, planning, subagent dispatch, and commit timing.

- [x] **Step 2: Update `skills/emp-workflow/SKILL.md`**

Add `.codex/hooks.json` and `.codex/agents/` to preflight, define CodeGraph-vs-`rg` routing, and require `.superpowers/subagents.md` for plan execution or subagent dispatch.

- [x] **Step 3: Update `.superpowers/subagents.md`**

Add a concise Codex trigger paragraph: the file is not auto-loaded by itself; it is reached through `AGENTS.md`, `skills/emp-workflow/SKILL.md`, `.codex/hooks.json`, plan headers, and `.codex/agents/emp-*.toml`.

- [x] **Step 4: Update `change-matrix.md`**

Add `.codex/config.toml`, `.codex/hooks.json`, `.codex/agents/emp-*.toml`, `.superpowers/subagents.md`, and commit rules to workflow writable areas and validation expectations.

### Task 3: Extend Workflow Guard

**Files:**
- Modify: `scripts/emp-workflow-check.mjs`

**Interfaces:**
- Consumes: workflow files from Tasks 1 and 2.
- Produces: `corepack pnpm workflow:check` failures if Codex trigger files or subagent rules drift.

- [x] **Step 1: Add required files**

Require `.codex/config.toml`, `.codex/hooks.json`, `.codex/agents/emp-*.toml`, and `.superpowers/subagents.md`.

- [x] **Step 2: Add required text checks**

Check for:
- `.codex/config.toml`: `hooks = true`, `goals = true`, `multi_agent = true`, `max_threads = 6`
- `.codex/hooks.json`: `SessionStart`, `UserPromptSubmit`, `.superpowers/subagents.md`, `.codex/agents/emp-*.toml`, `CodeGraph`, `commit`, `push`
- `.codex/agents/emp-fast.toml`: `gpt-5.3-codex-spark`, `CodeGraph`
- `.codex/agents/emp-impl.toml`: `gpt-5.4-mini`, `NEEDS_CONTEXT`
- `.codex/agents/emp-deep.toml`: `gpt-5.4`, `BLOCKED`
- `AGENTS.md` and `skills/emp-workflow/SKILL.md`: `.superpowers/subagents.md`, `.codex/agents/`, CodeGraph commands
- `.superpowers/subagents.md`: `Codex 触发入口`, `派发决策`, `NEEDS_CONTEXT`, `BLOCKED`
- `.superpowers/subagents.md`: `实际派发方式`, `Brief Template`, `Review Package Template`, `agent_type`
- `skills/emp-workflow/references/change-matrix.md`: hook JSON parse, prompt assembly caveat, untracked `.codex/*` handoff rule

- [x] **Step 3: Validate**

Run: `corepack pnpm workflow:check`
Expected: `EMP workflow check passed.`

### Task 4: Final Drift Check

**Files:**
- Verify only.

**Interfaces:**
- Consumes: all changed workflow files.
- Produces: final confidence that the workflow chain is coherent.

- [x] **Step 1: Run whitespace check**

Run: `git diff --check`
Expected: no output.

- [x] **Step 2: Review changed files**

Run: `git diff --stat`
Expected: only workflow files changed.

### Task 5: Subagent Audit Corrections

**Files:**
- Modify: `AGENTS.md`
- Modify: `.superpowers/subagents.md`
- Modify: `skills/emp-workflow/SKILL.md`
- Modify: `skills/emp-workflow/references/change-matrix.md`
- Modify: `scripts/emp-workflow-check.mjs`

**Interfaces:**
- Consumes: subagent audit output and current `spawn_agent` runtime shape.
- Produces: explicit mapping from `emp-*` semantic profiles to runtime roles, reusable brief/review templates, and guard checks for the mapping.

- [x] **Step 1: Add read-only CodeGraph exception**

Document that read-only audits or docs/config/scripts/Skill/`.codex/*`/`.superpowers/*` work can use `codegraph status .` only, and must state why `sync` was skipped.

- [x] **Step 2: Add actual dispatch mapping**

Document how `emp-fast`, `emp-impl`, and `emp-deep` map to current `spawn_agent` `agent_type`, model override, and brief fields when runtime does not expose `emp-*` directly.

- [x] **Step 3: Add brief and review templates**

Add compact templates so each subagent receives profile, runtime, goal, scope, forbidden paths, validation, and return contract.

- [x] **Step 4: Add plan execution status**

Keep the current execution state in this tracked plan file. `.superpowers/sdd/progress.md` may be updated as a local ignored ledger, but `workflow:check` must not depend on it.

- [x] **Step 5: Extend guard coverage**

Make `scripts/emp-workflow-check.mjs` validate JSON structure, actual dispatch headings, brief/review templates, and prompt-vs-hook validation wording.

### Task 6: Final Runtime Trigger Smoke

**Files:**
- Verify only.

**Interfaces:**
- Consumes: repo-local `.codex` config/hooks/agents and prompt assembly.
- Produces: confidence that Codex can surface the intended workflow contract at runtime.

- [x] **Step 1: Parse hooks**

Run: `node -e "JSON.parse(require('fs').readFileSync('.codex/hooks.json','utf8')); console.log('json ok')"`
Expected: `json ok`.

- [x] **Step 2: Check prompt assembly**

Run: `codex debug prompt-input --enable hooks --enable goals --enable multi_agent "什么时候用 codegraph 什么时候提交 什么时候子 agent"`
Expected: prompt includes CodeGraph, commit, `.codex/agents/emp-*.toml`, and `.superpowers/subagents.md`; prompt does not include `codebase-memory-mcp`.

- [x] **Step 3: Sync CodeGraph**

Run: `codegraph sync . && codegraph status .`
Expected: CodeGraph reports the current checkout as indexed or no longer has pending workflow changes.

### Task 7: Worktree Cleanup Rule

**Files:**
- Modify: `AGENTS.md`
- Modify: `.codex/hooks.json`
- Modify: `skills/emp-workflow/SKILL.md`
- Modify: `skills/emp-workflow/references/change-matrix.md`
- Modify: `scripts/emp-workflow-check.mjs`

**Interfaces:**
- Consumes: live `.worktrees/` inspection and historical EMP stale-worktree cleanup practice.
- Produces: a repeatable rule that prevents destructive cleanup of dirty or unmerged worktrees.

- [x] **Step 1: Add decision rule**

Document that `.worktrees` / `git worktree` / cleanup requests must run worktree inventory first and must not start with `rm -rf .worktrees`.

- [x] **Step 2: Add cleanup procedure**

Document `git worktree list --porcelain`, `du -sh .worktrees`, per-candidate `git -C <path> status --short --branch`, dirty diff stat, `git worktree remove <path>`, and `git worktree prune`.

- [x] **Step 3: Separate branch deletion**

Document that branch deletion is not part of directory cleanup unless explicitly requested, and requires `git merge-base --is-ancestor <branch> v4` plus upstream/unmerged-commit checks.

- [x] **Step 4: Extend trigger and guard**

Add hook trigger terms for `worktree` / `.worktrees` / `git worktree` / `清理`, and extend `workflow:check` to fail if the worktree cleanup contract drifts.
