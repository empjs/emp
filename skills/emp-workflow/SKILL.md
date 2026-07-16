---
name: emp-workflow
description: EMP workflow guide for CI, dependencies, builds, releases, Codex routing, Git/PR, worktrees, cross-package impact, and repository validation. Use when these repository-specific boundaries matter; skip for text-only work and narrow source edits already covered by AGENTS.md.
---

# EMP Workflow

## Core Flow

1. Define the requested outcome, allowed scope, completion evidence, and stop condition.
2. Read only the matching section in `references/routing-and-context.md`; preserve unrelated checkout changes.
3. Use CodeGraph for symbols, call chains, package boundaries, runtime paths, or affected tests. Use `rg` or structured parsing for text and config.
4. Keep simple or shared-state work in the controller. Use `spawn_agent` only for an independent domain or medium/high-risk verification, after reading the selected `.codex/agents/` profile.
5. For non-trivial implementation, state the plan in the task unless the user requests a durable file.
6. Select the smallest checks from `references/change-matrix.md`. Stop when the requested result and required evidence are complete.
7. Report changed files, exact verification, skipped checks, and remaining risk. Commit or push only when requested or required by release/PR closure.

## Reference Map

- `references/routing-and-context.md`: preflight, CodeGraph, model routing, delegation briefs, and tool-output limits.
- `references/change-matrix.md`: protected scope, minimum verification, and reasoning/prompt evaluation gates.
- `references/routing-evaluation.md`: fixed task set, hard gates, and before/after record for Codex routing changes.
- `references/repository-operations.md`: Skill, Git/PR, worktree, tests, and release procedures.
- Read `.codex/config.toml` or `.codex/hooks.json` only for runtime configuration work; read only the Agent profile being used.

## Decision Rules

- One writer per file or shared state. Serialize dependency graphs, migrations, snapshots, ports, publishing, and external writes.
- Do not extend into protected paths without task authorization or commit generated output, caches, `.codegraph/`, or `.worktrees/`.
- Use `corepack pnpm`; prefer live evidence and bounded logs.
