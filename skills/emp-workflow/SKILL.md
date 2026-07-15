---
name: emp-workflow
description: EMP repository workflow guide for scoped development, CI, dependency, package, release, Skill, Codex routing, Git, PR, worktree, review, and validation tasks in /Users/Bigo/Desktop/develop/fontend-workspace/emp. Use when repository-specific boundaries or verification are needed.
---

# EMP Workflow

## Core Flow

1. Classify the task before reading more context: text-only, single-file/config, cross-file code, CI/dependency/build/release, or external-system work.
2. Run only the matching preflight from `references/routing-and-context.md`; always preserve unrelated user changes.
3. Use CodeGraph only for symbols, call chains, package boundaries, runtime paths, or affected tests. Use `rg` and direct parsing for docs, literals, configs, scripts, and workflows.
4. Keep simple and shared-state work in the controller. Delegate only an independent sidecar or medium/high-risk verification, using the cheapest sufficient `.codex/agents/` profile and a short brief.
5. For non-trivial implementation, write the plan in the current task unless the user explicitly requests a durable file.
6. Before editing, select the minimum checks from `references/change-matrix.md`; after editing, run them and summarize successful logs.
7. Deliver changed files, exact verification outcomes, skipped checks, and remaining risk. Commit or push only when explicitly requested or required by release/PR closure.

## Reference Map

- Read `references/routing-and-context.md` for task-tier preflight, CodeGraph commands, Token-First Model Routing, Delegation Contract, short briefs, and tool-output limits.
- Read `references/change-matrix.md` only to choose validation commands, confirm protected paths, or apply model verification gates.
- Read `references/repository-operations.md` only for project Skill changes, Git/PR closure, worktree cleanup, test strategy, release automation, or package scope.
- Read `.codex/config.toml` and `.codex/hooks.json` only for runtime-routing changes. Read only the selected `.codex/agents/emp-*.toml` before `spawn_agent`; do not load every profile by default.

## Decision Rules

- One writer per file or shared state. Serialize lockfile, migration, snapshot, port, publish, and external-write work.
- Do not touch `apps/**`, `website`, `packages/cdn-*`, `packages/lib-*`, publish workflow, or lockfile unless the task authorizes that scope.
- Do not create repo-local historical workflow directories or commit generated output, caches, `.codegraph/`, or `.worktrees/`.
- Use `corepack pnpm`; report real results instead of predicted success.
- Keep successful command output to command + exit code + concise summary. Read full logs only to diagnose a failure.
